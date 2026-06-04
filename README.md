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

## Auth + data

Firebase Auth (email/password + Google/Apple OAuth) and Firestore (single
`profiles/{uid}` collection). The single client + helpers live in
`dt-auth-client.js`; the page-level gate in `dt-auth-gate.js`. Firestore
authorization is in `firestore.rules`. See `firebase/README.md` for
one-time project setup.

## Deploy

Firebase Hosting via the Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
# edit .firebaserc with your project ID
firebase deploy
```

Live URL: `https://<project-id>.web.app`.

Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in
`firebase.json` and apply to every response.
