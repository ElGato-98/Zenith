# ZÉNITH — To-do

## Bugs à corriger
- [ ] Vide en bas de l'écran en mode PWA (safe-area-inset-bottom)
- [x] Blocage du tilt à ~80° vers le zénith (levé à 90°)
- [x] Décalage AR gauche/droite — refonte projection 3D (base caméra complète avec roulis)

## En cours / priorité haute
- [x] **Mode jour** — palette blanc cassé, noir, accents oranges
- [ ] Calibrer le champ de vision réel de la caméra (vidéo `cover` ≠ constante FOV 70°/zoom)
- [ ] Déclinaison magnétique (World Magnetic Model) — nord magnétique → géographique

## Nouvelles fonctionnalités

### Météo astronomique
- [ ] Intégrer une API météo (Open-Meteo ou Clear Outside) basée sur la géolocalisation
- [ ] Afficher couverture nuageuse, seeing et transparence atmosphérique
- [ ] Indicateur visible sur l'écran CIEL ("Ciel dégagé / Nuageux ce soir")
- [ ] Prévision sur 5 nuits dans l'écran CETTE NUIT

### Nébuleuses & objets du ciel profond
- [ ] Ajouter catalogue Messier (110 objets) + NGC sélection
- [ ] Afficher sur la carte du ciel avec taille angulaire réelle
- [ ] Icônes distinctes selon type (nébuleuse, amas ouvert, amas globulaire, galaxie)
- [ ] Fiche détail avec description et conditions d'observation

### Notifications
- [x] Éclipses (solaire et lunaire) — écran dédié ÉCLIPSES
- [ ] Notification push à l'approche d'une éclipse
- [ ] Conjonctions planétaires remarquables
- [ ] Passage de l'ISS au-dessus de la position
- [ ] Opposition des planètes extérieures
- [ ] Pluies de météores (Perséides, Géminides…)

### Carte du système solaire *(nouvel écran)*
- [ ] Vue de dessus depuis le pôle nord écliptique
- [ ] Orbites elliptiques en pointillé pour les 8 planètes
- [ ] Positions planétaires en temps réel (synchro avec le scrubber)
- [ ] Lunes : Lune (Terre) + 4 lunes galiléennes (Jupiter)
- [ ] Orbites des lunes en pointillé
- [ ] Échelle logarithmique (planètes internes + externes visibles simultanément)
- [ ] Distance Terre–planète en temps réel
- [ ] Tap sur une planète → fiche détail existante

## Idées pour plus tard
- [ ] Grille équatoriale optionnelle (AR / Dec) sur la carte du ciel
- [ ] Trajectoire de la Lune et planètes sur 24h (trait pointillé)
- [ ] Widget iOS (position Lune + prochain événement)
- [ ] Amas et nébuleuses dans l'écran ATLAS avec filtres
