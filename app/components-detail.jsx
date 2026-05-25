/* ============================================================
   ZÉNITH — Object Detail card.
   Slides up from below sky view. Wiki-style header with stats,
   prose, visibility arc. ATLAS_ENTRIES is the source of truth.
   ============================================================ */

function findEntry(obj) {
  if (!obj) return null;
  return ATLAS_ENTRIES.find(e => e.id === obj.id)
      || ATLAS_ENTRIES.find(e => e.name === obj.name)
      || null;
}

/* hero artwork — a procedural orbit/halo motif sized to the object */
function HeroArtwork({ obj }) {
  // pick a motif depending on category
  const cat = (obj.cat || "").toLowerCase();
  if (cat === "planète" || cat === "planete") {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {/* concentric ellipses, planet body */}
        <g transform="translate(195 180)">
          <ellipse cx="0" cy="0" rx="170" ry="50" fill="none" stroke="rgba(232,228,216,0.10)" strokeWidth="0.6"/>
          <ellipse cx="0" cy="0" rx="140" ry="42" fill="none" stroke="rgba(232,228,216,0.14)" strokeWidth="0.6"/>
          <ellipse cx="0" cy="0" rx="110" ry="36" fill="none" stroke="rgba(232,228,216,0.20)" strokeWidth="0.7"/>
          <ellipse cx="0" cy="0" rx="84"  ry="30" fill="none" stroke="rgba(232,228,216,0.30)" strokeWidth="0.7"/>
          <circle cx="0" cy="0" r="44" fill={obj.color || "#e8c894"} opacity="0.92"/>
          <ellipse cx="0" cy="0" rx="80" ry="22" fill="none" stroke="rgba(232,228,216,0.55)" strokeWidth="1.1"/>
        </g>
        <SkyDots count={120} seed={42}/>
      </svg>
    );
  }
  if (cat === "galaxie") {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <SkyDots count={140} seed={11}/>
        <g transform="translate(195 180) rotate(28)">
          {Array.from({length:6}).map((_,i)=>{
            const ry = 95 - i*8;
            return <ellipse key={i} cx="0" cy="0" rx="160" ry={ry} fill="none"
              stroke="rgba(232,228,216,0.18)" strokeWidth="0.6"/>;
          })}
          <ellipse cx="0" cy="0" rx="40" ry="14" fill="rgba(232,228,216,0.85)"/>
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="rgba(232,228,216,1)"/>
        </g>
      </svg>
    );
  }
  if (cat === "nébuleuse" || cat === "nebuleuse") {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <SkyDots count={180} seed={7}/>
        <g transform="translate(195 180)">
          {Array.from({length:8}).map((_,i)=>{
            const r = 50 + i*12;
            return <circle key={i} cx="0" cy="0" r={r} fill="none"
              stroke={`rgba(232,228,216,${0.20 - i*0.02})`} strokeWidth="0.6"
              strokeDasharray="1 3"/>;
          })}
          <circle cx="0" cy="0" r="8" fill="rgba(232,228,216,0.9)"/>
        </g>
      </svg>
    );
  }
  if (cat === "satellite") {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <SkyDots count={100} seed={5}/>
        {/* arc of pass */}
        <g transform="translate(195 220)">
          <path d="M -160 0 Q 0 -180 160 0" fill="none" stroke="rgba(232,228,216,0.45)" strokeWidth="0.9"/>
          <path d="M -160 0 Q 0 -180 160 0" fill="none" stroke="rgba(232,228,216,0.18)" strokeWidth="0.9" strokeDasharray="2 4"/>
          <circle cx="40" cy="-78" r="3" fill="rgba(232,228,216,1)"/>
          <line x1="40" y1="-78" x2="40" y2="0" stroke="rgba(232,228,216,0.3)" strokeWidth="0.4" strokeDasharray="2 3"/>
        </g>
      </svg>
    );
  }
  if (cat === "amas globulaire") {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <SkyDots count={80} seed={9}/>
        <g transform="translate(195 180)">
          {Array.from({length:140}).map((_,i)=>{
            const a = (i*137.5)*Math.PI/180;
            const r = Math.sqrt(i)*5;
            const cx = Math.cos(a)*r, cy = Math.sin(a)*r;
            const sz = Math.max(0.4, 1.8 - r/80);
            return <circle key={i} cx={cx} cy={cy} r={sz}
              fill={`rgba(232,228,216,${Math.max(0.2, 1 - r/100)})`}/>;
          })}
        </g>
      </svg>
    );
  }
  if (obj.id === "sun") {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <SkyDots count={50} seed={22}/>
        <g transform="translate(195 180)">
          <circle r="135" fill="rgba(255,215,50,0.03)"/>
          <circle r="100" fill="rgba(255,215,50,0.06)"/>
          <circle r="74"  fill="rgba(255,215,50,0.10)"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a}
              x1={Math.cos(rad)*82} y1={Math.sin(rad)*82}
              x2={Math.cos(rad)*114} y2={Math.sin(rad)*114}
              stroke="rgba(255,210,40,0.50)" strokeWidth="2.5"/>;
          })}
          <circle r="66" fill="rgba(255,200,40,0.22)"/>
          <circle r="52" fill="rgba(255,210,50,0.55)"/>
          <circle r="40" fill="rgba(255,215,50,0.92)"/>
        </g>
      </svg>
    );
  }
  // étoile (default)
  return (
    <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <SkyDots count={150} seed={3}/>
      <g transform="translate(195 180)">
        {/* concentric thin rings */}
        {Array.from({length:5}).map((_,i)=>{
          const r = 50 + i*22;
          return <circle key={i} cx="0" cy="0" r={r} fill="none"
            stroke="rgba(232,228,216,0.10)" strokeWidth="0.6"/>;
        })}
        {/* big star with cross spikes */}
        <line x1="-130" y1="0" x2="130" y2="0" stroke="rgba(232,228,216,0.6)" strokeWidth="0.7"/>
        <line x1="0" y1="-130" x2="0" y2="130" stroke="rgba(232,228,216,0.6)" strokeWidth="0.7"/>
        <circle cx="0" cy="0" r="16" fill="rgba(232,228,216,0.18)"/>
        <circle cx="0" cy="0" r="6" fill="rgba(232,228,216,1)"/>
      </g>
    </svg>
  );
}

function SkyDots({ count = 100, seed = 1 }) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s/233280; };
  const dots = [];
  for (let i = 0; i < count; i++) {
    const x = rand()*390;
    const y = rand()*360;
    const r = 0.3 + rand()*0.9;
    const a = 0.15 + rand()*0.4;
    dots.push(<circle key={i} cx={x} cy={y} r={r} fill={`rgba(232,228,216,${a})`}/>);
  }
  return <g>{dots}</g>;
}

/* visibility arc — small chart showing alt vs time tonight */
function VisibilityArc({ peakAlt = 60 }) {
  const W = 346, H = 110;
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i/40;
    const alt = Math.sin(t * Math.PI) * peakAlt;
    const x = t * W;
    const y = H - (alt / 90) * H * 0.85;
    pts.push([x, y]);
  }
  const path = pts.map((p,i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      <line x1="0" y1={H-1} x2={W} y2={H-1} stroke="rgba(232,228,216,0.18)" strokeWidth="0.6"/>
      {/* hour ticks */}
      {Array.from({length:9}).map((_,i)=>(
        <line key={i} x1={i*W/8} y1={H-1} x2={i*W/8} y2={H-6}
          stroke="rgba(232,228,216,0.25)" strokeWidth="0.6"/>
      ))}
      {Array.from({length:9}).map((_,i)=>(
        <text key={"t"+i} x={i*W/8} y={H-12} fontSize="8"
          fill="rgba(232,228,216,0.4)" textAnchor="middle"
          fontFamily="JetBrains Mono">
          {String(20 + i*2 - (i*2 > 4 ? 24 : 0)).padStart(2,"0")}h
        </text>
      ))}
      <path d={path} fill="none" stroke="rgba(232,228,216,0.85)" strokeWidth="1"/>
      {/* peak marker */}
      <circle cx={W/2} cy={H - (peakAlt/90)*H*0.85} r="2" fill="rgba(232,228,216,1)"/>
      <text x={W/2 + 8} y={H - (peakAlt/90)*H*0.85 + 4} fontSize="9"
        fill="rgba(232,228,216,0.9)" fontFamily="JetBrains Mono">
        {peakAlt}° culmination
      </text>
    </svg>
  );
}

function ObjectDetail({ obj, onClose, observer, date, favorites = new Set(), onToggleFav }) {
  if (!obj) return null;
  const entry = findEntry(obj) || obj;

  // Try to find equatorial coords from various sources
  let ra = obj.ra, dec = obj.dec;
  if ((ra == null || dec == null) && observer && date) {
    const star = NAMED_STARS.find(s => s.id === obj.id || s.id === entry.id);
    if (star) { ra = star.ra; dec = star.dec; }
    else {
      // try a planet
      const planetMap = { mercury: "Mercury", venus: "Venus", mars: "Mars", jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune" };
      const body = planetMap[obj.id] || planetMap[entry.id];
      if (body) {
        try {
          const equ = Astronomy.Equator(body, date, observer, true, true);
          ra = equ.ra; dec = equ.dec;
        } catch(_) {}
      }
    }
  }

  // Compute real visibility if we have coords + observer
  const visibility = useMemo(() => {
    if (ra == null || dec == null || !observer || !date) return null;
    try { return getStarVisibility(ra, dec, observer, date); } catch(e) { return null; }
  }, [ra, dec, observer, date]);

  // Current position
  const liveAzAlt = useMemo(() => {
    if (ra == null || dec == null || !observer || !date) return null;
    try { return equatorialToHorizontal(ra, dec, observer, date); } catch(e) { return null; }
  }, [ra, dec, observer, date]);

  // Build stats: use live data where possible
  const liveStats = [];
  if (visibility) {
    liveStats.push({ lbl: "Magnitude", val: entry.magnitude || (obj.mag != null ? obj.mag.toFixed(2) : "—") });
    liveStats.push({ lbl: "Distance", val: entry.distance || (obj.distance != null ? obj.distance.toFixed(2) + " UA" : "—") });
    liveStats.push({ lbl: "Type", val: entry.type || "—" });
    if (entry.spectral && entry.spectral !== "—") liveStats.push({ lbl: "Spectral", val: entry.spectral });
    if (entry.mass    && entry.mass    !== "—") liveStats.push({ lbl: "Masse",    val: entry.mass    });
    if (entry.radius  && entry.radius  !== "—") liveStats.push({ lbl: "Rayon",    val: entry.radius  });
    liveStats.push({ lbl: "Constellation", val: entry.constellation || (ra != null ? constellationFromRA(ra) : "—") });
    liveStats.push({ lbl: "Asc. droite", val: raToString(ra) });
    liveStats.push({ lbl: "Déclinaison", val: decToString(dec) });
  } else {
    liveStats.push({ lbl: "Magnitude", val: entry.magnitude || "—", unit: "v" });
    liveStats.push({ lbl: "Distance", val: entry.distance || "—" });
    liveStats.push({ lbl: "Type", val: entry.type || "—" });
    if (entry.spectral && entry.spectral !== "—") liveStats.push({ lbl: "Spectral", val: entry.spectral });
    if (entry.mass    && entry.mass    !== "—") liveStats.push({ lbl: "Masse",    val: entry.mass    });
    if (entry.radius  && entry.radius  !== "—") liveStats.push({ lbl: "Rayon",    val: entry.radius  });
    liveStats.push({ lbl: "Constellation", val: entry.constellation || "—" });
    liveStats.push({ lbl: "Asc. droite", val: entry.rightAscension || "—" });
    liveStats.push({ lbl: "Déclinaison", val: entry.declination || "—" });
  }

  return (
    <div className="detail">
      <div className="detail-top">
        <button className="detail-back" onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M7 1 L3 5 L7 9" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
          Retour
        </button>
        <button
          className={"detail-share" + (favorites.has(entry.id) ? " is-active" : "")}
          onClick={() => onToggleFav && onToggleFav(entry.id)}
        >
          {favorites.has(entry.id) ? "Suivi ✓" : "Suivre"}
        </button>
        <div className="detail-orbits">
          <HeroArtwork obj={entry}/>
        </div>
        <div className="detail-id">
          <div className="detail-cat">
            <span style={{ marginRight: "8px" }}>●</span>
            {entry.cat || "Objet"} · {entry.bayer || ""}
          </div>
          <div className="detail-name">{entry.name}</div>
          {entry.constellation && (
            <div className="detail-bayer">dans {entry.constellation}</div>
          )}
        </div>
      </div>

      <div className="detail-body no-scrollbar">
        <div className="detail-stats">
          {liveStats.map((s, i) => (
            <div className="detail-stat" key={i}>
              <div className="detail-stat-label">{s.lbl}</div>
              <div className="detail-stat-value">
                {s.val}{s.unit && <span className="unit">{s.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {visibility && (
          <>
            <div className="detail-section-h">Cette nuit, ici · calcul en direct</div>
            <div className="detail-visibility">
              <div className="detail-vis-row">
                <span className="lbl">Lever</span>
                <span>{visibility.rise ? formatTime(visibility.rise) : (liveAzAlt && liveAzAlt.alt > 0 ? "Déjà levé" : "Sous l'horizon")}</span>
              </div>
              <div className="detail-vis-row">
                <span className="lbl">Culmination</span>
                <span>{visibility.culm ? formatTime(visibility.culm) : "—"} · alt. {visibility.peakAlt.toFixed(0)}°</span>
              </div>
              <div className="detail-vis-row">
                <span className="lbl">Coucher</span>
                <span>{visibility.set ? formatTime(visibility.set) : "Reste levé"}</span>
              </div>
              {liveAzAlt && (
                <div className="detail-vis-row">
                  <span className="lbl">Position actuelle</span>
                  <span>
                    {liveAzAlt.alt > 0
                      ? `az ${liveAzAlt.az.toFixed(0)}° · alt ${liveAzAlt.alt.toFixed(0)}°`
                      : "Sous l'horizon"}
                  </span>
                </div>
              )}
              <div className="detail-arc">
                <VisibilityArc peakAlt={Math.max(5, Math.round(visibility.peakAlt))}/>
              </div>
            </div>
          </>
        )}

        <div className="detail-section-h">Notice</div>
        <div className="detail-prose">
          {(entry.prose || ["Aucune notice rédigée pour cet objet."]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }}></p>
          ))}
        </div>

        <div className="detail-source">
          {visibility
            ? "Position calculée en temps réel · Astronomy Engine + Hipparcos"
            : "Données statiques · catalogue Hipparcos + Wikipédia FR"}
        </div>
      </div>
    </div>
  );
}

function raToString(ra) {
  if (ra == null) return "—";
  let r = ra % 24; if (r < 0) r += 24;
  const h = Math.floor(r);
  const m = Math.floor((r - h) * 60);
  const s = ((r - h) * 60 - m) * 60;
  return `${h}h ${m.toString().padStart(2,"0")}m ${s.toFixed(0).padStart(2,"0")}s`;
}
function decToString(dec) {
  if (dec == null) return "—";
  const sign = dec >= 0 ? "+" : "−";
  const a = Math.abs(dec);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  const s = ((a - d) * 60 - m) * 60;
  return `${sign}${d}° ${m.toString().padStart(2,"0")}′ ${s.toFixed(0).padStart(2,"0")}″`;
}

Object.assign(window, { ObjectDetail });
