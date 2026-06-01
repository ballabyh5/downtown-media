// dt-auth.jsx — Log In / Sign Up ("join the gang") page sections
const { useState: useAuth } = React;

const AUTH_SPOKES = ["THE HUB", "DELHI", "MUMBAI", "BANGALORE"];

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

  function flip(next) {
    setMode(next);
    setErrs({});
    setDone(false);
  }

  function submit(e) {
    e.preventDefault();
    const ex = {};
    if (mode === "signup" && name.trim().length < 2) ex.name = "WE NEED SOMETHING TO CALL YOU.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) ex.email = "THAT EMAIL LOOKS FAKE. TRY AGAIN.";
    if (pass.length < 6) ex.pass = "6+ CHARACTERS. MAKE IT MEAN SOMETHING.";
    if (mode === "signup" && !agree) ex.agree = "TICK THE BOX. HOUSE RULES.";
    setErrs(ex);
    if (Object.keys(ex).length === 0) setDone(true);
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
          {mode === "signup" && (
            <AField label="WHAT DO WE CALL YOU" placeholder="e.g. Tank from Lajpat" value={name}
              onChange={(v) => setName(v)} err={errs.name} autoComplete="name" />
          )}

          <AField label="EMAIL" type="email" placeholder="you@thestreets.in" value={email}
            onChange={(v) => setEmail(v)} err={errs.email} autoComplete="email" />

          <AField
            label={mode === "login" ? "PASSWORD" : "SET A PASSWORD"}
            type={show ? "text" : "password"}
            placeholder={mode === "login" ? "your secret handshake" : "6+ characters"}
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
              <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>FORGOT IT?</a>
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

          <button type="submit" className="auth-submit">
            {mode === "login" ? "LET ME IN ▶" : "MAKE IT OFFICIAL ▶"}
          </button>

          <div className="auth-or"><span>OR</span></div>

          <div className="auth-oauth">
            <button type="button" className="auth-oauth__btn" onClick={(e) => e.preventDefault()}><span className="auth-oauth__g">G</span> GOOGLE</button>
            <button type="button" className="auth-oauth__btn" onClick={(e) => e.preventDefault()}><span className="auth-oauth__g"></span> APPLE</button>
          </div>

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
