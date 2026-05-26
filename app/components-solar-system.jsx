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

/* Convert heliocentric (hx, hy in AU) to SVG coords.
   Angle preserved, radius logarithmic, Y-axis flipped (ecliptic→SVG). */
function auToXY(hx, hy, cx, cy, maxR) {
  const d = Math.sqrt(hx * hx + hy * hy);
  if (d < 1e-9) return { x: cx, y: cy };
  const r = orbitRadius(d, maxR);
  const a = Math.atan2(hy, hx);
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

const SOLAR_BODIES = [
  { id: 'mercury', name: 'Mercure', body: 'Mercury', auMean: 0.387,  dotR: 2.5, color: '#a09888' },
  { id: 'venus',   name: 'Vénus',   body: 'Venus',   auMean: 0.723,  dotR: 4,   color: '#e8d050' },
  { id: 'earth',   name: 'Terre',   body: 'Earth',   auMean: 1.000,  dotR: 4,   color: '#5090c0' },
  { id: 'mars',    name: 'Mars',    body: 'Mars',    auMean: 1.524,  dotR: 3,   color: '#c06840' },
  { id: 'jupiter', name: 'Jupiter', body: 'Jupiter', auMean: 5.203,  dotR: 9,   color: '#c8a060' },
  { id: 'saturn',  name: 'Saturne', body: 'Saturn',  auMean: 9.537,  dotR: 7,   color: '#d4b870' },
  { id: 'uranus',  name: 'Uranus',  body: 'Uranus',  auMean: 19.19,  dotR: 5.5, color: '#70c0c0' },
  { id: 'neptune', name: 'Neptune', body: 'Neptune', auMean: 30.07,  dotR: 5.5, color: '#4060d0' },
];

function SolarSystemScreen({ observer, date, nightMode, dayMode, onSelect }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 390, h: 750 });

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      if (r.width > 0) setDims({ w: r.width, h: r.height });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const NAV_H = 100; // space reserved at bottom for nav
  const cx = dims.w / 2;
  const cy = (dims.h - NAV_H) / 2;
  const maxR = Math.min(dims.w / 2, (dims.h - NAV_H) / 2) - 28;

  // Heliocentric positions
  const planets = useMemo(() => {
    return SOLAR_BODIES.map(p => {
      try {
        const v = Astronomy.HelioVector(p.body, date);
        const pos = auToXY(v.x, v.y, cx, cy, maxR);
        return { ...p, ...pos };
      } catch (_) {
        const pos = auToXY(p.auMean, 0, cx, cy, maxR);
        return { ...p, ...pos };
      }
    });
  }, [date, cx, cy, maxR]);

  // Moon angle
  const moonAngle = useMemo(() => {
    try {
      const m = Astronomy.GeoMoon(date);
      return Math.atan2(m.y, m.x);
    } catch (_) { return 0; }
  }, [date]);

  const earth = planets.find(p => p.id === 'earth');
  const saturn = planets.find(p => p.id === 'saturn');

  // Theme-aware subtle colors
  const orbitStroke = nightMode ? 'rgba(224,122,114,0.13)' : dayMode ? 'rgba(26,21,16,0.10)' : 'rgba(232,228,216,0.13)';
  const labelFill   = nightMode ? 'rgba(224,122,114,0.60)' : dayMode ? 'rgba(26,21,16,0.55)'  : 'rgba(232,228,216,0.60)';
  const moonStroke  = nightMode ? 'rgba(224,122,114,0.25)' : dayMode ? 'rgba(26,21,16,0.20)'  : 'rgba(232,228,216,0.25)';

  const MOON_R = 14;

  return (
    <div className="screen solar-screen" ref={containerRef}>
      <svg width={dims.w} height={dims.h} style={{ display: 'block', position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="sun-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="planet-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {SOLAR_BODIES.map(p => (
          <circle key={p.id + '-orb'} cx={cx} cy={cy}
            r={orbitRadius(p.auMean, maxR)}
            fill="none" stroke={orbitStroke} strokeWidth="0.7" strokeDasharray="3 5"/>
        ))}

        {/* Sun */}
        <circle cx={cx} cy={cy} r={24} fill="#ffd060" opacity="0.12" filter="url(#sun-glow)"/>
        <circle cx={cx} cy={cy} r={10} fill="#ffd060" opacity="0.95"/>
        <circle cx={cx} cy={cy} r={10} fill="#ffd060" filter="url(#sun-glow)" opacity="0.5"/>

        {/* Moon orbit around Earth */}
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
            rx={saturn.dotR * 2.2} ry={saturn.dotR * 0.65}
            fill="none" stroke={saturn.color} strokeWidth="0.9" opacity="0.55"
            transform={`rotate(-15 ${saturn.x} ${saturn.y})`}/>
        )}

        {/* Planets */}
        {planets.map(p => (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onSelect({ id: p.id, name: p.name, cat: 'planète', color: p.color })}>
            {/* hit area */}
            <circle cx={p.x} cy={p.y} r={Math.max(p.dotR + 8, 14)} fill="transparent"/>
            {/* glow */}
            <circle cx={p.x} cy={p.y} r={p.dotR} fill={p.color} filter="url(#planet-glow)" opacity="0.45"/>
            {/* body */}
            <circle cx={p.x} cy={p.y} r={p.dotR} fill={p.color}/>
            {/* label */}
            <text x={p.x + p.dotR + 4} y={p.y + 3.5}
              fontSize="7.5" fontFamily="var(--mono)" letterSpacing="0.10em"
              fill={labelFill} style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {p.name.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Date label bottom-left */}
        <text x={16} y={dims.h - NAV_H - 12}
          fontSize="9" fontFamily="var(--mono)" letterSpacing="0.14em"
          fill={labelFill} opacity="0.7">
          {frenchDate(date).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

Object.assign(window, { SolarSystemScreen });
