// dt-blocks.jsx — Hero (Front Page), Roster, Merch/Drops, Footer
const { useState: useStateB, useRef: useRefB } = React;

// ---------- HERO ----------
function Hero({ city, lead, secondary, trending, heroLayout }) {
  return (
    <section className="hero">
      <div className="hero__head">
        <SectionLabel n="01">THE FRONT PAGE</SectionLabel>
        <span className="hero__dateline">{city.tag} · {city.dateline}</span>
      </div>

      <div className={"hero__grid " + (heroLayout === "masonry" ? "is-masonry" : "is-mega")}>
        {/* LEAD */}
        <article className="lead">
          <VideoPlayer label="LEAD VIDEO — STREET FOOD CHALLENGE (16:9)" tag={lead.tag} />
          <div className="lead__body">
            <div className="lead__kicker">
              <Tag solid>{lead.kicker}</Tag>
            </div>
            <h1 className="lead__title">{lead.title}</h1>
            <p className="lead__dek">{lead.dek}</p>
            <div className="lead__meta">
              <span className="byline">BY {lead.byline}</span>
              <span className="dot">●</span>
              <span>{lead.read} READ</span>
              <span className="dot">●</span>
              <a href="#" className="lead__watch" onClick={(e) => e.preventDefault()}>
                WATCH NOW ▶
              </a>
            </div>
          </div>
        </article>

        {/* SECONDARY STACK */}
        <div className="secs">
          {secondary.map((s, i) => (
            <article className="sec" key={i}>
              <PH label={"THUMB · 4:3"} ratio="4 / 3" />
              <div className="sec__body">
                <Tag>{s.kicker}</Tag>
                <h3 className="sec__title">{s.title}</h3>
                <div className="sec__meta">
                  <span className="byline">{s.byline}</span>
                  <span className="dot">●</span>
                  <span>{s.read}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* TRENDING SIDEBAR */}
        <aside className="trend">
          <div className="trend__head">
            <span className="trend__title">TRENDING NOW</span>
            <span className="trend__live">
              <span className="trend__pulse" />
              UPDATED 2 MIN AGO
            </span>
          </div>
          <ol className="trend__list">
            {trending.map((t, i) => (
              <li className="trend__item" key={i}>
                <span className="trend__num">{String(i + 1).padStart(2, "0")}</span>
                <div className="trend__txt">
                  <span className="trend__tag">{t.tag}</span>
                  <a href="#" onClick={(e) => e.preventDefault()}>{t.title}</a>
                </div>
              </li>
            ))}
          </ol>
          <a href="#" className="trend__more" onClick={(e) => e.preventDefault()}>
            SEE ALL HEAT →
          </a>
        </aside>
      </div>
    </section>
  );
}

function VideoPlayer({ label, tag }) {
  const [playing, setPlaying] = useStateB(false);
  return (
    <div className="vp">
      <PH label={label} ratio="16 / 9" sticker={tag} />
      <button
        className={"vp__btn" + (playing ? " is-playing" : "")}
        onClick={() => setPlaying((v) => !v)}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="vp__bar">
        <div className="vp__rec">
          <span className="vp__recdot" />
          {playing ? "PLAYING" : "PAUSED"}
        </div>
        <div className="vp__track">
          <div className="vp__fill" style={{ width: playing ? "62%" : "0%" }} />
        </div>
        <span className="vp__time">{playing ? "07:24 / 12:03" : "00:00 / 12:03"}</span>
      </div>
    </div>
  );
}

// ---------- ROSTER ----------
function Roster({ roster, rosterStyle }) {
  const trackRef = useRefB(null);
  const drag = useRefB({ down: false, x: 0, left: 0, moved: false });

  function onDown(e) {
    const t = trackRef.current;
    drag.current = { down: true, x: e.pageX, left: t.scrollLeft, moved: false };
    t.classList.add("is-grabbing");
  }
  function onMove(e) {
    if (!drag.current.down) return;
    const t = trackRef.current;
    const dx = e.pageX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    t.scrollLeft = drag.current.left - dx;
  }
  function onUp() {
    drag.current.down = false;
    if (trackRef.current) trackRef.current.classList.remove("is-grabbing");
  }
  function nudge(dir) {
    trackRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="roster">
      <div className="roster__head">
        <SectionLabel n="02">THE ROSTER</SectionLabel>
        <div className="roster__sub">
          <span>THE FACES OF THE NETWORK — TAP IN TO THEIR FEEDS</span>
          <div className="roster__nav">
            <button onClick={() => nudge(-1)} aria-label="prev">←</button>
            <button onClick={() => nudge(1)} aria-label="next">→</button>
          </div>
        </div>
      </div>

      <div
        className="roster__track"
        ref={trackRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        {roster.map((p, i) =>
          rosterStyle === "mugshot" ? (
            <MugCard p={p} key={i} />
          ) : (
            <TradeCard p={p} key={i} />
          )
        )}
        <a href="#" className="roster__all" onClick={(e) => e.preventDefault()}>
          <span>SEE THE<br />WHOLE<br />GANG →</span>
        </a>
      </div>
    </section>
  );
}

function TradeCard({ p }) {
  return (
    <article className="card" style={{ "--card": p.color }}>
      <div className="card__top">
        <span className="card__num">{p.num}</span>
        <span className="card__beat">{p.beat}</span>
      </div>
      <PH label="ROSTER PORTRAIT · 3:4" ratio="3 / 4" />
      <div className="card__name">{p.name}</div>
      <div className="card__handle">{p.handle}</div>
      <div className="card__stats">
        {Object.entries(p.stats).map(([k, v]) => (
          <div className="card__stat" key={k}>
            <span className="card__statv">{v}</span>
            <span className="card__statk">{k}</span>
          </div>
        ))}
      </div>
      <button className="card__cta" onClick={(e) => e.preventDefault()}>
        FOLLOW
      </button>
    </article>
  );
}

function MugCard({ p }) {
  return (
    <article className="mug" style={{ "--card": p.color }}>
      <PH label="ROSTER PORTRAIT · 3:4" ratio="3 / 4" />
      <div className="mug__overlay">
        <span className="mug__num">{p.num}</span>
        <div className="mug__name">{p.name}</div>
        <div className="mug__beat">{p.beat}</div>
      </div>
      <div className="mug__handle">{p.handle}</div>
    </article>
  );
}

// ---------- MERCH / DROPS ----------
function Merch({ drops }) {
  return (
    <section className="merch">
      <div className="merch__banner">
        <div className="merch__bgword">DROPS DROPS DROPS DROPS</div>
        <div className="merch__head">
          <div>
            <SectionLabel n="03">RECENT DROPS</SectionLabel>
            <h2 className="merch__title">
              WEAR THE<br />NETWORK.
            </h2>
            <p className="merch__dek">
              Heavyweight cotton, loud graphics, made in small batches that sell out
              before you finish reading this. No restock guarantees. That's the point.
            </p>
            <button className="merch__cta" onClick={(e) => e.preventDefault()}>
              SHOP THE STORE ▶
            </button>
          </div>
          <div className="merch__grid">
            {drops.map((d, i) => (
              <article className={"drop" + (d.sold ? " is-sold" : "")} key={i}>
                <PH label="PRODUCT · 1:1" ratio="1 / 1" sticker={d.status} />
                <div className="drop__row">
                  <span className="drop__name">{d.name}</span>
                  <span className="drop__price">{d.price}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------
function Footer() {
  const cols = [
    { h: "THE NETWORK", l: ["About the Hub", "Our Spokes", "Careers", "Press kit", "Advertise"] },
    { h: "COVERAGE", l: ["Cricket", "Esports", "Culture", "Money", "Watch"] },
    { h: "THE CITIES", l: ["Downtown Delhi", "Downtown Mumbai", "Downtown Bangalore", "Pitch your city"] },
    { h: "FOLLOW", l: ["Instagram", "YouTube", "X / Twitter", "Discord", "WhatsApp"] },
  ];
  return (
    <footer className="foot">
      <div className="foot__top">
        <div className="foot__brand">
          <span className="logo__word" style={{ fontSize: 44 }}>DOWNTOWN</span>
          <span className="foot__tagline">A HUB-AND-SPOKE MEDIA NETWORK FOR YOUNG INDIA.</span>
          <a href="Newsletter.html" className="foot__sub">
            GET THE DAILY DROP →
          </a>
        </div>
        <div className="foot__cols">
          {cols.map((c) => (
            <div className="foot__col" key={c.h}>
              <div className="foot__h">{c.h}</div>
              {c.l.map((x) => (
                <a href="#" key={x} onClick={(e) => e.preventDefault()}>{x}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="foot__bar">
        <span>© 2026 DOWNTOWN MEDIA PVT. LTD. — ALL NOISE RESERVED.</span>
        <span className="foot__legal">
          <a href="#" onClick={(e) => e.preventDefault()}>PRIVACY</a>
          <a href="#" onClick={(e) => e.preventDefault()}>TERMS</a>
          <a href="#" onClick={(e) => e.preventDefault()}>MADE IN INDIA ✦</a>
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, { Hero, VideoPlayer, Roster, TradeCard, MugCard, Merch, Footer });
