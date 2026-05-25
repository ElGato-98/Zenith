/* ============================================================
   ZÉNITH — SkyView: the live sky screen.
   Stars projected onto screen from (az, alt) via simple
   gnomonic-ish flat projection relative to (heading, tilt).
   Drag to pan, tap a star to open detail.
   ============================================================ */

const FOV_H = 70;   // horizontal field of view in degrees
const FOV_V = 120;  // vertical field of view in degrees

// generate ambient background stars with random RA/Dec so they rotate properly
const AMBIENT_STARS_RD = (() => {
  let seed = 17;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed/233280; };
  const out = [];
  for (let i = 0; i < 800; i++) {
    out.push({
      ra: rand() * 24,
      // uniform on sphere: dec from arcsin(uniform)
      dec: (Math.asin(2*rand() - 1) * 180 / Math.PI),
      mag: 4 + rand() * 2.5,
      twinkle: rand()
    });
  }
  return out;
})();

// Milky way band — a great-circle inclined ~63° to equator, RA from 0 to 24
const MILKY_WAY_RD = (() => {
  let seed = 91;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed/233280; };
  const out = [];
  // Milky Way galactic plane: inclined ~63° to celestial equator, ascending node RA~18h
  for (let i = 0; i < 600; i++) {
    const lon = rand() * 360;          // galactic longitude
    const lat = (rand() - 0.5) * 14;   // ±7° spread around galactic plane
    // approximate transform: galactic plane peaks at RA 18h, Dec 0; offset by latitude
    const ra = (lon / 15) % 24;
    const dec = Math.sin((lon - 90) * Math.PI / 180) * 63 + lat;
    out.push({
      ra, dec: Math.max(-90, Math.min(90, dec)),
      mag: 4 + rand() * 2,
      twinkle: rand()
    });
  }
  return out;
})();

function project(star, heading, tilt, width, height) {
  let relAz = star.az - heading;
  while (relAz > 180) relAz -= 360;
  while (relAz < -180) relAz += 360;
  const relAlt = star.alt - tilt;
  if (Math.abs(relAz) > FOV_H * 0.6) return null;
  if (relAlt < -FOV_V * 0.55 || relAlt > FOV_V * 0.55) return null;
  const x = width/2 + (relAz / (FOV_H/2)) * (width/2);
  const y = height/2 - (relAlt / (FOV_V/2)) * (height/2);
  return { x, y, relAz, relAlt };
}

/* ------ Star drawing on canvas (ambient + milky way) ------ */
function drawCanvas(canvas, ambientStarsWithAzAlt, milkyWithAzAlt, heading, tilt, paperRgb, nightMode) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w*dpr || canvas.height !== h*dpr) {
    canvas.width = w*dpr; canvas.height = h*dpr;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // soft milky way wash
  const mwOpacity = nightMode ? 0.05 : 0.10;
  for (const s of milkyWithAzAlt) {
    if (s.alt < -5) continue;
    const p = project(s, heading, tilt, w, h);
    if (!p) continue;
    const sz = 0.5 + (6 - s.mag) * 0.22;
    ctx.fillStyle = `rgba(${paperRgb}, ${mwOpacity})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, Math.PI*2); ctx.fill();
  }

  // ambient stars
  for (const s of ambientStarsWithAzAlt) {
    if (s.alt < 0) continue;
    const p = project(s, heading, tilt, w, h);
    if (!p) continue;
    const sz = Math.max(0.3, (6.2 - s.mag) * 0.45);
    const alpha = nightMode ? 0.4 : Math.min(1, 0.18 + (5 - s.mag) * 0.15);
    ctx.fillStyle = `rgba(${paperRgb}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, sz, 0, Math.PI*2);
    ctx.fill();
  }
}

/* ------ named star: dot + optional cross spikes ------ */
function StarMark({ s, x, y, onTap, nightMode }) {
  const isBright = s.mag < 1.5;
  const isMid = s.mag < 2.5;
  const r = isBright ? 2.6 : isMid ? 1.7 : 1.1;
  const spikeLen = isBright ? 14 : isMid ? 7 : 0;

  return (
    <g
      className="star-mark"
      style={{ cursor: "pointer" }}
      onClick={(e) => { e.stopPropagation(); onTap(s); }}
    >
      {/* tap target */}
      <circle cx={x} cy={y} r={14} fill="transparent" />
      {/* halo */}
      {isBright && (
        <circle cx={x} cy={y} r={9} fill={s.color} opacity={nightMode ? 0.08 : 0.12}/>
      )}
      {/* main dot */}
      <circle cx={x} cy={y} r={r} fill={s.color}/>
      {/* cross spikes for bright stars (the pixel-art look) */}
      {spikeLen > 0 && (
        <>
          <line x1={x - spikeLen} y1={y} x2={x + spikeLen} y2={y}
                stroke={s.color} strokeWidth="0.6" opacity={nightMode ? 0.5 : 0.85}/>
          <line x1={x} y1={y - spikeLen} x2={x} y2={y + spikeLen}
                stroke={s.color} strokeWidth="0.6" opacity={nightMode ? 0.5 : 0.85}/>
        </>
      )}
    </g>
  );
}

/* ------ Planet mark — slightly different look ------ */
function PlanetMark({ p, x, y, onTap, nightMode }) {
  return (
    <g style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onTap({ ...p, kind: "planet" }); }}>
      <circle cx={x} cy={y} r={20} fill="transparent"/>
      <circle cx={x} cy={y} r={p.size + 4} fill={p.color} opacity={nightMode ? 0.06 : 0.10}/>
      <circle cx={x} cy={y} r={p.size} fill={p.color}/>
      {/* tiny tick marks around bright planets */}
      <line x1={x} y1={y - 12} x2={x} y2={y - 8} stroke={p.color} strokeWidth="0.8" opacity="0.55"/>
      <line x1={x} y1={y + 8} x2={x} y2={y + 12} stroke={p.color} strokeWidth="0.8" opacity="0.55"/>
      <line x1={x - 12} y1={y} x2={x - 8} y2={y} stroke={p.color} strokeWidth="0.8" opacity="0.55"/>
      <line x1={x + 8} y1={y} x2={x + 12} y2={y} stroke={p.color} strokeWidth="0.8" opacity="0.55"/>
    </g>
  );
}

/* ------ Device orientation hook (compass + tilt from phone gyro) ------ */
function useDeviceOrientation(enabled) {
  const [orient, setOrient] = useState(null);
  const [permState, setPermState] = useState("idle"); // idle | granted | denied | unsupported

  useEffect(() => {
    if (!enabled) return;
    if (typeof DeviceOrientationEvent === "undefined") {
      setPermState("unsupported");
      return;
    }
    function handler(e) {
      let heading;
      if (e.webkitCompassHeading !== undefined) {
        // iOS Safari: true compass heading, 0=N clockwise
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Other browsers: alpha is rotation around z; rough heading
        heading = (360 - e.alpha) % 360;
      } else {
        return;
      }
      // beta is front-back tilt. In portrait:
      //   beta = 0    → phone flat, screen up
      //   beta = 90   → phone vertical (camera facing horizon)
      //   beta = 180  → phone flat, screen down (camera at zenith)
      // So tilt = beta - 90  maps vertical→horizon (0°) and tilted back→up (toward 90°).
      const beta = e.beta == null ? 90 : e.beta;
      const tilt = Math.max(-15, Math.min(90, beta - 90));
      setOrient({ heading, tilt });
    }
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [enabled]);

  function requestPermission() {
    if (typeof DeviceOrientationEvent === "undefined") {
      setPermState("unsupported");
      return Promise.resolve("unsupported");
    }
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      return DeviceOrientationEvent.requestPermission().then(state => {
        setPermState(state);
        return state;
      }).catch(() => {
        setPermState("denied");
        return "denied";
      });
    }
    setPermState("granted");
    return Promise.resolve("granted");
  }

  return { orient, permState, requestPermission };
}

/* ------ Sky View main component ------ */
function SkyView({ nightMode, onTapObject, observer, date, compassMode, deviceOrient }) {
  const [heading, setHeading] = useState(180);  // start facing south
  const [tilt, setTilt] = useState(45);          // looking somewhat up
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  // when compass mode is active and we have orientation data, override
  const effHeading = (compassMode && deviceOrient) ? deviceOrient.heading : heading;
  const effTilt    = (compassMode && deviceOrient) ? deviceOrient.tilt    : tilt;

  const paperRgb = nightMode ? "224, 122, 114" : "232, 228, 216";

  // sky size — we measure container
  const [size, setSize] = useState({ w: 390, h: 844 });
  useEffect(() => {
    function measure() {
      const r = containerRef.current?.getBoundingClientRect();
      if (r && r.width > 0) setSize({ w: r.width, h: r.height });
    }
    // measure twice: synchronous + after first paint to catch layout settle
    measure();
    requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // compute ambient + milky way star az/alt for the current observer/date
  const ambientWithAzAlt = useMemo(() => {
    if (!observer || !date) return [];
    return computeStarsPositions(AMBIENT_STARS_RD, observer, date);
  }, [observer, date]);
  const milkyWithAzAlt = useMemo(() => {
    if (!observer || !date) return [];
    return computeStarsPositions(MILKY_WAY_RD, observer, date);
  }, [observer, date]);

  // redraw canvas whenever heading/tilt/size/nightMode/positions change
  useEffect(() => {
    if (canvasRef.current) drawCanvas(canvasRef.current, ambientWithAzAlt, milkyWithAzAlt, effHeading, effTilt, paperRgb, nightMode);
  }, [effHeading, effTilt, size, nightMode, ambientWithAzAlt, milkyWithAzAlt]);

  /* drag to pan — disabled when compass mode is active */
  function onPointerDown(e) {
    if (compassMode) return;
    dragRef.current = {
      x: e.clientX, y: e.clientY,
      h0: heading, t0: tilt
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    // drag horizontally → pan azimuth (drag left = look right)
    const newH = dragRef.current.h0 - dx * (FOV_H / size.w);
    // drag vertically → drag UP looks UP (intuitive: lift phone to look at sky).
    // Slight boost (1.4x) so reaching zenith doesn't require a giant drag.
    const newT = dragRef.current.t0 - dy * (FOV_V / size.h) * 1.4;
    setHeading(((newH % 360) + 360) % 360);
    setTilt(Math.max(-15, Math.min(90, newT)));
  }
  function onPointerUp(e) {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(_) {}
  }

  // project named stars + planets — compute az/alt LIVE from RA/Dec, observer, date
  const starsWithAzAlt = useMemo(() => {
    if (!observer || !date) return [];
    return computeStarsPositions(NAMED_STARS, observer, date);
  }, [observer, date]);

  const namedProjected = useMemo(() => {
    return starsWithAzAlt.map(s => {
      if (s.alt < -5) return null; // skip stars way below horizon
      const p = project(s, effHeading, effTilt, size.w, size.h);
      return p ? { ...s, ...p } : null;
    }).filter(Boolean);
  }, [starsWithAzAlt, effHeading, effTilt, size]);

  const planetsLive = useMemo(() => {
    if (!observer || !date) return [];
    return getPlanetPositions(observer, date);
  }, [observer, date]);

  const planetProjected = useMemo(() => {
    return planetsLive.map(p => {
      const pp = project(p, effHeading, effTilt, size.w, size.h);
      return pp ? { ...p, ...pp } : null;
    }).filter(Boolean);
  }, [planetsLive, effHeading, effTilt, size]);

  // constellation lines visible
  const constellationLines = useMemo(() => {
    const byId = Object.fromEntries(namedProjected.map(s => [s.id, s]));
    const lines = [];
    for (const [constId, segs] of Object.entries(CONSTELLATION_LINES)) {
      for (const [a, b] of segs) {
        if (byId[a] && byId[b]) {
          lines.push({ a: byId[a], b: byId[b], id: constId + "-" + a + "-" + b });
        }
      }
    }
    return lines;
  }, [namedProjected]);

  // horizon altitude=0
  const horizonY = useMemo(() => {
    const relAlt = 0 - effTilt;
    if (Math.abs(relAlt) > FOV_V * 0.55) return null;
    return size.h/2 - (relAlt / (FOV_V/2)) * (size.h/2);
  }, [effTilt, size]);

  // zenith marker (alt = 90)
  const zenithY = useMemo(() => {
    const relAlt = 90 - effTilt;
    if (relAlt < 0 || relAlt > FOV_V * 0.55) return null;
    return size.h/2 - (relAlt / (FOV_V/2)) * (size.h/2);
  }, [effTilt, size]);

  // closest bright object to center reticle
  const reticleTarget = useMemo(() => {
    const cx = size.w/2, cy = size.h/2;
    const candidates = [
      ...namedProjected.filter(s => s.mag < 2.5),
      ...planetProjected.map(p => ({ ...p, kind: "planet" }))
    ];
    let best = null; let bestD = 60; // px radius
    for (const c of candidates) {
      const d = Math.hypot(c.x - cx, c.y - cy);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }, [namedProjected, planetProjected, size]);

  return (
    <div
      className="sky"
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas className="sky-canvas" ref={canvasRef}></canvas>

      {/* horizon line */}
      {horizonY !== null && (
        <div className="horizon" style={{ top: horizonY + "px" }}>
          <span className="horizon-label-l numeral">{bearingText(effHeading - 30)}</span>
          <span className="horizon-label-r numeral">{bearingText(effHeading + 30)}</span>
        </div>
      )}

      {/* zenith marker */}
      {zenithY !== null && (
        <div className="zenith" style={{ top: zenithY + "px", left: size.w/2 + "px" }}>
          <span className="zenith-cross"></span>
          <span className="zenith-label">ZÉNITH · 90°</span>
        </div>
      )}

      <svg
        className="sky-svg"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        {/* constellation lines */}
        <g style={{ pointerEvents: "none" }}>
          {constellationLines.map(l => (
            <line key={l.id}
              x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y}
              stroke={`rgba(${paperRgb}, 0.18)`} strokeWidth="0.7"
              strokeDasharray="2 3"/>
          ))}
        </g>

        {/* named stars */}
        <g style={{ pointerEvents: "auto" }}>
          {namedProjected.map(s => (
            <StarMark key={s.id} s={s} x={s.x} y={s.y} onTap={onTapObject} nightMode={nightMode}/>
          ))}
        </g>

        {/* planets */}
        <g style={{ pointerEvents: "auto" }}>
          {planetProjected.map(p => (
            <PlanetMark key={p.id} p={p} x={p.x} y={p.y} onTap={onTapObject} nightMode={nightMode}/>
          ))}
        </g>
      </svg>

      {/* labels for the brightest stars in view (hide if it's the reticle target) */}
      {namedProjected.filter(s => s.mag < 1.4 && s.id !== reticleTarget?.id && s.y < size.h - 180).map(s => (
        <div key={"lbl-"+s.id}
          className="sky-obj-label"
          style={{ left: s.x + 10 + "px", top: s.y + "px" }}>
          <div className="sky-obj-label-name">{s.name}</div>
          <div className="sky-obj-label-meta numeral">m {s.mag.toFixed(2)} · {s.bayer}</div>
        </div>
      ))}

      {/* planet labels */}
      {planetProjected.filter(p => p.id !== reticleTarget?.id && p.y < size.h - 180).map(p => (
        <div key={"plnt-lbl-"+p.id}
          className="sky-obj-label"
          style={{ left: p.x + 12 + "px", top: p.y + "px" }}>
          <div className="sky-obj-label-name">{p.name}</div>
          <div className="sky-obj-label-meta numeral">m {p.mag.toFixed(1)} · alt {p.alt.toFixed(0)}°</div>
        </div>
      ))}

      <div className="sky-grain"></div>

      {/* compass + reticle + scope label */}
      <CompassStrip heading={effHeading}/>
      <Reticle visible={true}/>

      {reticleTarget && (
        <div className="scope-label">
          <span className="scope-label-line"></span>
          <div className="scope-label-name">{reticleTarget.name}</div>
          <div className="scope-label-meta">
            m {reticleTarget.mag.toFixed(2)} · {reticleTarget.bayer || reticleTarget.constellation}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SkyView });
