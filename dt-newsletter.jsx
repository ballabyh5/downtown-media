// dt-newsletter.jsx — "The Daily Drop" signup page sections
const { useState: useNL } = React;

const NL_SPOKES = ["THE HUB", "DELHI", "MUMBAI", "BANGALORE"];
const NL_INTERESTS = ["CRICKET", "ESPORTS", "POP CULTURE", "COLLEGE LIFE", "MONEY MOVES", "MERCH DROPS"];

const NL_GET = [
  { tag: "DAILY · 6AM IST", title: "THE 6AM DROP", line: "Five things worth knowing before your first chai. Sports, internet, your city — sorted." },
  { tag: "SUNDAYS", title: "WEEKEND LONGFORM", line: "One big story we actually reported. Zero fluff, zero SEO sludge, all bite." },
  { tag: "AS IT HAPPENS", title: "DROP ALERTS", line: "First dibs on merch restocks and live-show tickets before they hit the public timeline." },
  { tag: "GAME NIGHTS", title: "MATCH-DAY LIVE", line: "Score blasts, hot takes and the group-chat energy, pushed straight to your inbox." },
];

const NL_STATS = [
  { v: "84K", k: "IN THE GANG" },
  { v: "6AM", k: "EVERY DAMN DAY" },
  { v: "04", k: "CITIES & COUNTING" },
  { v: "62%", k: "OPEN RATE" },
];

const NL_ISSUES = [
  { no: "#214", date: "FRI 30 MAY", title: "The catch that broke the internet, and the kid who took it", read: "4 MIN" },
  { no: "#213", date: "THU 29 MAY", title: "We ranked every campus canteen in North Campus. It got personal.", read: "6 MIN" },
  { no: "#212", date: "WED 28 MAY", title: "Inside the 200-player BGMI LAN nobody told you about", read: "5 MIN" },
  { no: "#211", date: "TUE 27 MAY", title: "Why every auto in Bengaluru is suddenly playing the same song", read: "3 MIN" },
  { no: "#210", date: "MON 26 MAY", title: "The ₹40 sandwich that runs three colleges", read: "4 MIN" },
];

// ---------- HERO + SIGNUP ----------
function NLHero() {
  const [email, setEmail] = useNL("");
  const [spoke, setSpoke] = useNL("THE HUB");
  const [interests, setInterests] = useNL(["CRICKET", "POP CULTURE"]);
  const [err, setErr] = useNL("");
  const [done, setDone] = useNL(false);

  function toggle(i) {
    setInterests((arr) => (arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i]));
  }
  function submit(e) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) { setErr("THAT EMAIL LOOKS FAKE. TRY AGAIN."); return; }
    setErr("");
    setDone(true);
  }

  return (
    <section className="nl-hero">
      <div className="nl-hero__l">
        <div className="nl-kicker">
          <Tag solid>NEWSLETTER · FREE FOREVER</Tag>
        </div>
        <h1 className="nl-title">FIVE THINGS.<br />EVERY MORNING.<br /><span className="nl-title__hl">NONE OF THEM<br />BORING.</span></h1>
        <p className="nl-dek">
          The Daily Drop is the only newsletter built for how young India actually
          reads — fast, loud, and straight to the point. Sports, internet chaos and
          your city, in your inbox by 6AM. Unsubscribe anytime. We won't be hurt. (We will.)
        </p>

        {!done ? (
          <form className="nl-form" onSubmit={submit} noValidate>
            <div className="nl-field">
              <label className="nl-label">DROP YOUR EMAIL</label>
              <div className={"nl-input-wrap" + (err ? " is-err" : "")}>
                <input
                  className="nl-input"
                  type="email"
                  placeholder="you@thestreets.in"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (err) setErr(""); }}
                />
                <button type="submit" className="nl-submit">SUBSCRIBE ▶</button>
              </div>
              {err && <div className="nl-err">⚠ {err}</div>}
            </div>

            <div className="nl-field">
              <label className="nl-label">PICK YOUR SPOKE</label>
              <div className="nl-chips">
                {NL_SPOKES.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={"chip" + (spoke === s ? " is-on" : "")}
                    onClick={() => setSpoke(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="nl-field">
              <label className="nl-label">WHAT ARE YOU HERE FOR <span className="nl-label__sub">PICK ALL THAT APPLY</span></label>
              <div className="nl-chips">
                {NL_INTERESTS.map((i) => (
                  <button
                    type="button"
                    key={i}
                    className={"chip chip--tag" + (interests.includes(i) ? " is-on" : "")}
                    onClick={() => toggle(i)}
                  >
                    {interests.includes(i) ? "✓ " : "+ "}{i}
                  </button>
                ))}
              </div>
            </div>

            <p className="nl-fine">NO SPAM. NO SELLING YOUR DATA. ONE-TAP UNSUB. PROMISE.</p>
          </form>
        ) : (
          <div className="nl-done">
            <div className="nl-done__badge">✓ YOU'RE IN THE GANG</div>
            <h2 className="nl-done__title">CHECK YOUR INBOX.</h2>
            <p className="nl-done__line">
              Confirmation sent to <strong>{email}</strong>. Your first <strong>{spoke}</strong> Drop
              lands tomorrow at 6AM IST.
            </p>
            <div className="nl-done__tags">
              <span className="nl-done__k">YOU'LL HEAR ABOUT:</span>
              {interests.length ? interests.map((i) => <span className="chip is-on" key={i}>{i}</span>)
                : <span className="chip is-on">EVERYTHING</span>}
            </div>
            <button className="nl-redo" onClick={() => { setDone(false); setEmail(""); }}>
              ← USE A DIFFERENT EMAIL
            </button>
          </div>
        )}
      </div>

      {/* email preview mock */}
      <aside className="nl-hero__r">
        <div className="mailcard">
          <div className="mailcard__bar">
            <span className="mailcard__dot" /><span className="mailcard__dot" /><span className="mailcard__dot" />
            <span className="mailcard__from">INBOX · DOWNTOWN MEDIA</span>
          </div>
          <div className="mailcard__head">
            <div className="mailcard__subj">THE 6AM DROP — MON, 30 MAY</div>
            <div className="mailcard__meta">to you · 6:00 AM · ★</div>
          </div>
          <div className="mailcard__body">
            <div className="mailcard__hero">
              <PH label="ISSUE HERO · 16:9" ratio="16 / 9" sticker="LEAD" />
            </div>
            {[
              "01  That catch. We have thoughts. All of them loud.",
              "02  The esports roster shake-up nobody saw coming",
              "03  Your city's weekend, sorted in 4 bullet points",
              "04  One link you'll send to the group chat",
            ].map((t, i) => (
              <div className="mailcard__row" key={i}>
                <span className="mailcard__sq" />
                <span>{t}</span>
              </div>
            ))}
            <div className="mailcard__cta">READ THE FULL DROP ▶</div>
          </div>
        </div>
        <div className="nl-stamp">DELIVERED<br />HOT &amp; FRESH</div>
      </aside>
    </section>
  );
}

// ---------- WHAT YOU GET ----------
function NLGet() {
  return (
    <section className="nl-sec">
      <div className="nl-sec__head">
        <SectionLabel n="01">WHAT LANDS IN YOUR INBOX</SectionLabel>
      </div>
      <div className="nl-get">
        {NL_GET.map((g, i) => (
          <article className="getcard" key={i}>
            <span className="getcard__no">{String(i + 1).padStart(2, "0")}</span>
            <span className="getcard__tag">{g.tag}</span>
            <h3 className="getcard__title">{g.title}</h3>
            <p className="getcard__line">{g.line}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- STAT STRIP ----------
function NLStats() {
  return (
    <section className="statstrip">
      {NL_STATS.map((s, i) => (
        <div className="statstrip__cell" key={i}>
          <span className="statstrip__v">{s.v}</span>
          <span className="statstrip__k">{s.k}</span>
        </div>
      ))}
    </section>
  );
}

// ---------- PAST ISSUES ----------
function NLIssues() {
  return (
    <section className="nl-sec">
      <div className="nl-sec__head nl-sec__head--row">
        <SectionLabel n="02">READ A FEW FIRST</SectionLabel>
        <a href="#" className="nl-archive" onClick={(e) => e.preventDefault()}>BROWSE THE ARCHIVE →</a>
      </div>
      <div className="nl-issues">
        {NL_ISSUES.map((it, i) => (
          <a href="#" className="issue" key={i} onClick={(e) => e.preventDefault()}>
            <span className="issue__no">{it.no}</span>
            <span className="issue__date">{it.date}</span>
            <span className="issue__title">{it.title}</span>
            <span className="issue__read">{it.read}</span>
            <span className="issue__arrow">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { NLHero, NLGet, NLStats, NLIssues });
