/* ============================================================
   ZÉNITH — SkyView: the live sky screen.
   Stars projected onto screen from (az, alt) via simple
   gnomonic-ish flat projection relative to (heading, tilt).
   Drag to pan, tap a star to open detail.
   ============================================================ */

const FOV_H = 70;   // horizontal field of view in degrees
const FOV_V = 120;  // vertical field of view in degrees

const CONST_NAMES_FR = {
  lyra:"Lyre", cygnus:"Cygne", aquila:"Aigle", ursamajor:"Grande Ourse",
  ursaminor:"Petite Ourse", cassiopeia:"Cassiopée", bootes:"Bouvier",
  hercules:"Hercule", scorpius:"Scorpion", pegasus:"Pégase",
  andromeda:"Andromède", corona:"Couronne Boréale", virgo:"Vierge",
  leo:"Lion", sagittarius:"Sagittaire", ophiuchus:"Ophiuchus",
  draco:"Dragon", cepheus:"Céphée", perseus:"Persée", serpens:"Serpent",
  triangulum:"Triangle", canesvenatici:"Chiens de Chasse",
  coma:"Chevelure de Bérénice", orion:"Orion", gemini:"Gémeaux",
  taurus:"Taureau", auriga:"Cocher", canismajor:"Grand Chien",
  canisminor:"Petit Chien", piscisaustrinus:"Poisson austral",
};

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

function project(star, heading, tilt, width, height, zoom = 1) {
  let relAz = star.az - heading;
  while (relAz > 180) relAz -= 360;
  while (relAz < -180) relAz += 360;
  const relAlt = star.alt - tilt;
  const fovH = FOV_H / zoom;
  const fovV = FOV_V / zoom;
  if (Math.abs(relAz) > fovH * 0.6) return null;
  if (relAlt < -fovV * 0.55 || relAlt > fovV * 0.55) return null;
  const x = width/2 + (relAz / (fovH/2)) * (width/2);
  const y = height/2 - (relAlt / (fovV/2)) * (height/2);
  return { x, y, relAz, relAlt };
}

/* ------ Star drawing on canvas (ambient + milky way) ------ */
function drawCanvas(canvas, ambientStarsWithAzAlt, milkyWithAzAlt, heading, tilt, paperRgb, nightMode, zoom = 1) {
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
    const p = project(s, heading, tilt, w, h, zoom);
    if (!p) continue;
    const sz = 0.5 + (6 - s.mag) * 0.22;
    ctx.fillStyle = `rgba(${paperRgb}, ${mwOpacity})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, Math.PI*2); ctx.fill();
  }

  // ambient stars
  for (const s of ambientStarsWithAzAlt) {
    if (s.alt < 0) continue;
    const p = project(s, heading, tilt, w, h, zoom);
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

function SunMark({ sun, x, y, onTap, nightMode }) {
  return (
    <g style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onTap({ ...sun, id: "sun", name: "Soleil", kind: "sun" }); }}>
      <circle cx={x} cy={y} r={24} fill="transparent"/>
      <circle cx={x} cy={y} r={20} fill={nightMode ? "rgba(255,80,60,0.05)" : "rgba(255,220,60,0.05)"}/>
      <circle cx={x} cy={y} r={13} fill={nightMode ? "rgba(255,80,60,0.12)" : "rgba(255,220,60,0.12)"}/>
      <circle cx={x} cy={y} r={8}  fill={nightMode ? "rgba(255,80,60,0.22)" : "rgba(255,220,60,0.22)"}/>
      <circle cx={x} cy={y} r={5}  fill={nightMode ? "rgba(255,100,80,0.95)" : "rgba(255,215,50,0.95)"}/>
      {[0,45,90,135,180,225,270,315].map(a => {
        const rad = a * Math.PI / 180;
        return <line key={a}
          x1={x + Math.cos(rad)*8} y1={y + Math.sin(rad)*8}
          x2={x + Math.cos(rad)*13} y2={y + Math.sin(rad)*13}
          stroke={nightMode ? "rgba(255,100,80,0.55)" : "rgba(255,215,50,0.75)"}
          strokeWidth="1.2"/>;
      })}
    </g>
  );
}

function MoonMark({ moon, x, y, onTap, nightMode }) {
  const R = 9;
  const ill = moon.illumination;
  const waxing = moon.waxing;
  const k = 1 - 2 * ill;
  const rx = Math.abs(k) * R;
  const flip = (k < 0); // gibbous → ellipse lumineuse ; croissant → ellipse sombre
  return (
    <g style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onTap({ ...moon, id: "moon", name: "Lune", kind: "moon" }); }}>
      <circle cx={x} cy={y} r={22} fill="transparent"/>
      <circle cx={x} cy={y} r={R+7} fill="rgba(232,228,216,0.05)"/>
      <circle cx={x} cy={y} r={R+3} fill="rgba(232,228,216,0.10)"/>
      <defs><clipPath id="moon-clip-sv"><circle cx={x} cy={y} r={R}/></clipPath></defs>
      <circle cx={x} cy={y} r={R} fill="rgba(232,228,216,0.90)"/>
      <g clipPath="url(#moon-clip-sv)">
        <rect x={waxing ? x - R : x} y={y - R} width={R} height={R * 2} fill="rgba(10,9,8,0.95)"/>
        <ellipse cx={x} cy={y} rx={rx} ry={R} fill={flip ? "rgba(232,228,216,0.90)" : "rgba(10,9,8,0.95)"}/>
      </g>
    </g>
  );
}

/* ------ Device orientation hook (compass + tilt from phone gyro) ------ */
function useDeviceOrientation(enabled) {
  const [orient, setOrient] = useState(null);
  const [permState, setPermState] = useState("idle"); // idle | granted | denied | unsupported
  const rawRef    = useRef(null); // latest sensor reading, written in event handler
  const smoothRef = useRef(null); // low-pass filtered value
  const rafRef    = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      rawRef.current = null; smoothRef.current = null;
      setOrient(null);
      return;
    }
    if (typeof DeviceOrientationEvent === "undefined") {
      setPermState("unsupported");
      return;
    }

    // Event handler only writes to a ref — no React state, no render
    function handler(e) {
      if (e.alpha == null || e.beta == null) return;
      const beta = e.beta;
      const tilt = Math.max(-15, Math.min(75, beta - 90));
      // alphaHeading: gyroscope Z axis — stable at all tilt angles, no gimbal lock.
      // compassHeading: webkitCompassHeading — accurate but flips ~45° on iOS.
      // Strategy: use alphaHeading as primary, re-calibrate on compass when tilt < 25°.
      const alphaHeading = (360 - e.alpha) % 360;
      const compassHeading = e.webkitCompassHeading ?? alphaHeading;
      rawRef.current = { alphaHeading, compassHeading, tilt };
    }

    // rAF loop: low-pass filter + gyro/compass fusion
    const ALPHA = 0.2;

    function tick() {
      if (rawRef.current) {
        const raw = rawRef.current;
        if (!smoothRef.current) {
          const initOffset = raw.compassHeading - raw.alphaHeading;
          smoothRef.current = { heading: raw.compassHeading, tilt: raw.tilt, calibOffset: initOffset };
        } else {
          const s = smoothRef.current;
          // calibOffset is set once at init and never updated.
          // iPhone gyro drift is < 1° over a typical session — imperceptible on a sky map.
          const calibOffset = s.calibOffset;
          // Stable heading = gyro + calibration offset
          const stableHeading = (raw.alphaHeading + calibOffset + 360) % 360;
          let dh = stableHeading - s.heading;
          if (dh >  180) dh -= 360;
          if (dh < -180) dh += 360;
          smoothRef.current = {
            heading:     (s.heading + dh * ALPHA + 360) % 360,
            tilt:        s.tilt + (raw.tilt - s.tilt) * ALPHA,
            calibOffset,
          };
        }
        setOrient({ ...smoothRef.current });
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("deviceorientation", handler, true);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("deviceorientation", handler, true);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      rawRef.current = null; smoothRef.current = null;
    };
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

/* ------ Camera stream hook ------ */
function useCameraStream(enabled) {
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) return;

    const start = (constraints) =>
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });

    // Prefer rear camera; fall back to any camera
    start({ video: { facingMode: { ideal: "environment" } } })
      .catch(() => start({ video: true }))
      .catch(err => console.warn("Caméra inaccessible :", err.message));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [enabled]);

  return videoRef;
}

/* ------ Sky View main component ------ */
function SkyView({ nightMode, onTapObject, observer, date, compassMode, deviceOrient, cameraMode = false }) {
  const [heading, setHeading] = useState(180);  // start facing south
  const [tilt, setTilt] = useState(45);          // looking somewhat up
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const pointersRef = useRef({});
  const pinchRef = useRef(null);
  const lastTapRef = useRef(0);
  const plateCanvasRef = useRef(null);
  const videoRef = useCameraStream(cameraMode);
  const [zoom, setZoom] = useState(1);
  const [plateOffset, setPlateOffset] = useState(0);
  const [plateStatus, setPlateStatus] = useState(null);

  // when compass mode is active and we have orientation data, override
  const rawHeading = (compassMode && deviceOrient) ? deviceOrient.heading : heading;
  const effHeading = cameraMode ? (rawHeading + plateOffset + 360) % 360 : rawHeading;
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
    if (canvasRef.current) drawCanvas(canvasRef.current, ambientWithAzAlt, milkyWithAzAlt, effHeading, effTilt, paperRgb, nightMode, zoom);
  }, [effHeading, effTilt, size, nightMode, ambientWithAzAlt, milkyWithAzAlt, zoom]);

  /* drag to pan + pinch to zoom */
  function onPointerDown(e) {
    pointersRef.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    const pts = Object.values(pointersRef.current);
    if (pts.length === 2) {
      dragRef.current = null;
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchRef.current = { dist0: dist, zoom0: zoom };
    } else if (pts.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setZoom(1);
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
      if (!compassMode) {
        dragRef.current = { x: e.clientX, y: e.clientY, h0: heading, t0: tilt };
      }
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!pointersRef.current[e.pointerId]) return;
    pointersRef.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    const pts = Object.values(pointersRef.current);
    if (pts.length === 2 && pinchRef.current) {
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      setZoom(Math.max(0.5, Math.min(4, pinchRef.current.zoom0 * dist / pinchRef.current.dist0)));
      return;
    }
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const newH = dragRef.current.h0 - dx * (FOV_H / zoom / size.w);
    const newT = dragRef.current.t0 - dy * (FOV_V / zoom / size.h) * 1.4;
    setHeading(((newH % 360) + 360) % 360);
    setTilt(Math.max(-15, Math.min(90, newT)));
  }
  function onPointerUp(e) {
    delete pointersRef.current[e.pointerId];
    const pts = Object.values(pointersRef.current);
    if (pts.length < 2) pinchRef.current = null;
    if (pts.length === 0) dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(_) {}
  }

  // project named stars + planets — compute az/alt LIVE from RA/Dec, observer, date
  const starsWithAzAlt = useMemo(() => {
    if (!observer || !date) return [];
    return computeStarsPositions(NAMED_STARS, observer, date);
  }, [observer, date]);

  const namedProjected = useMemo(() => {
    return starsWithAzAlt.map(s => {
      if (s.alt < -5) return null;
      const p = project(s, effHeading, effTilt, size.w, size.h, zoom);
      return p ? { ...s, ...p } : null;
    }).filter(Boolean);
  }, [starsWithAzAlt, effHeading, effTilt, size, zoom]);

  const planetsLive = useMemo(() => {
    if (!observer || !date) return [];
    return getPlanetPositions(observer, date);
  }, [observer, date]);

  const planetProjected = useMemo(() => {
    return planetsLive.map(p => {
      const pp = project(p, effHeading, effTilt, size.w, size.h, zoom);
      return pp ? { ...p, ...pp } : null;
    }).filter(Boolean);
  }, [planetsLive, effHeading, effTilt, size, zoom]);

  const moonLive = useMemo(() => {
    if (!observer || !date) return null;
    try { return getMoonInfo(observer, date); } catch(_) { return null; }
  }, [observer, date]);

  const moonProjected = useMemo(() => {
    if (!moonLive) return null;
    const p = project(moonLive, effHeading, effTilt, size.w, size.h, zoom);
    return p ? { ...moonLive, ...p, id: "moon", name: "Lune" } : null;
  }, [moonLive, effHeading, effTilt, size, zoom]);

  const sunLive = useMemo(() => {
    if (!observer || !date) return null;
    try { return getSunInfo(observer, date); } catch(_) { return null; }
  }, [observer, date]);

  const sunProjected = useMemo(() => {
    if (!sunLive) return null;
    const p = project(sunLive, effHeading, effTilt, size.w, size.h, zoom);
    return p ? { ...sunLive, ...p, id: "sun", name: "Soleil" } : null;
  }, [sunLive, effHeading, effTilt, size, zoom]);

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
    const fovV = FOV_V / zoom;
    if (Math.abs(relAlt) > fovV * 0.55) return null;
    return size.h/2 - (relAlt / (fovV/2)) * (size.h/2);
  }, [effTilt, size, zoom]);

  // zenith marker (alt = 90)
  const zenithY = useMemo(() => {
    const relAlt = 90 - effTilt;
    const fovV = FOV_V / zoom;
    if (relAlt < 0 || relAlt > fovV * 0.55) return null;
    return size.h/2 - (relAlt / (fovV/2)) * (size.h/2);
  }, [effTilt, size, zoom]);

  // closest bright object to center reticle
  const reticleTarget = useMemo(() => {
    const cx = size.w/2, cy = size.h/2;
    const candidates = [
      ...namedProjected.filter(s => s.mag < 2.5),
      ...planetProjected.map(p => ({ ...p, kind: "planet" })),
      ...(moonProjected ? [{ ...moonProjected, mag: -12 }] : []),
      ...(sunProjected  ? [{ ...sunProjected,  mag: -26, kind: "sun" }] : []),
    ];
    let best = null; let bestD = 60;
    for (const c of candidates) {
      const d = Math.hypot(c.x - cx, c.y - cy);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }, [namedProjected, planetProjected, moonProjected, sunProjected, size]);

  const constellationLabels = useMemo(() => {
    const byConst = {};
    for (const s of namedProjected) {
      if (!s.constellation) continue;
      if (!byConst[s.constellation]) byConst[s.constellation] = [];
      byConst[s.constellation].push(s);
    }
    return Object.entries(byConst)
      .filter(([, stars]) => stars.length >= 2)
      .map(([id, stars]) => {
        const cx = stars.reduce((sum, s) => sum + s.x, 0) / stars.length;
        const cy = stars.reduce((sum, s) => sum + s.y, 0) / stars.length;
        return { id, name: CONST_NAMES_FR[id] || id, x: cx, y: cy };
      })
      .filter(l => l.x > 20 && l.x < size.w - 20 && l.y > 80 && l.y < size.h - 180);
  }, [namedProjected, size]);

  function runPlateSolve() {
    if (!videoRef.current || !plateCanvasRef.current) return;
    setPlateStatus("solving");
    const video = videoRef.current;
    const W = 320, H = 240;
    const canvas = plateCanvasRef.current;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, W, H);
    let imageData;
    try { imageData = ctx.getImageData(0, 0, W, H); }
    catch(_) { setPlateStatus("weak"); setTimeout(() => setPlateStatus(null), 3000); return; }
    // Luminance map
    const { data } = imageData;
    const lum = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++)
      lum[i] = 0.299*data[i*4] + 0.587*data[i*4+1] + 0.114*data[i*4+2];
    // Local bright-spot maxima
    const spots = [];
    for (let y = 4; y < H-4; y++) {
      for (let x = 4; x < W-4; x++) {
        const v = lum[y*W+x];
        if (v < 160) continue;
        let isMax = true;
        for (let dy=-3; dy<=3 && isMax; dy++)
          for (let dx=-3; dx<=3 && isMax; dx++)
            if (lum[(y+dy)*W+(x+dx)] > v) isMax = false;
        if (!isMax) continue;
        let near = false;
        for (const s of spots) if (Math.hypot(s.x-x, s.y-y) < 14) { near = true; break; }
        if (!near) spots.push({ x, y, v });
      }
    }
    spots.sort((a, b) => b.v - a.v);
    const detected = spots.slice(0, 8);
    if (detected.length < 2) { setPlateStatus("weak"); setTimeout(() => setPlateStatus(null), 3000); return; }
    const normSpots = detected.map(s => ({ nx: (s.x/W - 0.5)*2, ny: (s.y/H - 0.5)*2 }));
    // Candidates from catalog
    const allCandidates = [
      ...starsWithAzAlt.filter(s => s.mag < 3 && s.alt > -5),
      ...planetsLive.filter(p => p.mag < 3),
      ...(moonLive  ? [moonLive]  : []),
      ...(sunLive   ? [sunLive]   : []),
    ];
    // Sweep heading offset -45…+45° in 1° steps
    let bestOffset = 0, bestScore = Infinity;
    const baseH = (compassMode && deviceOrient) ? deviceOrient.heading : heading;
    for (let dh = -45; dh <= 45; dh++) {
      const testH = (baseH + dh + 360) % 360;
      let score = 0;
      for (const spot of normSpots) {
        let minD = 0.25;
        for (const star of allCandidates) {
          const p = project(star, testH, effTilt, size.w, size.h, zoom);
          if (!p) continue;
          const d = Math.hypot((p.x/size.w - 0.5)*2 - spot.nx, (p.y/size.h - 0.5)*2 - spot.ny);
          if (d < minD) minD = d;
        }
        score += minD;
      }
      if (score < bestScore) { bestScore = score; bestOffset = dh; }
    }
    const confidence = 1 - bestScore / (normSpots.length * 0.25);
    if (confidence > 0.25) {
      setPlateOffset(prev => prev + bestOffset);
      setPlateStatus("ok");
    } else {
      setPlateStatus("weak");
    }
    setTimeout(() => setPlateStatus(null), 3000);
  }

  return (
    <div
      className={"sky" + (cameraMode ? " camera-on" : "")}
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {cameraMode && (
        <>
          <video ref={videoRef} className="sky-camera" autoPlay playsInline muted/>
          <canvas ref={plateCanvasRef} style={{ display: "none" }}/>
          <button
            className={"plate-btn" + (plateStatus === "ok" ? " is-ok" : plateStatus === "weak" ? " is-weak" : plateStatus === "solving" ? " is-solving" : "")}
            onClick={runPlateSolve}
            disabled={plateStatus === "solving"}
          >
            {plateStatus === "solving" ? "Calibration…" : plateStatus === "ok" ? "Calibré ✓" : plateStatus === "weak" ? "Signal faible" : "Calibrer"}
          </button>
        </>
      )}
      <canvas className="sky-canvas" ref={canvasRef} style={cameraMode ? { opacity: 0 } : undefined}></canvas>

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

        {/* moon */}
        <g style={{ pointerEvents: "auto" }}>
          {moonProjected && (
            <MoonMark moon={moonProjected} x={moonProjected.x} y={moonProjected.y} onTap={onTapObject} nightMode={nightMode}/>
          )}
        </g>

        {/* sun */}
        <g style={{ pointerEvents: "auto" }}>
          {sunProjected && (
            <SunMark sun={sunProjected} x={sunProjected.x} y={sunProjected.y} onTap={onTapObject} nightMode={nightMode}/>
          )}
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

      {moonProjected && moonProjected.id !== reticleTarget?.id && moonProjected.y < size.h - 180 && (
        <div className="sky-obj-label" style={{ left: moonProjected.x + 12 + "px", top: moonProjected.y + "px" }}>
          <div className="sky-obj-label-name">Lune</div>
          <div className="sky-obj-label-meta numeral">{moonProjected.phaseName} · {Math.round(moonProjected.illumination * 100)}%</div>
        </div>
      )}

      {sunProjected && sunProjected.id !== reticleTarget?.id && sunProjected.y < size.h - 180 && (
        <div className="sky-obj-label" style={{ left: sunProjected.x + 14 + "px", top: sunProjected.y + "px" }}>
          <div className="sky-obj-label-name">Soleil</div>
          <div className="sky-obj-label-meta numeral">alt {sunLive.alt.toFixed(0)}° · {sunLive.constellation}</div>
        </div>
      )}

      {constellationLabels.map(l => (
        <div key={"cst-"+l.id} className="sky-const-label" style={{ left: l.x+"px", top: l.y+"px" }}>
          {l.name}
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
            {reticleTarget.kind === "moon"
              ? `${reticleTarget.phaseName} · ${Math.round(reticleTarget.illumination * 100)}%`
              : reticleTarget.kind === "sun"
              ? `alt ${reticleTarget.alt?.toFixed(0) ?? "—"}° · ${reticleTarget.constellation || "—"}`
              : reticleTarget.kind === "planet"
              ? `m ${reticleTarget.mag?.toFixed(1) ?? "—"} · alt ${reticleTarget.alt?.toFixed(0) ?? "—"}°`
              : `m ${reticleTarget.mag?.toFixed(2) ?? "—"} · ${reticleTarget.bayer || reticleTarget.constellation || "—"}`
            }
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SkyView });
