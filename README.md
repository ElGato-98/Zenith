# ZÉNITH — Observatoire céleste

Prototype interactif d'une application iPhone de carte du ciel. Pas de bundler, pas de build — un seul dossier `app/` à servir statiquement.

---

## Accès rapide

### GitHub Pages (recommandé — HTTPS requis pour caméra et gyroscope)

1. Merge la branche de travail dans `main`
2. **Settings → Pages** → source : `main`, dossier `/app`
3. L'app sera disponible à `https://elgato-98.github.io/Zenith/`

### Serveur local (même réseau Wi-Fi)

```bash
cd app
python3 -m http.server 8080
```

Puis sur iPhone : `http://<IP-de-ton-ordi>:8080`

> ⚠️ En HTTP local, DeviceOrientation, getUserMedia et le service worker sont désactivés par le navigateur. Utilise GitHub Pages pour tester compas, caméra AR et PWA.

### Installer comme PWA sur iPhone

Ouvre l'URL GitHub Pages dans Safari → bouton Partager → **« Sur l'écran d'accueil »**. L'app se lance alors en plein écran, sans barre Safari.

---

## Architecture

Pas de bundler. React 18 + Babel standalone s'exécutent directement dans le navigateur. Chaque fichier `.jsx` est un `<script type="text/babel">` chargé dans l'ordre dans `index.html`. Les symboles entre fichiers se partagent via `window`.

```
index.html
│
├── data.jsx                  — étoiles nommées, planètes, lignes de constellations, Atlas de base, villes
├── data-stars.jsx            — données réelles catalogue (dist, spectral, masse, rayon), prose française, Soleil/Lune
├── astronomy-helpers.jsx     — wrappers Astronomy Engine (éphémérides, visibilité, lever/coucher)
│
├── components-shared.jsx     — StatusBar, BottomNav, CompassStrip, Reticle, TimeScrubber
├── components-location.jsx   — LocationChip, LocationSheet (sélection de ville + géolocalisation)
├── components-sky.jsx        — SkyView : projection gnomonique, gyroscope, zoom, AR, plaque
├── components-detail.jsx     — ObjectDetail : fiche complète avec stats, prose, arc de visibilité
├── components-tonight-atlas.jsx — TonightScreen + AtlasScreen
│
├── app.jsx                   — App root : état global, navigation, favoris, heure
│
├── styles.css                — design system complet (tokens CSS, nuit, toutes les vues)
├── manifest.json             — PWA manifest
├── sw.js                     — service worker (cache-first local, network-first CDN)
└── icon.svg                  — icône SVA pour PWA et apple-touch-icon
```

---

## Dépendances externes (CDN, pas de npm)

| Lib | Version | Usage |
|-----|---------|-------|
| React | 18.3.1 | UI |
| ReactDOM | 18.3.1 | Rendu |
| Babel Standalone | 7.29.0 | Transpilation JSX in-browser |
| Astronomy Engine | 2.1.19 | Éphémérides réelles (positions, lever/coucher) |
| Google Fonts | — | Instrument Serif, Space Grotesk, JetBrains Mono |

Toutes les dépendances ont leurs `integrity` SRI dans `index.html`.

---

## Design system

Défini dans `:root` de `styles.css` :

```css
--ink: #0a0908          /* fond near-black */
--paper: #e8e4d8        /* texte off-white chaud */
--amber: #c89a3a        /* accent doré (favoris) */
--red: #d63a2f          /* état actif HUD, live dot */
--blue: #6486a8         /* éléments secondaires */

--serif:  'Instrument Serif'
--sans:   'Space Grotesk'
--mono:   'JetBrains Mono'
```

**Mode nuit** : `.app.night` redéfinit `--paper` en rouge `#e07a72` et ses dérivés pour préserver la vision nocturne. Tous les composants héritent automatiquement via les tokens.

---

## Fonctionnalités

### Carte du ciel (`SkyView`)
- Projection gnomonique centrée sur l'azimut + inclinaison regardée
- ~80 étoiles nommées avec couleur spectrale, lignes de constellations, labels
- Lune avec phase correcte (terminator calculé), Soleil avec halo
- Planètes visibles (Mercure → Neptune) avec position réelle
- Glissement pour changer la direction regardée
- Pinch-to-zoom (×0.5 → ×4), double-tap pour reset zoom
- Horizon avec labels N/S/E/O, marqueur zénith

### Compas + gyroscope
- `DeviceOrientationEvent` / `webkitCompassHeading`
- Lissage par filtre passe-bas (rAF loop, α = 0.12)
- Désactivable — glissement manuel en fallback

### Caméra AR
- `getUserMedia` → vidéo derrière le SVG
- Superposition transparente de la carte
- Bouton **Calibrer** : capture 320×240, détecte les maxima lumineux locaux, balaie ±45° pour aligner sur les étoiles réelles (confiance > 25 %)

### Scrubber de temps
- Fenêtre « cette nuit » : 18h00 → 06h00
- Mode EN DIRECT (synced à `Date.now()`, tick toutes les 30 s)
- Glissement pour voyager dans le temps

### Atlas
- Catalogue de ~85 objets (étoiles, planètes, Lune, Soleil, galaxies, nébuleuses, amas)
- Recherche textuelle + filtres par catégorie
- Section **Objets suivis** (favoris) en haut de liste
- Fiche détail : stats réelles, arc de visibilité, prose française

### Favoris
- Bouton **Suivre** dans chaque fiche, persisté dans `localStorage` (`z-fav`)
- Apparaissent en section dédiée dans l'Atlas avec badge ★

### PWA
- Installable sur l'écran d'accueil iPhone (manifest + meta Apple)
- Service worker cache-first pour les assets locaux, network-first pour CDN

---

## Persistence localStorage

| Clé | Contenu |
|-----|---------|
| `z-night` | `"1"` si mode nuit activé |
| `z-loc` | ID de la ville sélectionnée |
| `z-fav` | JSON array d'IDs d'objets suivis |

---

## Ajouter un objet à l'Atlas

Dans `data.jsx`, `ATLAS_ENTRIES` array, ou dans `data-stars.jsx` pour les étoiles enrichies. Chaque entrée doit avoir :

```js
{
  id: "mon-objet",          // identifiant unique
  cat: "Étoile",            // catégorie (filtre Atlas)
  name: "Mon Objet",
  bayer: "α Mon",           // désignation Bayer ou "-"
  constellation: "...",
  type: "Géante rouge",
  distance: "430 al",
  magnitude: "0.50",
  rightAscension: "05h 55m 10s",
  declination: "+07° 24′ 25″",
  spectral: "M1–M2",        // optionnel
  mass: "~11–12 M☉",        // optionnel
  radius: "~700–1000 R☉",   // optionnel
  ra: 88.79,                // degrés décimaux, pour projection sur la carte
  dec: 7.41,
  color: "#e87050",
  prose: [
    "Paragraphe 1...",
    "Paragraphe 2...",
  ]
}
```

---

## Lancer en développement

Tout changement dans un `.jsx` ou `.css` est visible immédiatement en rechargeant l'onglet. Babel recompile côté client à chaque chargement.

Pour un rechargement automatique :

```bash
cd app
npx browser-sync start --server --files "*.jsx,*.css,*.html"
```
