# Firebase setup

This project deploys to Firebase Hosting and uses Firebase Auth + Firestore.
Everything below is one-time and stays on the free **Spark** plan — no credit
card required, no auto-pause.

## One-time project setup

1. **Create the project**
   - Go to https://console.firebase.google.com → Add project.
   - Disable Analytics (you don't need it; keeps the project leaner).
   - You stay on Spark — do not upgrade to Blaze.

2. **Register a Web app**
   - Project Settings → General → Your apps → Web (`</>`).
   - Nickname: `downtown-media`. Skip Firebase Hosting setup in the wizard
     (we configure it via `firebase.json` instead).
   - Copy the SDK config object — paste into `../dt-config.js`.

3. **Enable Auth providers**
   - Authentication → Sign-in method → Enable **Email/Password**.
   - Under Templates → Email Address Verification: keep default, or customize.
   - (Optional) Enable Google + Apple for the OAuth buttons. Apple requires
     an Apple Developer account; skip if you don't have one.

4. **Enable Firestore**
   - Firestore Database → Create database → Production mode → pick the
     nearest region (e.g. `asia-south1` for India). Region is permanent.

5. **Deploy rules + hosting**
   ```bash
   npm i -g firebase-tools
   firebase login
   # Edit .firebaserc, set "default" to your actual project ID
   firebase deploy
   ```
   First deploy creates `https://<project-id>.web.app` — that's your live URL.

## Dashboard knobs to flip

These are policy settings the SDK can't change for you.

**Authentication → Settings → User actions**
- Email enumeration protection: **ON** (Firebase has had this since 2024 — it
  makes sign-in / reset return generic errors instead of "user not found").

**Authentication → Settings → Authorized domains**
- Add `localhost` (for local testing) and your custom domain if/when you set one.
- `<project>.web.app` is auto-added.

**Authentication → Templates**
- Edit "from name" so the verification email doesn't say "noreply@<project-id>".

**Firestore → Rules** — deployed by `firebase deploy` from `firestore.rules` at repo root.

## What's intentionally NOT here

- A `users` collection. Firebase Auth owns user identity; the `profiles`
  collection only mirrors the public-facing bits (display name, default spoke).
- A `failed_login_count` field. Firebase Auth has built-in throttling on
  `/identitytoolkit.googleapis.com` — an app-side counter would be racy and
  trivially bypassed.
- A `sessions` collection. Firebase Auth issues 1-hour ID tokens with
  rotating refresh tokens; `signOut()` revokes them server-side.
