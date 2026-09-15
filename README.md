# bezant-landing

Public site for **[Bezant](https://bezant.app)** — landing page, privacy policy, and support.

This repo is the Vercel site root (Root Directory = `.`). The iOS app lives in [`benlvb/bezant`](https://github.com/benlvb/bezant); engineering docs stay there and are not published here.

## What’s published

| Path | URL |
| --- | --- |
| `index.html` | `/` |
| `privacy.md` | `/privacy/` |
| `support.md` | `/support/` |
| `landing/` | favicon, share card, shared JS |

Jekyll copies `index.html` and `landing/` verbatim (no front matter). `/privacy/` and `/support/` are built from markdown.

## Local preview

```sh
# Static homepage only (no Jekyll):
python3 -m http.server
# open http://localhost:8000/

# Full site (privacy + support pages):
bundle install
bundle exec jekyll serve
```

Serve over HTTP, not `file://`, so the browser can load `landing/lp-shared.js`.

## Validate

```sh
node scripts/check-landing.mjs
```

Parses both JS payloads, checks `lp-shared.js` resolves, and fails if anything in the tree isn’t either a public page or listed in `_config.yml` `exclude:`.

## Deploy

Vercel: import this repo, **Root Directory = `.`**. `vercel.json` runs `bundle exec jekyll build` → `_site` with `trailingSlash: true`. The ignore command skips deploys that only touch `README.md`, `.github/`, or `scripts/`.

Domain: `bezant.app`.

The 1200×630 share card is stored as four base64 chunks (`landing/og-image.png.b64.1`–`.4`) and decoded to `landing/og-image.png` during the Vercel install step (and by `scripts/check-landing.mjs`). Re-render from the SVG with:

```sh
rsvg-convert -w 1200 -h 630 landing/og-card.svg -o landing/og-image.png
python3 - <<'PY'
from pathlib import Path
import base64
b = base64.b64encode(Path("landing/og-image.png").read_bytes()).decode()
size = (len(b) + 3) // 4
size = (size + 3) // 4 * 4
for i in range(4):
    Path(f"landing/og-image.png.b64.{i+1}").write_text(b[i*size:(i+1)*size])
PY
```
