/* ============================================================
   ZÉNITH — App root.
   Manages screen, night mode, selected object, time.
   ============================================================ */

function NightToggle({ on, onToggle }) {
  return (
    <button
      className={"hud-btn " + (on ? "is-active" : "")}
      onClick={onToggle}
      title={on ? "Mode nuit rouge actif" : "Mode nuit rouge"}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11 9 A 5 5 0 1 1 5 3 A 4 4 0 0 0 11 9 Z" stroke="currentColor" strokeWidth="0.9" fill="none"/>
      </svg>
    </button>
  );
}

function DayToggle({ on, onToggle }) {
  return (
    <button
      className={"hud-btn " + (on ? "is-active" : "")}
      onClick={onToggle}
      title={on ? "Mode jour actif" : "Mode jour"}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="0.9"/>
        <line x1="7" y1="1"    x2="7"    y2="2.5"  stroke="currentColor" strokeWidth="0.9"/>
        <line x1="7" y1="11.5" x2="7"    y2="13"   stroke="currentColor" strokeWidth="0.9"/>
        <line x1="1" y1="7"    x2="2.5"  y2="7"    stroke="currentColor" strokeWidth="0.9"/>
        <line x1="11.5" y1="7" x2="13"   y2="7"    stroke="currentColor" strokeWidth="0.9"/>
        <line x1="2.8" y1="2.8"   x2="3.9"  y2="3.9"  stroke="currentColor" strokeWidth="0.9"/>
        <line x1="10.1" y1="10.1" x2="11.2" y2="11.2" stroke="currentColor" strokeWidth="0.9"/>
        <line x1="11.2" y1="2.8"  x2="10.1" y2="3.9"  stroke="currentColor" strokeWidth="0.9"/>
        <line x1="3.9" y1="10.1"  x2="2.8"  y2="11.2" stroke="currentColor" strokeWidth="0.9"/>
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

/* ---- Pistes audio — déposez vos .mp3 dans app/music/ puis listez-les ici ---- */
const TRACKS = [
  // { title: "Nom du morceau", src: "./music/nom.mp3" },
];

function useAudio(tracks) {
  const audioRef = useRef(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (!tracks.length) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.src = tracks[trackIdx].src;
    a.loop = tracks.length === 1;
    a.volume = volume;
    if (playing) a.play().catch(() => {});
    a.onended = () => {
      if (tracks.length > 1) setTrackIdx(i => (i + 1) % tracks.length);
    };
    return () => { a.onended = null; };
  }, [trackIdx, tracks]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  function toggle() {
    if (!tracks.length) return;
    const a = audioRef.current;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  }
  function prev() { setTrackIdx(i => (i - 1 + tracks.length) % tracks.length); }
  function next() { setTrackIdx(i => (i + 1) % tracks.length); }

  return { playing, toggle, prev, next, volume, setVolume, trackIdx };
}

function MusicButton({ on, onToggle }) {
  return (
    <button
      className={"hud-btn " + (on ? "is-active" : "")}
      onClick={onToggle}
      title="Musique d'ambiance"
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M5 10.5 V3 L11 1.5 V8" stroke="currentColor" strokeWidth="0.9" fill="none"/>
        <circle cx="3.5" cy="10.5" r="1.8" stroke="currentColor" strokeWidth="0.9"/>
        <circle cx="9.5" cy="8" r="1.8" stroke="currentColor" strokeWidth="0.9"/>
      </svg>
    </button>
  );
}

function MusicPanel({ tracks, audio, topOffset }) {
  const track = tracks[audio.trackIdx];
  return (
    <div className="music-panel" style={{ top: topOffset }}>
      {tracks.length === 0 ? (
        <div className="music-empty">Aucune piste —<br/>déposez vos .mp3<br/>dans app/music/</div>
      ) : (
        <>
          <div>
            <div className="music-panel-sub">En cours</div>
            <div className="music-panel-title">{track.title}</div>
          </div>
          <div className="music-panel-controls">
            <button className="music-ctrl" onClick={audio.prev}>&#9664;&#9664;</button>
            <button className="music-ctrl is-play" onClick={audio.toggle}>
              {audio.playing ? "⏸" : "▶"}
            </button>
            <button className="music-ctrl" onClick={audio.next}>&#9654;&#9654;</button>
          </div>
          <div className="music-panel-vol">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 3.5 H3.5 L6 1.5 V8.5 L3.5 6.5 H1 Z" stroke="currentColor" strokeWidth="0.7"/>
              <path d="M7.5 3 Q9 5 7.5 7" stroke="currentColor" strokeWidth="0.7" fill="none"/>
            </svg>
            <input type="range" min="0" max="1" step="0.01"
              value={audio.volume}
              onChange={e => audio.setVolume(parseFloat(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
  );
}

function CameraButton({ on, onToggle }) {
  return (
    <button
      className={"hud-btn " + (on ? "is-active" : "")}
      onClick={onToggle}
      title={on ? "Désactiver la caméra AR" : "Superposer la caméra"}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="3.5" width="12" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="0.9"/>
        <circle cx="7" cy="7.8" r="2.2" stroke="currentColor" strokeWidth="0.9"/>
        <path d="M4.8 3.5 L5.4 2 H8.6 L9.2 3.5" stroke="currentColor" strokeWidth="0.9" fill="none"/>
      </svg>
    </button>
  );
}

function App() {
  const [screen, setScreen] = useState("ciel");
  const [musicOpen, setMusicOpen] = useState(false);
  const audio = useAudio(TRACKS);
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem("z-theme");
    if (saved !== null) return Number(saved);
    return localStorage.getItem("z-night") === "1" ? 1 : 0; // migrate old pref
  });
  const nightMode = themeMode === 1;
  const dayMode   = themeMode === 2;
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState(() => {
    const id = localStorage.getItem("z-loc");
    return (id && LOCATIONS.find(l => l.id === id)) || LOCATIONS.find(l => l.id === "liege") || LOCATIONS[0];
  });
  const [locSheetOpen, setLocSheetOpen] = useState(false);
  const [compassMode, setCompassMode] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("z-fav") || "[]")); }
    catch(_) { return new Set(); }
  });
  useEffect(() => {
    localStorage.setItem("z-fav", JSON.stringify([...favorites]));
  }, [favorites]);
  function toggleFavorite(id) {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  const { orient: deviceOrient, permState, requestPermission, freezeAzRef } = useDeviceOrientation(compassMode);

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

  useEffect(() => { localStorage.setItem("z-theme", String(themeMode)); }, [themeMode]);
  useEffect(() => { if (location.id !== "me") localStorage.setItem("z-loc", location.id); }, [location]);

  async function toggleCamera() {
    if (cameraMode) { setCameraMode(false); return; }
    if (!compassMode) {
      const state = await requestPermission();
      if (state === "granted" || state === "default") setCompassMode(true);
    }
    setCameraMode(true);
  }

  // Time: full 24-hour range, 0–1440 minutes.
  // `now` ticks every 30s so all live data stays current.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [minutes, setMinutes] = useState(() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); });
  // is the user currently "live" (matching now) or has scrubbed elsewhere?
  const liveNowMin = nowMinutes;
  const [followLive, setFollowLive] = useState(true);
  // when followLive is true, keep minutes synced to now
  useEffect(() => {
    if (followLive) setMinutes(liveNowMin);
  }, [followLive, liveNowMin]);

  function handleScrubChange(v) {
    setFollowLive(false);
    setMinutes(v);
  }
  function resetToNow() {
    setFollowLive(true);
    setMinutes(liveNowMin);
  }

  const showLive = followLive;

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
    <div className={"app " + (nightMode ? "night" : dayMode ? "day" : "")}>
      <StatusBar time={statusTime}/>

      {screen === "ciel" && (
        <div className="screen screen-enter">
          <SkyView
            nightMode={nightMode}
            dayMode={dayMode}
            onTapObject={selectObject}
            observer={observer}
            date={currentDate}
            compassMode={compassMode}
            deviceOrient={deviceOrient}
            cameraMode={cameraMode}
            onCalibrated={freezeAzRef}
          />
          <LocationChip location={location} onOpen={() => setLocSheetOpen(true)}/>
          <div className="hud-top">
            <CompassButton on={compassMode} active={compassMode && deviceOrient != null} onToggle={toggleCompass}/>
            <CameraButton on={cameraMode} onToggle={toggleCamera}/>
            <NightToggle on={nightMode} onToggle={() => setThemeMode(m => m === 1 ? 0 : 1)}/>
            <DayToggle   on={dayMode}   onToggle={() => setThemeMode(m => m === 2 ? 0 : 2)}/>
            <MusicButton on={musicOpen || audio.playing} onToggle={() => setMusicOpen(o => !o)}/>
            <SearchButton onClick={gotoAtlas}/>
          </div>
          {musicOpen && <MusicPanel tracks={TRACKS} audio={audio} topOffset={54 + 4*(34+8) + 8}/>}
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

      {screen === "eclipse" && (
        <EclipseScreen
          observer={observer}
          location={location}
          onOpenLocation={() => setLocSheetOpen(true)}
          nightMode={nightMode}
          dayMode={dayMode}
        />
      )}

      {screen === "atlas" && (
        <AtlasScreen onSelect={selectObject} favorites={favorites} onToggleFav={toggleFavorite}/>
      )}

      {screen === "systeme" && (
        <SolarSystemScreen
          observer={observer}
          date={currentDate}
          nightMode={nightMode}
          dayMode={dayMode}
          onSelect={selectObject}
        />
      )}

      {selected && (
        <ObjectDetail
          obj={selected}
          onClose={() => setSelected(null)}
          observer={observer}
          date={currentDate}
          favorites={favorites}
          onToggleFav={toggleFavorite}
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
