/* ============================================================
   ZÉNITH — Star catalog with REAL equatorial coordinates.
   RA in hours (0-24), Dec in degrees (-90 to +90).
   Magnitudes & spectral colors from Hipparcos / IAU.
   When loaded, REPLACES window.NAMED_STARS with real-coord version.
   ============================================================ */

const NAMED_STARS_REAL = [
  // ─── Lyra ───
  { id: "vega",      name: "Véga",       bayer: "α Lyrae",   ra: 18.6156, dec: +38.7836, mag: 0.03, color: "#cfd6e8", constellation: "lyra" },
  { id: "sheliak",   name: "Sheliak",    bayer: "β Lyrae",   ra: 18.8338, dec: +33.3625, mag: 3.52, color: "#e0dac8", constellation: "lyra" },
  { id: "sulafat",   name: "Sulafat",    bayer: "γ Lyrae",   ra: 18.9819, dec: +32.6896, mag: 3.24, color: "#e0dac8", constellation: "lyra" },
  { id: "delta-lyr", name: "δ Lyrae",    bayer: "δ Lyrae",   ra: 18.8950, dec: +36.8995, mag: 4.22, color: "#e8a060", constellation: "lyra" },
  { id: "zeta-lyr",  name: "ζ Lyrae",    bayer: "ζ Lyrae",   ra: 18.7461, dec: +37.6052, mag: 4.34, color: "#e0dac8", constellation: "lyra" },

  // ─── Cygnus ───
  { id: "deneb",     name: "Deneb",      bayer: "α Cygni",   ra: 20.6905, dec: +45.2803, mag: 1.25, color: "#e0e6f0", constellation: "cygnus" },
  { id: "sadr",      name: "Sadr",       bayer: "γ Cygni",   ra: 20.3705, dec: +40.2566, mag: 2.20, color: "#e0dac8", constellation: "cygnus" },
  { id: "gienah",    name: "Gienah",     bayer: "ε Cygni",   ra: 20.7702, dec: +33.9703, mag: 2.46, color: "#e8b070", constellation: "cygnus" },
  { id: "delta-cyg", name: "Fawaris",    bayer: "δ Cygni",   ra: 19.7496, dec: +45.1308, mag: 2.87, color: "#e0dac8", constellation: "cygnus" },
  { id: "albireo",   name: "Albireo",    bayer: "β Cygni",   ra: 19.5120, dec: +27.9597, mag: 3.10, color: "#e8b070", constellation: "cygnus" },
  { id: "kappa-cyg", name: "κ Cygni",    bayer: "κ Cygni",   ra: 19.2885, dec: +53.3686, mag: 3.77, color: "#e0dac8", constellation: "cygnus" },

  // ─── Aquila ───
  { id: "altair",    name: "Altaïr",     bayer: "α Aquilae", ra: 19.8464, dec:  +8.8683, mag: 0.77, color: "#e8e0d0", constellation: "aquila" },
  { id: "tarazed",   name: "Tarazed",    bayer: "γ Aquilae", ra: 19.7711, dec: +10.6133, mag: 2.72, color: "#e8a060", constellation: "aquila" },
  { id: "alshain",   name: "Alshain",    bayer: "β Aquilae", ra: 19.9213, dec:  +6.4067, mag: 3.71, color: "#e8e0d0", constellation: "aquila" },
  { id: "delta-aql", name: "δ Aql",      bayer: "δ Aql",     ra: 19.4253, dec:  +3.1147, mag: 3.36, color: "#e0dac8", constellation: "aquila" },
  { id: "zeta-aql",  name: "ζ Aql",      bayer: "ζ Aql",     ra: 19.0900, dec: +13.8633, mag: 2.99, color: "#e0dac8", constellation: "aquila" },
  { id: "lambda-aql",name: "λ Aql",      bayer: "λ Aql",     ra: 19.1033, dec:  -4.8825, mag: 3.43, color: "#e0dac8", constellation: "aquila" },

  // ─── Ursa Major (Grande Ourse) ───
  { id: "dubhe",     name: "Dubhe",      bayer: "α UMa",     ra: 11.0621, dec: +61.7510, mag: 1.79, color: "#e8a060", constellation: "ursamajor" },
  { id: "merak",     name: "Merak",      bayer: "β UMa",     ra: 11.0307, dec: +56.3824, mag: 2.37, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "phecda",    name: "Phecda",     bayer: "γ UMa",     ra: 11.8972, dec: +53.6948, mag: 2.44, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "megrez",    name: "Megrez",     bayer: "δ UMa",     ra: 12.2571, dec: +57.0326, mag: 3.31, color: "#e0dac8", constellation: "ursamajor" },
  { id: "alioth",    name: "Alioth",     bayer: "ε UMa",     ra: 12.9004, dec: +55.9598, mag: 1.77, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "mizar",     name: "Mizar",      bayer: "ζ UMa",     ra: 13.3987, dec: +54.9255, mag: 2.27, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "alkaid",    name: "Alkaïd",     bayer: "η UMa",     ra: 13.7923, dec: +49.3133, mag: 1.86, color: "#cfd6e8", constellation: "ursamajor" },

  // ─── Ursa Minor (Petite Ourse) ───
  { id: "polaris",   name: "Polaris",    bayer: "α UMi",     ra:  2.5303, dec: +89.2641, mag: 1.98, color: "#e8e0d0", constellation: "ursaminor" },
  { id: "kochab",    name: "Kochab",     bayer: "β UMi",     ra: 14.8451, dec: +74.1554, mag: 2.07, color: "#e8a060", constellation: "ursaminor" },
  { id: "pherkad",   name: "Pherkad",    bayer: "γ UMi",     ra: 15.3455, dec: +71.8340, mag: 3.00, color: "#e0dac8", constellation: "ursaminor" },
  { id: "eps-umi",   name: "ε UMi",      bayer: "ε UMi",     ra: 16.7662, dec: +82.0372, mag: 4.21, color: "#e0dac8", constellation: "ursaminor" },
  { id: "zeta-umi",  name: "ζ UMi",      bayer: "ζ UMi",     ra: 15.7343, dec: +77.7944, mag: 4.32, color: "#e0dac8", constellation: "ursaminor" },
  { id: "eta-umi",   name: "η UMi",      bayer: "η UMi",     ra: 16.2917, dec: +75.7553, mag: 4.95, color: "#e0dac8", constellation: "ursaminor" },

  // ─── Cassiopée ───
  { id: "schedar",   name: "Schedar",    bayer: "α Cas",     ra:  0.6751, dec: +56.5374, mag: 2.24, color: "#e8a060", constellation: "cassiopeia" },
  { id: "caph",      name: "Caph",       bayer: "β Cas",     ra:  0.1530, dec: +59.1498, mag: 2.27, color: "#e0dac8", constellation: "cassiopeia" },
  { id: "gamma-cas", name: "Tsih",       bayer: "γ Cas",     ra:  0.9451, dec: +60.7167, mag: 2.15, color: "#cfd6e8", constellation: "cassiopeia" },
  { id: "ruchbah",   name: "Ruchbah",    bayer: "δ Cas",     ra:  1.4303, dec: +60.2353, mag: 2.66, color: "#e0dac8", constellation: "cassiopeia" },
  { id: "segin",     name: "Segin",      bayer: "ε Cas",     ra:  1.9066, dec: +63.6701, mag: 3.35, color: "#cfd6e8", constellation: "cassiopeia" },

  // ─── Boötes ───
  { id: "arcturus",  name: "Arcturus",   bayer: "α Boötis",  ra: 14.2610, dec: +19.1825, mag:-0.05, color: "#e8a060", constellation: "bootes" },
  { id: "izar",      name: "Izar",       bayer: "ε Boötis",  ra: 14.7498, dec: +27.0742, mag: 2.37, color: "#e8a060", constellation: "bootes" },
  { id: "nekkar",    name: "Nekkar",     bayer: "β Boö",     ra: 15.0324, dec: +40.3905, mag: 3.50, color: "#e8a060", constellation: "bootes" },
  { id: "seginus",   name: "Séginus",    bayer: "γ Boö",     ra: 14.5346, dec: +38.3082, mag: 3.03, color: "#cfd6e8", constellation: "bootes" },
  { id: "muphrid",   name: "Muphrid",    bayer: "η Boö",     ra: 13.9114, dec: +18.3977, mag: 2.68, color: "#e0dac8", constellation: "bootes" },

  // ─── Hercule ───
  { id: "rasalgethi",name: "Rasalgethi", bayer: "α Herculis",ra: 17.2441, dec: +14.3903, mag: 3.06, color: "#e8a060", constellation: "hercules" },
  { id: "kornephoros",name:"Kornephoros",bayer: "β Herculis",ra: 16.5037, dec: +21.4896, mag: 2.78, color: "#e8a060", constellation: "hercules" },
  { id: "zeta-her",  name: "ζ Her",      bayer: "ζ Her",     ra: 16.6881, dec: +31.6033, mag: 2.81, color: "#e0dac8", constellation: "hercules" },
  { id: "eta-her",   name: "η Her",      bayer: "η Her",     ra: 16.7150, dec: +38.9223, mag: 3.53, color: "#e0dac8", constellation: "hercules" },
  { id: "eps-her",   name: "ε Her",      bayer: "ε Her",     ra: 17.0048, dec: +30.9263, mag: 3.92, color: "#e0dac8", constellation: "hercules" },
  { id: "pi-her",    name: "π Her",      bayer: "π Her",     ra: 17.2508, dec: +36.8092, mag: 3.16, color: "#e0dac8", constellation: "hercules" },
  { id: "delta-her", name: "Sarin",      bayer: "δ Her",     ra: 17.2505, dec: +24.8392, mag: 3.14, color: "#e0dac8", constellation: "hercules" },
  { id: "tau-her",   name: "τ Her",      bayer: "τ Her",     ra: 16.3290, dec: +46.3133, mag: 3.89, color: "#e0dac8", constellation: "hercules" },
  { id: "phi-her",   name: "φ Her",      bayer: "φ Her",     ra: 16.1461, dec: +44.9347, mag: 4.23, color: "#e0dac8", constellation: "hercules" },

  // ─── Scorpion ───
  { id: "antares",   name: "Antarès",    bayer: "α Scorpii", ra: 16.4901, dec: -26.4320, mag: 1.06, color: "#e85c3e", constellation: "scorpius" },
  { id: "shaula",    name: "Shaula",     bayer: "λ Sco",     ra: 17.5601, dec: -37.1038, mag: 1.62, color: "#cfd6e8", constellation: "scorpius" },
  { id: "dschubba",  name: "Dschubba",   bayer: "δ Sco",     ra: 16.0055, dec: -22.6217, mag: 2.32, color: "#cfd6e8", constellation: "scorpius" },
  { id: "acrab",     name: "Acrab",      bayer: "β Sco",     ra: 16.0906, dec: -19.8054, mag: 2.62, color: "#cfd6e8", constellation: "scorpius" },

  // ─── Pegasus ───
  { id: "markab",    name: "Markab",     bayer: "α Pegasi",  ra: 23.0793, dec: +15.2052, mag: 2.49, color: "#cfd6e8", constellation: "pegasus" },
  { id: "scheat",    name: "Scheat",     bayer: "β Pegasi",  ra: 23.0629, dec: +28.0828, mag: 2.42, color: "#e8a060", constellation: "pegasus" },
  { id: "algenib",   name: "Algenib",    bayer: "γ Pegasi",  ra:  0.2206, dec: +15.1836, mag: 2.83, color: "#e0dac8", constellation: "pegasus" },
  { id: "alpheratz", name: "Alphératz",  bayer: "α And",     ra:  0.1398, dec: +29.0904, mag: 2.06, color: "#cfd6e8", constellation: "pegasus" },

  // ─── Andromède ───
  { id: "mirach",    name: "Mirach",     bayer: "β And",     ra:  1.1622, dec: +35.6206, mag: 2.05, color: "#e8a060", constellation: "andromeda" },
  { id: "almach",    name: "Almach",     bayer: "γ And",     ra:  2.0650, dec: +42.3297, mag: 2.10, color: "#e8a060", constellation: "andromeda" },

  // ─── Couronne Boréale ───
  { id: "alphecca",  name: "Alphecca",   bayer: "α CrB",     ra: 15.5781, dec: +26.7148, mag: 2.23, color: "#cfd6e8", constellation: "corona" },
  { id: "nusakan",   name: "Nusakan",    bayer: "β CrB",     ra: 15.4638, dec: +29.1054, mag: 3.66, color: "#e0dac8", constellation: "corona" },
  { id: "gamma-crb", name: "γ CrB",      bayer: "γ CrB",     ra: 15.7124, dec: +26.2956, mag: 3.84, color: "#e0dac8", constellation: "corona" },
  { id: "delta-crb", name: "δ CrB",      bayer: "δ CrB",     ra: 15.8266, dec: +26.0681, mag: 4.59, color: "#e0dac8", constellation: "corona" },
  { id: "eps-crb",   name: "ε CrB",      bayer: "ε CrB",     ra: 15.9598, dec: +26.8779, mag: 4.13, color: "#e0dac8", constellation: "corona" },
  { id: "iota-crb",  name: "ι CrB",      bayer: "ι CrB",     ra: 16.0240, dec: +29.8512, mag: 4.99, color: "#e0dac8", constellation: "corona" },

  // ─── Vierge ───
  { id: "spica",     name: "Spica",      bayer: "α Vir",     ra: 13.4198, dec: -11.1614, mag: 0.98, color: "#cfd6e8", constellation: "virgo" },
  { id: "porrima",   name: "Porrima",    bayer: "γ Vir",     ra: 12.6943, dec:  -1.4494, mag: 2.74, color: "#e0dac8", constellation: "virgo" },
  { id: "vindem",    name: "Vindémiatrix",bayer:"ε Vir",     ra: 13.0363, dec: +10.9591, mag: 2.85, color: "#e8a060", constellation: "virgo" },
  { id: "heze-vir",  name: "Heze",       bayer: "ζ Vir",     ra: 13.5782, dec:  -0.5957, mag: 3.38, color: "#e0dac8", constellation: "virgo" },

  // ─── Lion ───
  { id: "regulus",   name: "Régulus",    bayer: "α Leo",     ra: 10.1395, dec: +11.9672, mag: 1.35, color: "#cfd6e8", constellation: "leo" },
  { id: "denebola",  name: "Denebola",   bayer: "β Leo",     ra: 11.8176, dec: +14.5720, mag: 2.14, color: "#cfd6e8", constellation: "leo" },
  { id: "algieba",   name: "Algieba",    bayer: "γ Leo",     ra: 10.3329, dec: +19.8415, mag: 2.08, color: "#e8a060", constellation: "leo" },
  { id: "zosma",     name: "Zosma",      bayer: "δ Leo",     ra: 11.2351, dec: +20.5237, mag: 2.56, color: "#e0dac8", constellation: "leo" },
  { id: "chort",     name: "Chort",      bayer: "θ Leo",     ra: 11.2373, dec: +15.4297, mag: 3.34, color: "#e0dac8", constellation: "leo" },

  // ─── Sagittaire ───
  { id: "kaus-aus",  name: "Kaus Australis",bayer:"ε Sgr",   ra: 18.4029, dec: -34.3847, mag: 1.85, color: "#cfd6e8", constellation: "sagittarius" },
  { id: "nunki",     name: "Nunki",      bayer: "σ Sgr",     ra: 18.9211, dec: -26.2967, mag: 2.05, color: "#cfd6e8", constellation: "sagittarius" },
  { id: "kaus-med",  name: "Kaus Media", bayer: "δ Sgr",     ra: 18.3499, dec: -29.8281, mag: 2.72, color: "#e8a060", constellation: "sagittarius" },
  { id: "ascella",   name: "Ascella",    bayer: "ζ Sgr",     ra: 19.0435, dec: -29.8800, mag: 2.59, color: "#e0dac8", constellation: "sagittarius" },

  // ─── Ophiuchus ───
  { id: "rasalhague",name: "Rasalhague", bayer: "α Oph",     ra: 17.5823, dec: +12.5601, mag: 2.08, color: "#e0dac8", constellation: "ophiuchus" },
  { id: "sabik",     name: "Sabik",      bayer: "η Oph",     ra: 17.1730, dec: -15.7250, mag: 2.43, color: "#e0dac8", constellation: "ophiuchus" },
  { id: "cebalrai",  name: "Céblalraï",  bayer: "β Oph",     ra: 17.7245, dec:  +4.5673, mag: 2.77, color: "#e8a060", constellation: "ophiuchus" },
  { id: "yed-prior", name: "Yed Prior",  bayer: "δ Oph",     ra: 16.2391, dec:  -3.6943, mag: 2.74, color: "#e8a060", constellation: "ophiuchus" },
  { id: "yed-post",  name: "Yed Posterior",bayer:"ε Oph",    ra: 16.3053, dec:  -4.6925, mag: 3.23, color: "#e8a060", constellation: "ophiuchus" },

  // ─── Dragon ───
  { id: "etamin",    name: "Étamin",     bayer: "γ Dra",     ra: 17.9434, dec: +51.4889, mag: 2.23, color: "#e8a060", constellation: "draco" },
  { id: "rastaban",  name: "Rastaban",   bayer: "β Dra",     ra: 17.5072, dec: +52.3014, mag: 2.79, color: "#e8a060", constellation: "draco" },
  { id: "thuban",    name: "Thuban",     bayer: "α Dra",     ra: 14.0732, dec: +64.3758, mag: 3.65, color: "#e0dac8", constellation: "draco" },
  { id: "grumium",   name: "Grumium",    bayer: "ξ Dra",     ra: 17.8921, dec: +56.8725, mag: 3.75, color: "#e0dac8", constellation: "draco" },
  { id: "altais",    name: "Altais",     bayer: "δ Dra",     ra: 19.2093, dec: +67.6614, mag: 3.07, color: "#e8a060", constellation: "draco" },
  { id: "iota-dra",  name: "ι Dra",      bayer: "ι Dra",     ra: 15.4155, dec: +58.9661, mag: 3.29, color: "#e8a060", constellation: "draco" },
  { id: "theta-dra", name: "θ Dra",      bayer: "θ Dra",     ra: 16.0315, dec: +58.5650, mag: 4.01, color: "#e0dac8", constellation: "draco" },

  // ─── Céphée ───
  { id: "alderamin", name: "Aldéramin",  bayer: "α Cep",     ra: 21.3097, dec: +62.5856, mag: 2.45, color: "#cfd6e8", constellation: "cepheus" },
  { id: "alfirk",    name: "Alfirk",     bayer: "β Cep",     ra: 21.4777, dec: +70.5607, mag: 3.23, color: "#cfd6e8", constellation: "cepheus" },
  { id: "errai",     name: "Errai",      bayer: "γ Cep",     ra: 23.6558, dec: +77.6322, mag: 3.21, color: "#e8a060", constellation: "cepheus" },

  // ─── Persée ───
  { id: "algol",     name: "Algol",      bayer: "β Per",     ra:  3.1361, dec: +40.9556, mag: 2.12, color: "#cfd6e8", constellation: "perseus" },
  { id: "mirfak",    name: "Mirfak",     bayer: "α Per",     ra:  3.4054, dec: +49.8612, mag: 1.79, color: "#e0dac8", constellation: "perseus" },

  // ─── Serpent ───
  { id: "unukalhai", name: "Unukalhai",  bayer: "α Ser",     ra: 15.7378, dec:  +6.4253, mag: 2.63, color: "#e8a060", constellation: "serpens" },
  { id: "mu-ser",    name: "μ Ser",      bayer: "μ Ser",     ra: 15.8270, dec:  -3.4304, mag: 3.53, color: "#e0dac8", constellation: "serpens" },

  // ─── Triangulum ───
  { id: "tria-alpha",name: "α Tri",      bayer: "α Tri",     ra:  1.8847, dec: +29.5793, mag: 3.41, color: "#e0dac8", constellation: "triangulum" },
  { id: "tria-beta", name: "β Tri",      bayer: "β Tri",     ra:  2.1591, dec: +34.9876, mag: 3.00, color: "#e0dac8", constellation: "triangulum" },

  // ─── Chiens de Chasse ───
  { id: "cor-caroli",name: "Cor Caroli", bayer: "α CVn",     ra: 12.9338, dec: +38.3183, mag: 2.89, color: "#cfd6e8", constellation: "canesvenatici" },
  { id: "chara",     name: "Chara",      bayer: "β CVn",     ra: 12.5624, dec: +41.3576, mag: 4.26, color: "#e0dac8", constellation: "canesvenatici" },

  // ─── Coma Berenices ───
  { id: "diadem",    name: "Diadème",    bayer: "α Com",     ra: 13.1665, dec: +17.5292, mag: 4.32, color: "#e0dac8", constellation: "coma" },
  { id: "beta-com",  name: "β Com",      bayer: "β Com",     ra: 13.1979, dec: +27.8783, mag: 4.26, color: "#e0dac8", constellation: "coma" },
  { id: "gamma-com", name: "γ Com",      bayer: "γ Com",     ra: 12.4490, dec: +28.2683, mag: 4.36, color: "#e0dac8", constellation: "coma" },

  // ─── Étoiles d'hiver (couchant en mai) ───
  { id: "sirius",    name: "Sirius",     bayer: "α CMa",     ra:  6.7525, dec: -16.7161, mag:-1.46, color: "#e8e6e2", constellation: "canismajor" },
  { id: "betelgeuse",name: "Bételgeuse", bayer: "α Orionis", ra:  5.9195, dec:  +7.4071, mag: 0.50, color: "#e85c3e", constellation: "orion" },
  { id: "rigel",     name: "Rigel",      bayer: "β Orionis", ra:  5.2422, dec:  -8.2017, mag: 0.13, color: "#cfd6e8", constellation: "orion" },
  { id: "capella",   name: "Capella",    bayer: "α Aurigae", ra:  5.2782, dec: +45.9979, mag: 0.08, color: "#e8c878", constellation: "auriga" },
  { id: "procyon",   name: "Procyon",    bayer: "α CMi",     ra:  7.6552, dec:  +5.2249, mag: 0.34, color: "#e8e0d0", constellation: "canisminor" },
  { id: "castor",    name: "Castor",     bayer: "α Gem",     ra:  7.5766, dec: +31.8884, mag: 1.58, color: "#cfd6e8", constellation: "gemini" },
  { id: "pollux",    name: "Pollux",     bayer: "β Gem",     ra:  7.7553, dec: +28.0262, mag: 1.14, color: "#e8a060", constellation: "gemini" },
  { id: "aldebaran", name: "Aldébaran",  bayer: "α Tau",     ra:  4.5987, dec: +16.5093, mag: 0.85, color: "#e8a060", constellation: "taurus" },
  { id: "elnath",    name: "Elnath",     bayer: "β Tau",     ra:  5.4382, dec: +28.6075, mag: 1.65, color: "#cfd6e8", constellation: "taurus" },
  { id: "bellatrix", name: "Bellatrix",  bayer: "γ Ori",     ra:  5.4188, dec:  +6.3497, mag: 1.64, color: "#cfd6e8", constellation: "orion" },
  { id: "alnilam",   name: "Alnilam",    bayer: "ε Ori",     ra:  5.6036, dec:  -1.2019, mag: 1.69, color: "#cfd6e8", constellation: "orion" },
  { id: "alnitak",   name: "Alnitak",    bayer: "ζ Ori",     ra:  5.6793, dec:  -1.9426, mag: 1.74, color: "#cfd6e8", constellation: "orion" },
  { id: "mintaka",   name: "Mintaka",    bayer: "δ Ori",     ra:  5.5334, dec:  -0.2991, mag: 2.23, color: "#cfd6e8", constellation: "orion" },
  { id: "saiph",     name: "Saiph",      bayer: "κ Ori",     ra:  5.7959, dec:  -9.6697, mag: 2.06, color: "#cfd6e8", constellation: "orion" },

  // ─── Fomalhaut (très bas, automne mais utile) ───
  { id: "fomalhaut", name: "Fomalhaut",  bayer: "α PsA",     ra: 22.9608, dec: -29.6222, mag: 1.16, color: "#e8e0d0", constellation: "piscisaustrinus" },
];

// Ajouter les nouvelles constellations qui manquaient
const EXTRA_CONSTELLATIONS = {
  orion: [
    ["betelgeuse","bellatrix"], ["bellatrix","mintaka"],
    ["mintaka","alnilam"], ["alnilam","alnitak"],
    ["alnitak","saiph"], ["saiph","rigel"],
    ["rigel","mintaka"], ["betelgeuse","alnitak"]
  ],
  gemini: [["castor","pollux"]],
  taurus: [["aldebaran","elnath"]],
};

// Replace the simplified data
window.NAMED_STARS = NAMED_STARS_REAL;
// Merge extra constellation lines
window.CONSTELLATION_LINES = Object.assign({}, window.CONSTELLATION_LINES, EXTRA_CONSTELLATIONS);

// Format helpers for atlas entries
function _raHMS(ra) {
  const r = ((ra % 24) + 24) % 24;
  const h = Math.floor(r);
  const m = Math.floor((r - h) * 60);
  const s = (((r - h) * 60 - m) * 60).toFixed(0).padStart(2, "0");
  return `${h}h ${String(m).padStart(2,"0")}m ${s}s`;
}
function _decDMS(dec) {
  const sign = dec >= 0 ? "+" : "−";
  const a = Math.abs(dec);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  const s = (((a - d) * 60 - m) * 60).toFixed(0).padStart(2, "0");
  return `${sign}${d}° ${String(m).padStart(2,"0")}′ ${s}″`;
}
const _CONST_FR = {
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

// Extend ATLAS_ENTRIES with all named stars + Moon entry
const _existingIds = new Set(window.ATLAS_ENTRIES.map(e => e.id));

// Add Sun entry
if (!_existingIds.has("sun")) {
  window.ATLAS_ENTRIES.push({
    id: "sun", cat: "Étoile", name: "Soleil", bayer: "Sol",
    constellation: "Variable (écliptique)", type: "Naine jaune — séquence principale (G2 V)",
    distance: "149 597 870 km — 1 UA", magnitude: "−26,74",
    rightAscension: "Variable", declination: "Variable",
    spectral: "G2 V", mass: "1 M☉ (1,989 × 10³⁰ kg)", radius: "695 700 km",
    discovery: "Connue depuis l'Antiquité",
    prose: [
      "Notre étoile, le Soleil, est une naine jaune de type spectral G2 V, âgée de 4,6 milliards d'années et située à exactement 1 unité astronomique — soit 8 minutes 20 secondes-lumière — de la Terre. Sa masse représente 99,86 % de la totalité du Système solaire.",
      "Sa surface visible, la <em>photosphère</em>, brûle à 5 778 K et révèle des taches solaires — zones magnétiques plus froides — dont le nombre oscille selon un cycle d'environ 11 ans. La couronne, enveloppe externe invisible à l'œil nu, atteint plusieurs millions de kelvins.",
      "<strong>Attention :</strong> n'observez jamais le Soleil directement sans filtre solaire certifié. Même quelques secondes d'observation non protégée causent des lésions rétiniennes irréversibles."
    ]
  });
}

// Add Moon entry
if (!_existingIds.has("moon")) {
  window.ATLAS_ENTRIES.push({
    id: "moon", cat: "Satellite", name: "Lune", bayer: "Luna",
    constellation: "Variable", type: "Satellite naturel de la Terre",
    distance: "≈ 384 400 km", magnitude: "−12,7 (pleine lune)",
    rightAscension: "Variable", declination: "Variable",
    spectral: "—", mass: "7,34 × 10²² kg", radius: "1 737 km",
    discovery: "Connue depuis l'Antiquité",
    prose: [
      "Unique satellite naturel de la Terre, la Lune orbite à une distance moyenne de 384 400 km en 27,3 jours. Ses phases cycliques résultent de sa position relative au Soleil et à la Terre.",
      "Sa surface criblée de cratères, de mers basaltiques (<em>maria</em>) et de hautes terres (<em>terrae</em>) retrace l'histoire des bombardements météoritiques du Système solaire primitif.",
      "Avec un diamètre apparent de 0,5°, elle est le seul corps céleste au-delà de la Terre dont on peut observer des détails à l'œil nu. Aux jumelles, Mare Imbrium et le cratère Tycho deviennent distinctement visibles."
    ]
  });
}

// ─── Real stellar data (Hipparcos / IAU / SIMBAD) ───────────────────────────
const _STAR_DATA = {
  // Lyra
  sheliak:     { dist:"960 a.l.",    spectral:"B8.5-A8 Ve",   mass:"3,0 M☉",   radius:"6,0 R☉",   type:"Étoile variable à éclipses (Algol)" },
  sulafat:     { dist:"620 a.l.",    spectral:"B9 III",        mass:"4,0 M☉",   radius:"15 R☉",    type:"Géante bleue-blanche" },
  "delta-lyr": { dist:"1 080 a.l.", spectral:"M4 II",          mass:"—",        radius:"150 R☉",   type:"Géante rouge" },
  "zeta-lyr":  { dist:"156 a.l.",   spectral:"A2 V",           mass:"2,3 M☉",   radius:"2,5 R☉",   type:"Étoile blanche de la séquence principale" },
  // Cygnus
  deneb:       { dist:"2 600 a.l.", spectral:"A2 Ia",          mass:"19 M☉",    radius:"203 R☉",   type:"Supergéante blanche" },
  sadr:        { dist:"1 524 a.l.", spectral:"F8 Iab",         mass:"12 M☉",    radius:"150 R☉",   type:"Supergéante jaune-blanche" },
  gienah:      { dist:"73 a.l.",    spectral:"K0 III",          mass:"2,1 M☉",   radius:"10 R☉",    type:"Géante orange" },
  "delta-cyg": { dist:"170 a.l.",   spectral:"B9 III",          mass:"3,0 M☉",   radius:"5,1 R☉",   type:"Géante bleue-blanche" },
  albireo:     { dist:"430 a.l.",   spectral:"K3 II + B8-9 V", mass:"5,0 M☉",   radius:"—",        type:"Étoile double (orange + bleue)" },
  "kappa-cyg": { dist:"124 a.l.",   spectral:"G9 III",          mass:"2,2 M☉",   radius:"14 R☉",    type:"Géante jaune-orange" },
  // Aquila
  altair:      { dist:"16,73 a.l.", spectral:"A7 V",            mass:"1,86 M☉",  radius:"1,63–2,03 R☉", type:"Étoile blanche de la séquence principale" },
  tarazed:     { dist:"460 a.l.",   spectral:"K3 II",            mass:"—",        radius:"62 R☉",    type:"Géante lumineuse orange" },
  alshain:     { dist:"44,7 a.l.",  spectral:"G8 IV",            mass:"1,27 M☉",  radius:"1,87 R☉",  type:"Sous-géante jaune" },
  "delta-aql": { dist:"50,6 a.l.",  spectral:"F0 IV",            mass:"1,65 M☉",  radius:"2,04 R☉",  type:"Sous-géante blanche" },
  "zeta-aql":  { dist:"83 a.l.",    spectral:"A0 V",             mass:"2,37 M☉",  radius:"2,28 R☉",  type:"Étoile blanche de la séquence principale" },
  "lambda-aql":{ dist:"125 a.l.",   spectral:"B9 V",             mass:"2,9 M☉",   radius:"2,6 R☉",   type:"Étoile bleue-blanche de la séquence principale" },
  // Ursa Major
  dubhe:       { dist:"123 a.l.",   spectral:"K0 III",           mass:"4,25 M☉",  radius:"17 R☉",    type:"Géante orange" },
  merak:       { dist:"79 a.l.",    spectral:"A1 V",             mass:"2,7 M☉",   radius:"3,0 R☉",   type:"Étoile blanche de la séquence principale" },
  phecda:      { dist:"84 a.l.",    spectral:"A0 Ve",            mass:"2,94 M☉",  radius:"3,0 R☉",   type:"Étoile blanche à émission" },
  megrez:      { dist:"81 a.l.",    spectral:"A3 V",             mass:"1,63 M☉",  radius:"1,4 R☉",   type:"Étoile blanche de la séquence principale" },
  alioth:      { dist:"82 a.l.",    spectral:"A0pCr",            mass:"2,91 M☉",  radius:"4,14 R☉",  type:"Étoile chimiquement particulière" },
  mizar:       { dist:"83 a.l.",    spectral:"A2 V",             mass:"2,4 M☉",   radius:"2,4 R☉",   type:"Étoile double — première photographiée" },
  alkaid:      { dist:"104 a.l.",   spectral:"B3 V",             mass:"6,1 M☉",   radius:"3,4 R☉",   type:"Étoile bleue de la séquence principale" },
  // Ursa Minor
  kochab:      { dist:"131 a.l.",   spectral:"K4 III",           mass:"2,2 M☉",   radius:"42 R☉",    type:"Géante orange" },
  pherkad:     { dist:"487 a.l.",   spectral:"A3 III",           mass:"—",        radius:"—",        type:"Géante blanche" },
  "eps-umi":   { dist:"347 a.l.",   spectral:"G5 III",           mass:"—",        radius:"—",        type:"Géante jaune" },
  "zeta-umi":  { dist:"369 a.l.",   spectral:"A3 III",           mass:"—",        radius:"—",        type:"Géante blanche" },
  "eta-umi":   { dist:"97 a.l.",    spectral:"F5 V",             mass:"—",        radius:"—",        type:"Étoile jaune-blanche de la séquence principale" },
  // Cassiopeia
  schedar:     { dist:"228 a.l.",   spectral:"K0 IIIa",          mass:"4,52 M☉",  radius:"45 R☉",    type:"Géante orange" },
  caph:        { dist:"54 a.l.",    spectral:"F2 III–IV",         mass:"2,0 M☉",   radius:"3,43 R☉",  type:"Sous-géante blanche (Céphéide)" },
  "gamma-cas": { dist:"613 a.l.",   spectral:"B0.5 IVe",         mass:"13,0 M☉",  radius:"10 R☉",    type:"Étoile éruptive bleue — type Be" },
  ruchbah:     { dist:"99 a.l.",    spectral:"A5 III–IV",         mass:"2,68 M☉",  radius:"3,9 R☉",   type:"Étoile blanche géante" },
  segin:       { dist:"442 a.l.",   spectral:"B3 III",            mass:"9,0 M☉",   radius:"6,0 R☉",   type:"Géante bleue" },
  // Boötes
  arcturus:    { dist:"36,7 a.l.",  spectral:"K1.5 IIIFe",       mass:"1,10 M☉",  radius:"25,4 R☉",  type:"Géante orange" },
  izar:        { dist:"203 a.l.",   spectral:"K0 II + A2 V",     mass:"—",        radius:"—",        type:"Étoile double (Pulcherrima)" },
  nekkar:      { dist:"225 a.l.",   spectral:"G8 III",            mass:"—",        radius:"—",        type:"Géante jaune" },
  seginus:     { dist:"85 a.l.",    spectral:"A7 III",            mass:"—",        radius:"—",        type:"Géante blanche" },
  muphrid:     { dist:"37,2 a.l.",  spectral:"G0 IV",             mass:"1,41 M☉",  radius:"2,27 R☉",  type:"Sous-géante jaune" },
  // Hercules
  rasalgethi:  { dist:"360 a.l.",   spectral:"M5 Ib-II + G5 III",mass:"—",        radius:"300 R☉",   type:"Semi-régulière rouge — système double" },
  kornephoros: { dist:"148 a.l.",   spectral:"G7 IIIa",           mass:"—",        radius:"—",        type:"Géante jaune" },
  "zeta-her":  { dist:"35 a.l.",    spectral:"G0 IV",             mass:"1,45 M☉",  radius:"2,6 R☉",   type:"Sous-géante jaune (double à 35 a.l.)" },
  "eta-her":   { dist:"112 a.l.",   spectral:"G7.5 IIIa",         mass:"—",        radius:"—",        type:"Géante jaune-orange" },
  "eps-her":   { dist:"155 a.l.",   spectral:"A0 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  "pi-her":    { dist:"367 a.l.",   spectral:"K3 II",             mass:"—",        radius:"—",        type:"Géante lumineuse orange" },
  "delta-her": { dist:"75 a.l.",    spectral:"A3 IV",             mass:"2,45 M☉",  radius:"2,19 R☉",  type:"Sous-géante blanche" },
  "tau-her":   { dist:"314 a.l.",   spectral:"B5 IV",             mass:"—",        radius:"—",        type:"Géante bleue" },
  "phi-her":   { dist:"235 a.l.",   spectral:"B9 V",              mass:"—",        radius:"—",        type:"Étoile bleue-blanche de la séquence principale" },
  // Scorpius
  antares:     { dist:"553 a.l.",   spectral:"M1.5 Iab–Ib",      mass:"15 M☉",    radius:"700 R☉",   type:"Supergéante rouge" },
  shaula:      { dist:"700 a.l.",   spectral:"B1.5 IV",           mass:"12 M☉",    radius:"—",        type:"Géante bleue" },
  dschubba:    { dist:"401 a.l.",   spectral:"B0.2 IV",           mass:"13 M☉",    radius:"—",        type:"Géante bleue-blanche" },
  acrab:       { dist:"404 a.l.",   spectral:"B1 V + B2 V",      mass:"10+6 M☉",  radius:"—",        type:"Système binaire de géantes bleues" },
  // Pegasus
  markab:      { dist:"140 a.l.",   spectral:"B9 III",            mass:"4,6 M☉",   radius:"4,7 R☉",   type:"Géante bleue-blanche" },
  scheat:      { dist:"196 a.l.",   spectral:"M2.5 II–III",       mass:"2,1 M☉",   radius:"95 R☉",    type:"Géante rouge pulsante" },
  algenib:     { dist:"391 a.l.",   spectral:"B2 IV",             mass:"8,3 M☉",   radius:"4,8 R☉",   type:"Géante bleue à grande vitesse" },
  alpheratz:   { dist:"97 a.l.",    spectral:"B9p",               mass:"3,8 M☉",   radius:"2,7 R☉",   type:"Étoile chimiquement particulière (mercure-manganèse)" },
  // Andromeda
  mirach:      { dist:"197 a.l.",   spectral:"M0 IIIa",           mass:"3,12 M☉",  radius:"100 R☉",   type:"Géante rouge (guide vers M31)" },
  almach:      { dist:"355 a.l.",   spectral:"K3 II + B8 V",     mass:"—",        radius:"—",        type:"Système quadruple — double de contraste" },
  // Corona Borealis
  alphecca:    { dist:"75 a.l.",    spectral:"A0 V + G5 V",      mass:"2,22+0,92 M☉","radius":"3,04+1,0 R☉", type:"Système binaire à éclipses" },
  nusakan:     { dist:"114 a.l.",   spectral:"F0 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  "gamma-crb": { dist:"146 a.l.",   spectral:"A0 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  "delta-crb": { dist:"165 a.l.",   spectral:"G5 III",            mass:"—",        radius:"—",        type:"Géante jaune" },
  "eps-crb":   { dist:"230 a.l.",   spectral:"K2 III",            mass:"—",        radius:"—",        type:"Géante orange" },
  "iota-crb":  { dist:"314 a.l.",   spectral:"A0sp",              mass:"—",        radius:"—",        type:"Étoile chimiquement particulière" },
  // Virgo
  spica:       { dist:"250 a.l.",   spectral:"B1 III-IV + B2 V", mass:"10,25+7,21 M☉","radius":"7,4+3,6 R☉", type:"Système binaire de géantes bleues" },
  porrima:     { dist:"38,6 a.l.",  spectral:"F0 V + F0 V",      mass:"1,56+1,56 M☉","radius":"1,51+1,51 R☉", type:"Binaire visuelle célèbre (Virgo)" },
  vindem:      { dist:"110 a.l.",   spectral:"G8 III",            mass:"2,64 M☉",  radius:"13 R☉",    type:"Géante jaune-orange" },
  "heze-vir":  { dist:"74 a.l.",    spectral:"A3 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  // Leo
  regulus:     { dist:"79 a.l.",    spectral:"B7 V",              mass:"3,8 M☉",   radius:"4,35 R☉",  type:"Étoile bleue-blanche — rotation extrême (317 km/s)" },
  denebola:    { dist:"36,2 a.l.",  spectral:"A3 V",              mass:"1,75 M☉",  radius:"1,73 R☉",  type:"Étoile blanche de la séquence principale" },
  algieba:     { dist:"130 a.l.",   spectral:"K1 III + G7 III",  mass:"—",        radius:"—",        type:"Binaire double — deux géantes colorées" },
  zosma:       { dist:"58,4 a.l.",  spectral:"A4 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  chort:       { dist:"165 a.l.",   spectral:"A2 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  // Sagittarius
  "kaus-aus":  { dist:"143 a.l.",   spectral:"B9.5 III",          mass:"—",        radius:"—",        type:"Géante bleue-blanche" },
  nunki:       { dist:"228 a.l.",   spectral:"B2.5 V",            mass:"7,8 M☉",   radius:"4,5 R☉",   type:"Étoile bleue-blanche de la séquence principale" },
  "kaus-med":  { dist:"348 a.l.",   spectral:"K3 III",            mass:"—",        radius:"—",        type:"Géante orange" },
  ascella:     { dist:"89 a.l.",    spectral:"A2+Am",             mass:"—",        radius:"—",        type:"Système double — étoile Am" },
  // Ophiuchus
  rasalhague:  { dist:"46,7 a.l.",  spectral:"A5 III",            mass:"2,4 M☉",   radius:"2,58 R☉",  type:"Sous-géante blanche" },
  sabik:       { dist:"84 a.l.",    spectral:"A2 V + A2 V",      mass:"—",        radius:"—",        type:"Binaire visuelle d'étoiles A" },
  cebalrai:    { dist:"82 a.l.",    spectral:"K2 III",            mass:"—",        radius:"—",        type:"Géante orange" },
  "yed-prior": { dist:"172 a.l.",   spectral:"M1 III",            mass:"—",        radius:"—",        type:"Géante rouge" },
  "yed-post":  { dist:"108 a.l.",   spectral:"G8 III",            mass:"—",        radius:"—",        type:"Géante jaune" },
  // Draco
  etamin:      { dist:"148 a.l.",   spectral:"K5 III",            mass:"1,72 M☉",  radius:"48 R☉",    type:"Géante orange" },
  rastaban:    { dist:"380 a.l.",   spectral:"G2 II",             mass:"—",        radius:"—",        type:"Géante sous-géante jaune" },
  thuban:      { dist:"303 a.l.",   spectral:"A0 III",            mass:"2,8 M☉",   radius:"4,9 R☉",   type:"Géante blanche — ancienne étoile polaire" },
  grumium:     { dist:"112 a.l.",   spectral:"K2 III",            mass:"—",        radius:"—",        type:"Géante orange" },
  altais:      { dist:"97 a.l.",    spectral:"G9 III",            mass:"—",        radius:"—",        type:"Géante jaune" },
  "iota-dra":  { dist:"103 a.l.",   spectral:"K2 III",            mass:"—",        radius:"—",        type:"Géante orange" },
  "theta-dra": { dist:"69 a.l.",    spectral:"F9 V",              mass:"—",        radius:"—",        type:"Étoile jaune de la séquence principale" },
  // Cepheus
  alderamin:   { dist:"49 a.l.",    spectral:"A7 IV–V",           mass:"1,74 M☉",  radius:"2,31 R☉",  type:"Sous-géante blanche — future étoile polaire" },
  alfirk:      { dist:"595 a.l.",   spectral:"B2 IIIev",          mass:"12 M☉",    radius:"—",        type:"Géante bleue éruptive — Céphéide β" },
  errai:       { dist:"45 a.l.",    spectral:"K1 IV",             mass:"1,18 M☉",  radius:"4,93 R☉",  type:"Sous-géante (système planétaire connu)" },
  // Perseus
  algol:       { dist:"92,8 a.l.",  spectral:"B8 V + K2 IV",     mass:"3,59+0,79 M☉","radius":"2,73+3,48 R☉", type:"Binaire à éclipses — prototype de la classe" },
  mirfak:      { dist:"592 a.l.",   spectral:"F5 Ib",             mass:"8,5 M☉",   radius:"68 R☉",    type:"Supergéante jaune-blanche" },
  // Serpens
  unukalhai:   { dist:"73,4 a.l.",  spectral:"K2 IIIa",           mass:"2,51 M☉",  radius:"13 R☉",    type:"Géante orange" },
  "mu-ser":    { dist:"170 a.l.",   spectral:"F0 V",              mass:"—",        radius:"—",        type:"Étoile blanche de la séquence principale" },
  // Triangulum
  "tria-alpha":{ dist:"64,6 a.l.",  spectral:"F6 IIIn",           mass:"—",        radius:"—",        type:"Étoile jaune-blanche" },
  "tria-beta": { dist:"127 a.l.",   spectral:"A5 III",            mass:"—",        radius:"—",        type:"Géante blanche" },
  // Canes Venatici
  "cor-caroli":{ dist:"110 a.l.",   spectral:"Ap + F0 V",         mass:"—",        radius:"—",        type:"Étoile chimiquement particulière — double" },
  chara:       { dist:"27,2 a.l.",  spectral:"G0 V",              mass:"1,03 M☉",  radius:"1,09 R☉",  type:"Analogue solaire (ressemble au Soleil)" },
  // Coma Berenices
  diadem:      { dist:"58,1 a.l.",  spectral:"F5 V + F5 V",      mass:"—",        radius:"—",        type:"Binaire physique — deux étoiles F" },
  "beta-com":  { dist:"29,9 a.l.",  spectral:"F9.5 V",            mass:"1,15 M☉",  radius:"1,11 R☉",  type:"Analogue solaire proche" },
  "gamma-com": { dist:"170 a.l.",   spectral:"K1 III",            mass:"—",        radius:"—",        type:"Géante orange" },
  // Winter stars
  sirius:      { dist:"8,60 a.l.",  spectral:"A1 V",              mass:"2,02 M☉",  radius:"1,71 R☉",  type:"Étoile blanche de la séquence principale" },
  betelgeuse:  { dist:"700 a.l.",   spectral:"M1–M2 Ia",          mass:"15–20 M☉", radius:"900–1 500 R☉", type:"Supergéante rouge — candidate supernova" },
  rigel:       { dist:"860 a.l.",   spectral:"B8 Ia",             mass:"21 M☉",    radius:"78 R☉",    type:"Supergéante bleue" },
  capella:     { dist:"42,9 a.l.",  spectral:"G3 + G0 Ia",        mass:"2,57+2,69 M☉","radius":"11,98+8,83 R☉", type:"Binaire de géantes jaunes" },
  procyon:     { dist:"11,46 a.l.", spectral:"F5 IV–V",           mass:"1,50 M☉",  radius:"2,05 R☉",  type:"Sous-géante jaune-blanche" },
  castor:      { dist:"51,5 a.l.",  spectral:"A2 V × 2 + M",     mass:"2,76+2,98 M☉","radius":"2,09+1,73 R☉", type:"Système sextuple" },
  pollux:      { dist:"33,8 a.l.",  spectral:"K0 III",            mass:"1,91 M☉",  radius:"8,8 R☉",   type:"Géante orange (exoplanète confirmée)" },
  aldebaran:   { dist:"65,1 a.l.",  spectral:"K5 III",            mass:"1,16 M☉",  radius:"44,2 R☉",  type:"Géante rouge" },
  elnath:      { dist:"134 a.l.",   spectral:"B7 III",            mass:"5,0 M☉",   radius:"4,7 R☉",   type:"Géante bleue-blanche" },
  bellatrix:   { dist:"250 a.l.",   spectral:"B2 V",              mass:"7,7 M☉",   radius:"5,75 R☉",  type:"Géante bleue-blanche" },
  alnilam:     { dist:"2 000 a.l.", spectral:"B0 Ia",             mass:"40 M☉",    radius:"42 R☉",    type:"Supergéante bleue (baudrier d'Orion)" },
  alnitak:     { dist:"1 200 a.l.", spectral:"O9.7 Ib + B1 V",   mass:"33+14 M☉", radius:"20+7 R☉",  type:"Supergéante bleue — système triple" },
  mintaka:     { dist:"900 a.l.",   spectral:"O9.5 II + B1 V",   mass:"24+20 M☉", radius:"—",        type:"Système multiple de supergéantes bleues" },
  saiph:       { dist:"650 a.l.",   spectral:"B0.5 III",          mass:"15,5 M☉",  radius:"22 R☉",    type:"Géante bleue (pied d'Orion)" },
  fomalhaut:   { dist:"25,1 a.l.",  spectral:"A3 V",              mass:"1,92 M☉",  radius:"1,84 R☉",  type:"Étoile blanche — premier disque de débris imagé" },
};

// ─── Hand-written prose for the 20 most notable stars ────────────────────────
const _PROSE = {
  sirius: [
    "Sirius, l'Étoile du Chien, est l'astre le plus brillant du ciel nocturne avec une magnitude de −1,46. Sa proximité remarquable — 8,6 années-lumière, neuvième étoile la plus proche — explique en grande partie son éclat. Les anciens Égyptiens lui accordaient une importance capitale : son lever héliaque coïncidait avec les crues du Nil.",
    "C'est en réalité un système double : Sirius A, étoile blanche deux fois plus massive que le Soleil, accompagnée de Sirius B, une naine blanche de la taille de la Terre mais presque aussi massive que le Soleil — vestige d'une étoile qui a épuisé son combustible il y a environ 120 millions d'années.",
    "Aux jumelles, Sirius scintille avec une extrême vivacité aux basses altitudes, produisant des éclairs de toutes les couleurs. Ce phénomène est dû à la dispersion atmosphérique accentuée par la magnitude très élevée de l'étoile."
  ],
  betelgeuse: [
    "Bételgeuse est l'une des étoiles les plus grandes et les plus lumineuses de notre galaxie. Avec un rayon estimé entre 700 et 1 500 fois celui du Soleil, si elle était placée à la position de notre étoile, elle engloutirait l'orbite de Jupiter. Supergéante rouge de type M, elle brille d'une couleur orangée inconfondable à l'épaule gauche d'Orion.",
    "À une distance d'environ 700 années-lumière, Bételgeuse est une étoile en fin de vie dont la luminosité varie irrégulièrement sur des cycles de plusieurs années. Son effondrement en supernova est attendu dans un futur astronomique — mais pas imminent à l'échelle humaine. Elle brillerait alors comme la Lune pleine, visible en plein jour.",
    "En 2019–2020, une obscurcissement spectaculaire de son éclat — la <em>Grande Diminution</em> — a suscité un vif engouement scientifique. Il s'est avéré résulter d'une éjection de masse ayant formé un nuage de poussière occultant partiellement l'étoile."
  ],
  rigel: [
    "Rigel, pied gauche d'Orion, est une supergéante bleue de magnitude 0,13, la sixième étoile la plus brillante du ciel. Sa luminosité intrinsèque est phénoménale : environ 120 000 fois celle du Soleil. À 860 années-lumière, si elle était à la distance de Sirius, elle brillerait comme un croissant de lune.",
    "Sa surface à 12 000 K lui confère cette teinte bleu-blanc caractéristique des étoiles les plus chaudes et les plus jeunes — elle n'a que quelques millions d'années. Comme Bételgeuse, elle finira en supernova ; sa masse de 21 masses solaires en fait une candidate probable à l'effondrement en trou noir.",
    "Rigel est aussi un système multiple : Rigel B, visible au télescope à 9 secondes d'arc, est elle-même une binaire spectroscopique de deux étoiles bleues moins massives."
  ],
  aldebaran: [
    "Aldébaran, l'œil rouge du Taureau, est une géante orange de type K5 III, 65 fois plus grande que le Soleil. Sa couleur rojiza chaude se distingue facilement à l'œil nu, en particulier lors de son passage au méridien en hiver. Son nom est arabe : Al Dabarān, « le suiveur » — il suit les Pléiades dans leur course nocturne.",
    "Malgré son aspect massif dans le ciel, Aldébaran n'est qu'à 65 années-lumière — une distance modeste — et sa faible masse (1,16 M☉) trahit une étoile similaire au Soleil ayant gonflé en géante après avoir épuisé son hydrogène central.",
    "Sa position sur l'écliptique en fait une étoile régulièrement occultée par la Lune. Ces occultations, spectaculaires car l'étoile disparaît brusquement derrière le bord sombre lunaire, permettent de mesurer son diamètre angulaire avec précision."
  ],
  arcturus: [
    "Arcturus est l'étoile la plus brillante de l'hémisphère nord et la quatrième du ciel entier, avec une magnitude de −0,05. Géante orange de type K1.5, elle est 25 fois plus grande que le Soleil et brille 170 fois plus fort. À 37 années-lumière, c'est l'une des géantes les plus proches de nous.",
    "Ce qui rend Arcturus scientifiquement remarquable est sa cinématique : elle appartient au <em>courant d'Arcturus</em>, un groupe d'étoiles se déplaçant dans une direction différente du disque galactique — probablement des étoiles capturées lors d'une ancienne fusion avec une galaxie naine.",
    "Son mouvement propre est l'un des plus élevés des étoiles brillantes : en 150 000 ans, elle quittera la constellation du Bouvier. En 1933, c'est elle qui inaugura l'Exposition universelle de Chicago — sa lumière, collectée par des télescopes, alluma les projecteurs de l'événement."
  ],
  deneb: [
    "Deneb, la queue du Cygne, est l'une des étoiles les plus lumineuses de notre galaxie. À environ 2 600 années-lumière — soit près de 100 fois plus loin que Véga — sa luminosité intrinsèque est estimée à 200 000 fois celle du Soleil. Si elle était à la distance de Sirius, elle brillerait comme la Lune pleine.",
    "Supergéante bleue-blanche de type A2 Ia, Deneb possède un rayon d'environ 200 rayons solaires. C'est l'une des rares étoiles suffisamment brillantes pour avoir une luminosité estimée malgré l'incertitude sur sa distance exacte, encore débattue entre 2 000 et 3 000 années-lumière.",
    "Avec Véga et Altaïr, elle forme le <em>Triangle d'été</em>, repère incontournable du ciel boréal de juillet à octobre. Deneb sera l'étoile polaire dans environ 9 000 ans, grâce à la précession des équinoxes."
  ],
  altair: [
    "Altaïr, l'aigle volant, est l'étoile la plus proche du Triangle d'été : à seulement 16,7 années-lumière, c'est la douzième étoile la plus proche connue. Sa magnitude de 0,77 en fait l'une des dix plus brillantes du ciel nocturne.",
    "Altaïr tourne sur elle-même à la vitesse prodigieuse de 286 km/s à son équateur — soit une rotation complète en neuf heures, contre 25 jours pour le Soleil. Cette rotation est si rapide qu'elle déforme l'étoile en un ellipsoïde aplati : son rayon équatorial est 20 % plus grand que son rayon polaire, fait confirmé par interférométrie en 2006.",
    "De type spectral A7 V, Altaïr est 11 fois plus lumineuse que le Soleil mais deux fois moins ancienne. Son intense rotation entraîne un assombrissement polaire caractéristique : ses pôles, moins distants du centre, apparaissent plus chauds et plus brillants que son équateur bombé."
  ],
  spica: [
    "Spica est la quinzième étoile la plus brillante du ciel (magnitude 0,98) et l'étoile principale de la Vierge. C'est un système binaire serré de deux géantes bleues en orbite mutuelle en seulement quatre jours — si proches que les forces de marée les déforment en ellipsoïdes allongés l'une vers l'autre.",
    "Ses deux composantes (B1 III-IV et B2 V) ont des masses combinées de plus de 17 masses solaires. Ce couple est si compact qu'il n'est pas séparable visuellement — seule la spectroscopie révèle la dualité. La déformation tidale fait que Spica est légèrement variable.",
    "Hipparque aurait utilisé Spica vers 127 av. J.-C. pour découvrir la précession des équinoxes en comparant sa position à celle notée 150 ans plus tôt. L'étoile se trouve à 250 années-lumière dans la direction du centre de la Voie Lactée."
  ],
  procyon: [
    "Procyon, l'étoile du Petit Chien, est la huitième plus brillante du ciel (magnitude 0,34) et l'une des plus proches : 11,46 années-lumière. Son nom grec signifie « avant le chien » — elle se lève avant Sirius, l'étoile du Grand Chien.",
    "Comme Sirius, Procyon est un système double : Procyon A, sous-géante jaune-blanche de type F5 IV-V, accompagnée de Procyon B, une naine blanche peu lumineuse découverte en 1896. La naine blanche complète une orbite en 40,82 ans.",
    "Procyon A est en train de quitter la séquence principale et de gonfler — dans quelques dizaines de millions d'années, elle deviendra une géante rouge. En hiver, avec Sirius et Bételgeuse, elle forme le <em>Triangle d'hiver</em>, l'un des astérismes les plus faciles à identifier."
  ],
  pollux: [
    "Pollux est la plus brillante étoile des Gémeaux, bien que sa désignation Bayer soit β (bêta). Géante orange de type K0 III, elle est 34 fois plus grande que le Soleil et 34 fois plus lumineuse, située à seulement 34 années-lumière.",
    "En 2006, la découverte d'une exoplanète en orbite autour de Pollux a fait de cette étoile l'une des géantes les plus proches avec un système planétaire confirmé. La planète, Pollux b (aussi nommée Thestias), est une géante gazeuse de 2,3 masses de Jupiter, orbitant à 1,6 UA en environ 590 jours.",
    "Avec Castor, son jumeau apparent, Pollux forme la tête des Gémeaux. Castor est à 51 années-lumière et Pollux à 34 — ils ne sont pas physiquement liés mais nous semblent proches en projection sur la sphère céleste."
  ],
  castor: [
    "Castor est l'un des systèmes stellaires les plus complexes connus à l'œil nu : ce qui semble une étoile unique est en réalité six étoiles liées gravitationnellement. Les trois composantes principales visibles au télescope — Castor A, B et C — sont elles-mêmes chacune une binaire spectroscopique.",
    "Castor A et B sont deux étoiles blanches A2 séparées d'environ 3 secondes d'arc, révélées pour la première fois par James Pound en 1718 — l'une des toutes premières doubles visuelles mesurées. Castor C, alias YY Gem, est une binaire à éclipses de deux étoiles M rouges.",
    "Bien que nominalement « α » des Gémeaux, Castor est moins brillante que Pollux (β Gem) — une erreur historique de désignation. En hiver, la paire Castor-Pollux est l'un des spectacles les plus marquants du ciel : deux étoiles côte à côte, l'une blanche, l'autre orangée."
  ],
  regulus: [
    "Régulus, cœur du Lion, est la vingt-deuxième étoile la plus brillante du ciel et l'une des quatre étoiles royales de l'Antiquité. Étoile bleue-blanche de type B7 V, elle tourne à 317 km/s à son équateur — si vite que son équateur est 32 % plus large que ses pôles.",
    "Cette rotation extrême est proche de la vitesse de rupture — au-delà, l'étoile se disloquerait. Ses pôles, plus chauds, rayonnent fortement en ultraviolet, tandis que son équateur bombé est plus froid. Si Régulus tournait seulement 16 % plus vite, elle se décomposerait.",
    "La position de Régulus très proche de l'écliptique en fait une étoile fréquemment occultée par la Lune et, plus rarement, par des planètes et des astéroïdes. Mesurant son diamètre angulaire lors de ces occultations est une technique précieuse en astronomie stellaire."
  ],
  fomalhaut: [
    "Fomalhaut, l'unique étoile brillante du Poisson austral, est surtout connue pour son impressionnant anneau de débris — un vaste disque de poussières et de glaces s'étendant de 133 à 158 UA, imagé pour la première fois par le télescope Hubble en 2008.",
    "Dans cet anneau, une source de lumière baptisée <em>Fomalhaut b</em> a d'abord été annoncée comme le premier exoplanète directement imagé en lumière visible. Des observations ultérieures ont montré que cette source disparaissait progressivement — il s'agirait plutôt d'un nuage d'expansion rapide, résidu d'une collision entre objets de la ceinture de Kuiper du système.",
    "Fomalhaut se trouve à 25 années-lumière, et malgré sa magnitude de 1,16, elle reste difficile à observer depuis les latitudes tempérées boréales : à Paris ou Bruxelles, elle ne dépasse guère 10–15° au-dessus de l'horizon sud en automne."
  ],
  algol: [
    "Algol, l'Étoile du Démon (de l'arabe Râs al-Ghûl, « la tête de l'ogre »), est l'étoile variable la plus connue et le prototype d'une classe entière d'étoiles : les binaires à éclipses de type Algol. Sa luminosité chute d'une magnitude tous les 2,87 jours lorsque la composante plus froide (K2 IV) passe devant la principale (B8 V).",
    "Cette variabilité était probablement connue de l'Égypte ancienne — un papyrus du Caire daterait les cycles d'Algol avec une précision surprenante. Elle a été expliquée scientifiquement par John Goodricke en 1783, qui proposa l'hypothèse de l'éclipse et reçut la médaille Copley.",
    "Le système est en réalité triple : une troisième étoile gravite en 1,86 an autour de la paire centrale. Cette configuration a permis à l'astrophysique moderne d'étudier le transfert de masse entre les deux composantes principales — Algol est un laboratoire idéal pour la physique des étoiles doubles."
  ],
  mizar: [
    "Mizar (ζ UMa) est historiquement la première étoile double reconnue comme telle. Benedetto Castelli aurait été le premier à noter sa duplicité vers 1617, suivie par Giovanni Battista Riccioli en 1650. Elle est aussi la première étoile dont une photographie a révélé la nature binaire spectroscopique, en 1889.",
    "Visible à l'œil nu, Mizar forme un couple apparent avec Alcor, séparée de 12 minutes d'arc. On croyait longtemps cette association purement optique, mais des mesures récentes suggèrent qu'Alcor fait partie du système. Mizar elle-même est une binaire visuelle (A et B, séparées d'environ 14 secondes d'arc), chacune étant à son tour une binaire spectroscopique — quatre étoiles au total.",
    "Ce système quadruple à 83 années-lumière est un symbole de la complexité cachée derrière les étoiles en apparence solitaires du ciel."
  ],
  albireo: [
    "Albireo (β Cygni) est unanimement considérée comme la plus belle étoile double à observer au télescope. Elle compose une paire dont le contraste de couleurs est exceptionnel : une géante orange vif (K3 II, magnitude 3,4) et une étoile bleue (B8-9 V, magnitude 5,1) séparées de 34 secondes d'arc, bien résolubles à faible grossissement.",
    "La nature physique de cette paire est longtemps restée débattue : s'agit-il d'un système réellement lié ou d'une simple association optique ? Les mesures de distance récentes (Gaia) semblent indiquer une distance légèrement différente pour chaque composante, suggérant une association de hasard plutôt qu'une orbite commune.",
    "Qu'elle soit physique ou non, Albireo reste le test préféré des astronomes amateurs pour juger la qualité optique d'un instrument : la séparation angulaire est aisée, mais la beauté du contraste bleu-orange est le vrai sujet."
  ],
  thuban: [
    "Thuban (α Draconis) est célèbre pour une seule raison astronomique : elle fut l'étoile polaire de la Terre vers 2700 avant J.-C., à l'époque de la construction des pyramides d'Égypte. On a même supposé que certains puits des pyramides de Gizeh étaient orientés vers elle.",
    "Ce déplacement du pôle est dû à la précession des équinoxes : l'axe de rotation terrestre décrit un cercle complet en environ 26 000 ans, balayant différentes étoiles comme étoile polaire. Thuban ne détient plus ce rôle — Polaris est désormais à moins d'un degré du pôle — et n'y reviendra pas avant environ 21 000 ans.",
    "Géante blanche de type A0 III à 303 années-lumière, Thuban est de magnitude 3,65 — bien moins éclatante que Polaris. Ce fait illustre que les étoiles polaires du passé ou du futur ne sont pas nécessairement plus brillantes que celles de leur époque."
  ],
  antares: [
    "Antarès, cœur du Scorpion, est l'une des étoiles les plus imposantes de notre galaxie. Son rayon d'environ 700 rayons solaires — certaines estimations atteignent 1 500 R☉ — en fait l'une des plus grandes étoiles mesurées. Placée au centre du Système solaire, elle engloutirait l'orbite de Jupiter.",
    "Son nom grec signifie « rival d'Arès » (rival de Mars) — sa couleur orangée-rouge est si similaire à celle de la planète rouge que les observateurs anciens s'y confondaient parfois, surtout lors des conjonctions. Supergéante rouge de type M1.5 Iab, Antarès finira en supernova dans un futur cosmique proche.",
    "En 2017, des observations interférométriques ont révélé une structure atmosphérique complexe : une enveloppe étendue, irrégulière et turbulente, plus de 2,5 fois le rayon de l'étoile elle-même. Antarès perd constamment de la matière sous forme de vents stellaires intenses."
  ],
  capella: [
    "Capella (magnitude 0,08) est la sixième étoile la plus brillante du ciel et la plus brillante de la constellation du Cocher. À 43 années-lumière, elle brille d'autant plus qu'elle est en réalité la somme de deux géantes jaunes de type G, presque identiques, en orbite mutuelle en 104 jours.",
    "Les deux composantes de Capella — Capella Aa (G3 Ia, 2,57 M☉) et Ab (G0 IIIa, 2,69 M☉) — ressemblent à ce que deviendra notre Soleil dans quelques milliards d'années : des géantes ayant épuisé leur hydrogène central et gonflé. Le système présente aussi deux naines rouges satellites (Capella H et L), beaucoup moins lumineuses.",
    "Capella est l'une des étoiles les plus brillantes à passer au zénith depuis les latitudes européennes, ce qui la rend circumpolaire depuis la France ou la Belgique — elle ne se couche jamais sous l'horizon."
  ],
};

// ─── Generate atlas entries for all named stars not already present ───────────
const _starEntries = NAMED_STARS_REAL
  .filter(s => !_existingIds.has(s.id))
  .map(s => {
    const d = _STAR_DATA[s.id] || {};
    const prose = _PROSE[s.id] || [
      `${s.name} (${s.bayer}) est une étoile de la constellation ${_CONST_FR[s.constellation] || s.constellation}, de magnitude ${s.mag.toFixed(2)}. Type spectral : ${d.spectral || "—"}. Distance : ${d.dist || "inconnue"}.`,
    ];
    return {
      id: s.id,
      cat: "Étoile",
      name: s.name,
      bayer: s.bayer,
      constellation: _CONST_FR[s.constellation] || s.constellation,
      type: d.type || "Étoile",
      distance: d.dist || "—",
      magnitude: s.mag.toFixed(2),
      rightAscension: _raHMS(s.ra),
      declination: _decDMS(s.dec),
      spectral: d.spectral || "—",
      mass: d.mass || "—",
      radius: d.radius || "—",
      ra: s.ra,
      dec: s.dec,
      color: s.color,
      prose,
    };
  });

window.ATLAS_ENTRIES = [...window.ATLAS_ENTRIES, ..._starEntries];
