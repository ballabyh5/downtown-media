// dt-auth-client.js — single Firebase app + Auth + Firestore client.
// Exposes window.dtAuth with the same shape the UI depended on before:
//   signUp, signIn, signOut, resetPassword, signInWithProvider,
//   getSession, onChange. JSX and the gate don't need to change.
//
// Loaded as a plain script (no JSX) so it boots before the Babel-transformed
// modules attach to it. Uses the Firebase compat SDK to stay no-build.

(function () {
  var cfg = window.DT_CONFIG || {};
  if (!window.firebase || !firebase.initializeApp) {
    console.error("[dt-auth] firebase compat SDK not loaded");
    return;
  }
  if (!cfg.apiKey || cfg.apiKey.indexOf("YOUR-API-KEY") !== -1) {
    console.error("[dt-auth] dt-config.js still has placeholder values");
  }

  // initializeApp is idempotent in the compat SDK as long as we guard.
  if (!firebase.apps.length) firebase.initializeApp(cfg);

  var auth = firebase.auth();
  var db   = firebase.firestore();

  // Persist sessions in IndexedDB (the compat default on https). On
  // failure (private mode, locked storage) the SDK falls back to in-memory.
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function () { /* non-fatal */ });

  var VALID_SPOKES = { HUB: 1, DELHI: 1, MUMBAI: 1, BANGALORE: 1 };

  // ---------- error mapping ----------
  // Map Firebase error codes to short, non-leaky UI copy. Anything unmapped
  // becomes a generic message so we never surface raw internals. With
  // "Email enumeration protection" turned ON in the Firebase console,
  // sign-in already returns a unified invalid-credential for both
  // "wrong password" and "no such user" — we just pass that through.
  function friendly(err) {
    if (!err) return null;
    var code = err.code || "";
    var map = {
      "auth/invalid-credential":          "EMAIL OR PASSWORD DIDN'T MATCH.",
      "auth/wrong-password":              "EMAIL OR PASSWORD DIDN'T MATCH.",
      "auth/user-not-found":              "EMAIL OR PASSWORD DIDN'T MATCH.",
      "auth/invalid-login-credentials":   "EMAIL OR PASSWORD DIDN'T MATCH.",
      "auth/email-already-in-use":        "THAT EMAIL'S ALREADY ON THE LIST.",
      "auth/weak-password":               "PASSWORD'S TOO SHORT. 12+ CHARACTERS.",
      "auth/invalid-email":               "THAT EMAIL LOOKS FAKE. TRY AGAIN.",
      "auth/missing-password":            "ENTER A PASSWORD.",
      "auth/too-many-requests":           "TOO MANY ATTEMPTS. SLOW DOWN AND TRY AGAIN IN A BIT.",
      "auth/network-request-failed":      "NETWORK HICCUP. TRY AGAIN.",
      "auth/user-disabled":               "ACCOUNT'S LOCKED. CONTACT US.",
      "auth/popup-closed-by-user":        "POPUP CLOSED. TRY AGAIN OR USE EMAIL.",
      "auth/popup-blocked":               "BROWSER BLOCKED THE POPUP. ALLOW IT AND RETRY.",
      "auth/cancelled-popup-request":     "POPUP CLOSED. TRY AGAIN OR USE EMAIL.",
      "auth/operation-not-allowed":       "THAT SIGN-IN METHOD ISN'T ENABLED YET.",
      "auth/account-exists-with-different-credential":
                                          "EMAIL'S ALREADY LINKED TO A DIFFERENT SIGN-IN METHOD.",
      "auth/email-not-verified":          "CONFIRM YOUR EMAIL FIRST. CHECK YOUR INBOX.",
    };
    return map[code] || "SOMETHING BROKE. TRY AGAIN.";
  }

  function normalizeEmail(raw) {
    return (raw || "").trim().toLowerCase().slice(0, 254);
  }

  function safeName(raw) {
    return (raw || "").trim().slice(0, 50);
  }

  function safeSpoke(raw) {
    var s = (raw || "HUB").toString().toUpperCase();
    return VALID_SPOKES[s] ? s : "HUB";
  }

  // ---------- profile doc helpers ----------
  // Writes the profile doc if it doesn't already exist. Used by both the
  // email signup path (one-time, while the user is briefly authenticated
  // before we sign them out for verification) and the OAuth path (one-time
  // on first popup completion). The Firestore rule enforces ownership +
  // shape, so even if a caller passes garbage, the rule rejects it.
  async function ensureProfile(user, displayName, defaultSpoke) {
    var ref = db.collection("profiles").doc(user.uid);
    var snap = await ref.get();
    if (snap.exists) return;
    var ts = firebase.firestore.FieldValue.serverTimestamp();
    await ref.set({
      displayName:  safeName(displayName || user.displayName || "NEW MEMBER"),
      defaultSpoke: safeSpoke(defaultSpoke),
      createdAt:    ts,
      updatedAt:    ts,
    });
  }

  // ---------- main API ----------
  async function signUp(input) {
    var email = normalizeEmail(input.email);
    var pass  = input.password || "";
    var name  = safeName(input.displayName);
    var spoke = safeSpoke(input.defaultSpoke);

    try {
      var cred = await auth.createUserWithEmailAndPassword(email, pass);
      var user = cred.user;

      // Best-effort displayName on the auth record (used by OAuth UIs too).
      try { await user.updateProfile({ displayName: name }); } catch (_e) {}

      // Write the profile doc while we're still authenticated.
      try { await ensureProfile(user, name, spoke); } catch (_e) {}

      // Trigger verification email, then sign the user out so they must
      // confirm before they can log in (the Phase-1 "option A" choice).
      await user.sendEmailVerification({
        url: window.location.origin + "/Log%20In.html?verified=1",
        handleCodeInApp: false,
      });
      await auth.signOut();

      return { error: null, code: null, data: { email: email } };
    } catch (e) {
      return { error: friendly(e), code: e.code || null, data: null };
    }
  }

  async function signIn(input) {
    var email = normalizeEmail(input.email);
    var pass  = input.password || "";
    try {
      var cred = await auth.signInWithEmailAndPassword(email, pass);
      var user = cred.user;

      if (!user.emailVerified) {
        await auth.signOut();
        return { error: friendly({ code: "auth/email-not-verified" }), code: "auth/email-not-verified", data: null };
      }
      return { error: null, code: null, data: { user: user } };
    } catch (e) {
      return { error: friendly(e), code: e.code || null, data: null };
    }
  }

  async function signOut() {
    try {
      await auth.signOut();
      return { error: null };
    } catch (e) {
      return { error: friendly(e) };
    }
  }

  async function resetPassword(emailRaw) {
    var email = normalizeEmail(emailRaw);
    if (!email) return { error: "ENTER YOUR EMAIL FIRST." };
    try {
      await auth.sendPasswordResetEmail(email, {
        url: window.location.origin + "/Log%20In.html?recover=1",
        handleCodeInApp: false,
      });
      return { error: null };
    } catch (e) {
      return { error: friendly(e) };
    }
  }

  async function signInWithProvider(provider) {
    try {
      var p;
      if (provider === "google") {
        p = new firebase.auth.GoogleAuthProvider();
      } else if (provider === "apple") {
        p = new firebase.auth.OAuthProvider("apple.com");
      } else {
        return { error: "UNKNOWN PROVIDER." };
      }
      var res = await auth.signInWithPopup(p);
      // First-OAuth-sign-in: make sure a profile doc exists.
      try { await ensureProfile(res.user, res.user.displayName, "HUB"); } catch (_e) {}
      return { error: null };
    } catch (e) {
      return { error: friendly(e) };
    }
  }

  // ---------- session shape ----------
  // Normalize to { user } so the existing gate / Masthead code keeps working
  // (it already reads session.user.email).
  function toSession(user) { return user ? { user: user } : null; }

  // getSession: resolve once on the first onAuthStateChanged fire so callers
  // get the persisted-user-or-null reliably at boot. After that we cache.
  var initial = null;
  var initialReady = false;
  var initialQueue = [];
  auth.onAuthStateChanged(function (user) {
    initial = toSession(user);
    initialReady = true;
    while (initialQueue.length) initialQueue.shift()(initial);
  });

  function getSession() {
    if (initialReady) return Promise.resolve(initial);
    return new Promise(function (resolve) { initialQueue.push(resolve); });
  }

  function onChange(cb) {
    return auth.onAuthStateChanged(function (user) { cb(toSession(user)); });
  }

  window.dtAuth = {
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    resetPassword: resetPassword,
    signInWithProvider: signInWithProvider,
    getSession: getSession,
    onChange: onChange,
    _auth: auth,
    _db: db,
  };
})();
