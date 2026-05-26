/* ============================================================
   ZÉNITH — Solar System screen.
   Heliocentric orrery using Astronomy Engine ephemerides.
   Logarithmic radial scale so all 8 planets fit on screen.
   ============================================================ */

const LOG_K = 2.5;
const LOG_MAX = Math.log(1 + 30.07 * LOG_K);

function orbitRadius(au, maxR) {
  return maxR * Math.log(1 + au * LOG_K) / LOG_MAX;
}

function auToXY(hx, hy, cx, cy, maxR) {
  const d = Math.sqrt(hx * hx + hy * hy);
  if (d < 1e-9) return { x: cx, y: cy };
  const r = orbitRadius(d, maxR);
  const a = Math.atan2(hy, hx);
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

const SOLAR_BODIES = [
  { id: 'mercury', name: 'Mercure', body: 'Mercury', auMean: 0.387,  dotR: 2.5, color: '#a09888' },
  { id: 'venus',   name: 'Vénus',   body: 'Venus',   auMean: 0.723,  dotR: 3.5, color: '#e8d050' },
  { id: 'earth',   name: 'Terre',   body: 'Earth',   auMean: 1.000,  dotR: 3.5, color: '#5090c0' },
  { id: 'mars',    name: 'Mars',    body: 'Mars',    auMean: 1.524,  dotR: 3,   color: '#c06840' },
  { id: 'jupiter', name: 'Jupiter', body: 'Jupiter', auMean: 5.203,  dotR: 7,   color: '#c8a060' },
  { id: 'saturn',  name: 'Saturne', body: 'Saturn',  auMean: 9.537,  dotR: 5.5, color: '#d4b870' },
  { id: 'uranus',  name: 'Uranus',  body: 'Uranus',  auMean: 19.19,  dotR: 4.5, color: '#70c0c0' },
  { id: 'neptune', name: 'Neptune', body: 'Neptune', auMean: 30.07,  dotR: 4.5, color: '#4060d0' },
];

function SolarSystemScreen({ observer, date, nightMode, dayMode, onSelect }) {
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ w: 390, h: 700 });

  // ResizeObserver fires immediately on first observe — reliable at first render.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const e = entries[0];
      if (e && e.contentRect.width > 0)
        setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Center sun in the content area above the nav bar.
  const NAV_H = 96;
  const cx   = dims.w / 2;
  const cy   = (dims.h - NAV_H) / 2;
  const maxR = Math.min(dims.w / 2, (dims.h - NAV_H) / 2) - 32;

  const planets = useMemo(() => {
    return SOLAR_BODIES.map(p => {
      try {
        const v = Astronomy.HelioVector(p.body, date);
        return { ...p, ...auToXY(v.x, v.y, cx, cy, maxR) };
      } catch (_) {
        return { ...p, ...auToXY(p.auMean, 0, cx, cy, maxR) };
      }
    });
  }, [date, cx, cy, maxR]);

  const moonAngle = useMemo(() => {
    try {
      const m = Astronomy.GeoMoon(date);
      return Math.atan2(m.y, m.x);
    } catch (_) { return 0; }
  }, [date]);

  const earth  = planets.find(p => p.id === 'earth');
  const saturn = planets.find(p => p.id === 'saturn');

  const orbitStroke = nightMode ? 'rgba(224,122,114,0.14)' : dayMode ? 'rgba(26,21,16,0.11)' : 'rgba(232,228,216,0.14)';
  const labelFill   = nightMode ? 'rgba(224,122,114,0.65)' : dayMode ? 'rgba(26,21,16,0.60)'  : 'rgba(232,228,216,0.65)';
  const moonStroke  = nightMode ? 'rgba(224,122,114,0.30)' : dayMode ? 'rgba(26,21,16,0.22)'  : 'rgba(232,228,216,0.30)';

  const MOON_R = 13;

  // Compute label anchor and position radially away from the Sun.
  // Avoids labels always pointing right and colliding when planets are clustered.
  function labelProps(p) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const off = p.dotR + 6;
    return {
      x: p.x + ux * off,
      y: p.y + uy * off + 3,
      textAnchor: ux >= 0 ? 'start' : 'end',
    };
  }

  return (
    <div ref={wrapRef} className="screen" style={{ overflow: 'hidden' }}>
    <svg
      width={dims.w} height={dims.h}
      style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <filter id="sun-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="planet-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Orbit rings */}
      {SOLAR_BODIES.map(p => (
        <circle key={p.id + '-orb'} cx={cx} cy={cy}
          r={orbitRadius(p.auMean, maxR)}
          fill="none" stroke={orbitStroke} strokeWidth="0.7" strokeDasharray="3 5"/>
      ))}

      {/* Sun — small body + subtle halo only */}
      <circle cx={cx} cy={cy} r={8}  fill="#ffd060" filter="url(#sun-glow)" opacity="0.45"/>
      <circle cx={cx} cy={cy} r={8}  fill="#ffd060" opacity="0.95"/>
      <circle cx={cx} cy={cy} r={12} fill="none" stroke="#ffd060" strokeWidth="0.5" opacity="0.3"/>

      {/* Moon orbit (exaggerated for visibility) */}
      {earth && (
        <>
          <circle cx={earth.x} cy={earth.y} r={MOON_R}
            fill="none" stroke={moonStroke} strokeWidth="0.5" strokeDasharray="2 3"/>
          <circle
            cx={earth.x + MOON_R * Math.cos(moonAngle)}
            cy={earth.y - MOON_R * Math.sin(moonAngle)}
            r={1.5} fill={moonStroke}/>
        </>
      )}

      {/* Saturn ring */}
      {saturn && (
        <ellipse cx={saturn.x} cy={saturn.y}
          rx={saturn.dotR * 2.1} ry={saturn.dotR * 0.6}
          fill="none" stroke={saturn.color} strokeWidth="0.9" opacity="0.5"
          transform={`rotate(-15 ${saturn.x} ${saturn.y})`}/>
      )}

      {/* Planets */}
      {planets.map(p => {
        const lbl = labelProps(p);
        return (
          <g key={p.id} style={{ cursor: 'pointer' }}
             onClick={() => onSelect({ id: p.id, name: p.name, cat: 'planète', color: p.color })}>
            {/* tap target */}
            <circle cx={p.x} cy={p.y} r={Math.max(p.dotR + 8, 14)} fill="transparent"/>
            {/* glow */}
            <circle cx={p.x} cy={p.y} r={p.dotR} fill={p.color} filter="url(#planet-glow)" opacity="0.4"/>
            {/* body */}
            <circle cx={p.x} cy={p.y} r={p.dotR} fill={p.color}/>
            {/* label — placed radially away from Sun */}
            <text x={lbl.x} y={lbl.y}
              textAnchor={lbl.textAnchor}
              fontSize="7.5" fontFamily="var(--mono)" letterSpacing="0.09em"
              fill={labelFill} style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {p.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Date label — bottom-left, above nav */}
      <text x={16} y={dims.h - NAV_H - 10}
        fontSize="9" fontFamily="var(--mono)" letterSpacing="0.13em"
        fill={labelFill} opacity="0.65">
        {frenchDate(date).toUpperCase()}
      </text>
    </svg>
    </div>
  );
}

Object.assign(window, { SolarSystemScreen });
