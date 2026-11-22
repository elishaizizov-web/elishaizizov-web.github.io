# Private Redaktion

The editor is a separate Python service. Start it from this directory with
`gunicorn 'app:create_app()'`. Keep it off the static site's document root.
Python 3.11 or later is supported. Install dependencies from requirements.txt.

Set these environment variables through the hosting service's secret manager.

- `EDITOR_SECRET_KEY` is a persistent random session secret of at least 32 characters.
- `EDITOR_PASSWORD_HASH` is a Werkzeug scrypt password hash. Generate it by passing
  a unique password from `getpass.getpass()` to `werkzeug.security.generate_password_hash`.
- `EDITOR_GITHUB_REPO` is a dedicated private repository in owner/repository form.
- `EDITOR_GITHUB_TOKEN` is a fine-grained credential restricted to that repository,
  with Contents read and write access. Initialize the private repository with a commit.
- `EDITOR_GITHUB_BRANCH` selects the private repository branch and defaults to `main`.

Use HTTPS and sign-in rate limiting on the hosting gateway before opening the service
to the internet. The public website has its own repository and requires separate
authorization for merging and deployment. The editor credential must have access only
to the private repository. Repository access remains limited to approved collaborators.

For local testing set `EDITOR_LOCAL_DEMO=1` and set `EDITOR_DRAFT_DIR` to a private
directory outside the website checkout. Use a loopback listener and test credentials.
This mode stores version history in local Git and allows HTTP on loopback.

## Editing

Choose Neuer Guide or Neue Podcastfolge. Enter the title and permanent URL slug.
The guide slug defines `/guides/<slug>/` and the episode slug defines
`/podcast/<slug>/` when a release is integrated. The slug is locked on first save.
Drafts are visible after login. Private image uploads are stored with the matching
draft revision. Use a supported image format up to 500 KB. For PDFs or large audio
files use an appropriately protected media service and enter the HTTPS link.
Keep assets with private addresses on access-controlled media storage.
The private preview does not load external image or audio resources automatically.

The guide offers Lesetext and Checkliste templates. The latter turns each nonblank
line of the body into a list item. Koscher einkaufen points to the existing custom
tool, whose filtering and source data continue to be maintained separately.
The episode preview renders its metadata and an audio link and optional transcript.

Entwurf speichern writes a draft revision. Gespeicherte Vorschau renders this
revision using the private service. Freigabepaket herunterladen exports the saved
revision as HTML and its uploaded image. The package stays on the user's device
until they explicitly share it. The library and podcast archive will use released
content after the publication workflow is connected in Stage 3.

## Hosting decision

Stage 2 uses the dedicated editor instead of Decap. Decap's editorial workflow
with a GitHub backend uses branches and pull requests. That leaves drafts readable
by anyone when the repository is public. A private repository plus a separate
authentication service and a protected preview would still be required. The
dedicated editor allows tighter control over draft reads and asset delivery.

GitHub Free supports private repositories. The editor uses Flask and Gunicorn,
which have no license fee. HTTPS hosting, private media storage and provider
costs remain to be selected. No external hosting subscription is configured.
