// dt-events.jsx — Downtown Media events vertical (city-filtered, on-page RSVP)
const { useState: useEV, useEffect: useEVe } = React;

const EV_TYPES = ["ALL", "LIVE SHOW", "WATCH PARTY", "BGMI LAN", "MEETUP", "POP-UP"];

// city: HUB = national/flagship (shows in every city). Others = that Spoke.
const EV_EVENTS = [
  { id: "e1", day: "04", dow: "THU", mon: "JUN", time: "7:30 PM", iso: "2026-06-04T19:30:00+05:30",
    title: "IND vs AUS — BIG-SCREEN WATCH PARTY", venue: "Hauz Khas Social", city: "DELHI", type: "WATCH PARTY",
    status: "FREE ENTRY", price: "FREE", tie: "3RD T20I · LIVE ON THE TICKER",
    blurb: "Giant screen, louder crowd, and our roster heckling every wide. Walk-ins welcome till the place fills up." },
  { id: "e2", day: "06", dow: "SAT", mon: "JUN", time: "7:00 PM", iso: "2026-06-06T19:00:00+05:30",
    title: "DOWNTOWN LIVE: DELHI", venue: "Talkatora Indoor Stadium", city: "DELHI", type: "LIVE SHOW",
    status: "SELLING FAST", price: "₹599", tie: "FLAGSHIP TOUR",
    blurb: "The whole network, one stage, zero filter. Live podcast tapings, surprise guests and a crowd that doesn't sit down." },
  { id: "e3", day: "08", dow: "MON", mon: "JUN", time: "8:00 PM", iso: "2026-06-08T20:00:00+05:30",
    title: "OPEN MIC NIGHT WITH SANA K", venue: "antiSOCIAL, Khar", city: "MUMBAI", type: "MEETUP",
    status: "TICKETS LIVE", price: "₹299",
    blurb: "Five mics, no rules. Sana hosts the city's loudest open mic — comedy, bars, and the occasional disaster." },
  { id: "e4", day: "13", dow: "SAT", mon: "JUN", time: "12:00 PM", iso: "2026-06-13T12:00:00+05:30",
    title: "DOWNTOWN LAN: MUMBAI 200", venue: "Andheri Esports Arena", city: "MUMBAI", type: "BGMI LAN",
    status: "SELLING FAST", price: "₹399", tie: "200-PLAYER BGMI BRACKET",
    blurb: "200 players, one trophy, all day. BYO squad or get drafted at the door. Casted live by the Downtown desk." },
  { id: "e5", day: "14", dow: "SUN", mon: "JUN", time: "3:30 PM", iso: "2026-06-14T15:30:00+05:30",
    title: "RCB WATCH PARTY", venue: "Toit, Indiranagar", city: "BANGALORE", type: "WATCH PARTY",
    status: "FREE ENTRY", price: "FREE", tie: "M.CHINNASWAMY FIXTURE",
    blurb: "Ee sala. Probably. Either way we're watching together with cold ones and colder takes." },
  { id: "e6", day: "20", dow: "SAT", mon: "JUN", time: "7:00 PM", iso: "2026-06-20T19:00:00+05:30",
    title: "DOWNTOWN LIVE: BENGALURU", venue: "Phoenix Marketcity", city: "BANGALORE", type: "LIVE SHOW",
    status: "TICKETS LIVE", price: "₹599", tie: "FLAGSHIP TOUR",
    blurb: "The tour rolls south. Same chaos, more filter coffee. Doors at 6, mayhem at 7." },
  { id: "e7", day: "21", dow: "SUN", mon: "JUN", time: "11:00 AM", iso: "2026-06-21T11:00:00+05:30",
    title: "'NIGHT SHIFT' POP-UP DROP", venue: "Roaming · watch the app", city: "HUB", type: "POP-UP",
    status: "TICKETS LIVE", price: "EARLY ACCESS", tie: "NATIONAL · 1 DAY ONLY",
    blurb: "The Night Shift restock, in person, before it hits the site. Location pings to ticket-holders 24h before." },
  { id: "e8", day: "27", dow: "SAT", mon: "JUN", time: "5:00 PM", iso: "2026-06-27T17:00:00+05:30",
    title: "MEET THE ROSTER: ARUSH + RIMJHIM", venue: "DLF CyberHub", city: "DELHI", type: "MEETUP",
    status: "SOLD OUT", price: "₹349",
    blurb: "Photos, hot takes, and questions you'll regret asking. Capped at 150 — and it's gone." },
  { id: "e9", day: "04", dow: "SAT", mon: "JUL", time: "7:00 PM", iso: "2026-07-04T19:00:00+05:30",
    title: "DOWNTOWN LIVE: MUMBAI", venue: "NSCI Dome, Worli", city: "MUMBAI", type: "LIVE SHOW",
    status: "TICKETS LIVE", price: "₹699", tie: "TOUR FINALE",
    blurb: "The biggest room on the tour. Full roster, live band, one very expensive confetti budget." },
  // past
  { id: "p1", day: "24", dow: "SAT", mon: "MAY", time: "—", iso: "2026-05-24T18:00:00+05:30",
    title: "CAMPUS TAKEOVER: NORTH CAMPUS", venue: "Delhi University", city: "DELHI", type: "MEETUP",
    status: "PAST", price: "—", blurb: "" },
  { id: "p2", day: "17", dow: "SAT", mon: "MAY", time: "—", iso: "2026-05-17T07:00:00+05:30",
    title: "CUBBON RUN CLUB X DOWNTOWN", venue: "Cubbon Park", city: "BANGALORE", type: "MEETUP",
    status: "PAST", price: "—", blurb: "" },
];

const matchesType = (e, type) => {
  if (type === "ALL") return true;
  if (type === "MEETUP") return e.type === "MEETUP";
  if (type === "POP-UP") return e.type === "POP-UP";
  return e.type === type;
};
const inCity = (e, city) => city === "HUB" || e.city === city || e.city === "HUB";

function ctaFor(status) {
  if (status === "SOLD OUT") return { label: "SOLD OUT", dis: true };
  if (status === "FREE ENTRY") return { label: "RSVP — FREE", dis: false };
  if (status === "PAST") return { label: "SEE THE RECAP →", dis: false, ghost: true };
  return { label: "GET TICKETS ▶", dis: false };
}

// ---------- COUNTDOWN ----------
function useCountdown(iso) {
  const [now, setNow] = useEV(Date.now());
  useEVe(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

// ---------- HERO (next up) ----------
function EVHero({ ev, cityLabel, onRSVP }) {
  const c = useCountdown(ev.iso);
  const cta = ctaFor(ev.status);
  return (
    <section className="ev-hero">
      <div className="ev-hero__head">
        <SectionLabel n="NEXT">NEXT UP IN {cityLabel}</SectionLabel>
        <span className="ev-hero__when">{ev.dow} {ev.day} {ev.mon} · {ev.time} IST</span>
      </div>
      <div className="ev-hero__grid">
        <div className="ev-poster">
          <PH label="EVENT POSTER · 3:4" ratio="3 / 4" sticker={ev.type} />
          <div className="ev-poster__date"><span>{ev.day}</span><span>{ev.mon}</span></div>
        </div>
        <div className="ev-hero__body">
          <div className="ev-hero__tags">
            <span className={"ev-status ev-status--" + ev.status.replace(/[^a-z]/gi, "").toLowerCase()}>{ev.status}</span>
            {ev.tie && <span className="ev-tie">◆ {ev.tie}</span>}
          </div>
          <h1 className="ev-hero__title">{ev.title}</h1>
          <div className="ev-hero__meta">
            <span>◷ {ev.dow} {ev.day} {ev.mon} · {ev.time}</span>
            <span>⌖ {ev.venue}, {ev.city === "HUB" ? "NATIONAL" : ev.city}</span>
          </div>
          <p className="ev-hero__blurb">{ev.blurb}</p>
          <div className="ev-count">
            {[["DAYS", c.d], ["HRS", c.h], ["MIN", c.m], ["SEC", c.s]].map(([k, v]) => (
              <div className="ev-count__cell" key={k}>
                <span className="ev-count__v">{String(v).padStart(2, "0")}</span>
                <span className="ev-count__k">{k}</span>
              </div>
            ))}
          </div>
          <div className="ev-hero__cta">
            <button className="ev-btn" disabled={cta.dis} onClick={() => onRSVP(ev)}>{cta.label}</button>
            <span className="ev-price">{ev.price}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- TYPE FILTER BAR ----------
function EVBar({ type, setType, count, cityLabel }) {
  return (
    <div className="ev-bar">
      <span className="ev-bar__count">{count} UPCOMING · {cityLabel}</span>
      <div className="ev-bar__chips">
        {EV_TYPES.map((tp) => (
          <button key={tp} className={"chip" + (type === tp ? " is-on" : "")} onClick={() => setType(tp)}>{tp}</button>
        ))}
      </div>
    </div>
  );
}

// ---------- SCHEDULE ----------
function EVRow({ ev, onRSVP }) {
  const cta = ctaFor(ev.status);
  return (
    <article className={"ev-row" + (ev.status === "PAST" ? " is-past" : "")}>
      <div className="ev-row__date">
        <span className="ev-row__day">{ev.day}</span>
        <span className="ev-row__dow">{ev.dow}</span>
      </div>
      <div className="ev-row__thumb"><PH label="POSTER" ratio="1 / 1" /></div>
      <div className="ev-row__info">
        <div className="ev-row__tags">
          <span className="ev-type">{ev.type}</span>
          <span className={"ev-status ev-status--" + ev.status.replace(/[^a-z]/gi, "").toLowerCase()}>{ev.status}</span>
        </div>
        <h3 className="ev-row__title">{ev.title}</h3>
        <div className="ev-row__meta">{ev.time !== "—" ? ev.time + " · " : ""}{ev.venue} · {ev.city === "HUB" ? "NATIONAL" : ev.city}</div>
      </div>
      <div className="ev-row__act">
        <span className="ev-row__price">{ev.price}</span>
        <button className={"ev-btn ev-btn--sm" + (cta.ghost ? " ev-btn--ghost" : "")} disabled={cta.dis} onClick={() => onRSVP(ev)}>{cta.label}</button>
      </div>
    </article>
  );
}

function EVSchedule({ upcoming, past, onRSVP }) {
  // group upcoming by month
  const groups = [];
  upcoming.forEach((e) => {
    let g = groups[groups.length - 1];
    if (!g || g.mon !== e.mon) { g = { mon: e.mon, items: [] }; groups.push(g); }
    g.items.push(e);
  });
  return (
    <section className="ev-sec">
      <div className="ev-sec__head"><SectionLabel n="01">THE SCHEDULE</SectionLabel></div>
      {upcoming.length === 0 && (
        <div className="es-empty">NOTHING ON THE CALENDAR HERE YET. SWITCH CITY OR CHECK BACK — WE MOVE FAST.</div>
      )}
      {groups.map((g) => (
        <div className="ev-month" key={g.mon}>
          <div className="ev-month__label"><span>{g.mon}</span><span className="ev-month__yr">2026</span><span className="ev-month__line" /></div>
          <div className="ev-list">
            {g.items.map((e) => <EVRow ev={e} key={e.id} onRSVP={onRSVP} />)}
          </div>
        </div>
      ))}
      {past.length > 0 && (
        <div className="ev-past">
          <div className="ev-month__label ev-month__label--past"><span>RECENTLY WENT DOWN</span><span className="ev-month__line" /></div>
          <div className="ev-list">
            {past.map((e) => <EVRow ev={e} key={e.id} onRSVP={onRSVP} />)}
          </div>
        </div>
      )}
    </section>
  );
}

// ---------- RSVP MODAL ----------
function EVModal({ ev, onClose }) {
  const [name, setName] = useEV("");
  const [email, setEmail] = useEV("");
  const [err, setErr] = useEV("");
  const [done, setDone] = useEV(false);
  if (!ev) return null;
  const free = ev.status === "FREE ENTRY";
  const recap = ev.status === "PAST";

  function submit(e) {
    e.preventDefault();
    if (recap) return;
    const okE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (name.trim().length < 2) { setErr("DROP YOUR NAME FIRST."); return; }
    if (!okE) { setErr("THAT EMAIL LOOKS FAKE."); return; }
    setErr(""); setDone(true);
  }

  return (
    <div className="ev-modal" onMouseDown={onClose}>
      <div className="ev-modal__box" onMouseDown={(e) => e.stopPropagation()}>
        <button className="ev-modal__x" onClick={onClose} aria-label="close">✕</button>
        {recap ? (
          <div className="ev-modal__pad">
            <span className="ev-type">{ev.type} · PAST</span>
            <h2 className="ev-modal__title">{ev.title}</h2>
            <div className="ev-modal__meta">{ev.dow} {ev.day} {ev.mon} · {ev.venue}, {ev.city}</div>
            <p className="ev-modal__line">This one's done and dusted. The recap reel and photo dump are live on the feed.</p>
            <button className="ev-btn" onClick={onClose}>WATCH THE RECAP ▶</button>
          </div>
        ) : !done ? (
          <form className="ev-modal__pad" onSubmit={submit} noValidate>
            <span className="ev-type">{ev.type} · {ev.city === "HUB" ? "NATIONAL" : ev.city}</span>
            <h2 className="ev-modal__title">{free ? "RSVP" : "GET TICKETS"}</h2>
            <div className="ev-modal__ev">{ev.title}</div>
            <div className="ev-modal__meta">{ev.dow} {ev.day} {ev.mon} · {ev.time} · {ev.venue}</div>
            <div className="ev-modal__fields">
              <label className="nl-label">YOUR NAME</label>
              <input className="ev-field" value={name} onChange={(e) => { setName(e.target.value); if (err) setErr(""); }} placeholder="first + last" />
              <label className="nl-label">EMAIL</label>
              <input className="ev-field" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (err) setErr(""); }} placeholder="you@thestreets.in" />
            </div>
            {err && <div className="nl-err">⚠ {err}</div>}
            <button type="submit" className="ev-btn ev-btn--full">
              {free ? "LOCK MY SPOT" : "CONTINUE — " + ev.price + " ▶"}
            </button>
            <p className="nl-fine">{free ? "FREE ENTRY · FIRST COME FIRST IN. WE'LL EMAIL THE DETAILS." : "SECURE CHECKOUT VIA OUR TICKETING PARTNER. NO HIDDEN FEES."}</p>
          </form>
        ) : (
          <div className="ev-modal__pad ev-modal__done">
            <div className="nl-done__badge">✓ YOU'RE ON THE LIST</div>
            <h2 className="ev-modal__title">SEE YOU THERE, {name.split(" ")[0].toUpperCase()}.</h2>
            <div className="ev-modal__ev">{ev.title}</div>
            <div className="ev-modal__meta">{ev.dow} {ev.day} {ev.mon} · {ev.time} · {ev.venue}</div>
            <p className="ev-modal__line">{free ? "Spot locked." : "Order confirmed."} Details + {free ? "entry pass" : "tickets"} sent to <strong>{email}</strong>. Add it to your calendar so you don't flake.</p>
            <button className="ev-btn ev-btn--full" onClick={onClose}>DONE</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { EV_EVENTS, EV_TYPES, matchesType, inCity, EVHero, EVBar, EVSchedule, EVModal });
