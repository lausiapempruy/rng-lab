# RNG Lab

A static, GitHub-Pages-friendly RNG probability playground designed to feel like a mature product on day one.

## Included

- Deterministic seeded PRNG
- Configurable luck modifier
- Pity threshold + guaranteed rare handling
- Batch rolls: 10 / 100 / 1,000 / 10,000
- Live distribution telemetry
- Roll feed
- JSON session export
- Drop-table matrix
- Diagnostics panel
- Changelog / release history
- PWA manifest + offline service worker
- Mock API response contract
- Responsive desktop/tablet/mobile layout

## Run locally

Open `index.html`, or use any static server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Push the repository to GitHub and enable Pages from the repository's Actions/Pages settings. No build step is required.

## Structure

```text
/
├─ index.html
├─ styles.css
├─ app.js
├─ manifest.json
├─ sw.js
├─ data/
│  └─ rates.json
└─ api/
   └─ mock-roll.json
```

## Roadmap

- v1.1: custom weighted tables
- v1.2: Monte Carlo comparison mode
- v1.3: shareable simulation URLs
- v1.4: server-authoritative API adapter
