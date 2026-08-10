/* ============================================================
   ZÉNITH — Éclipses: dedicated screen.
   Local circumstances from Astronomy Engine plus a live geometric
   model of the Moon crossing the solar disk, so one computation
   drives the timeline, the percentage and the animated preview.
   ============================================================ */

const AU_KM     = 149597870.7;
const R_SUN_KM  = 695700;
const R_MOON_KM = 1737.4;

/* Fraction of the solar disk hidden, from two overlapping circles.
   d = centre separation, R = sun radius, r = moon radius (same units). */
function diskOverlap(d, R, r) {
  if (d >= R + r) return 0;
  if (d <= Math.abs(R - r)) return r >= R ? 1 : (r * r) / (R * R);
  const d2 = d*d, R2 = R*R, r2 = r*r;
  const a1 = Math.acos((d2 + R2 - r2) / (2 * d * R));
  const a2 = Math.acos((d2 + r2 - R2) / (2 * d * r));
  return (R2 * (a1 - Math.sin(2*a1)/2) + r2 * (a2 - Math.sin(2*a2)/2)) / (Math.PI * R2);
}

/* Live Sun/Moon geometry in the observer's sky.
   dx/dy = Moon's offset from the Sun in degrees, in a tangent plane
   oriented as seen by eye: +x to the right, +y toward the zenith. */
function eclipseGeometry(observer, date) {
  try {
    const t  = Astronomy.MakeTime(date);
    const se = Astronomy.Equator(Astronomy.Body.Sun,  t, observer, true, true);
    const me = Astronomy.Equator(Astronomy.Body.Moon, t, observer, true, true);
    const sh = Astronomy.Horizon(t, observer, se.ra, se.dec, "normal");
    const mh = Astronomy.Horizon(t, observer, me.ra, me.dec, "normal");

    const rSun  = Math.atan(R_SUN_KM  / (se.dist * AU_KM)) * 180 / Math.PI;
    const rMoon = Math.atan(R_MOON_KM / (me.dist * AU_KM)) * 180 / Math.PI;

    let dAz = mh.azimuth - sh.azimuth;
    if (dAz >  180) dAz -= 360;
    if (dAz < -180) dAz += 360;

    const dx  = dAz * Math.cos(sh.altitude * Math.PI / 180);
    const dy  = mh.altitude - sh.altitude;
    const sep = Math.hypot(dx, dy);

    return { dx, dy, sep, rSun, rMoon,
             frac: diskOverlap(sep, rSun, rMoon),
             sunAz: sh.azimuth, sunAlt: sh.altitude };
  } catch (_) { return null; }
}

/* Next solar eclipse actually observable from here (Sun above the horizon
   at maximum). Astronomy Engine exposes the phase events in snake_case. */
function findLocalSolarEclipse(observer, from) {
  if (!observer || !from) return null;
  try {
    let e = Astronomy.SearchLocalSolarEclipse(from, observer);
    for (let guard = 0; guard < 10 && e; guard++) {
      if (e.peak && e.peak.altitude > 0) break;
      e = Astronomy.NextLocalSolarEclipse(e.peak.time, observer);
    }
    if (!e || !e.peak || e.peak.altitude <= 0) return null;

    const phases = [
      ["begin",    "Premier contact", e.partial_begin],
      ["totBegin", "Début totalité",  e.total_begin],
      ["peak",     "Maximum",         e.peak],
      ["totEnd",   "Fin totalité",    e.total_end],
      ["end",      "Dernier contact", e.partial_end],
    ].filter(([, , ev]) => ev && ev.time)
     .map(([id, label, ev]) => {
       const d = new Date(ev.time.date);
       const g = eclipseGeometry(observer, d);
       return { id, label, date: d, alt: ev.altitude, az: g ? g.sunAz : null };
     });

    const begin = phases.find(p => p.id === "begin");
    const peak  = phases.find(p => p.id === "peak");
    const end   = phases.find(p => p.id === "end");
    if (!begin || !peak || !end) return null;

    return {
      kind: e.kind,
      obscuration: e.obscuration ?? 0,
      phases, begin, peak, end,
      durationMin:  Math.round((end.date - begin.date) / 60000),
      setsEclipsed: end.alt < 0,
      lowHorizon:   peak.alt < 15,
    };
  } catch (_) { return null; }
}

/* A short chronological list of what is coming, solar + lunar. */
function upcomingEclipses(observer, from) {
  const out = [];
  try {
    let e = Astronomy.SearchLocalSolarEclipse(from, observer);
    for (let i = 0; i < 4 && e; i++) {
      out.push({
        type: "solar", kind: e.kind,
        date: new Date(e.peak.time.date),
        obscuration: e.obscuration ?? 0,
        alt: e.peak.altitude,
        visible: e.peak.altitude > 0,
      });
      e = Astronomy.NextLocalSolarEclipse(e.peak.time, observer);
    }
  } catch (_) {}
  try {
    let l = Astronomy.SearchLunarEclipse(from);
    for (let i = 0; i < 3 && l; i++) {
      const d = new Date(l.peak.date), t = Astronomy.MakeTime(d);
      const eq = Astronomy.Equator(Astronomy.Body.Moon, t, observer, true, true);
      const h  = Astronomy.Horizon(t, observer, eq.ra, eq.dec, "normal");
      out.push({
        type: "lunar", kind: l.kind, date: d,
        obscuration: l.obscuration ?? 0,
        alt: h.altitude, visible: h.altitude > 0,
      });
      l = Astronomy.NextLunarEclipse(l.peak);
    }
  } catch (_) {}
  return out.sort((a, b) => a.date - b.date).slice(0, 6);
}

const KIND_FR = {
  partial: "partielle", annular: "annulaire",
  total: "totale", penumbral: "par la pénombre",
};

function bearingCard(az) {
  if (az == null) return "";
  const c = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
  return c[Math.round(az / 22.5) % 16];
}

function countdownText(ms) {
  if (ms <= 0) return null;
  const m = Math.floor(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (d > 0) return `dans ${d} j ${h % 24} h`;
  if (h > 0) return `dans ${h} h ${m % 60} min`;
  return `dans ${m} min`;
}

/* ---- The disk: Sun with the Moon biting into it ---- */
function EclipseDisk({ geo, size = 190, nightMode, dayMode }) {
  if (!geo) return null;
  const cx = size / 2, cy = size / 2;
  const rPx = size * 0.26;              // Sun drawn at a fixed on-screen size
  const scale = rPx / geo.rSun;         // px per degree
  const mR = geo.rMoon * scale;
  const mx = cx + geo.dx * scale;
  const my = cy - geo.dy * scale;

  const sunFill = nightMode ? "#e07a72" : "#ffc233";
  const edge = dayMode ? "rgba(26,21,16,0.22)" : "rgba(232,228,216,0.16)";

  return (
    <svg width={size} height={size} className="ecl-disk">
      <defs>
        <filter id="ecl-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation={rPx * 0.16} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* the Moon is a hole punched out of the Sun, not a grey disk on top */}
        <mask id="ecl-mask">
          <rect x="0" y="0" width={size} height={size} fill="#fff"/>
          <circle cx={mx} cy={my} r={mR} fill="#000"/>
        </mask>
      </defs>
      {/* halo fades as the light is eaten away */}
      <circle cx={cx} cy={cy} r={rPx * 1.55} fill={sunFill}
        opacity={0.04 + 0.11 * (1 - geo.frac)}/>
      <g mask="url(#ecl-mask)">
        <circle cx={cx} cy={cy} r={rPx} fill={sunFill}
          filter="url(#ecl-glow)" opacity={0.5}/>
        <circle cx={cx} cy={cy} r={rPx} fill={sunFill}/>
      </g>
      {/* faint rim so the Moon still reads once it is off the disk */}
      <circle cx={mx} cy={my} r={mR} fill="none" stroke={edge} strokeWidth="0.8"/>
    </svg>
  );
}

/* ---- ÉCLIPSES screen ---- */
function EclipseScreen({ observer, location, onOpenLocation, nightMode, dayMode }) {
  const [now, setNow]     = useState(() => new Date());
  const [scrub, setScrub] = useState(null);   // minutes from first contact; null = follow clock

  const locId = location && location.id;
  const ecl      = useMemo(() => findLocalSolarEclipse(observer, new Date()), [observer, locId]);
  const upcoming = useMemo(() => upcomingEclipses(observer, new Date()),      [observer, locId]);

  const near = ecl ? Math.abs(ecl.peak.date - now) < 3 * 3600e3 : false;
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), near ? 1000 : 60000);
    return () => clearInterval(id);
  }, [near]);

  // Reset the preview when the location (and therefore the eclipse) changes.
  useEffect(() => { setScrub(null); }, [locId]);

  const live = ecl && now >= ecl.begin.date && now <= ecl.end.date;
  const shownDate = !ecl ? null
    : scrub != null ? new Date(ecl.begin.date.getTime() + scrub * 60000)
    : live ? now : ecl.peak.date;

  const geo = ecl ? eclipseGeometry(observer, shownDate) : null;
  const pct = geo ? geo.frac * 100 : 0;

  return (
    <div className="tonight screen-enter">
      <div className="tonight-body no-scrollbar">
        <header className="tonight-header" style={{ paddingTop: 0 }}>
          <button className="tonight-eyebrow tonight-eyebrow-btn" onClick={onOpenLocation}>
            Éclipses · {location.name} <span style={{ color: "var(--paper-fade)" }}>↗</span>
          </button>

          {ecl ? (
            <>
              <h1 className="tonight-title">
                {ecl.peak.date.toLocaleDateString("fr-BE",
                  { weekday: "long", day: "numeric", month: "long" })}
                <br/>
                <em className="serif" style={{ fontStyle: "italic", color: "var(--paper-dim)" }}>
                  éclipse solaire {KIND_FR[ecl.kind] || ecl.kind}
                </em>
              </h1>
              <div className="ecl-status numeral">
                {live ? "en cours"
                      : countdownText(ecl.begin.date - now) || "terminée"}
                {" · "}{(ecl.obscuration * 100).toFixed(0)}% au maximum
              </div>
            </>
          ) : (
            <h1 className="tonight-title">
              Aucune éclipse<br/>
              <em className="serif" style={{ fontStyle: "italic", color: "var(--paper-dim)" }}>
                visible depuis ce lieu
              </em>
            </h1>
          )}
        </header>

        {ecl && (
          <>
            <section className="tonight-section">
              <EclipseDisk geo={geo} nightMode={nightMode} dayMode={dayMode}/>

              <div className="ecl-readout">
                <div className="ecl-pct numeral">{pct.toFixed(0)}%</div>
                <div className="ecl-pct-lbl">du disque solaire masqué</div>
                <div className="ecl-when numeral">
                  {formatTime(shownDate)}
                  {geo && ` · Soleil ${geo.sunAlt.toFixed(0)}° ${bearingCard(geo.sunAz)}`}
                </div>
              </div>

              <input
                className="ecl-scrub"
                type="range" min="0" max={ecl.durationMin} step="1"
                value={Math.round((shownDate - ecl.begin.date) / 60000)}
                onChange={e => setScrub(Number(e.target.value))}
              />
              <div className="ecl-scrub-ends numeral">
                <span>{formatTime(ecl.begin.date)}</span>
                {scrub != null
                  ? <button className="ecl-reset" onClick={() => setScrub(null)}>
                      {live ? "suivre l'heure" : "revenir au maximum"}
                    </button>
                  : <span className="ecl-scrub-hint">glissez pour parcourir</span>}
                <span>{formatTime(ecl.end.date)}</span>
              </div>
            </section>

            <section className="tonight-section">
              <div className="tonight-section-h">
                <h3>Déroulé</h3>
                <span className="count numeral">{ecl.durationMin} min</span>
              </div>
              <div className="ecl-phases">
                {ecl.phases.map(p => (
                  <button key={p.id}
                    className={"ecl-phase" + (p.id === "peak" ? " is-peak" : "")}
                    onClick={() => setScrub(Math.round((p.date - ecl.begin.date) / 60000))}>
                    <span className="ecl-phase-lbl">{p.label}</span>
                    <span className="ecl-phase-time numeral">{formatTime(p.date)}</span>
                    <span className="ecl-phase-pos numeral">
                      {p.alt < 0 ? "sous l'horizon" : `${p.alt.toFixed(0)}° ${bearingCard(p.az)}`}
                    </span>
                  </button>
                ))}
              </div>

              {(ecl.lowHorizon || ecl.setsEclipsed) && (
                <p className="ecl-note">
                  {ecl.setsEclipsed
                    ? `Le Soleil se couche avant la fin de l'éclipse. Au maximum il ne sera qu'à ${ecl.peak.alt.toFixed(0)}° de hauteur : il vous faut une vue parfaitement dégagée vers l'${bearingCard(ecl.peak.az).toLowerCase()}, sans arbres ni immeubles.`
                    : `Le Soleil restera bas (${ecl.peak.alt.toFixed(0)}° au maximum) — prévoyez un horizon dégagé vers l'${bearingCard(ecl.peak.az).toLowerCase()}.`}
                </p>
              )}

              <p className="ecl-warn">
                <strong>Ne regardez jamais le Soleil sans filtre certifié ISO 12312-2.</strong>
                {ecl.kind !== "total" &&
                  " Même masqué à 99 %, il brûle la rétine en quelques secondes, sans douleur."}
                {" "}Lunettes de soleil, verres fumés, films radiographiques et filtres photo
                ne protègent pas.
              </p>
            </section>
          </>
        )}

        {upcoming.length > 0 && (
          <section className="tonight-section">
            <div className="tonight-section-h">
              <h3>Prochaines</h3>
              <span className="count numeral">{location.name}</span>
            </div>
            <div className="ecl-list">
              {upcoming.map((u, i) => (
                <div key={i} className={"ecl-row" + (u.visible ? "" : " is-hidden-ev")}>
                  <span className="ecl-row-date numeral">
                    {u.date.toLocaleDateString("fr-BE", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <span className="ecl-row-kind">
                    {u.type === "solar" ? "Solaire" : "Lunaire"} {KIND_FR[u.kind] || u.kind}
                  </span>
                  <span className="ecl-row-val numeral">
                    {!u.visible ? "non visible"
                      : u.type === "solar" ? `${(u.obscuration * 100).toFixed(0)}%`
                      : u.kind === "penumbral" ? "subtile"
                      : `${(u.obscuration * 100).toFixed(0)}%`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ height: "40px" }}/>
      </div>
    </div>
  );
}

Object.assign(window, {
  EclipseScreen, EclipseDisk,
  findLocalSolarEclipse, upcomingEclipses, eclipseGeometry, diskOverlap,
});
