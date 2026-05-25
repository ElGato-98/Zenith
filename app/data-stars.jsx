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

// Add one entry per named star not already present
const _starEntries = NAMED_STARS_REAL
  .filter(s => !_existingIds.has(s.id))
  .map(s => ({
    id: s.id,
    cat: "Étoile",
    name: s.name,
    bayer: s.bayer,
    constellation: _CONST_FR[s.constellation] || s.constellation,
    type: "Étoile",
    distance: "—",
    magnitude: s.mag.toFixed(2),
    rightAscension: _raHMS(s.ra),
    declination: _decDMS(s.dec),
    spectral: "—",
    ra: s.ra,
    dec: s.dec,
    color: s.color,
    prose: [`${s.name} (${s.bayer}) est une étoile de la constellation ${_CONST_FR[s.constellation] || s.constellation}, de magnitude ${s.mag.toFixed(2)}.`]
  }));

window.ATLAS_ENTRIES = [...window.ATLAS_ENTRIES, ..._starEntries];
