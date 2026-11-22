import base64
import hmac
import os
from datetime import timedelta
from io import BytesIO
from pathlib import Path
import re
import secrets
from urllib.parse import urlsplit
from zipfile import ZIP_DEFLATED, ZipFile

from flask import Flask, abort, redirect, render_template, request, send_file, session, url_for
from werkzeug.security import check_password_hash

from store import Conflict, LocalGit, PrivateGitHub, StoreError


FIELDS = {
    'guide': [('title', 'Titel'), ('slug', 'Feste Adresse'), ('summary', 'Kurzbeschreibung'),
              ('topic', 'Thema'), ('image_url', 'Bildadresse'), ('body', 'Text'),
              ('sources', 'Quellen'), ('updated', 'Aktualisiert am'), ('pdf', 'PDF (optional)'),
              ('component', 'Vorlage')],
    'episode': [('title', 'Titel'), ('slug', 'Feste Adresse'), ('summary', 'Beschreibung'),
                ('image_url', 'Bildadresse'), ('date', 'Datum'), ('audio', 'Audioadresse'),
                ('duration', 'Dauer'), ('transcript', 'Transkript')],
}
KINDS = {'guide': 'Guide', 'episode': 'Podcastfolge'}
COMPONENTS = {'article': 'Lesetext', 'checklist': 'Checkliste', 'shopping': 'Koscher einkaufen'}
TEXTAREAS = {'summary', 'body', 'sources', 'transcript'}
URL_FIELDS = {'image_url', 'audio', 'pdf'}
IMAGE_TYPES = {'image/jpeg': b'\xff\xd8\xff', 'image/png': b'\x89PNG\r\n\x1a\n', 'image/webp': b'RIFF'}
SLUG = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+)*')
KEY = re.compile(r'(guide|episode)--[a-z0-9]+(?:-[a-z0-9]+)*\Z')
IMAGE_LIMIT = 512_000


def create_app():
    app = Flask(__name__)
    demo = os.environ.get('EDITOR_LOCAL_DEMO') == '1'
    if not demo and not os.environ.get('EDITOR_GITHUB_REPO'):
        raise RuntimeError('A private GitHub repository is required')
    password_hash = os.environ['EDITOR_PASSWORD_HASH']
    secret_key = os.environ['EDITOR_SECRET_KEY']
    if len(secret_key) < 32:
        raise RuntimeError('EDITOR_SECRET_KEY must contain at least 32 characters')
    app.config.update(SECRET_KEY=secret_key, MAX_CONTENT_LENGTH=650_000, SESSION_COOKIE_HTTPONLY=True,
                      SESSION_COOKIE_SAMESITE='Strict', SESSION_COOKIE_SECURE=not demo,
                      PERMANENT_SESSION_LIFETIME=timedelta(hours=4))
    if demo:
        directory = Path(os.environ['EDITOR_DRAFT_DIR']).resolve()
        if Path(__file__).resolve().parent.parent in (directory, *directory.parents):
            raise RuntimeError('Draft storage must be outside the site checkout')
        store = LocalGit(directory)
    else:
        store = PrivateGitHub(os.environ['EDITOR_GITHUB_REPO'], os.environ['EDITOR_GITHUB_TOKEN'],
                              os.environ.get('EDITOR_GITHUB_BRANCH', 'main'))

    @app.before_request
    def protect():
        if request.endpoint != 'login' and not session.get('authenticated'):
            if request.endpoint == 'index' and request.method == 'GET':
                return redirect(url_for('login'))
            abort(401)
        if request.method == 'POST':
            csrf = session.get('csrf')
            if not csrf or not hmac.compare_digest(csrf.encode(), request.form.get('csrf', '').encode()):
                abort(400)

    @app.after_request
    def private_headers(response):
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Robots-Tag'] = 'noindex, nofollow'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Referrer-Policy'] = 'no-referrer'
        response.headers['Content-Security-Policy'] = (
            "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; "
            "form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
        )
        return response

    @app.errorhandler(StoreError)
    @app.errorhandler(Conflict)
    def storage_error(error):
        if isinstance(error, Conflict):
            return render_template('error.html', message='Dieser Entwurf wurde inzwischen geändert. Öffne ihn erneut.'), 409
        return render_template('error.html', message='Der private Speicher ist gerade nicht verfügbar.'), 503

    @app.get('/')
    def index():
        entries = [key for key in store.list() if KEY.fullmatch(key)]
        return render_template('index.html', entries=entries, kinds=KINDS)

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            if check_password_hash(password_hash, request.form.get('password', '')):
                session.clear()
                session.permanent = True
                session.update(authenticated=True, csrf=secrets.token_urlsafe(32))
                return redirect(url_for('index'), code=303)
            return render_template('login.html', error='Das Passwort stimmt nicht.'), 401
        session.setdefault('csrf', secrets.token_urlsafe(32))
        return render_template('login.html')

    @app.post('/logout')
    def logout():
        session.clear()
        return redirect(url_for('login'), code=303)

    def load(key):
        if not KEY.fullmatch(key):
            abort(404)
        draft, version = store.read(key)
        if draft is None:
            abort(404)
        return draft, version

    @app.get('/new/<kind>')
    def new(kind):
        if kind not in FIELDS:
            abort(404)
        return edit_form(kind, {}, '')

    @app.get('/edit/<key>')
    def edit(key):
        draft, version = load(key)
        return edit_form(draft['kind'], draft, version)

    def edit_form(kind, draft, version, error='', status=200):
        return render_template('edit.html', kind=kind, draft=draft, version=version, error=error,
                               label=KINDS[kind], fields=FIELDS[kind], areas=TEXTAREAS,
                               urls=URL_FIELDS, components=COMPONENTS), status

    @app.post('/save/<kind>')
    def save(kind):
        if kind not in FIELDS:
            abort(404)
        draft = {field: request.form.get(field, '').strip() for field, _ in FIELDS[kind]}
        draft['kind'] = kind
        previous_key = request.form.get('key', '')
        version = request.form.get('version', '')
        if previous_key:
            previous, _ = load(previous_key)
            if previous['kind'] != kind:
                abort(400)
            draft['slug'] = previous['slug']
            if 'image' in previous and not request.form.get('remove_image'):
                draft['image'] = previous['image']
        if not draft['title'] or not SLUG.fullmatch(draft['slug']) or len(draft['slug']) > 70:
            return edit_form(kind, draft, version, 'Gib einen Titel und eine gültige Adresse ein.', 400)
        draft['key'] = f'{kind}--{draft["slug"]}'
        for field in URL_FIELDS & draft.keys():
            if draft[field] and not https_url(draft[field]):
                return edit_form(kind, draft, version, 'Adressen müssen mit https:// beginnen.', 400)
        upload = request.files.get('image')
        if upload and upload.filename:
            image = upload.read(IMAGE_LIMIT + 1)
            mime = upload.mimetype
            magic = IMAGE_TYPES.get(mime)
            if not magic or not image.startswith(magic) or len(image) > IMAGE_LIMIT or (mime == 'image/webp' and image[8:12] != b'WEBP'):
                return edit_form(kind, draft, version, 'Wähle JPG, PNG oder WebP bis 500 KB.', 400)
            draft['image'] = {'mime': mime, 'base64': base64.b64encode(image).decode()}
        store.save(draft['key'], draft, version)
        return redirect(url_for('edit', key=draft['key'], saved='1'), code=303)

    @app.get('/preview/<key>')
    def preview(key):
        draft, _ = load(key)
        return render_template('preview.html', draft=draft, label=KINDS[draft['kind']], image_url=(
            url_for('image', key=key) if 'image' in draft else ''
        ))

    @app.get('/image/<key>')
    def image(key):
        draft, _ = load(key)
        if 'image' not in draft:
            abort(404)
        picture = draft['image']
        return send_file(BytesIO(base64.b64decode(picture['base64'])), mimetype=picture['mime'])

    @app.post('/release-preview/<key>')
    def release_preview(key):
        draft, version = load(key)
        if request.form.get('version') != version:
            raise Conflict
        output = BytesIO()
        picture = draft.get('image')
        image_name = 'bild.' + picture['mime'].split('/')[1] if picture else ''
        with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
            archive.writestr('index.html', render_template('published.html', draft=draft, image_url=image_name or draft.get('image_url')))
            if picture:
                archive.writestr(image_name, base64.b64decode(picture['base64']))
        output.seek(0)
        return send_file(output, mimetype='application/zip', as_attachment=True, download_name=f'{key}-{version[:8]}.zip')

    app.jinja_env.globals.update(https_url=https_url, components=COMPONENTS)
    return app


def https_url(value):
    try:
        parts = urlsplit(value)
        return bool(parts.scheme == 'https' and parts.hostname and not parts.username)
    except ValueError:
        return False
