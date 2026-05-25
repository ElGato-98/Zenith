/* ============================================================
   ZÉNITH — Astronomy Engine integration.
   Real ephemerides for stars, planets, sun, moon.
   Library: https://github.com/cosinekitty/astronomy
   ============================================================ */

// Bodies we care about
const ZENITH_PLANETS = [
  { id: "mercury", name: "Mercure", body: "Mercury", color: "#cfc8b8" },
  { id: "venus",   name: "Vénus",   body: "Venus",   color: "#f0e6c8" },
  { id: "mars",    name: "Mars",    body: "Mars",    color: "#e85c3e" },
  { id: "jupiter", name: "Jupiter", body: "Jupiter", color: "#e8c894" },
  { id: "saturn",  name: "Saturne", body: "Saturn",  color: "#d8b878" },
  { id: "uranus",  name: "Uranus",  body: "Uranus",  color: "#a8d6e8" },
  { id: "neptune", name: "Neptune", body: "Neptune", color: "#6486a8" },
];

function makeObserver(loc) {
  return new Astronomy.Observer(loc.lat, loc.lon, 0);
}

/* RA (hours), Dec (deg) → {az, alt} for the given observer + date */
function equatorialToHorizontal(ra, dec, observer, date) {
  // Astronomy.Horizon(date, observer, ra (hours), dec (deg), refraction)
  const h = Astronomy.Horizon(date, observer, ra, dec, "normal");
  return { az: h.azimuth, alt: h.altitude };
}

/* Compute az/alt for an array of stars (with ra, dec fields) */
function computeStarsPositions(stars, observer, date) {
  return stars.map(s => {
    const h = Astronomy.Horizon(date, observer, s.ra, s.dec, "normal");
    return { ...s, az: h.azimuth, alt: h.altitude };
  });
}

/* Get planets visible — only return those above horizon (alt > -2°) */
function getPlanetPositions(observer, date) {
  return ZENITH_PLANETS.map(p => {
    try {
      const equ = Astronomy.Equator(p.body, date, observer, true, true);
      const hor = Astronomy.Horizon(date, observer, equ.ra, equ.dec, "normal");
      const illum = Astronomy.Illumination(p.body, date);
      // Compute rise/set within ±24h for context
      let rise = null, set = null;
      try {
        const rEvt = Astronomy.SearchRiseSet(p.body, observer, +1, date, 1);
        if (rEvt) rise = rEvt.date;
        const sEvt = Astronomy.SearchRiseSet(p.body, observer, -1, date, 1);
        if (sEvt) set = sEvt.date;
      } catch(_) {}
      return {
        id: p.id, name: p.name, color: p.color,
        ra: equ.ra, dec: equ.dec,
        az: hor.azimuth, alt: hor.altitude,
        mag: illum.mag,
        distance: equ.dist, // AU
        rise, set,
        size: p.body === "Venus" || p.body === "Jupiter" ? 4.2 :
              p.body === "Mars" ? 3.0 :
              p.body === "Saturn" ? 3.2 :
              p.body === "Mercury" ? 2.8 : 2.5
      };
    } catch (e) {
      return null;
    }
  }).filter(p => p && p.alt > -2 && p.mag < 6); // visible only
}

/* Moon info: phase, illumination, rise, set */
function getMoonInfo(observer, date) {
  const phaseAngle = Astronomy.MoonPhase(date); // 0-360, 0=new, 180=full
  const illum = Astronomy.Illumination("Moon", date);
  // Astronomy.MoonPhase: 0=new, 90=first quarter, 180=full, 270=last quarter
  const phaseName = moonPhaseName(phaseAngle);
  const waxing = phaseAngle < 180;
  const equ = Astronomy.Equator("Moon", date, observer, true, true);
  const hor = Astronomy.Horizon(date, observer, equ.ra, equ.dec, "normal");

  let rise = null, set = null;
  try {
    const rEvt = Astronomy.SearchRiseSet("Moon", observer, +1, date, 1);
    if (rEvt) rise = rEvt.date;
    const sEvt = Astronomy.SearchRiseSet("Moon", observer, -1, date, 1);
    if (sEvt) set = sEvt.date;
  } catch(_) {}

  // age of the moon in days (synodic)
  const ageDays = (phaseAngle / 360) * 29.530588;
  // distance in km (illum.geo_dist is in AU)
  const distanceKm = illum.geo_dist * 149597870.7;

  return {
    phaseAngle,
    phaseName,
    waxing,
    illumination: illum.phase_fraction, // 0-1
    age: ageDays,
    distance: distanceKm,
    az: hor.azimuth, alt: hor.altitude,
    ra: equ.ra, dec: equ.dec,
    rise, set
  };
}

function moonPhaseName(angle) {
  if (angle < 11.25 || angle >= 348.75) return "Nouvelle lune";
  if (angle < 78.75)  return "Premier croissant";
  if (angle < 101.25) return "Premier quartier";
  if (angle < 168.75) return "Gibbeuse croissante";
  if (angle < 191.25) return "Pleine lune";
  if (angle < 258.75) return "Gibbeuse décroissante";
  if (angle < 281.25) return "Dernier quartier";
  return "Dernier croissant";
}

/* Sun: rise/set + astronomical twilight (-18°) */
function getSunTimes(observer, date) {
  // Use start of local day (00:00) for searching
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const search = (body, dir, alt) => {
    try {
      if (alt == null) {
        const e = Astronomy.SearchRiseSet(body, observer, dir, dayStart, 1);
        return e ? e.date : null;
      } else {
        const e = Astronomy.SearchAltitude(body, observer, dir, dayStart, 1, alt);
        return e ? e.date : null;
      }
    } catch(_) { return null; }
  };
  return {
    sunrise:     search("Sun", +1, null),
    sunset:      search("Sun", -1, null),
    astroDusk:   search("Sun", -1, -18), // sun reaches -18° going down → astronomical night begins
    astroDawn:   search("Sun", +1, -18), // sun reaches -18° going up → astronomical night ends
    civilDusk:   search("Sun", -1, -6),
    civilDawn:   search("Sun", +1, -6),
  };
}

/* Format Date → "HH:MM" in local time */
function formatTime(d) {
  if (!d) return "—";
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/* Format Date → "DD/MM" or relative */
function formatDateShort(d) {
  if (!d) return "—";
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth()+1).toString().padStart(2, "0");
  return `${dd}/${mm}`;
}

/* What weekday name in French (long) */
const DAY_NAMES_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTH_NAMES_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function frenchDate(d) {
  return `${DAY_NAMES_FR[d.getDay()]} ${d.getDate()} ${MONTH_NAMES_FR[d.getMonth()]} ${d.getFullYear()}`;
}

/* Which zodiac/constellation a body sits in — simplified by RA */
const ZODIAC = [
  { name: "Poissons",   raStart: 22.85, raEnd: 25.92 }, // wraps
  { name: "Bélier",     raStart:  1.92, raEnd:  3.42 },
  { name: "Taureau",    raStart:  3.42, raEnd:  6.20 },
  { name: "Gémeaux",    raStart:  6.20, raEnd:  8.15 },
  { name: "Cancer",     raStart:  8.15, raEnd:  9.30 },
  { name: "Lion",       raStart:  9.30, raEnd: 11.40 },
  { name: "Vierge",     raStart: 11.40, raEnd: 14.30 },
  { name: "Balance",    raStart: 14.30, raEnd: 15.50 },
  { name: "Scorpion",   raStart: 15.50, raEnd: 16.50 },
  { name: "Ophiuchus",  raStart: 16.50, raEnd: 17.95 },
  { name: "Sagittaire", raStart: 17.95, raEnd: 20.10 },
  { name: "Capricorne", raStart: 20.10, raEnd: 21.85 },
  { name: "Verseau",    raStart: 21.85, raEnd: 23.85 },
];
function constellationFromRA(ra) {
  const r = ra % 24;
  for (const z of ZODIAC) {
    if (z.raStart > z.raEnd) {
      // wraps midnight
      if (r >= z.raStart || r < z.raEnd) return z.name;
    } else if (r >= z.raStart && r < z.raEnd) {
      return z.name;
    }
  }
  return "—";
}

/* Compute rise/culmination/set + peak altitude for ANY fixed point (RA/Dec)
   by sampling altitude across ±12h around the given date. Resolution: 5 min. */
function getStarVisibility(ra, dec, observer, baseDate) {
  const step = 5; // minutes
  let prev = null;
  let rise = null, set = null, culm = null, peakAlt = -90;
  for (let dm = -12*60; dm <= 12*60; dm += step) {
    const d = new Date(baseDate.getTime() + dm * 60000);
    const h = Astronomy.Horizon(d, observer, ra, dec, "normal");
    if (prev) {
      if (prev.alt < 0 && h.altitude >= 0 && !rise) rise = d;
      if (prev.alt >= 0 && h.altitude < 0 && rise && !set) set = d;
    }
    if (h.altitude > peakAlt) { peakAlt = h.altitude; culm = d; }
    prev = { alt: h.altitude, az: h.azimuth };
  }
  return { rise, culm, set, peakAlt };
}

Object.assign(window, {
  getStarVisibility,
  makeObserver, equatorialToHorizontal, computeStarsPositions,
  getPlanetPositions, getMoonInfo, getSunTimes,
  moonPhaseName, formatTime, formatDateShort, frenchDate,
  constellationFromRA
});
