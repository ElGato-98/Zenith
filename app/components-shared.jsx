/* ============================================================
   ZÉNITH — shared chrome: status bar, home indicator, bottom nav,
   compass strip, reticle, time scrubber, common SVG icons.
   ============================================================ */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* --- iOS-ish status bar (drawn, not real) --- */
function StatusBar({ time = "23:14" }) {
  return (
    <div className="device-status">
      <span>{time}</span>
      <div className="device-status-right">
        <span className="device-status-bars">
          <span></span><span></span><span></span><span></span>
        </span>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M8 9 L11 6 A4 4 0 0 0 5 6 L8 9 Z" fill="currentColor" opacity="0.95"/>
          <path d="M8 9 L13 4 A7 7 0 0 0 3 4 L8 9 Z" fill="currentColor" opacity="0.55"/>
        </svg>
        <span className="device-status-batt"></span>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return <div className="device-home"></div>;
}

/* --- Bottom nav glyphs --- */
const NavGlyphs = {
  ciel: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="0.9"/>
      <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      <circle cx="11" cy="11" r="1" fill="currentColor"/>
      <line x1="11" y1="0" x2="11" y2="3" stroke="currentColor" strokeWidth="0.9"/>
      <line x1="11" y1="19" x2="11" y2="22" stroke="currentColor" strokeWidth="0.9"/>
      <line x1="0" y1="11" x2="3" y2="11" stroke="currentColor" strokeWidth="0.9"/>
      <line x1="19" y1="11" x2="22" y2="11" stroke="currentColor" strokeWidth="0.9"/>
    </svg>
  ),
  nuit: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M16 14 A 7 7 0 1 1 8 6 A 5.5 5.5 0 0 0 16 14 Z"
            stroke="currentColor" strokeWidth="0.9" fill="none"/>
      <circle cx="18" cy="5" r="0.8" fill="currentColor"/>
      <circle cx="4" cy="4" r="0.6" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  atlas: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="11" rx="10" ry="4" stroke="currentColor" strokeWidth="0.9"/>
      <ellipse cx="11" cy="11" rx="4" ry="10" stroke="currentColor" strokeWidth="0.9"/>
      <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
    </svg>
  ),
  systeme: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
      <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="0.8" fill="none"/>
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="0.6" fill="none" strokeDasharray="2 2"/>
      <circle cx="14" cy="9" r="1" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
};

function BottomNav({ screen, onChange }) {
  const items = [
    { id: "ciel",    label: "Ciel" },
    { id: "nuit",    label: "Cette nuit" },
    { id: "atlas",   label: "Atlas" },
    { id: "systeme", label: "Système" },
  ];
  return (
    <nav className="nav">
      {items.map(it => (
        <button
          key={it.id}
          className={"nav-btn " + (screen === it.id ? "is-active" : "")}
          onClick={() => onChange(it.id)}
        >
          <span className="nav-btn-glyph">{NavGlyphs[it.id]}</span>
          <span className="nav-btn-label">{it.label}</span>
          <span className="nav-btn-dot"></span>
        </button>
      ))}
    </nav>
  );
}

/* --- Compass strip that scrolls with heading --- */
function bearingText(deg) {
  const d = ((deg % 360) + 360) % 360;
  const dirs = [
    [0,   "N"],   [22.5,"NNE"], [45,  "NE"],  [67.5, "ENE"],
    [90,  "E"],   [112.5,"ESE"], [135, "SE"],  [157.5,"SSE"],
    [180, "S"],   [202.5,"SSO"], [225, "SO"],  [247.5,"OSO"],
    [270, "O"],   [292.5,"ONO"], [315, "NO"],  [337.5,"NNO"]
  ];
  let best = dirs[0]; let bestDiff = 999;
  for (const [a, lbl] of dirs) {
    const diff = Math.min(Math.abs(a-d), 360-Math.abs(a-d));
    if (diff < bestDiff) { bestDiff = diff; best = [a, lbl]; }
  }
  return best[1];
}

function CompassStrip({ heading }) {
  // major tick every 30°, label cardinals
  const cardinal = { 0:"N", 90:"E", 180:"S", 270:"O" };
  const ticks = [];
  for (let a = -90; a <= 90; a += 5) {
    const abs = ((Math.round(heading + a)) % 360 + 360) % 360;
    const isMajor = abs % 30 === 0;
    const lbl = cardinal[abs] || (isMajor ? abs + "°" : "");
    ticks.push({ a, abs, isMajor, lbl });
  }
  return (
    <div className="compass">
      <div className="compass-degrees numeral">{Math.round(heading).toString().padStart(3, "0")}°</div>
      <div className="compass-bearing">{bearingText(heading)}</div>
      <div className="compass-strip">
        <div className="compass-strip-inner" style={{ left: "50%", transform: "translateX(-50%)" }}>
          {ticks.map((t, i) => (
            <span key={i} className="compass-strip-tick">
              <span className={"compass-strip-tick-line " + (t.isMajor ? "is-major" : "")}></span>
              <span className="compass-strip-tick-label">{t.lbl}</span>
            </span>
          ))}
        </div>
        <div className="compass-reticle"></div>
      </div>
    </div>
  );
}

/* --- HUD reticle in center of sky view --- */
function Reticle({ visible = true }) {
  if (!visible) return null;
  return (
    <div className="reticle">
      <div className="reticle-ring"></div>
      <div className="reticle-ring is-inner"></div>
      <div className="reticle-cross-h"></div>
      <div className="reticle-cross-v"></div>
      <div className="reticle-tick t"></div>
      <div className="reticle-tick b"></div>
      <div className="reticle-tick l"></div>
      <div className="reticle-tick r"></div>
    </div>
  );
}

/* --- Time scrubber pinned to the bottom of sky view --- */
function pad(n) { return n.toString().padStart(2, "0"); }
function minutesToLabel(min) {
  const m = ((min % 1440) + 1440) % 1440;
  return pad(Math.floor(m/60)) + ":" + pad(Math.floor(m%60));
}

function TimeScrubber({ minutes, onChange, nowMinutes, location, isLive, onResetToNow }) {
  const ref = useRef(null);
  const dragging = useRef(false);

  // full 24-hour window, 0 to 1440 minutes
  const min = 0;
  const max = 24*60;
  const range = max - min;

  function setFromX(clientX) {
    const r = ref.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const v = min + ratio * range;
    onChange(Math.round(v));
  }
  function onDown(e) {
    dragging.current = true;
    setFromX(e.clientX ?? e.touches?.[0]?.clientX);
    e.preventDefault();
  }
  function onMove(e) {
    if (!dragging.current) return;
    setFromX(e.clientX ?? e.touches?.[0]?.clientX);
  }
  function onUp() { dragging.current = false; }

  useEffect(() => {
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const cursorRatio = (minutes - min) / range;
  const nowRatio = nowMinutes != null ? (nowMinutes - min) / range : null;

  // 1-hour ticks across 24h
  const ticks = [];
  for (let h = 0; h <= 24; h++) {
    const ratio = (h*60 - min) / range;
    const lbl = pad(h % 24) + "h";
    ticks.push({ ratio, lbl, major: h % 3 === 0 });
  }

  // dateLabel — real today/tomorrow based on actual date
  const now = new Date();
  const today = new Date(now); today.setHours(0,0,0,0);
  const target = new Date(today); target.setMinutes(minutes);
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNames = ["jan", "fév", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
  const dayLbl = `${dayNames[target.getDay()]} ${target.getDate()} ${monthNames[target.getMonth()]}`;
  const dateLabel = dayLbl + (location ? " · " + location.name.toUpperCase() : "");

  return (
    <div className="scrub">
      <div className="scrub-meta">
        <div className="scrub-time numeral">
          {minutesToLabel(minutes)}
          {isLive && <span className="scrub-live-dot"></span>}
        </div>
        <div className="scrub-date">
          {isLive
            ? <span className="scrub-live-lbl">EN DIRECT · {dateLabel}</span>
            : <button className="scrub-now-btn" onClick={onResetToNow}>↻ MAINTENANT</button>}
        </div>
      </div>
      <div className="scrub-track" ref={ref} onPointerDown={onDown}>
        <div className="scrub-track-line"></div>
        {ticks.map((t, i) => (
          <React.Fragment key={i}>
            <span
              className={"scrub-track-tick " + (t.major ? "is-hour" : "is-half")}
              style={{ left: (t.ratio*100) + "%" }}
            ></span>
            {t.major && (
              <span className="scrub-track-tick-label" style={{ left: (t.ratio*100) + "%" }}>
                {t.lbl}
              </span>
            )}
          </React.Fragment>
        ))}
        {nowRatio !== null && (
          <div className="scrub-now" style={{ left: (nowRatio*100) + "%" }}>
            <div className="scrub-now-dot"></div>
          </div>
        )}
        <div className="scrub-track-cursor" style={{ left: (cursorRatio*100) + "%" }}></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  StatusBar, HomeIndicator, BottomNav,
  CompassStrip, Reticle, TimeScrubber,
  bearingText, minutesToLabel, pad
});
