# Downtown Media

Static site with in-browser JSX compilation via `@babel/standalone`.

## Pages

- `index.html` — the hub
- `Downtown Media.html` — main homepage
- `Esports.html` — esports vertical
- `Events.html` — events calendar
- `Newsletter.html` — newsletter signup
- `Log In.html` — auth screen

## Components

JSX is compiled in the browser, so editing a `.jsx` file and refreshing is enough.

- `dt-ui.jsx`, `dt-blocks.jsx`, `dt-data.jsx` — shared UI + data
- `dt-auth.jsx`, `dt-events.jsx`, `dt-esports.jsx`, `dt-newsletter.jsx` — per-page
- `tweaks-panel.jsx` — dev tweaks overlay
- `dt-theme.css` — theme tokens

## Local preview

Any static server works:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/pages.yml`.
