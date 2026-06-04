// dt-auth.jsx — Log In / Sign Up ("join the gang") page sections
const { useState: useAuth } = React;

const AUTH_SPOKES = ["THE HUB", "DELHI", "MUMBAI", "BANGALORE"];

// Map UI label → enum value the rules expect (see firestore.rules isValidSpoke).
const SPOKE_TO_ENUM = { "THE HUB": "HUB", "DELHI": "DELHI", "MUMBAI": "MUMBAI", "BANGALORE": "BANGALORE" };

const PASS_MIN = 12;
const PASS_MAX = 128;
const NAME_MAX = 50;
const EMAIL_MAX = 254;
// RFC-5322-lite. Server is the source of truth; this just kills obvious typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// OAuth providers to show in the form. Drop "apple" until you have a paid
// Apple Developer account and have configured the Apple provider in the
// Firebase console — otherwise the button errors with "operation-not-allowed".
const OAUTH_PROVIDERS = ["google"];

const AUTH_PERKS = [
  { k: "01", t: "DROP ALERTS", l: "First dibs on merch restocks & live-show tickets before the public timeline." },
  { k: "02", t: "THE 6AM DROP", l: "Five things worth knowing, in your inbox before your first chai." },
  { k: "03", t: "GANG-ONLY VOTES", l: "Pick the cover star, kill the bad takes, name the next series." },
  { k: "04", t: "MATCH-DAY LIVE", l: "Score blasts and group-chat energy pushed straight to you." },
];

// ---------- field atom ----------
function AField({ label, type, placeholder, value, onChange, err, autoComplete, right }) {
  return (
    <div className="af">
      <label className="af__label">{label}</label>
      <div className={"af__wrap" + (err ? " is-err" : "")}>
        <input
          className="af__input"
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
        {right}
      </div>
      {err && <div className="af__err">⚠ {err}</div>}
    </div>
  );
}

// ---------- main auth card ----------
function AuthCard({ startMode }) {
  const [mode, setMode] = useAuth(startMode === "signup" ? "signup" : "login");
  const [email, setEmail] = useAuth("");
  const [pass, setPass] = useAuth("");
  const [name, setName] = useAuth("");
  const [spoke, setSpoke] = useAuth("THE HUB");
  const [show, setShow] = useAuth(false);
  const [remember, setRemember] = useAuth(true);
  const [agree, setAgree] = useAuth(false);
  const [errs, setErrs] = useAuth({});
  const [done, setDone] = useAuth(false);
  const [busy, setBusy] = useAuth(false);
  const [topErr, setTopErr] = useAuth("");
  const [topErrCode, setTopErrCode] = useAuth("");
  const [resetMsg, setResetMsg] = useAuth("");

  function flip(next) {
    setMode(next);
    setErrs({});
    setDone(false);
    setTopErr("");
    setTopErrCode("");
    setResetMsg("");
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (busy || !window.dtAuth) return;
    setTopErr("");
    setResetMsg("");
    setBusy(true);
    const { error } = await window.dtAuth.resetPassword(email);
    setBusy(false);
    if (error) { setTopErr(error); return; }
    // Same UI message whether the email exists or not — prevents enumeration.
    setResetMsg("IF THAT EMAIL'S ON THE LIST, A RESET LINK IS ON ITS WAY.");
  }

  async function handleOAuth(provider) {
    if (busy || !window.dtAuth) return;
    setTopErr("");
    setBusy(true);
    const { error } = await window.dtAuth.signInWithProvider(provider);
    if (error) { setTopErr(error); setBusy(false); return; }
    // Popup closed with a signed-in user. The gate (dt-auth-gate.js) will
    // honor ?next= if set; otherwise show the same success card the
    // email flow uses.
    setMode("login");
    setBusy(false);
    setDone(true);
  }

  function validate() {
    const ex = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (mode === "signup") {
      if (trimmedName.length < 2)  ex.name = "WE NEED SOMETHING TO CALL YOU.";
      if (trimmedName.length > NAME_MAX) ex.name = "KEEP IT UNDER " + NAME_MAX + " CHARS.";
      if (!agree)                  ex.agree = "TICK THE BOX. HOUSE RULES.";
    }
    if (trimmedEmail.length > EMAIL_MAX || !EMAIL_RE.test(trimmedEmail)) ex.email = "THAT EMAIL LOOKS FAKE. TRY AGAIN.";
    if (pass.length < PASS_MIN)    ex.pass  = PASS_MIN + "+ CHARACTERS. MAKE IT MEAN SOMETHING.";
    if (pass.length > PASS_MAX)    ex.pass  = "PASSWORD'S TOO LONG. KEEP IT UNDER " + PASS_MAX + ".";
    return ex;
  }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setTopErr("");
    const ex = validate();
    setErrs(ex);
    if (Object.keys(ex).length > 0) return;
    if (!window.dtAuth) { setTopErr("AUTH NOT READY. RELOAD AND TRY AGAIN."); return; }

    setBusy(true);
    try {
      const payload = {
        email: email,
        password: pass,
        displayName: name,
        defaultSpoke: SPOKE_TO_ENUM[spoke] || "HUB",
      };
      const { error, code } = mode === "signup"
        ? await window.dtAuth.signUp(payload)
        : await window.dtAuth.signIn(payload);
      if (error) { setTopErr(error); setTopErrCode(code || ""); return; }
      setDone(true);
    } catch (_unexpected) {
      setTopErr("SOMETHING BROKE. TRY AGAIN.");
      setTopErrCode("");
    } finally {
      setBusy(false);
    }
  }

  // One-click recovery: dup-email on signup → flip to login, keep email + password fields.
  function switchToLoginFromDup() {
    setMode("login");
    setErrs({});
    setTopErr("");
    setTopErrCode("");
    setResetMsg("");
    setDone(false);
  }

  if (done) {
    return (
      <div className="auth-card auth-card--done">
        <div className="auth-done__badge">{mode === "signup" ? "✓ YOU'RE IN THE GANG" : "✓ WELCOME BACK"}</div>
        <h2 className="auth-done__title">
          {mode === "signup" ? <>SAVE YOUR<br />SPOT.</> : <>BACK ON<br />THE STREETS.</>}
        </h2>
        <p className="auth-done__line">
          {mode === "signup" ? (
            <>Confirmation sent to <strong>{email}</strong>. Verify it and your <strong>{spoke}</strong> feed
            goes live. First Drop lands tomorrow, 6AM IST.</>
          ) : (
            <>Signed in as <strong>{email}</strong>. Your feed's warmed up and the group chat's been loud.</>
          )}
        </p>
        <a href="Downtown Media.html" className="auth-go">ENTER THE HUB ▶</a>
        <button className="auth-redo" onClick={() => { setDone(false); setPass(""); }}>
          ← {mode === "signup" ? "USE A DIFFERENT EMAIL" : "NOT YOU? SWITCH ACCOUNT"}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button className={"auth-tab" + (mode === "login" ? " is-on" : "")} onClick={() => flip("login")}>LOG IN</button>
        <button className={"auth-tab" + (mode === "signup" ? " is-on" : "")} onClick={() => flip("signup")}>JOIN THE GANG</button>
      </div>

      <div className="auth-card__pad">
        <div className="auth-kicker">
          <span className="tag tag--solid">{mode === "login" ? "MEMBERS ONLY" : "FREE · 30 SECONDS"}</span>
        </div>
        <h1 className="auth-title">
          {mode === "login" ? <>WELCOME BACK,<br />TROUBLEMAKER.</> : <>PICK A NAME.<br />JOIN THE NOISE.</>}
        </h1>

        <form className="auth-form" onSubmit={submit} noValidate>
          {topErr && (
            <div className="af__err" role="alert">
              ⚠ {topErr}
              {topErrCode === "auth/email-already-in-use" && (
                <button type="button" className="af__err-cta" onClick={switchToLoginFromDup}>
                  ↪ TRY LOGGING IN INSTEAD
                </button>
              )}
            </div>
          )}
          {resetMsg && <div className="af__ok" role="status">✓ {resetMsg}</div>}
          {mode === "signup" && (
            <AField label="WHAT DO WE CALL YOU" placeholder="e.g. Tank from Lajpat" value={name}
              onChange={(v) => setName(v)} err={errs.name} autoComplete="name" />
          )}

          <AField label="EMAIL" type="email" placeholder="you@thestreets.in" value={email}
            onChange={(v) => setEmail(v)} err={errs.email} autoComplete="email" />

          <AField
            label={mode === "login" ? "PASSWORD" : "SET A PASSWORD"}
            type={show ? "text" : "password"}
            placeholder={mode === "login" ? "your secret handshake" : PASS_MIN + "+ characters"}
            value={pass}
            onChange={(v) => setPass(v)}
            err={errs.pass}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            right={<button type="button" className="af__eye" onClick={() => setShow((s) => !s)}>{show ? "HIDE" : "SHOW"}</button>}
          />

          {mode === "signup" && (
            <div className="af">
              <label className="af__label">YOUR SPOKE <span className="af__label-sub">SET YOUR DEFAULT FEED</span></label>
              <div className="auth-chips">
                {AUTH_SPOKES.map((s) => (
                  <button type="button" key={s} className={"chip" + (spoke === s ? " is-on" : "")} onClick={() => setSpoke(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {mode === "login" ? (
            <div className="auth-rowline">
              <button type="button" className={"auth-check" + (remember ? " is-on" : "")} onClick={() => setRemember((r) => !r)}>
                <span className="auth-check__box">{remember ? "✓" : ""}</span>
                KEEP ME ON THE STREETS
              </button>
              <a href="#" className="auth-link" onClick={handleForgot}>FORGOT IT?</a>
            </div>
          ) : (
            <div className="af">
              <button type="button" className={"auth-check auth-check--terms" + (agree ? " is-on" : "") + (errs.agree ? " is-err" : "")} onClick={() => setAgree((a) => !a)}>
                <span className="auth-check__box">{agree ? "✓" : ""}</span>
                I'M COOL WITH THE HOUSE RULES &amp; PRIVACY STUFF
              </button>
              {errs.agree && <div className="af__err">⚠ {errs.agree}</div>}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={busy} aria-busy={busy}>
            {busy
              ? (mode === "login" ? "CHECKING…" : "SIGNING YOU UP…")
              : (mode === "login" ? "LET ME IN ▶" : "MAKE IT OFFICIAL ▶")}
          </button>

          {OAUTH_PROVIDERS.length > 0 && <div className="auth-or"><span>OR</span></div>}

          {OAUTH_PROVIDERS.length > 0 && (
            <div className="auth-oauth" style={{ gridTemplateColumns: `repeat(${OAUTH_PROVIDERS.length}, 1fr)` }}>
              {OAUTH_PROVIDERS.includes("google") && (
                <button type="button" className="auth-oauth__btn" disabled={busy} onClick={() => handleOAuth("google")}>
                  <span className="auth-oauth__g">G</span> GOOGLE
                </button>
              )}
              {OAUTH_PROVIDERS.includes("apple") && (
                <button type="button" className="auth-oauth__btn" disabled={busy} onClick={() => handleOAuth("apple")}>
                  <span className="auth-oauth__g"></span> APPLE
                </button>
              )}
            </div>
          )}

          <p className="auth-switch">
            {mode === "login" ? (
              <>NEW AROUND HERE? <button type="button" onClick={() => flip("signup")}>JOIN THE GANG →</button></>
            ) : (
              <>ALREADY ONE OF US? <button type="button" onClick={() => flip("login")}>LOG IN →</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

// ---------- right-side hype panel ----------
function AuthHype() {
  return (
    <aside className="auth-hype">
      <div className="memcard">
        <div className="memcard__top">
          <span className="memcard__brand">DOWNTOWN</span>
          <span className="memcard__chip">MEMBER</span>
        </div>
        <div className="memcard__mid">
          <span className="memcard__lab">GANG NO.</span>
          <span className="memcard__no">84,217</span>
        </div>
        <div className="memcard__strip">✦ ALL ACCESS ✦ ALL CITIES ✦ ALL NOISE ✦ ALL ACCESS ✦ ALL CITIES ✦</div>
        <div className="memcard__bottom">
          <div>
            <span className="memcard__k">HOLDER</span>
            <span className="memcard__v">YOUR NAME HERE</span>
          </div>
          <div>
            <span className="memcard__k">SINCE</span>
            <span className="memcard__v">2026</span>
          </div>
        </div>
      </div>

      <div className="auth-perks">
        <div className="auth-perks__head">WHAT A FREE ACCOUNT UNLOCKS</div>
        {AUTH_PERKS.map((p) => (
          <div className="perk" key={p.k}>
            <span className="perk__k">{p.k}</span>
            <div className="perk__txt">
              <span className="perk__t">{p.t}</span>
              <span className="perk__l">{p.l}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="auth-stamp">NO SPAM<br />NO SELLOUT<br />ONE-TAP OUT</div>
    </aside>
  );
}

Object.assign(window, { AuthCard, AuthHype });
