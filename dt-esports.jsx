// dt-esports.jsx — Downtown Media Esports vertical
const { useState: useES, useEffect: useESe, useRef: useESr } = React;

const ES_GAMES = ["ALL", "VALORANT", "BGMI", "DOTA 2", "CS2"];

// Featured live match per game (ALL falls back to VALORANT)
const ES_FEATURED = {
  VALORANT: {
    tourney: "VCT — SOUTH ASIA · GRAND FINAL",
    map: "ASCENT · MAP 3", note: "ROUND 21 · GODLIKE ON MAP POINT",
    t1: { name: "GODLIKE", tag: "GE", s: 12 },
    t2: { name: "GLOBAL ESPORTS", tag: "GLE", s: 9 },
    viewers: 48213,
    headline: "GODLIKE ON MAP POINT — GLOBAL'S COMEBACK IS RIGHT HERE OR NOWHERE",
    dek: "Two rounds from the trophy. We're live in the server with round-by-round reactions and the loudest watch-party in the country.",
  },
  BGMI: {
    tourney: "BGMI MASTERS · GRAND FINALS · DAY 3",
    map: "ERANGEL · MATCH 14", note: "ZONE 5 · 23 ALIVE",
    t1: { name: "SOUL", tag: "SOUL", s: 78 },
    t2: { name: "GODLIKE", tag: "GE", s: 71 },
    viewers: 91440,
    headline: "SOUL AND GODLIKE TRADING THE LEAD WITH SIX MATCHES LEFT",
    dek: "Day 3 is a bloodbath. Overall points are within one chicken dinner — every rotation matters now.",
  },
  "DOTA 2": {
    tourney: "ESL ONE · SEA QUALIFIER · UB FINAL",
    map: "GAME 2 · 38 MIN", note: "RADIANT +12K NET WORTH",
    t1: { name: "REVENANT", tag: "RVN", s: 1 },
    t2: { name: "GODS REIGN", tag: "GR", s: 1 },
    viewers: 12087,
    headline: "REVENANT FORCE GAME 3 AFTER A 38-MINUTE THROWDOWN",
    dek: "A high-ground siege that would not end. We break down the Aegis steal that flipped it.",
  },
  CS2: {
    tourney: "ESEA SOUTH ASIA · PLAYOFFS",
    map: "MIRAGE · 24-21", note: "CT SIDE · ROUND 46",
    t1: { name: "VELOCITY", tag: "VLT", s: 24 },
    t2: { name: "ORANGUTAN", tag: "OG", s: 21 },
    viewers: 8765,
    headline: "VELOCITY GRIND OUT MIRAGE IN A ROUND-46 KNIFE-FIGHT",
    dek: "Overtime energy without the overtime. The clutch that broke Orangutan's economy, frame by frame.",
  },
};

const ES_MATCHES = [
  { g: "VALORANT", st: "LIVE", a: "GODLIKE", b: "GLOBAL ESPORTS", sa: 12, sb: 9, info: "VCT SA · GRAND FINAL" },
  { g: "BGMI", st: "LIVE", a: "SOUL", b: "GODLIKE", sa: 78, sb: 71, info: "BGMI MASTERS · DAY 3" },
  { g: "CS2", st: "LIVE", a: "VELOCITY", b: "ORANGUTAN", sa: 24, sb: 21, info: "ESEA SA · PLAYOFFS" },
  { g: "VALORANT", st: "UP", a: "TRUE RIPPERS", b: "REVENANT", time: "TODAY 8:30 PM", info: "VCT SA · 3RD PLACE" },
  { g: "DOTA 2", st: "UP", a: "REVENANT", b: "GODS REIGN", time: "TODAY 9:00 PM", info: "ESL ONE · GAME 3" },
  { g: "BGMI", st: "UP", a: "ENIGMA", b: "GLADIATORS", time: "TMRW 6:00 PM", info: "BGMI MASTERS · DAY 4" },
  { g: "CS2", st: "UP", a: "ORANGUTAN", b: "MARCOS", time: "TMRW 7:30 PM", info: "ESEA SA · LB R2" },
  { g: "VALORANT", st: "FIN", a: "GODLIKE", b: "TRUE RIPPERS", sa: 2, sb: 0, info: "VCT SA · UB FINAL" },
  { g: "DOTA 2", st: "FIN", a: "GODS REIGN", b: "REVENANT", sa: 2, sb: 1, info: "ESL ONE · UB SF" },
  { g: "BGMI", st: "FIN", a: "GODLIKE", b: "ENIGMA", sa: 91, sb: 84, info: "BGMI MASTERS · DAY 2" },
];

const ES_STANDINGS = {
  VALORANT: { tourney: "VCT — SOUTH ASIA", rows: [
    { t: "GODLIKE", w: 11, l: 2, d: "+18", p: 33 },
    { t: "GLOBAL ESPORTS", w: 10, l: 3, d: "+14", p: 30 },
    { t: "TRUE RIPPERS", w: 8, l: 5, d: "+6", p: 24 },
    { t: "REVENANT", w: 6, l: 7, d: "-2", p: 18 },
    { t: "VELOCITY", w: 3, l: 10, d: "-15", p: 9 },
  ]},
  BGMI: { tourney: "BGMI MASTERS", rows: [
    { t: "SOUL", w: 6, l: 1, d: "182", p: 182 },
    { t: "GODLIKE", w: 5, l: 2, d: "176", p: 176 },
    { t: "ENIGMA", w: 4, l: 3, d: "151", p: 151 },
    { t: "GLADIATORS", w: 3, l: 4, d: "133", p: 133 },
    { t: "BLIND", w: 2, l: 5, d: "98", p: 98 },
  ]},
  "DOTA 2": { tourney: "ESL ONE — SEA", rows: [
    { t: "REVENANT", w: 7, l: 2, d: "+9", p: 21 },
    { t: "GODS REIGN", w: 6, l: 3, d: "+5", p: 18 },
    { t: "ORANGUTAN", w: 4, l: 5, d: "-1", p: 12 },
    { t: "MARCOS", w: 2, l: 7, d: "-8", p: 6 },
  ]},
  CS2: { tourney: "ESEA — SOUTH ASIA", rows: [
    { t: "VELOCITY", w: 9, l: 3, d: "+74", p: 27 },
    { t: "ORANGUTAN", w: 8, l: 4, d: "+51", p: 24 },
    { t: "MARCOS", w: 6, l: 6, d: "+8", p: 18 },
    { t: "TRUE RIPPERS", w: 4, l: 8, d: "-33", p: 12 },
  ]},
};

const ES_STORIES = [
  { g: "VALORANT", tag: "VALORANT", title: "GodLike's coach broke down the grand-final map veto for us, frame by frame", byline: "RIMJHIM", read: "6 MIN" },
  { g: "BGMI", tag: "BGMI", title: "Sensitivity settings the pros don't actually want you to copy", byline: "DEV 'DPS' PRATAP", read: "5 MIN" },
  { g: "VALORANT", tag: "TRANSFERS", title: "The roster shake-up nobody saw coming — and who's quietly fielding offers", byline: "KASHISH AZMANI", read: "8 MIN" },
  { g: "CS2", tag: "CS2", title: "Velocity's anchor on the clutch that broke Orangutan's whole economy", byline: "ARUSH SINGH", read: "4 MIN" },
  { g: "DOTA 2", tag: "DOTA 2", title: "Inside the 38-minute high-ground siege that refused to end", byline: "RIMJHIM", read: "7 MIN" },
  { g: "BGMI", tag: "SCENE", title: "We crashed a 200-player BGMI LAN in Andheri. It went off.", byline: "SANA K", read: "5 MIN" },
];

const ES_PLAYERS = [
  { g: "VALORANT", h: "@syk0", name: "SYKO", team: "GODLIKE", role: "DUELIST", rating: "1.34", kd: "1.6", color: "#39FF14" },
  { g: "BGMI", h: "@jonathan", name: "JONATHAN", team: "GODLIKE", role: "ASSAULTER", rating: "4.8", kd: "3.1", color: "#FFEA00" },
  { g: "VALORANT", h: "@lightningfast", name: "LIGHTNING", team: "GLOBAL ESPORTS", role: "INITIATOR", rating: "1.21", kd: "1.3", color: "#1FB6FF" },
  { g: "CS2", h: "@nova", name: "NOVA", team: "VELOCITY", role: "AWPER", rating: "1.28", kd: "1.4", color: "#FF3B1D" },
  { g: "DOTA 2", h: "@moon", name: "MOON", team: "REVENANT", role: "CARRY", rating: "8.9", kd: "9.2", color: "#B388FF" },
  { g: "BGMI", h: "@spray", name: "SPRAY", team: "SOUL", role: "IGL", rating: "4.2", kd: "2.7", color: "#00FFD1" },
];

const byGame = (arr, g) => (g === "ALL" ? arr : arr.filter((x) => x.g === g));

// ---------- GAME SWITCHER ----------
function ESGameSwitch({ sel, setSel }) {
  return (
    <div className="es-switch">
      <span className="es-switch__lbl">TITLE //</span>
      <div className="es-switch__pills">
        {ES_GAMES.map((g) => (
          <button key={g} className={"gpill" + (sel === g ? " is-on" : "")} onClick={() => setSel(g)}>
            {g}
          </button>
        ))}
      </div>
      <span className="es-switch__feed">{sel === "ALL" ? "ALL TITLES" : sel} · LIVE FEED</span>
    </div>
  );
}

// ---------- HERO: live stream + scoreboard ----------
function ESHero({ sel }) {
  const f = ES_FEATURED[sel === "ALL" ? "VALORANT" : sel];
  const [viewers, setViewers] = useES(f.viewers);
  const [playing, setPlaying] = useES(true);

  useESe(() => { setViewers(f.viewers); }, [sel]);
  useESe(() => {
    const id = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 80) - 30), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="es-hero">
      <div className="es-hero__head">
        <SectionLabel n="LIVE">ON THE MAIN STAGE</SectionLabel>
        <span className="es-hero__t">{f.tourney}</span>
      </div>
      <div className="es-hero__grid">
        <div className="stream">
          <div className="stream__screen">
            <PH label={"LIVE STREAM · " + f.map} ratio="16 / 9" />
            <div className="stream__live"><span className="stream__dot" />LIVE</div>
            <div className="stream__viewers">◉ {viewers.toLocaleString("en-IN")} WATCHING</div>
            <button className={"stream__play" + (playing ? " is-on" : "")} onClick={() => setPlaying((p) => !p)}>
              {playing ? "❚❚" : "▶"}
            </button>
          </div>
          <div className="stream__bar">
            <span className="stream__map">{f.map}</span>
            <span className="stream__note">{f.note}</span>
            <a href="#" className="stream__chat" onClick={(e) => e.preventDefault()}>OPEN CHAT ▸</a>
          </div>
          <h1 className="es-hero__headline">{f.headline}</h1>
          <p className="es-hero__dek">{f.dek}</p>
        </div>

        <aside className="scoreboard">
          <div className="scoreboard__head">LIVE SCORE</div>
          <div className="scoreboard__team">
            <div className="scoreboard__logo" style={{ "--c": "var(--accent)" }}>{f.t1.tag}</div>
            <span className="scoreboard__name">{f.t1.name}</span>
            <span className={"scoreboard__s" + (f.t1.s >= f.t2.s ? " is-lead" : "")}>{f.t1.s}</span>
          </div>
          <div className="scoreboard__vs">VS</div>
          <div className="scoreboard__team">
            <div className="scoreboard__logo">{f.t2.tag}</div>
            <span className="scoreboard__name">{f.t2.name}</span>
            <span className={"scoreboard__s" + (f.t2.s > f.t1.s ? " is-lead" : "")}>{f.t2.s}</span>
          </div>
          <div className="scoreboard__foot">{f.note}</div>
          <button className="scoreboard__cta" onClick={(e) => e.preventDefault()}>WATCH THE STREAM ▶</button>
        </aside>
      </div>
    </section>
  );
}

// ---------- MATCHES ----------
function ESMatches({ sel }) {
  const [st, setSt] = useES("LIVE");
  const tabs = [["LIVE", "LIVE NOW"], ["UP", "UPCOMING"], ["FIN", "RESULTS"]];
  const list = byGame(ES_MATCHES, sel).filter((m) => m.st === st);
  return (
    <section className="es-sec">
      <div className="es-sec__head es-sec__head--row">
        <SectionLabel n="01">MATCHES</SectionLabel>
        <div className="es-tabs">
          {tabs.map(([k, lbl]) => (
            <button key={k} className={"es-tab" + (st === k ? " is-on" : "")} onClick={() => setSt(k)}>{lbl}</button>
          ))}
        </div>
      </div>
      {list.length ? (
        <div className="matchgrid">
          {list.map((m, i) => (
            <article className={"match match--" + m.st.toLowerCase()} key={i}>
              <div className="match__top">
                <span className="match__game">{m.g}</span>
                <span className="match__status">
                  {m.st === "LIVE" && <span className="match__pulse" />}
                  {m.st === "LIVE" ? "LIVE" : m.st === "UP" ? m.time : "FINAL"}
                </span>
              </div>
              <div className="match__teams">
                <div className="match__team">
                  <span className="match__tname">{m.a}</span>
                  {m.st !== "UP" && <span className={"match__score" + (m.sa >= m.sb ? " is-win" : "")}>{m.sa}</span>}
                </div>
                <div className="match__team">
                  <span className="match__tname">{m.b}</span>
                  {m.st !== "UP" && <span className={"match__score" + (m.sb > m.sa ? " is-win" : "")}>{m.sb}</span>}
                </div>
              </div>
              <div className="match__foot">{m.info}</div>
            </article>
          ))}
        </div>
      ) : (
        <div className="es-empty">NO {st === "LIVE" ? "LIVE" : st === "UP" ? "UPCOMING" : "FINISHED"} {sel !== "ALL" ? sel + " " : ""}MATCHES RIGHT NOW. CHECK BACK.</div>
      )}
    </section>
  );
}

// ---------- STANDINGS ----------
function ESStandings({ sel }) {
  const key = sel === "ALL" ? "VALORANT" : sel;
  const s = ES_STANDINGS[key];
  return (
    <section className="es-sec">
      <div className="es-sec__head es-sec__head--row">
        <SectionLabel n="02">STANDINGS</SectionLabel>
        <span className="es-stand__t">{s.tourney}</span>
      </div>
      <div className="standtable">
        <div className="standrow standrow--head">
          <span>#</span><span>TEAM</span><span>W</span><span>L</span><span className="standrow__d">{key === "BGMI" ? "PTS" : "DIFF"}</span><span>P</span>
        </div>
        {s.rows.map((r, i) => (
          <div className={"standrow" + (i === 0 ? " is-top" : "")} key={i}>
            <span className="standrow__rank">{String(i + 1).padStart(2, "0")}</span>
            <span className="standrow__team">{r.t}{i === 0 && <span className="standrow__crown">★ TOP SEED</span>}</span>
            <span>{r.w}</span><span>{r.l}</span><span className="standrow__d">{r.d}</span>
            <span className="standrow__p">{r.p}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- STORIES ----------
function ESStories({ sel }) {
  const list = byGame(ES_STORIES, sel);
  return (
    <section className="es-sec">
      <div className="es-sec__head"><SectionLabel n="03">FROM THE PITS</SectionLabel></div>
      <div className="es-stories">
        {list.map((s, i) => (
          <article className="es-story" key={i}>
            <PH label="THUMB · 16:9" ratio="16 / 9" />
            <div className="es-story__body">
              <Tag>{s.tag}</Tag>
              <h3 className="es-story__title">{s.title}</h3>
              <div className="es-story__meta"><span className="byline">{s.byline}</span><span className="dot">●</span><span>{s.read}</span></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- TOP CARRIES (players) ----------
function ESPlayers({ sel }) {
  const list = byGame(ES_PLAYERS, sel);
  const ref = useESr(null);
  return (
    <section className="es-players">
      <div className="es-sec__head es-sec__head--row" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 24px 18px" }}>
        <SectionLabel n="04">TOP CARRIES</SectionLabel>
        <div className="roster__nav">
          <button onClick={() => ref.current.scrollBy({ left: -340, behavior: "smooth" })}>←</button>
          <button onClick={() => ref.current.scrollBy({ left: 340, behavior: "smooth" })}>→</button>
        </div>
      </div>
      <div className="player-track" ref={ref}>
        {list.map((p, i) => (
          <article className="pcard" key={i} style={{ "--card": p.color }}>
            <div className="pcard__top"><span className="pcard__role">{p.role}</span><span className="pcard__game">{p.g}</span></div>
            <PH label="PLAYER · 3:4" ratio="3 / 4" />
            <div className="pcard__name">{p.name}</div>
            <div className="pcard__sub">{p.h} · {p.team}</div>
            <div className="pcard__stats">
              <div className="pcard__stat"><span className="pcard__sv">{p.rating}</span><span className="pcard__sk">RATING</span></div>
              <div className="pcard__stat"><span className="pcard__sv">{p.kd}</span><span className="pcard__sk">K/D</span></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ES_GAMES, ESGameSwitch, ESHero, ESMatches, ESStandings, ESStories, ESPlayers });
