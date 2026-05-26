/* ============================================================
   ZÉNITH — CETTE NUIT + ATLAS screens.
   ============================================================ */

/* Phase de lune disc, drawn with two overlapping circles for terminator */
function MoonDisc({ illumination = 0.78, waxing = true }) {
  // ill: 0=new, 1=full
  // We render a circle and overlay a curved shadow.
  const R = 50;
  const cx = 54, cy = 54;
  // terminator: ellipse with x-radius scaled by illumination
  const k = 1 - 2 * illumination; // -1 (full) to 1 (new)
  const rx = Math.abs(k) * R;
  const flip = (k < 0); // gibbous → ellipse lumineuse ; croissant → ellipse sombre
  return (
    <svg viewBox="0 0 108 108" width="100%" height="100%">
      <defs>
        <clipPath id="moonClip"><circle cx={cx} cy={cy} r={R}/></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="rgba(232, 228, 216, 0.9)"/>
      {/* shadow side */}
      <g clipPath="url(#moonClip)">
        {/* full shadow rectangle on the dark half */}
        <rect x={waxing ? 0 : cx} y="0" width={cx} height="108" fill="rgba(10,9,8,0.95)"/>
        {/* terminator ellipse */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={R} fill={flip ? "rgba(232,228,216,0.9)" : "rgba(10,9,8,0.95)"}/>
      </g>
      {/* maria as subtle dark splotches */}
      <g clipPath="url(#moonClip)" opacity="0.18">
        <circle cx="38" cy="44" r="9" fill="#0a0908"/>
        <circle cx="62" cy="34" r="6" fill="#0a0908"/>
        <circle cx="58" cy="62" r="11" fill="#0a0908"/>
        <circle cx="42" cy="70" r="7" fill="#0a0908"/>
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(232,228,216,0.35)" strokeWidth="0.8"/>
    </svg>
  );
}

/* Tiny planet/satellite glyph for row */
function PlanetGlyph({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <ellipse cx="10" cy="10" rx="9" ry="3" fill="none" stroke="rgba(232,228,216,0.35)" strokeWidth="0.6"/>
      <circle cx="10" cy="10" r="3.4" fill={color}/>
    </svg>
  );
}
function IssGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="0.8"/>
      <rect x="9" y="9" width="4" height="4" fill="currentColor"/>
      <line x1="5" y1="6" x2="5" y2="16" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="17" y1="6" x2="17" y2="16" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  );
}
function MeteorGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="3" y1="3" x2="14" y2="14" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="1" y1="8" x2="8" y2="14" stroke="currentColor" strokeWidth="0.6" opacity="0.5"/>
      <line x1="6" y1="2" x2="11" y2="9" stroke="currentColor" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="15" cy="15" r="2" fill="currentColor"/>
    </svg>
  );
}
function ConjunctionGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8" cy="11" r="3" fill="currentColor"/>
      <circle cx="14" cy="11" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="14" cy="11" r="5" stroke="currentColor" strokeWidth="0.6" opacity="0.4" fill="none"/>
    </svg>
  );
}

const EventGlyphs = { iss: <IssGlyph/>, meteors: <MeteorGlyph/>, conjunction: <ConjunctionGlyph/> };

/* ---------------- Astronomical weather (Open-Meteo, no API key) ----------- */
function useAstroWeather(location) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!location?.lat || !location?.lon) return;
    setLoading(true);
    const { lat, lon } = location;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=cloudcover,precipitation_probability,windspeed_10m,visibility,relativehumidity_2m` +
      `&forecast_days=6&timezone=auto`
    )
      .then(r => r.json())
      .then(json => { setData(parseAstroWeather(json)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [location?.lat, location?.lon]);
  return { data, loading };
}

function parseAstroWeather(json) {
  const h = json.hourly;
  const hours = h.time.map((t, i) => ({
    time:   new Date(t),          // Open-Meteo returns local-tz strings → getHours() is correct
    cloud:  h.cloudcover[i],
    precip: h.precipitation_probability[i],
    wind:   h.windspeed_10m[i],
    vis:    h.visibility[i],
    hum:    h.relativehumidity_2m[i],
  }));
  const now = new Date();
  // Closest hour to now = current conditions
  const current = hours.reduce((best, x) =>
    Math.abs(x.time - now) < Math.abs(best.time - now) ? x : best, hours[0]);
  // 5-night forecast: 21h tonight → 05h next morning for each upcoming day
  const nights = [];
  for (let d = 0; d < 5; d++) {
    const base = new Date(now); base.setDate(base.getDate() + d); base.setHours(0,0,0,0);
    const next = new Date(base); next.setDate(next.getDate() + 1);
    const baseStr = base.toISOString().slice(0,10), nextStr = next.toISOString().slice(0,10);
    const ns = hours.filter(x => {
      const s = x.time.toISOString().slice(0,10), hr = x.time.getHours();
      return (s === baseStr && hr >= 21) || (s === nextStr && hr <= 5);
    });
    if (ns.length === 0) continue;
    nights.push({
      date:      base,
      avgCloud:  ns.reduce((s,x) => s + x.cloud,  0) / ns.length,
      maxPrecip: Math.max(...ns.map(x => x.precip)),
      avgWind:   ns.reduce((s,x) => s + x.wind,   0) / ns.length,
    });
  }
  return { current, nights };
}

function skyScore(cloud, wind, precip) {
  if (precip > 40 || cloud > 80) return { label: "Couvert", color: "var(--red)",   symbol: "●" };
  if (cloud > 50  || wind > 30)  return { label: "Nuageux", color: "var(--amber)", symbol: "◑" };
  if (cloud > 25  || wind > 20)  return { label: "Partiel", color: "var(--amber)", symbol: "◐" };
  return                                { label: "Dégagé",  color: "#6ab87a",      symbol: "●" };
}
const seeingLabel    = w  => w < 10 ? "Excellent" : w < 20 ? "Bon"      : w < 30 ? "Moyen"    : "Mauvais";
const transLabel     = (v,h) => v > 20000 && h < 60 ? "Excellente" : v > 10000 && h < 75 ? "Bonne" : v > 5000 ? "Moyenne" : "Faible";
const DAY_SHORT      = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

/* ---------------- CETTE NUIT screen ---------------- */
function TonightScreen({ onSelect, location, onOpenLocation, observer, date }) {
  // Compute real sun/moon times + planet positions for the chosen location/date
  const sunTimes = useMemo(() => observer && date ? getSunTimes(observer, date) : null, [observer, date]);
  const moonInfo = useMemo(() => observer && date ? getMoonInfo(observer, date) : null, [observer, date]);
  const planets = useMemo(() => observer && date ? getPlanetPositions(observer, date) : [], [observer, date]);
  const eventsData = useMemo(() => {
    if (!observer || !date) return [];
    try { return getDynamicEvents(observer, date); } catch(_) { return []; }
  }, [observer, date]);

  const { data: wx, loading: wxLoading } = useAstroWeather(location);

  const dateStr = date ? frenchDate(date) : "";
  const dateCap = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  return (
    <div className="tonight screen-enter">
      <div className="tonight-body no-scrollbar">
        <header className="tonight-header" style={{ paddingTop: "0" }}>
          <button className="tonight-eyebrow tonight-eyebrow-btn" onClick={onOpenLocation}>
            Cette nuit · {location.name} <span style={{color:"var(--paper-fade)"}}>↗</span>
          </button>
          <h1 className="tonight-title">{dateCap.split(",")[0]}<br/><em className="serif" style={{fontStyle:"italic",color:"var(--paper-dim)"}}>une nuit observable</em></h1>
          <div className="tonight-meta-row">
            <div>
              <span className="lbl">Coucher soleil</span>
              <span className="val numeral">{formatTime(sunTimes?.sunset)}</span>
            </div>
            <div>
              <span className="lbl">Lever soleil</span>
              <span className="val numeral">{formatTime(sunTimes?.sunrise)}</span>
            </div>
            <div>
              <span className="lbl">Nuit astro.</span>
              <span className="val numeral">{formatTime(sunTimes?.astroDusk)}<br/>→ {formatTime(sunTimes?.astroDawn)}</span>
            </div>
          </div>
        </header>

        {/* Moon */}
        <section className="tonight-section">
          <div className="tonight-section-h">
            <h3>Lune</h3>
            <span className="count numeral">{moonInfo ? Math.round(moonInfo.illumination*100) : "—"}% · J{moonInfo?.age.toFixed(1)}</span>
          </div>
          <div className="moon-block">
            <div className="moon-disc">
              <MoonDisc illumination={moonInfo?.illumination ?? 0.5} waxing={moonInfo?.waxing ?? true}/>
            </div>
            <div className="moon-info">
              <div className="moon-info-name">{moonInfo?.phaseName ?? "—"}</div>
              <div className="moon-info-phase numeral" style={{whiteSpace:"nowrap"}}>{moonInfo ? Math.round(moonInfo.distance/1000).toLocaleString("fr-FR") + " 000 km" : "—"}</div>
              <div className="moon-info-stat">
                <span className="lbl">Lever</span><span className="numeral">{formatTime(moonInfo?.rise)}</span>
              </div>
              <div className="moon-info-stat">
                <span className="lbl">Coucher</span><span className="numeral">{formatTime(moonInfo?.set)}</span>
              </div>
              <div className="moon-info-stat">
                <span className="lbl">Altitude</span><span className="numeral">{moonInfo ? (moonInfo.alt > 0 ? moonInfo.alt.toFixed(0) + "°" : "Sous l'horizon") : "—"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Planets visible */}
        <section className="tonight-section">
          <div className="tonight-section-h">
            <h3>Planètes visibles</h3>
            <span className="count numeral">{planets.length} ce soir</span>
          </div>
          <div className="row-list">
            {planets.length === 0 && (
              <div style={{fontFamily:"var(--serif)",fontStyle:"italic",color:"var(--paper-dim)",fontSize:"14px",padding:"12px 0"}}>
                Aucune planète au-dessus de l'horizon à cette heure.
              </div>
            )}
            {planets.map(p => (
              <div className="row" key={p.id} onClick={() => onSelect(p)}>
                <span className="row-glyph"><PlanetGlyph color={p.color}/></span>
                <div className="row-main">
                  <span className="row-name">{p.name}</span>
                  <span className="row-sub numeral">m {p.mag.toFixed(1)} · {constellationFromRA(p.ra)}</span>
                </div>
                <div className="row-end">
                  <div className="row-end-primary numeral">{p.alt > 0 ? p.alt.toFixed(0) + "°" : "Bas"}</div>
                  <div className="row-end-secondary">{p.set ? "se couche " + formatTime(p.set) : "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="tonight-section">
          <div className="tonight-section-h">
            <h3>Évènements</h3>
            <span className="count numeral">indicatifs</span>
          </div>
          {eventsData.map((ev, i) => (
            <article className="event" key={i}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span className="row-glyph" style={{ marginTop: "4px" }}>
                  {EventGlyphs[ev.tag]}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="event-when">{ev.when}</div>
                  <div className="event-name">{ev.name}</div>
                  <div className="event-detail">{ev.detail}</div>
                </div>
              </div>
              <div className="event-peak">
                <span>Pic</span>
                <strong className="numeral">{ev.peak}</strong>
              </div>
            </article>
          ))}
          {eventsData.length === 0 && (
            <div style={{
              fontFamily:"var(--serif)", fontStyle:"italic",
              color:"var(--paper-dim)", fontSize:"14px", padding:"12px 0"
            }}>
              Aucun événement notable cette nuit — prochaine pluie d'étoiles ou conjonction à venir.
            </div>
          )}
          <div style={{
            marginTop:"8px", fontFamily:"var(--mono)", fontSize:"9px",
            color:"var(--paper-fade)", letterSpacing:"0.16em", textTransform:"uppercase"
          }}>
            Pluies d'étoiles · conjonctions · phases lunaires — calcul astronomique en temps réel
          </div>
        </section>

        {/* Conditions météo astronomiques */}
        <section className="tonight-section" style={{ borderBottom: 0 }}>
          <div className="tonight-section-h">
            <h3>Conditions</h3>
            <span className="count numeral">Bortle {location.bortle}</span>
          </div>

          {/* Bortle blurb */}
          <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", color:"var(--paper-dim)", fontSize:"13px", lineHeight:"1.5", paddingBottom:"14px" }}>
            Pollution lumineuse · classe {location.bortle}.
            {location.bortle <= 3 ? " Voie lactée détaillée visible." :
             location.bortle <= 5 ? " La plupart des constellations visibles." :
             location.bortle <= 7 ? " Seules les étoiles brillantes apparaissent." :
             " Seules les planètes et la Lune ressortent."}
          </div>

          {/* Live weather block */}
          {wxLoading && (
            <div style={{ fontFamily:"var(--mono)", fontSize:"9px", color:"var(--paper-fade)", letterSpacing:"0.18em", textTransform:"uppercase", padding:"8px 0" }}>
              Chargement météo…
            </div>
          )}
          {wx && (() => {
            const c = wx.current;
            const q = skyScore(c.cloud, c.wind, c.precip);
            return (
              <>
                {/* Quality badge */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                  <span style={{ fontSize:"22px", color: q.color, lineHeight:1 }}>{q.symbol}</span>
                  <span style={{ fontFamily:"var(--serif)", fontSize:"20px", color: q.color }}>{q.label}</span>
                  <span style={{ fontFamily:"var(--mono)", fontSize:"9px", color:"var(--paper-fade)", letterSpacing:"0.16em", textTransform:"uppercase", marginLeft:"auto" }}>maintenant</span>
                </div>

                {/* Stats grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"8px", marginBottom:"18px" }}>
                  {[
                    { lbl:"Nuages",   val: Math.round(c.cloud) + "%" },
                    { lbl:"Seeing",   val: seeingLabel(c.wind) },
                    { lbl:"Transp.",  val: transLabel(c.vis, c.hum) },
                    { lbl:"Précip.",  val: Math.round(c.precip) + "%" },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} style={{ background:"rgba(232,228,216,0.04)", borderRadius:"6px", padding:"8px 6px", textAlign:"center" }}>
                      <div style={{ fontFamily:"var(--mono)", fontSize:"8px", color:"var(--paper-fade)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"4px" }}>{lbl}</div>
                      <div style={{ fontFamily:"var(--mono)", fontSize:"11px", color:"var(--paper)" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* 5-night forecast strip */}
                <div style={{ fontFamily:"var(--mono)", fontSize:"8px", color:"var(--paper-fade)", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:"8px" }}>Prévision · 5 nuits</div>
                <div style={{ display:"flex", gap:"6px" }}>
                  {wx.nights.map((n, i) => {
                    const nq = skyScore(n.avgCloud, n.avgWind, n.maxPrecip);
                    return (
                      <div key={i} style={{ flex:1, background:"rgba(232,228,216,0.04)", borderRadius:"6px", padding:"8px 4px", textAlign:"center" }}>
                        <div style={{ fontFamily:"var(--mono)", fontSize:"8px", color:"var(--paper-fade)", marginBottom:"5px" }}>{DAY_SHORT[n.date.getDay()]}</div>
                        <div style={{ fontSize:"14px", color: nq.color, lineHeight:1, marginBottom:"4px" }}>{nq.symbol}</div>
                        <div style={{ fontFamily:"var(--mono)", fontSize:"7px", color: nq.color, letterSpacing:"0.06em" }}>{nq.label}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {!wx && !wxLoading && (
            <div style={{ fontFamily:"var(--mono)", fontSize:"9px", color:"var(--paper-fade)", letterSpacing:"0.14em", textTransform:"uppercase" }}>
              Données météo indisponibles
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------------- ATLAS screen ---------------- */
function MiniArt({ entry }) {
  const cat = (entry.cat || "").toLowerCase();
  if (cat === "planète" || cat === "planete") {
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        <ellipse cx="30" cy="30" rx="26" ry="8" fill="none" stroke="rgba(232,228,216,0.4)" strokeWidth="0.6"/>
        <circle cx="30" cy="30" r="10" fill="rgba(232,228,216,0.9)"/>
        <ellipse cx="30" cy="30" rx="20" ry="6" fill="none" stroke="rgba(232,228,216,0.6)" strokeWidth="0.6"/>
      </svg>
    );
  }
  if (cat === "galaxie") {
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        <g transform="translate(30 30) rotate(30)">
          <ellipse cx="0" cy="0" rx="26" ry="9" fill="none" stroke="rgba(232,228,216,0.4)" strokeWidth="0.5"/>
          <ellipse cx="0" cy="0" rx="20" ry="6" fill="none" stroke="rgba(232,228,216,0.55)" strokeWidth="0.5"/>
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="rgba(232,228,216,0.85)"/>
        </g>
      </svg>
    );
  }
  if (cat === "nébuleuse" || cat === "nebuleuse") {
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        {Array.from({length:5}).map((_,i)=>(
          <circle key={i} cx="30" cy="30" r={8+i*5} fill="none" stroke="rgba(232,228,216,0.25)" strokeWidth="0.5" strokeDasharray="1 2"/>
        ))}
        <circle cx="30" cy="30" r="3" fill="rgba(232,228,216,0.9)"/>
      </svg>
    );
  }
  if (cat === "satellite") {
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        <path d="M 8 40 Q 30 8 52 40" fill="none" stroke="rgba(232,228,216,0.5)" strokeWidth="0.7"/>
        <circle cx="30" cy="14" r="2" fill="rgba(232,228,216,1)"/>
        <line x1="8" y1="40" x2="52" y2="40" stroke="rgba(232,228,216,0.15)" strokeWidth="0.5"/>
      </svg>
    );
  }
  if (cat === "amas globulaire") {
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        {Array.from({length:60}).map((_,i)=>{
          let s = i*37;
          const rand = (n)=>{ s = (s*9301+49297)%233280; return s/233280; };
          const a = rand()*Math.PI*2; const r = rand()*22;
          return <circle key={i} cx={30+Math.cos(a)*r} cy={30+Math.sin(a)*r} r={0.6 + (22-r)/30} fill="rgba(232,228,216,0.7)"/>;
        })}
      </svg>
    );
  }
  if (entry.id === "sun") {
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        {[0,45,90,135,180,225,270,315].map(a => {
          const rad = a * Math.PI / 180;
          return <line key={a}
            x1={30 + Math.cos(rad)*14} y1={30 + Math.sin(rad)*14}
            x2={30 + Math.cos(rad)*22} y2={30 + Math.sin(rad)*22}
            stroke="rgba(255,215,50,0.75)" strokeWidth="1.4"/>;
        })}
        <circle cx="30" cy="30" r="11" fill="rgba(255,215,50,0.22)"/>
        <circle cx="30" cy="30" r="8"  fill="rgba(255,215,50,0.80)"/>
      </svg>
    );
  }
  // étoile
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%">
      <line x1="6" y1="30" x2="54" y2="30" stroke="rgba(232,228,216,0.45)" strokeWidth="0.5"/>
      <line x1="30" y1="6" x2="30" y2="54" stroke="rgba(232,228,216,0.45)" strokeWidth="0.5"/>
      <circle cx="30" cy="30" r="5" fill="rgba(232,228,216,0.15)"/>
      <circle cx="30" cy="30" r="2" fill="rgba(232,228,216,1)"/>
    </svg>
  );
}

function AtlasCard({ e, onSelect, badge }) {
  return (
    <div className={"atlas-card" + (badge ? " is-watched" : "")} onClick={() => onSelect(e)}>
      <div className="atlas-card-thumb"><MiniArt entry={e}/></div>
      <div className="atlas-card-main">
        <div className="atlas-card-cat">{e.cat} · {e.bayer}</div>
        <div className="atlas-card-name">{e.name}</div>
        <div className="atlas-card-meta">{e.constellation} — m {e.magnitude}</div>
      </div>
      {badge
        ? <div className="atlas-card-badge">★</div>
        : <div className="atlas-card-arrow">→</div>
      }
    </div>
  );
}

function AtlasScreen({ onSelect, favorites = new Set(), onToggleFav }) {
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const tabs = ["Tous", "Étoile", "Planète", "Galaxie", "Nébuleuse", "Amas globulaire", "Satellite"];

  const favEntries = ATLAS_ENTRIES.filter(e => favorites.has(e.id));

  const filtered = ATLAS_ENTRIES.filter(e => {
    if (filter !== "Tous" && e.cat !== filter) return false;
    if (query && !(e.name + " " + e.bayer).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="atlas screen-enter">
      <div className="atlas-body no-scrollbar">
        <header className="atlas-header">
          <div className="tonight-eyebrow">Catalogue · {ATLAS_ENTRIES.length} entrées</div>
          <h1 className="atlas-title">Atlas</h1>
          <div className="atlas-sub">parcourez le ciel, étoile par étoile</div>
          <div className="atlas-search">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="0.9"/>
              <line x1="7.8" y1="7.8" x2="11" y2="11" stroke="currentColor" strokeWidth="0.9"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un objet, une constellation…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </header>

        {favEntries.length > 0 && (
          <div className="atlas-watched">
            <div className="atlas-watched-header">
              <span className="atlas-watched-star">★</span>
              Objets suivis
              <span className="atlas-watched-count">{favEntries.length}</span>
            </div>
            <div className="atlas-list">
              {favEntries.map(e => (
                <AtlasCard key={e.id} e={e} onSelect={onSelect} badge={true}/>
              ))}
            </div>
          </div>
        )}

        <div className="atlas-tabs">
          {tabs.map(t => (
            <button key={t}
              className={"atlas-tab " + (filter === t ? "is-active" : "")}
              onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>
        <div className="atlas-list">
          {filtered.map(e => (
            <AtlasCard key={e.id} e={e} onSelect={onSelect} badge={favorites.has(e.id)}/>
          ))}
          {filtered.length === 0 && (
            <div style={{
              padding: "60px 0",
              textAlign: "center",
              fontFamily: "var(--mono)", fontSize: "11px",
              color: "var(--paper-fade)",
              letterSpacing: "0.18em", textTransform: "uppercase"
            }}>
              Aucun résultat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TonightScreen, AtlasScreen });
