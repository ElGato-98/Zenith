/* ============================================================
   ZÉNITH — Geolocation: chip + bottom sheet modal.
   Uses navigator.geolocation for "use my position".
   ============================================================ */

function formatCoord(lat, lon) {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "O";
  return Math.abs(lat).toFixed(2) + "°" + latDir + " · " + Math.abs(lon).toFixed(2) + "°" + lonDir;
}

/* find the closest preset location to a given (lat, lon) */
function nearestPreset(lat, lon) {
  let best = LOCATIONS[0]; let bestD = Infinity;
  for (const l of LOCATIONS) {
    const d = Math.hypot(l.lat - lat, l.lon - lon);
    if (d < bestD) { bestD = d; best = l; }
  }
  return { preset: best, distance: bestD };
}

/* Bortle scale indicator — 9 dots, fill up to n */
function BortleDots({ value }) {
  return (
    <div className="bortle">
      {Array.from({length:9}).map((_,i) => (
        <span key={i} className={"bortle-dot " + (i < value ? "is-filled" : "")}></span>
      ))}
    </div>
  );
}

/* Chip pinned at top-left of sky view — opens the sheet */
function LocationChip({ location, onOpen }) {
  return (
    <button className="loc-chip" onClick={onOpen}>
      <span className="loc-chip-icon">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="1.2" fill="currentColor"/>
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="0.8"/>
          <line x1="5" y1="0" x2="5" y2="1.5" stroke="currentColor" strokeWidth="0.8"/>
          <line x1="5" y1="8.5" x2="5" y2="10" stroke="currentColor" strokeWidth="0.8"/>
          <line x1="0" y1="5" x2="1.5" y2="5" stroke="currentColor" strokeWidth="0.8"/>
          <line x1="8.5" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.8"/>
        </svg>
      </span>
      <span className="loc-chip-text">
        <span className="loc-chip-name">{location.name}</span>
        <span className="loc-chip-coord numeral">{formatCoord(location.lat, location.lon)}</span>
      </span>
    </button>
  );
}

/* Bottom sheet for selecting / detecting location */
function LocationSheet({ open, current, onClose, onPick }) {
  const [status, setStatus] = useState("idle"); // idle | locating | granted | denied | unsupported
  const [detected, setDetected] = useState(null);
  const [error, setError] = useState(null);

  // reset state each time the sheet opens
  useEffect(() => {
    if (open) { setStatus("idle"); setDetected(null); setError(null); }
  }, [open]);

  if (!open) return null;

  function useMyPosition() {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating"); setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const near = nearestPreset(latitude, longitude);
        const cityName = near.distance < 0.5 ? near.preset.name : "Position détectée";
        const region = near.distance < 0.5 ? near.preset.region : `≈ ${near.preset.name} (${(near.distance * 111).toFixed(0)} km)`;
        setDetected({
          id: "me",
          name: cityName,
          region,
          lat: latitude, lon: longitude,
          bortle: near.preset.bortle,
          accuracy
        });
        setStatus("granted");
      },
      (err) => {
        setStatus(err.code === 1 ? "denied" : "error");
        setError(err.message || "Erreur de géolocalisation");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }

  return (
    <div className="loc-sheet-backdrop" onClick={onClose}>
      <div className="loc-sheet" onClick={e => e.stopPropagation()}>
        <div className="loc-sheet-handle"></div>
        <header className="loc-sheet-h">
          <span className="eyebrow">Position de l'observateur</span>
          <button className="loc-sheet-close" onClick={onClose} aria-label="Fermer">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
        </header>

        {/* CURRENT */}
        <div className="loc-current">
          <div className="loc-current-h eyebrow">Actuelle</div>
          <div className="loc-current-row">
            <div className="loc-current-name serif">{current.name}</div>
            <div className="loc-current-coord numeral">{formatCoord(current.lat, current.lon)}</div>
          </div>
          <div className="loc-current-sub">{current.region}</div>
          <div className="loc-current-meta">
            <span className="eyebrow">Pollution lumineuse · Bortle {current.bortle}</span>
            <BortleDots value={current.bortle}/>
          </div>
        </div>

        {/* GEOLOCATION button */}
        <button
          className={"loc-detect " + (status === "granted" ? "is-granted" : "")}
          onClick={useMyPosition}
          disabled={status === "locating"}
        >
          <span className="loc-detect-icon">
            {status === "locating"
              ? <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="3 3"><animateTransform attributeName="transform" type="rotate" from="0 7 7" to="360 7 7" dur="1.2s" repeatCount="indefinite"/></circle></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="1.5" fill="currentColor"/><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1" fill="none"/><line x1="7" y1="0" x2="7" y2="2" stroke="currentColor" strokeWidth="1"/><line x1="7" y1="12" x2="7" y2="14" stroke="currentColor" strokeWidth="1"/><line x1="0" y1="7" x2="2" y2="7" stroke="currentColor" strokeWidth="1"/><line x1="12" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1"/></svg>}
          </span>
          <span className="loc-detect-label">
            {status === "idle"      && "Utiliser ma position actuelle"}
            {status === "locating"  && "Localisation en cours…"}
            {status === "granted"   && "Position détectée — utiliser"}
            {status === "denied"    && "Accès refusé — réessayer"}
            {status === "unsupported" && "Géolocalisation indisponible"}
            {status === "error"     && "Réessayer"}
          </span>
        </button>

        {status === "granted" && detected && (
          <div className="loc-detected" onClick={() => { onPick(detected); onClose(); }}>
            <div className="loc-detected-name serif">{detected.name}</div>
            <div className="loc-detected-coord numeral">{formatCoord(detected.lat, detected.lon)}</div>
            <div className="loc-detected-sub">
              {detected.region} · précision ±{Math.round(detected.accuracy)} m
            </div>
          </div>
        )}

        {(status === "denied" || status === "unsupported") && (
          <div className="loc-error">
            {status === "denied"
              ? "L'application n'a pas accès à votre position. Vous pouvez choisir un lieu ci-dessous."
              : "Votre navigateur ne supporte pas la géolocalisation. Choisissez un lieu ci-dessous."}
          </div>
        )}

        <div className="loc-presets-h eyebrow">Lieux suggérés</div>
        <div className="loc-presets">
          {LOCATIONS.map(l => (
            <button key={l.id}
              className={"loc-preset " + (l.id === current.id ? "is-active" : "")}
              onClick={() => { onPick(l); onClose(); }}
            >
              <div className="loc-preset-main">
                <div className="loc-preset-name serif">{l.name}</div>
                <div className="loc-preset-region">{l.region}</div>
              </div>
              <div className="loc-preset-end">
                <div className="loc-preset-coord numeral">{formatCoord(l.lat, l.lon)}</div>
                <BortleDots value={l.bortle}/>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LocationChip, LocationSheet, formatCoord });
