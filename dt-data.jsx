// dt-data.jsx — content model for Downtown Media homepage
// All copy is placeholder-but-believable. Exported to window for other babel scripts.

const DT_CITIES = {
  HUB: {
    key: "HUB",
    tag: "THE HUB",
    dateline: "PAN-INDIA",
    score: { match: "IND vs AUS · 3rd T20I", line: "IND 184/4 (18.2) · need 12", live: true },
    ticker: [
      "BREAKING — India clinch series with 4 balls to spare",
      "Valorant Masters: GodLike storm into grand final",
      "DROP — 'NIGHT SHIFT' hoodie restock goes live 6PM IST",
      "Kohli: 'this crowd is the loudest I've heard'",
      "Watch — we crashed a wedding baraat and reviewed the DJ",
      "Mumbai City FC sign teenage winger from Aizawl",
    ],
  },
  DELHI: {
    key: "DELHI",
    tag: "DOWNTOWN DELHI",
    dateline: "NEW DELHI",
    score: { match: "Delhi Capitals · DDCA Pro League", line: "DC 156/3 (16.0) · chasing 171", live: true },
    ticker: [
      "DELHI — Sarojini haul or scam? we rate 8 fits under ₹500",
      "North Campus fest lineup leaked — and it's loaded",
      "Gully cricket league finals at Yamuna Sports Complex Sun",
      "Momos beef: which Lajpat stall actually slaps?",
      "Metro buskers we can't stop thinking about",
    ],
  },
  MUMBAI: {
    key: "MUMBAI",
    tag: "DOWNTOWN MUMBAI",
    dateline: "MUMBAI",
    score: { match: "Mumbai Indians · MPL Warm-up", line: "MI 201/5 (20.0) · post big one", live: true },
    ticker: [
      "MUMBAI — vada pav power rankings, the final word",
      "Bandra open-mic scene is quietly the best in the country",
      "Local train freestyle goes viral, rapper IDs himself",
      "Marine Drive at 5AM hits different — a photo essay",
      "Andheri esports cafe hosts 200-player BGMI LAN",
    ],
  },
  BANGALORE: {
    key: "BANGALORE",
    tag: "DOWNTOWN BANGALORE",
    dateline: "BENGALURU",
    score: { match: "RCB Fan League · M.Chinnaswamy", line: "RCB 178/6 (19.3) · so close again", live: true },
    ticker: [
      "BENGALURU — startup bros vs filter coffee, an investigation",
      "Indiranagar pub crawl, ranked by the bouncer's vibe",
      "Esports HQ: city now home to 3 tier-1 orgs",
      "Koramangala traffic survivor diaries — send help",
      "Cubbon Park run club has a 400-person waitlist",
    ],
  },
};

const DT_NAV = ["HUB", "SPORTS", "CRICKET", "ESPORTS", "CULTURE", "EVENTS", "ROSTER", "SHOP"];

const DT_LEAD = {
  kicker: "FRONT PAGE · EXCLUSIVE",
  title: "WE GAVE A ₹200 BUDGET TO 3 CRICKETERS AND TOLD THEM TO FEED A STREET TEAM",
  dek: "Chaos, charity, and one genuinely elite dosa. Full uncut video inside — it goes exactly where you think it does.",
  byline: "ARUSH SINGH",
  read: "12 MIN",
  tag: "VIDEO",
};

const DT_SECONDARY = [
  { kicker: "ESPORTS", title: "GodLike's coach broke down the grand-final map veto for us, frame by frame", byline: "RIMJHIM", read: "6 MIN" },
  { kicker: "CRICKET", title: "The uncapped kid from Ranchi everyone in the dressing room is whispering about", byline: "KASHISH AZMANI", read: "8 MIN" },
  { kicker: "CULTURE", title: "We sent an intern to review every viral street-food spot in 24 hours", byline: "DESK", read: "4 MIN" },
];

const DT_TRENDING = [
  { tag: "CRICKET", title: "Player ratings: that catch will be replayed for a decade" },
  { tag: "ESPORTS", title: "BGMI sensitivity settings the pros don't want you to copy" },
  { tag: "CULTURE", title: "The hostel-mess tier list that started three group-chat wars" },
  { tag: "MONEY", title: "How a 19-yr-old turned clip edits into a ₹4L/month thing" },
  { tag: "WATCH", title: "Street interviews: 'name a bowler' — it went off the rails" },
];

const DT_ROSTER = [
  { name: "ARUSH SINGH", handle: "@arushh", beat: "FRONT PAGE / CRICKET", num: "01", stats: { POSTS: "1.2K", FANS: "840K", HEAT: "97" }, color: "#39FF14" },
  { name: "KASHISH AZMANI", handle: "@kazmani", beat: "FEATURES / LONGFORM", num: "02", stats: { POSTS: "612", FANS: "510K", HEAT: "91" }, color: "#FFEA00" },
  { name: "RIMJHIM", handle: "@rimjhim.gg", beat: "ESPORTS / STREAMS", num: "03", stats: { POSTS: "2.4K", FANS: "1.1M", HEAT: "99" }, color: "#1FB6FF" },
  { name: "TANK VERMA", handle: "@tankk", beat: "STREET / STUNTS", num: "04", stats: { POSTS: "880", FANS: "395K", HEAT: "88" }, color: "#FF3B1D" },
  { name: "SANA K", handle: "@sanaonmic", beat: "CULTURE / MUSIC", num: "05", stats: { POSTS: "1.0K", FANS: "623K", HEAT: "93" }, color: "#B388FF" },
  { name: "DEV 'DPS' PRATAP", handle: "@dpsclips", beat: "EDITS / HIGHLIGHTS", num: "06", stats: { POSTS: "3.1K", FANS: "770K", HEAT: "95" }, color: "#39FF14" },
];

const DT_DROPS = [
  { name: "'NIGHT SHIFT' HEAVY HOODIE", price: "₹2,499", status: "RESTOCK 6PM", sold: false },
  { name: "DOWNTOWN STREET TEE", price: "₹999", status: "LOW STOCK", sold: false },
  { name: "TICKETS — DELHI LIVE SHOW", price: "₹599", status: "SELLING FAST", sold: false },
  { name: "ENAMEL 'CAUTION' PIN PACK", price: "₹349", status: "SOLD OUT", sold: true },
];

Object.assign(window, {
  DT_CITIES, DT_NAV, DT_LEAD, DT_SECONDARY, DT_TRENDING, DT_ROSTER, DT_DROPS,
});
