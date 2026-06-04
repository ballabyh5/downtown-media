// dt-ui.jsx — atoms, masthead, breaking-news ticker, city switcher
const { useState, useRef, useEffect } = React;

// Striped image placeholder with a mono label (user drops real media later)
function PH({ label, ratio, minH, sticker }) {
  const stripe =
    "repeating-linear-gradient(45deg, #141414 0 14px, #0c0c0c 14px 28px)";
  return (
    <div
      className="ph"
      style={{
        position: "relative",
        background: stripe,
        aspectRatio: ratio || undefined,
        minHeight: minH || undefined,
        border: "1px solid #2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "#6b6b6b",
          textTransform: "uppercase",
          padding: "4px 8px",
          textAlign: "center",
        }}
      >
        {label}
      </span>
      {sticker && (
        <span
          className="ph-sticker"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "var(--accent)",
            color: "#000",
            fontFamily: "var(--mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "3px 7px",
          }}
        >
          {sticker}
        </span>
      )}
    </div>
  );
}

// Small mono section label like  // THE FRONT PAGE
function SectionLabel({ children, n }) {
  return (
    <div className="sec-label">
      <span className="sec-label__tick">{n || "//"}</span>
      <span>{children}</span>
    </div>
  );
}

function Tag({ children, solid }) {
  return (
    <span className={"tag" + (solid ? " tag--solid" : "")}>{children}</span>
  );
}

// ---- Breaking news marquee ----
function Ticker({ city, tickerStyle }) {
  const items = city.ticker;
  if (tickerStyle === "static") {
    return (
      <div className="ticker ticker--static">
        <div className="ticker__badge">LIVE</div>
        <div className="ticker__stack">
          {items.slice(0, 3).map((t, i) => (
            <div className="ticker__row" key={i}>
              <span className="ticker__dot" />
              {t}
            </div>
          ))}
        </div>
        <ScoreChip score={city.score} />
      </div>
    );
  }
  // marquee — duplicate items so the loop is seamless
  const loop = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker__badge">BREAKING</div>
      <div className="ticker__viewport">
        <div className="ticker__track">
          {loop.map((t, i) => (
            <span className="ticker__item" key={i}>
              <span className="ticker__star">✦</span>
              {t}
            </span>
          ))}
        </div>
      </div>
      <ScoreChip score={city.score} />
    </div>
  );
}

function ScoreChip({ score }) {
  return (
    <div className="score-chip" title={score.match}>
      <span className="score-chip__live">
        <span className="score-chip__pulse" />
        LIVE
      </span>
      <span className="score-chip__match">{score.match}</span>
      <span className="score-chip__line">{score.line}</span>
    </div>
  );
}

// ---- Masthead / Top Navigation ----
function Masthead({ nav, cityKey, setCityKey, cities, active }) {
  const cur = active || "HUB";
  const PAGES = { HUB: "Downtown Media.html", ESPORTS: "Esports.html", EVENTS: "Events.html" };
  const [openSpokes, setOpenSpokes] = useState(false);
  const [q, setQ] = useState("");
  const [session, setSession] = useState(typeof window !== "undefined" ? window.dtSession : null);
  const [signingOut, setSigningOut] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpenSpokes(false);
    }
    document.addEventListener("mousedown", onDoc);
    function onSession(e) { setSession(e.detail); }
    window.addEventListener("dt:session", onSession);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("dt:session", onSession);
    };
  }, []);

  async function handleLogout() {
    if (signingOut || !window.dtAuth) return;
    setSigningOut(true);
    await window.dtAuth.signOut();
    // Reload so any cached UI state resets cleanly.
    window.location.reload();
  }

  const spokes = ["DELHI", "MUMBAI", "BANGALORE"];
  const userEmail = session && session.user ? session.user.email : "";
  const userTag = userEmail ? userEmail.split("@")[0].toUpperCase().slice(0, 18) : "";

  return (
    <header className="mast">
      <div className="util">
        <div className="util__l">
          <span className="util__time" id="util-clock">— : — IST</span>
          <span className="util__sep">/</span>
          <span>{cities[cityKey].dateline}</span>
          <span className="util__sep">/</span>
          <span className="util__wx">31°C · HAZY</span>
        </div>
        <div className="util__r">
          <a href="Newsletter.html">NEWSLETTER</a>
          <span className="util__sep">/</span>
          {session ? (
            <>
              <span className="util__who" title={userEmail}>HI, {userTag}</span>
              <button
                type="button"
                className="util__cta"
                onClick={handleLogout}
                disabled={signingOut}
                aria-busy={signingOut}
              >
                {signingOut ? "LOGGING OUT…" : "LOG OUT"}
              </button>
            </>
          ) : (
            <>
              <a href="Log In.html">LOG IN</a>
              <a href="Log In.html?mode=signup" className="util__cta">JOIN THE GANG</a>
            </>
          )}
        </div>
      </div>

      <div className="mast__main">
        <a href="Downtown Media.html" className="logo">
          <span className="logo__mark">▍▍</span>
          <span className="logo__word">DOWNTOWN</span>
          <span className="logo__sub">MEDIA</span>
        </a>

        <nav className="nav">
          {nav.map((n) => (
            <a
              key={n}
              href={PAGES[n] || "#"}
              className={"nav__link" + (n === cur ? " is-active" : "")}
              onClick={(e) => { if (!PAGES[n]) e.preventDefault(); }}
            >
              {n}
            </a>
          ))}

          <div className="spokes" ref={wrapRef}>
            <button
              className={"spokes__btn" + (openSpokes ? " is-open" : "")}
              onClick={() => setOpenSpokes((v) => !v)}
            >
              SPOKES
              <span className="spokes__chev">▾</span>
            </button>
            {openSpokes && (
              <div className="spokes__menu">
                <div className="spokes__head">PICK YOUR CITY</div>
                <button
                  className={"spokes__opt" + (cityKey === "HUB" ? " is-on" : "")}
                  onClick={() => {
                    setCityKey("HUB");
                    setOpenSpokes(false);
                  }}
                >
                  <span>THE HUB</span>
                  <span className="spokes__opt-sub">NATIONAL</span>
                </button>
                {spokes.map((s) => (
                  <button
                    key={s}
                    className={"spokes__opt" + (cityKey === s ? " is-on" : "")}
                    onClick={() => {
                      setCityKey(s);
                      setOpenSpokes(false);
                    }}
                  >
                    <span>DOWNTOWN {s}</span>
                    <span className="spokes__opt-sub">LOCAL</span>
                  </button>
                ))}
                <div className="spokes__soon">+ PUNE · KOLKATA · GOA — SOON</div>
              </div>
            )}
          </div>
        </nav>

        <div className="mast__search">
          <input
            className="search"
            placeholder="SEARCH THE STREETS…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* city tab strip — quick switch */}
      <div className="citystrip">
        <button
          className={"citystrip__tab" + (cityKey === "HUB" ? " is-on" : "")}
          onClick={() => setCityKey("HUB")}
        >
          ★ THE HUB
        </button>
        {spokes.map((s) => (
          <button
            key={s}
            className={"citystrip__tab" + (cityKey === s ? " is-on" : "")}
            onClick={() => setCityKey(s)}
          >
            {s}
          </button>
        ))}
        <span className="citystrip__hint">← HUB-AND-SPOKE · SWITCH YOUR FEED</span>
      </div>
    </header>
  );
}

Object.assign(window, { PH, SectionLabel, Tag, Ticker, ScoreChip, Masthead });
