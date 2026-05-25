/* ============================================================
   ZÉNITH — App root.
   Manages screen, night mode, selected object, time.
   ============================================================ */

function NightToggle({ on, onToggle }) {
  return (
    <button
      className={"hud-btn " + (on ? "is-active" : "")}
      onClick={onToggle}
      title="Mode nuit"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11 9 A 5 5 0 1 1 5 3 A 4 4 0 0 0 11 9 Z"
          stroke="currentColor" strokeWidth="0.9" fill="none"/>
      </svg>
    </button>
  );
}

function CompassButton({ on, active, onToggle }) {
  return (
    <button
      className={"hud-btn " + (on ? "is-active" : "")}
      onClick={onToggle}
      title={on ? (active ? "Compas actif — re-toucher pour désactiver" : "En attente d'orientation…") : "Suivre l'orientation du téléphone"}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="0.9"/>
        <path d="M 7 2.5 L 5 8 L 7 11.5 L 9 8 Z" fill="currentColor"/>
        <circle cx="7" cy="7" r="0.6" fill="currentColor"/>
      </svg>
    </button>
  );
}

function SearchButton({ onClick }) {
  return (
    <button className="hud-btn" onClick={onClick} title="Rechercher">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="0.9"/>
        <line x1="7.8" y1="7.8" x2="11" y2="11" stroke="currentColor" strokeWidth="0.9"/>
      </svg>
    </button>
  );
}

function App() {
  const [screen, setScreen] = useState("ciel");
  const [nightMode, setNightMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState(LOCATIONS.find(l => l.id === "liege") || LOCATIONS[0]);
  const [locSheetOpen, setLocSheetOpen] = useState(false);
  const [compassMode, setCompassMode] = useState(false);
  const { orient: deviceOrient, permState, requestPermission } = useDeviceOrientation(compassMode);

  async function toggleCompass() {
    if (compassMode) { setCompassMode(false); return; }
    const state = await requestPermission();
    if (state === "granted" || state === "default") setCompassMode(true);
    else if (state === "unsupported") {
      alert("Votre appareil ne supporte pas l'orientation du téléphone — utilisez le glissement à la place.");
    } else {
      alert("Permission refusée. Activez l'accès aux capteurs dans les réglages de Safari pour utiliser le compas.");
    }
  }

  // Time: we anchor on the local "tonight" range — today 18:00 to tomorrow 06:00.
  // Minutes from midnight 0-1800; scrubber slides 1080 (18h00) → 1800 (30h00 = 06h00 next day).
  // `now` ticks every 30s so all live data stays current.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  // start at "now" if it's within the tonight window, else at 22:00
  const [minutes, setMinutes] = useState(() => {
    const m = now.getHours() * 60 + now.getMinutes();
    if (m >= 18*60) return m;
    if (m < 6*60)   return m + 24*60;
    return 22*60;
  });
  // is the user currently "live" (matching now) or has scrubbed elsewhere?
  const liveNowMin = nowMinutes >= 18*60 ? nowMinutes : (nowMinutes < 6*60 ? nowMinutes + 24*60 : null);
  const [followLive, setFollowLive] = useState(true);
  // when followLive is true, keep minutes synced to now
  useEffect(() => {
    if (followLive && liveNowMin != null) setMinutes(liveNowMin);
  }, [followLive, liveNowMin]);

  function handleScrubChange(v) {
    setFollowLive(false);
    setMinutes(v);
  }
  function resetToNow() {
    if (liveNowMin != null) { setFollowLive(true); setMinutes(liveNowMin); }
  }

  // "EN DIRECT" only when we're following AND we're actually inside the tonight window
  const showLive = followLive && liveNowMin != null;

  // compose real Date from now (date part) + minutes (time of "tonight")
  const currentDate = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setMinutes(minutes);
    return d;
  }, [now, minutes]);

  // build Astronomy Engine observer once per location
  const observer = useMemo(() => makeObserver(location), [location]);

  // status bar time always reflects real now (it's the iOS clock)
  const statusTime = pad(now.getHours()) + ":" + pad(now.getMinutes());

  function selectObject(o) { setSelected(o); }
  function gotoAtlas() { setScreen("atlas"); }

  return (
    <div className={"app " + (nightMode ? "night" : "")}>
      <StatusBar time={statusTime}/>

      {screen === "ciel" && (
        <div className="screen screen-enter">
          <SkyView
            nightMode={nightMode}
            onTapObject={selectObject}
            observer={observer}
            date={currentDate}
            compassMode={compassMode}
            deviceOrient={deviceOrient}
          />
          <LocationChip location={location} onOpen={() => setLocSheetOpen(true)}/>
          <div className="hud-top">
            <CompassButton on={compassMode} active={compassMode && deviceOrient != null} onToggle={toggleCompass}/>
            <NightToggle on={nightMode} onToggle={() => setNightMode(n => !n)}/>
            <SearchButton onClick={gotoAtlas}/>
          </div>
          <TimeScrubber
            minutes={minutes}
            onChange={handleScrubChange}
            nowMinutes={liveNowMin}
            isLive={showLive}
            onResetToNow={resetToNow}
            location={location}
          />
        </div>
      )}

      {screen === "nuit" && (
        <TonightScreen
          onSelect={selectObject}
          location={location}
          onOpenLocation={() => setLocSheetOpen(true)}
          observer={observer}
          date={currentDate}
        />
      )}

      {screen === "atlas" && (
        <AtlasScreen onSelect={selectObject}/>
      )}

      {selected && (
        <ObjectDetail
          obj={selected}
          onClose={() => setSelected(null)}
          observer={observer}
          date={currentDate}
        />
      )}

      <LocationSheet
        open={locSheetOpen}
        current={location}
        onClose={() => setLocSheetOpen(false)}
        onPick={setLocation}
      />

      <BottomNav screen={screen} onChange={(s) => { setSelected(null); setScreen(s); }}/>
      <HomeIndicator/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
