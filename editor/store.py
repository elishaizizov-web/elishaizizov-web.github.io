import base64
import fcntl
import json
import os
from pathlib import Path
import re
import subprocess
from urllib.error import HTTPError
from urllib.request import HTTPRedirectHandler, Request, build_opener


class Conflict(Exception):
    pass


class StoreError(Exception):
    pass


class LocalGit:
    """Version drafts in a directory served exclusively through the editor."""
    def __init__(self, directory):
        self.root = Path(directory).resolve()
        self.root.mkdir(mode=0o700, parents=True, exist_ok=True)
        with (self.root / '.lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            if not (self.root / '.git').is_dir():
                self.git('init', '-q')

    def git(self, *args, checked=True):
        return subprocess.run(
            ['git', '-C', str(self.root), '-c', 'user.name=Redaktion',
             '-c', 'user.email=editor@localhost', *args],
            check=checked, capture_output=True, text=True,
        )

    def list(self):
        result = self.git('ls-tree', '--name-only', 'HEAD', checked=False)
        return sorted(Path(name).stem for name in result.stdout.splitlines() if name.endswith('.json'))

    def read(self, key):
        name = key + '.json'
        result = self.git('rev-parse', '--verify', f'HEAD:{name}', checked=False)
        if result.returncode:
            return None, ''
        version = result.stdout.strip()
        return json.loads(self.git('cat-file', '-p', version).stdout), version

    def save(self, key, draft, expected):
        name = key + '.json'
        target = self.root / name
        temporary = target.with_suffix('.tmp')
        with (self.root / '.lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            _, version = self.read(key)
            if version != expected:
                raise Conflict
            temporary.write_text(json.dumps(draft, ensure_ascii=False, indent=2))
            os.replace(temporary, target)
            self.git('add', '--', name)
            if self.git('diff', '--cached', '--quiet', '--', name, checked=False).returncode:
                self.git('commit', '-qm', f'Textentwurf {key}', '--', name)


class RejectRedirects(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class PrivateGitHub:
    """Persist draft versions via the GitHub Contents API on a private repository."""
    def __init__(self, repository, token, branch):
        if not re.fullmatch(r'[\w.-]+/[\w.-]+', repository, flags=re.ASCII):
            raise ValueError('Expected owner/repository')
        self.base = f'https://api.github.com/repos/{repository}'
        self.token = token
        self.branch = branch
        self.opener = build_opener(RejectRedirects())
        self.check_private()

    def request(self, path, data=None):
        body = json.dumps(data).encode() if data is not None else None
        req = Request(self.base + path, data=body, method='PUT' if body else 'GET', headers={
            'Authorization': 'Bearer ' + self.token, 'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json',
        })
        try:
            with self.opener.open(req, timeout=12) as response:
                return json.load(response)
        except HTTPError as exc:
            if exc.code == 404 and path.startswith('/contents/'):
                return None
            if exc.code in (409, 422) and body:
                raise Conflict from None
            raise StoreError from None
        except OSError:
            raise StoreError from None

    def check_private(self):
        if self.request('').get('visibility') != 'private':
            raise StoreError('Draft repository must be private')

    def content(self, key=''):
        from urllib.parse import urlencode
        path = '/contents/drafts' + ('/' + key + '.json' if key else '')
        return path + '?' + urlencode({'ref': self.branch})

    def list(self):
        self.check_private()
        return sorted(Path(item['name']).stem for item in self.request(self.content()) or []
                      if item['type'] == 'file' and item['name'].endswith('.json'))

    def read(self, key):
        self.check_private()
        result = self.request(self.content(key))
        if not result:
            return None, ''
        return json.loads(base64.b64decode(result['content'])), result['sha']

    def save(self, key, draft, expected):
        _, version = self.read(key)
        if version != expected:
            raise Conflict
        fields = {'message': f'Textentwurf {key}', 'branch': self.branch,
                  'content': base64.b64encode(json.dumps(draft, ensure_ascii=False).encode()).decode()}
        if version:
            fields['sha'] = version
        self.request('/contents/drafts/' + key + '.json', fields)
