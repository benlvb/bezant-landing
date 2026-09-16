# bezant-landing

Public site for **[Bezant](https://bezant.app)** — a private, on-device money planner for iPhone and Apple Watch.

This repo is the Vercel site root (Root Directory = `.`): landing, privacy, and support. The iOS app lives in [`benlvb/bezant`](https://github.com/benlvb/bezant); engineering docs stay there.

**App Store:** still Coming soon (TestFlight prep). There is no public listing URL — keep CTAs non-actionable. Do not add “Download now.”

## Product (match the app, not older marketing)

Keep `index.html` / `support.md` honest against `benlvb/bezant` main. In particular:

- **3 tabs:** Home / Track / Settings + a floating **+**. No Home Coach, no Monday digest.
- **Home:** greeting, TOTAL WEALTH, event banner (if any), cash flow, Goals/Saving tiles, money health, What-if planner.
- **Logging:** in-app number pad, Home Screen / Lock Screen widgets, Siri (“What’s my net worth in Bezant?”, “Log an expense…”, “Quick log…”), Apple Watch companion (glance, complications, crown quick-log).
- **Goals:** Top / Mid / Low tiers (not 1–5), contributions, live funding dates. Monthly PDF **SURPLUS** is that month’s actuals; goal dates use planning surplus.
- **Privacy:** on-device first. Optional Sign in with Apple (on-device — not “email only for restore”). Optional iCloud via the user’s CloudKit private DB; end-to-end only with Advanced Data Protection. Hide amounts + Face Unlock; app-switcher blur when lock is on.
- **Also ships:** 8 spending categories; USD / MYR / EUR / SGD + ECB FX; CSV import, PDF statement, backup/restore, multiple profiles.

`privacy.md` is the App Store privacy URL. Don’t regress the ADP wording.

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

The 1200×630 share card is committed as `landing/og-image.png`. Source is `landing/og-card.svg` (Coming soon, not Download). Re-render with:

```sh
rsvg-convert -w 1200 -h 630 landing/og-card.svg -o landing/og-image.png
```
