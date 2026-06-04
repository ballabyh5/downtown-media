// dt-auth-gate.js — page-load session check + post-login redirect.
//
// Behavior:
//   1. Reads window.dtAuth.getSession() at boot.
//   2. If <meta name="dt-protected" content="1"> is present AND no session,
//      redirects to Log In.html?next=<encoded current path+query>.
//   3. On Log In.html, after auth state flips to a real session, honors the
//      ?next= param if it points to a same-origin path.
//   4. Exposes window.dtSession (current session or null) for any UI that
//      needs to render based on it (e.g., Masthead).
//   5. Re-renders by reloading on logout so every page recomputes its gate.
//
// "Protection" on a static site is UX, not security. Real protection lives
// in firestore.rules — even a determined user opening DevTools can't read
// or write data the rules forbid, because the API rejects the request.

(function () {
  if (!window.dtAuth) {
    console.error("[dt-auth-gate] dtAuth not loaded — script order is wrong");
    return;
  }

  function isProtected() {
    var m = document.querySelector('meta[name="dt-protected"]');
    return m && m.getAttribute("content") === "1";
  }

  function loginUrl(next) {
    var u = "Log%20In.html";
    if (next) u += "?next=" + encodeURIComponent(next);
    return u;
  }

  function safeNext(raw) {
    if (!raw) return null;
    try {
      var decoded = decodeURIComponent(raw);
      // Reject absolute URLs and protocol-relative — same-origin only.
      if (decoded.indexOf("//") === 0) return null;
      if (/^[a-z]+:/i.test(decoded))   return null;
      return decoded;
    } catch (_e) {
      return null;
    }
  }

  function onLoginPage() {
    return /Log\s*In\.html$/i.test(window.location.pathname);
  }

  function currentPathAndQuery() {
    return window.location.pathname + window.location.search;
  }

  window.dtSession = null;

  window.dtAuth.getSession().then(function (session) {
    window.dtSession = session;
    if (isProtected() && !session) {
      window.location.replace(loginUrl(currentPathAndQuery()));
      return;
    }
    if (onLoginPage() && session) {
      var next = safeNext(new URLSearchParams(window.location.search).get("next"));
      if (next) window.location.replace(next);
    }
    window.dispatchEvent(new CustomEvent("dt:session", { detail: session }));
  });

  window.dtAuth.onChange(function (session) {
    var prev = window.dtSession;
    window.dtSession = session;
    window.dispatchEvent(new CustomEvent("dt:session", { detail: session }));

    if (!prev && session && onLoginPage()) {
      var next = safeNext(new URLSearchParams(window.location.search).get("next"));
      if (next) window.location.replace(next);
    }
    if (prev && !session && isProtected()) {
      window.location.replace(loginUrl(currentPathAndQuery()));
    }
  });
})();
