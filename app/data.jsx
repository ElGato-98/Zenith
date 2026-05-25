/* ============================================================
   ZÉNITH — DATA
   Star catalog (synthetic but plausible), constellations,
   tonight's events, atlas entries with wiki-style prose.
   All exposed on window so other Babel scripts can reach them.
   ============================================================ */

// Star catalog. Coordinates are stored as (az, alt) in degrees —
// not real astronomy; chosen for an attractive composition.
// az=0 is North, increases clockwise (E=90, S=180, W=270).
// alt is degrees above horizon (0 = horizon, 90 = zenith).
const NAMED_STARS = [
  // Lyra
  { id: "vega",      name: "Véga",       bayer: "α Lyrae",         az: 142, alt: 62, mag: 0.03, color: "#cfd6e8", constellation: "lyra" },
  { id: "sheliak",   name: "Sheliak",    bayer: "β Lyrae",         az: 138, alt: 56, mag: 3.5,  color: "#e0dac8", constellation: "lyra" },
  { id: "sulafat",   name: "Sulafat",    bayer: "γ Lyrae",         az: 146, alt: 56, mag: 3.2,  color: "#e0dac8", constellation: "lyra" },
  { id: "delta-lyr", name: "δ Lyrae",    bayer: "δ Lyrae",         az: 150, alt: 60, mag: 4.2,  color: "#e0dac8", constellation: "lyra" },
  { id: "zeta-lyr",  name: "ζ Lyrae",    bayer: "ζ Lyrae",         az: 144, alt: 58, mag: 4.3,  color: "#e0dac8", constellation: "lyra" },

  // Cygnus
  { id: "deneb",     name: "Deneb",      bayer: "α Cygni",         az: 175, alt: 70, mag: 1.25, color: "#e0e6f0", constellation: "cygnus" },
  { id: "sadr",      name: "Sadr",       bayer: "γ Cygni",         az: 178, alt: 58, mag: 2.20, color: "#e0dac8", constellation: "cygnus" },
  { id: "gienah",    name: "Gienah",     bayer: "ε Cygni",         az: 188, alt: 52, mag: 2.46, color: "#e8b070", constellation: "cygnus" },
  { id: "delta-cyg", name: "δ Cygni",    bayer: "δ Cygni",         az: 168, alt: 52, mag: 2.87, color: "#e0dac8", constellation: "cygnus" },
  { id: "albireo",   name: "Albireo",    bayer: "β Cygni",         az: 180, alt: 42, mag: 3.10, color: "#e8b070", constellation: "cygnus" },
  { id: "fawaris",   name: "Fawaris",    bayer: "δ Cygni",         az: 168, alt: 64, mag: 2.87, color: "#e0dac8", constellation: "cygnus" },

  // Aquila
  { id: "altair",    name: "Altaïr",     bayer: "α Aquilae",       az: 200, alt: 48, mag: 0.77, color: "#e8e0d0", constellation: "aquila" },
  { id: "tarazed",   name: "Tarazed",    bayer: "γ Aquilae",       az: 198, alt: 53, mag: 2.72, color: "#e8a060", constellation: "aquila" },
  { id: "alshain",   name: "Alshain",    bayer: "β Aquilae",       az: 204, alt: 44, mag: 3.71, color: "#e8e0d0", constellation: "aquila" },

  // Ursa Major (Grande Ourse / casserole)
  { id: "dubhe",     name: "Dubhe",      bayer: "α UMa",           az:  18, alt: 52, mag: 1.79, color: "#e8a060", constellation: "ursamajor" },
  { id: "merak",     name: "Merak",      bayer: "β UMa",           az:  22, alt: 46, mag: 2.37, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "phecda",    name: "Phecda",     bayer: "γ UMa",           az:  32, alt: 44, mag: 2.44, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "megrez",    name: "Megrez",     bayer: "δ UMa",           az:  36, alt: 50, mag: 3.31, color: "#e0dac8", constellation: "ursamajor" },
  { id: "alioth",    name: "Alioth",     bayer: "ε UMa",           az:  46, alt: 54, mag: 1.77, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "mizar",     name: "Mizar",      bayer: "ζ UMa",           az:  56, alt: 56, mag: 2.27, color: "#cfd6e8", constellation: "ursamajor" },
  { id: "alkaid",    name: "Alkaïd",     bayer: "η UMa",           az:  64, alt: 56, mag: 1.86, color: "#cfd6e8", constellation: "ursamajor" },

  // Polaris + Ursa Minor
  { id: "polaris",   name: "Polaris",    bayer: "α UMi",           az:   0, alt: 49, mag: 1.98, color: "#e8e0d0", constellation: "ursaminor" },
  { id: "kochab",    name: "Kochab",     bayer: "β UMi",           az:  18, alt: 64, mag: 2.07, color: "#e8a060", constellation: "ursaminor" },
  { id: "pherkad",   name: "Pherkad",    bayer: "γ UMi",           az:  22, alt: 70, mag: 3.00, color: "#e0dac8", constellation: "ursaminor" },

  // Cassiopée (NE)
  { id: "schedar",   name: "Schedar",    bayer: "α Cas",           az: 318, alt: 56, mag: 2.24, color: "#e8a060", constellation: "cassiopeia" },
  { id: "caph",      name: "Caph",       bayer: "β Cas",           az: 322, alt: 50, mag: 2.27, color: "#e0dac8", constellation: "cassiopeia" },
  { id: "gamma-cas", name: "Tsih",       bayer: "γ Cas",           az: 326, alt: 60, mag: 2.15, color: "#cfd6e8", constellation: "cassiopeia" },
  { id: "ruchbah",   name: "Ruchbah",    bayer: "δ Cas",           az: 330, alt: 56, mag: 2.66, color: "#e0dac8", constellation: "cassiopeia" },
  { id: "segin",     name: "Segin",      bayer: "ε Cas",           az: 334, alt: 64, mag: 3.35, color: "#cfd6e8", constellation: "cassiopeia" },

  // Boötes
  { id: "arcturus",  name: "Arcturus",   bayer: "α Boötis",        az:  82, alt: 38, mag: -0.05, color: "#e8a060", constellation: "bootes" },
  { id: "izar",      name: "Izar",       bayer: "ε Boötis",        az:  88, alt: 50, mag: 2.37,  color: "#e8a060", constellation: "bootes" },

  // Hercules
  { id: "rasalgethi", name: "Rasalgethi", bayer: "α Herculis",     az: 110, alt: 48, mag: 3.06, color: "#e8a060", constellation: "hercules" },
  { id: "kornephoros",name: "Kornephoros",bayer: "β Herculis",     az: 116, alt: 56, mag: 2.78, color: "#e8a060", constellation: "hercules" },

  // Scorpius (low S)
  { id: "antares",   name: "Antarès",    bayer: "α Scorpii",       az: 192, alt: 14, mag: 1.06, color: "#e85c3e", constellation: "scorpius" },

  // Pegasus (faraway E)
  { id: "markab",    name: "Markab",     bayer: "α Pegasi",        az: 244, alt: 32, mag: 2.49, color: "#cfd6e8", constellation: "pegasus" },
  { id: "scheat",    name: "Scheat",     bayer: "β Pegasi",        az: 248, alt: 40, mag: 2.42, color: "#e8a060", constellation: "pegasus" },
  { id: "algenib",   name: "Algenib",    bayer: "γ Pegasi",        az: 256, alt: 30, mag: 2.83, color: "#e0dac8", constellation: "pegasus" },
  { id: "alpheratz", name: "Alphératz",  bayer: "α And",           az: 260, alt: 40, mag: 2.06, color: "#cfd6e8", constellation: "pegasus" },

  // Andromède
  { id: "mirach",    name: "Mirach",     bayer: "β And",           az: 278, alt: 22, mag: 2.05, color: "#e8a060", constellation: "andromeda" },
  { id: "almach",    name: "Almach",     bayer: "γ And",           az: 290, alt: 18, mag: 2.10, color: "#e8a060", constellation: "andromeda" },

  // Couronne Boréale
  { id: "alphecca",  name: "Alphecca",   bayer: "α CrB",           az: 102, alt: 58, mag: 2.23, color: "#cfd6e8", constellation: "corona" },
  { id: "nusakan",   name: "Nusakan",    bayer: "β CrB",           az:  98, alt: 60, mag: 3.66, color: "#e0dac8", constellation: "corona" },
  { id: "gamma-crb", name: "γ CrB",      bayer: "γ CrB",           az: 105, alt: 60, mag: 3.84, color: "#e0dac8", constellation: "corona" },
  { id: "delta-crb", name: "δ CrB",      bayer: "δ CrB",           az: 108, alt: 58, mag: 4.59, color: "#e0dac8", constellation: "corona" },
  { id: "eps-crb",   name: "ε CrB",      bayer: "ε CrB",           az: 110, alt: 56, mag: 4.13, color: "#e0dac8", constellation: "corona" },
  { id: "iota-crb",  name: "ι CrB",      bayer: "ι CrB",           az:  95, alt: 56, mag: 4.99, color: "#e0dac8", constellation: "corona" },

  // Vierge
  { id: "spica",     name: "Spica",      bayer: "α Vir",           az: 200, alt: 22, mag: 0.98, color: "#cfd6e8", constellation: "virgo" },
  { id: "porrima",   name: "Porrima",    bayer: "γ Vir",           az: 215, alt: 30, mag: 2.74, color: "#e0dac8", constellation: "virgo" },
  { id: "vindem",    name: "Vindémiatrix",bayer:"ε Vir",           az: 222, alt: 38, mag: 2.85, color: "#e8a060", constellation: "virgo" },
  { id: "heze-vir",  name: "Heze",       bayer: "ζ Vir",           az: 208, alt: 28, mag: 3.38, color: "#e0dac8", constellation: "virgo" },

  // Lion (couchant W)
  { id: "regulus",   name: "Régulus",    bayer: "α Leo",           az: 268, alt: 16, mag: 1.35, color: "#cfd6e8", constellation: "leo" },
  { id: "denebola",  name: "Denebola",   bayer: "β Leo",           az: 250, alt: 32, mag: 2.14, color: "#cfd6e8", constellation: "leo" },
  { id: "algieba",   name: "Algieba",    bayer: "γ Leo",           az: 258, alt: 24, mag: 2.08, color: "#e8a060", constellation: "leo" },
  { id: "zosma",     name: "Zosma",      bayer: "δ Leo",           az: 254, alt: 30, mag: 2.56, color: "#e0dac8", constellation: "leo" },
  { id: "chort",     name: "Chort",      bayer: "θ Leo",           az: 252, alt: 28, mag: 3.34, color: "#e0dac8", constellation: "leo" },

  // Sagittaire (basse S — la théière)
  { id: "kaus-aus",  name: "Kaus Australis",bayer:"ε Sgr",         az: 188, alt:  6, mag: 1.85, color: "#cfd6e8", constellation: "sagittarius" },
  { id: "nunki",     name: "Nunki",      bayer: "σ Sgr",           az: 196, alt: 12, mag: 2.05, color: "#cfd6e8", constellation: "sagittarius" },
  { id: "kaus-med",  name: "Kaus Media", bayer: "δ Sgr",           az: 186, alt: 10, mag: 2.72, color: "#e8a060", constellation: "sagittarius" },
  { id: "ascella",   name: "Ascella",    bayer: "ζ Sgr",           az: 198, alt:  8, mag: 2.59, color: "#e0dac8", constellation: "sagittarius" },

  // Scorpion (déjà antares)
  { id: "shaula",    name: "Shaula",     bayer: "λ Sco",           az: 198, alt:  4, mag: 1.62, color: "#cfd6e8", constellation: "scorpius" },
  { id: "dschubba",  name: "Dschubba",   bayer: "δ Sco",           az: 186, alt: 18, mag: 2.32, color: "#cfd6e8", constellation: "scorpius" },
  { id: "acrab",     name: "Acrab",      bayer: "β Sco",           az: 184, alt: 20, mag: 2.62, color: "#cfd6e8", constellation: "scorpius" },

  // Ophiuchus
  { id: "rasalhague",name: "Rasalhague", bayer: "α Oph",           az: 158, alt: 50, mag: 2.08, color: "#e0dac8", constellation: "ophiuchus" },
  { id: "sabik",     name: "Sabik",      bayer: "η Oph",           az: 164, alt: 32, mag: 2.43, color: "#e0dac8", constellation: "ophiuchus" },
  { id: "cebalrai",  name: "Céblalraï",  bayer: "β Oph",           az: 158, alt: 44, mag: 2.77, color: "#e8a060", constellation: "ophiuchus" },
  { id: "yed-prior", name: "Yed Prior",  bayer: "δ Oph",           az: 144, alt: 26, mag: 2.74, color: "#e8a060", constellation: "ophiuchus" },
  { id: "yed-post",  name: "Yed Posterior",bayer:"ε Oph",          az: 148, alt: 26, mag: 3.23, color: "#e8a060", constellation: "ophiuchus" },

  // Hercule (plus de stars)
  { id: "zeta-her",  name: "ζ Her",      bayer: "ζ Her",           az: 120, alt: 60, mag: 2.81, color: "#e0dac8", constellation: "hercules" },
  { id: "eta-her",   name: "η Her",      bayer: "η Her",           az: 118, alt: 64, mag: 3.53, color: "#e0dac8", constellation: "hercules" },
  { id: "eps-her",   name: "ε Her",      bayer: "ε Her",           az: 122, alt: 56, mag: 3.92, color: "#e0dac8", constellation: "hercules" },
  { id: "pi-her",    name: "π Her",      bayer: "π Her",           az: 124, alt: 58, mag: 3.16, color: "#e0dac8", constellation: "hercules" },
  { id: "delta-her", name: "Sarin",      bayer: "δ Her",           az: 128, alt: 50, mag: 3.14, color: "#e0dac8", constellation: "hercules" },

  // Dragon — méandre
  { id: "etamin",    name: "Étamin",     bayer: "γ Dra",           az: 130, alt: 75, mag: 2.23, color: "#e8a060", constellation: "draco" },
  { id: "rastaban",  name: "Rastaban",   bayer: "β Dra",           az: 132, alt: 72, mag: 2.79, color: "#e8a060", constellation: "draco" },
  { id: "thuban",    name: "Thuban",     bayer: "α Dra",           az:  30, alt: 70, mag: 3.65, color: "#e0dac8", constellation: "draco" },
  { id: "grumium",   name: "Grumium",    bayer: "ξ Dra",           az: 138, alt: 73, mag: 3.75, color: "#e0dac8", constellation: "draco" },
  { id: "altais",    name: "Altais",     bayer: "δ Dra",           az: 100, alt: 78, mag: 3.07, color: "#e8a060", constellation: "draco" },

  // Céphée
  { id: "alderamin", name: "Aldéramin",  bayer: "α Cep",           az: 350, alt: 70, mag: 2.45, color: "#cfd6e8", constellation: "cepheus" },
  { id: "alfirk",    name: "Alfirk",     bayer: "β Cep",           az: 348, alt: 76, mag: 3.23, color: "#cfd6e8", constellation: "cepheus" },
  { id: "errai",     name: "Errai",      bayer: "γ Cep",           az: 358, alt: 64, mag: 3.21, color: "#e8a060", constellation: "cepheus" },

  // Persée (bas N)
  { id: "algol",     name: "Algol",      bayer: "β Per",           az:   0, alt: 18, mag: 2.12, color: "#cfd6e8", constellation: "perseus" },
  { id: "mirfak",    name: "Mirfak",     bayer: "α Per",           az:   8, alt: 22, mag: 1.79, color: "#e0dac8", constellation: "perseus" },

  // Bouvier (plus de stars)
  { id: "nekkar",    name: "Nekkar",     bayer: "β Boö",           az:  92, alt: 60, mag: 3.50, color: "#e8a060", constellation: "bootes" },
  { id: "seginus",   name: "Séginus",    bayer: "γ Boö",           az:  90, alt: 64, mag: 3.03, color: "#cfd6e8", constellation: "bootes" },
  { id: "muphrid",   name: "Muphrid",    bayer: "η Boö",           az:  80, alt: 32, mag: 2.68, color: "#e0dac8", constellation: "bootes" },

  // Aigle (plus de stars)
  { id: "delta-aql", name: "δ Aql",      bayer: "δ Aql",           az: 200, alt: 56, mag: 3.36, color: "#e0dac8", constellation: "aquila" },
  { id: "zeta-aql",  name: "ζ Aql",      bayer: "ζ Aql",           az: 196, alt: 50, mag: 2.99, color: "#e0dac8", constellation: "aquila" },
  { id: "lambda-aql",name: "λ Aql",      bayer: "λ Aql",           az: 208, alt: 40, mag: 3.43, color: "#e0dac8", constellation: "aquila" },

  // Cygne (plus de stars dans la queue)
  { id: "kappa-cyg", name: "κ Cyg",      bayer: "κ Cyg",           az: 154, alt: 70, mag: 3.77, color: "#e0dac8", constellation: "cygnus" },

  // Petite Ourse (compléter)
  { id: "eps-umi",   name: "ε UMi",      bayer: "ε UMi",           az:  10, alt: 72, mag: 4.21, color: "#e0dac8", constellation: "ursaminor" },
  { id: "zeta-umi",  name: "ζ UMi",      bayer: "ζ UMi",           az:   6, alt: 66, mag: 4.32, color: "#e0dac8", constellation: "ursaminor" },
  { id: "eta-umi",   name: "η UMi",      bayer: "η UMi",           az:  16, alt: 60, mag: 4.95, color: "#e0dac8", constellation: "ursaminor" },

  // Serpent
  { id: "unukalhai", name: "Unukalhai",  bayer: "α Ser",           az: 130, alt: 36, mag: 2.63, color: "#e8a060", constellation: "serpens" },
  { id: "mu-ser",    name: "μ Ser",      bayer: "μ Ser",           az: 138, alt: 28, mag: 3.53, color: "#e0dac8", constellation: "serpens" },

  // Triangle / Lacerta — quelques points faibles
  { id: "tria-alpha",name: "α Tri",      bayer: "α Tri",           az: 308, alt: 28, mag: 3.41, color: "#e0dac8", constellation: "triangulum" },
  { id: "tria-beta", name: "β Tri",      bayer: "β Tri",           az: 304, alt: 26, mag: 3.00, color: "#e0dac8", constellation: "triangulum" },

  // ── ZÉNITH (étoiles culminant proches du zénith depuis Lyon en mai 23h)
  { id: "cor-caroli",name: "Cor Caroli", bayer: "α CVn",           az:  72, alt: 82, mag: 2.89, color: "#cfd6e8", constellation: "canesvenatici" },
  { id: "chara",     name: "Chara",      bayer: "β CVn",           az:  78, alt: 80, mag: 4.26, color: "#e0dac8", constellation: "canesvenatici" },
  { id: "diadem",    name: "Diadème",    bayer: "α Com",           az:  90, alt: 80, mag: 4.32, color: "#e0dac8", constellation: "coma" },
  { id: "beta-com",  name: "β Com",      bayer: "β Com",           az:  86, alt: 83, mag: 4.26, color: "#e0dac8", constellation: "coma" },
  { id: "gamma-com", name: "γ Com",      bayer: "γ Com",           az:  88, alt: 78, mag: 4.36, color: "#e0dac8", constellation: "coma" },
  // Draco — tête plus haute encore
  { id: "iota-dra",  name: "ι Dra",      bayer: "ι Dra",           az:  92, alt: 86, mag: 3.29, color: "#e8a060", constellation: "draco" },
  { id: "theta-dra", name: "θ Dra",      bayer: "θ Dra",           az: 110, alt: 84, mag: 4.01, color: "#e0dac8", constellation: "draco" },
  // Hercules upper body
  { id: "tau-her",   name: "τ Her",      bayer: "τ Her",           az: 130, alt: 82, mag: 3.89, color: "#e0dac8", constellation: "hercules" },
  { id: "phi-her",   name: "φ Her",      bayer: "φ Her",           az: 125, alt: 80, mag: 4.23, color: "#e0dac8", constellation: "hercules" },
];

// Constellation line segments (pairs of star ids)
const CONSTELLATION_LINES = {
  lyra: [
    ["vega","sheliak"], ["sheliak","sulafat"], ["sulafat","delta-lyr"],
    ["delta-lyr","zeta-lyr"], ["zeta-lyr","vega"], ["sulafat","zeta-lyr"]
  ],
  cygnus: [
    ["deneb","sadr"], ["sadr","albireo"],
    ["delta-cyg","sadr"], ["sadr","gienah"],
    ["fawaris","sadr"]
  ],
  aquila: [
    ["altair","tarazed"], ["altair","alshain"],
    ["altair","delta-aql"], ["delta-aql","zeta-aql"],
    ["altair","lambda-aql"]
  ],
  ursamajor: [
    ["dubhe","merak"], ["merak","phecda"], ["phecda","megrez"],
    ["megrez","dubhe"], ["megrez","alioth"], ["alioth","mizar"], ["mizar","alkaid"]
  ],
  ursaminor: [
    ["polaris","kochab"], ["kochab","pherkad"],
    ["pherkad","eta-umi"], ["eta-umi","zeta-umi"],
    ["zeta-umi","eps-umi"], ["eps-umi","polaris"]
  ],
  cassiopeia: [
    ["caph","schedar"], ["schedar","gamma-cas"],
    ["gamma-cas","ruchbah"], ["ruchbah","segin"]
  ],
  bootes: [
    ["arcturus","izar"], ["izar","seginus"], ["seginus","nekkar"],
    ["nekkar","izar"], ["arcturus","muphrid"]
  ],
  hercules: [
    ["rasalgethi","kornephoros"], ["kornephoros","zeta-her"],
    ["zeta-her","eta-her"], ["eta-her","pi-her"], ["pi-her","eps-her"],
    ["eps-her","zeta-her"], ["zeta-her","delta-her"]
  ],
  pegasus: [
    ["markab","scheat"], ["scheat","alpheratz"],
    ["alpheratz","algenib"], ["algenib","markab"]
  ],
  andromeda: [
    ["alpheratz","mirach"], ["mirach","almach"]
  ],
  corona: [
    ["alphecca","nusakan"], ["nusakan","iota-crb"],
    ["alphecca","gamma-crb"], ["gamma-crb","delta-crb"],
    ["delta-crb","eps-crb"]
  ],
  virgo: [
    ["spica","heze-vir"], ["heze-vir","porrima"],
    ["porrima","vindem"]
  ],
  leo: [
    ["regulus","algieba"], ["algieba","zosma"],
    ["zosma","denebola"], ["denebola","chort"],
    ["chort","zosma"]
  ],
  sagittarius: [
    ["kaus-aus","kaus-med"], ["kaus-med","nunki"],
    ["nunki","ascella"], ["ascella","kaus-aus"]
  ],
  scorpius: [
    ["acrab","dschubba"], ["dschubba","antares"],
    ["antares","shaula"]
  ],
  ophiuchus: [
    ["rasalhague","cebalrai"], ["cebalrai","sabik"],
    ["sabik","yed-post"], ["yed-post","yed-prior"],
    ["yed-prior","rasalhague"]
  ],
  draco: [
    ["etamin","rastaban"], ["rastaban","grumium"],
    ["grumium","altais"], ["altais","thuban"]
  ],
  cepheus: [
    ["alderamin","alfirk"], ["alfirk","errai"]
  ],
  perseus: [
    ["mirfak","algol"]
  ],
  serpens: [
    ["unukalhai","mu-ser"]
  ],
  triangulum: [
    ["tria-alpha","tria-beta"]
  ],
  canesvenatici: [
    ["cor-caroli","chara"]
  ],
  coma: [
    ["diadem","beta-com"], ["beta-com","gamma-com"]
  ]
};

// Planets visible tonight (positioned for the scene)
const PLANETS = [
  { id: "jupiter", name: "Jupiter", az: 220, alt: 35, mag: -2.1, color: "#e8c894", size: 4.2,
    rise: "21:48", set: "04:12", elev: "35°", constellation: "Taureau",
    blurb: "Plus brillant objet de la nuit après la Lune. À l'œil nu : un point ambré stable. Aux jumelles, on devine les quatre satellites galiléens." },
  { id: "saturn",  name: "Saturne", az: 254, alt: 28, mag: 0.6,  color: "#d8b878", size: 3.2,
    rise: "20:14", set: "02:38", elev: "28°", constellation: "Verseau",
    blurb: "Anneaux visibles aux jumelles à fort grossissement. Apparaît jaune pâle, plus stable que les étoiles." },
  { id: "mars",    name: "Mars",    az: 168, alt: 22, mag: 1.1,  color: "#e85c3e", size: 2.8,
    rise: "22:36", set: "05:48", elev: "22°", constellation: "Cancer",
    blurb: "Point rouge profond, scintillement minime. En opposition rapprochée, sa magnitude peut atteindre −2." },
  { id: "venus",   name: "Vénus",   az: 286, alt:  8, mag: -3.8, color: "#f0e6c8", size: 4.6,
    rise: "—",     set: "20:24", elev: "Couchée", constellation: "Balance",
    blurb: "L'étoile du berger. Visible dans la lueur du crépuscule, à l'ouest. Disparait sous l'horizon vers 20h24." }
];

// ISS pass tonight
const ISS_PASS = {
  start: "23:14", peak: "23:18", end: "23:22",
  startAz: "SO", peakAlt: "62°", endAz: "NE",
  magnitude: -3.2,
  duration: "8 min"
};

// Tonight's astronomical context
const TONIGHT = {
  date: "Lundi 25 mai 2026",
  location: "Lyon, 45.76° N 4.83° E",
  sunset: "21:14", sunrise: "06:08",
  astroDark: "23:02 → 04:20",
  moon: {
    phase: "Gibbeuse croissante",
    illumination: 78,
    rise: "16:42", set: "03:18",
    age: 11.2,
    distance: "382 410 km"
  },
  weather: {
    clouds: 18,   // %
    transparency: 4, // /5
    seeing: 3,    // /5
    bortle: 5,    // light pollution scale (1-9)
    temp: 14,
    humidity: 62
  },
  events: [
    {
      when: "23:14 — 23:22",
      name: "Passage de la Station spatiale internationale",
      detail: "Trajectoire SO → NE, culmination 62°. Visible à l'œil nu.",
      peak: "magnitude −3.2",
      tag: "iss"
    },
    {
      when: "Cette nuit, 02:00 et après",
      name: "Pic des η-Aquarides (post-pic)",
      detail: "Pluie d'étoiles issue de la comète de Halley. Radiant dans l'Aigle, montant après minuit.",
      peak: "≈10 météores/heure",
      tag: "meteors"
    },
    {
      when: "Demain 04:18 — 04:32",
      name: "Conjonction Lune–Saturne",
      detail: "Séparation angulaire 1°48'. Belle paire visible à l'œil nu, plein cadre aux jumelles.",
      peak: "alt. 18° au S-SO",
      tag: "conjunction"
    }
  ]
};

// Atlas — wiki-style entries
const ATLAS_ENTRIES = [
  {
    id: "vega",
    cat: "Étoile",
    name: "Véga",
    bayer: "α Lyrae",
    constellation: "Lyre",
    type: "Étoile blanche de la séquence principale",
    distance: "25,04 a.l.",
    magnitude: "0,03",
    rightAscension: "18h 36m 56s",
    declination: "+38° 47′ 01″",
    spectral: "A0 Va",
    mass: "2,14 M☉",
    radius: "2,36 R☉",
    discovery: "Connue depuis l'Antiquité",
    prose: [
      "Cinquième étoile la plus brillante du ciel et seconde du ciel boréal après Arcturus, Véga forme avec Deneb et Altaïr le grand <em>Triangle d'été</em> qui domine les nuits de juillet à septembre.",
      "C'est l'une des étoiles les mieux étudiées du voisinage solaire : sa rotation rapide la déforme en un ellipsoïde aplati, et un disque de débris décelé en 1983 par le satellite IRAS suggère un système planétaire en formation.",
      "Véga a servi d'étalon pour la définition photométrique de la magnitude zéro, et sera, vers l'an 13 727, l'étoile polaire de l'hémisphère nord par effet de la précession des équinoxes."
    ]
  },
  {
    id: "jupiter",
    cat: "Planète",
    name: "Jupiter",
    bayer: "♃",
    constellation: "Taureau (ce mois)",
    type: "Géante gazeuse",
    distance: "5,2 UA — 778 millions km",
    magnitude: "−2,1",
    rightAscension: "—",
    declination: "—",
    spectral: "—",
    mass: "318 M⊕",
    radius: "11,2 R⊕",
    discovery: "Connue depuis l'Antiquité",
    prose: [
      "Plus massive planète du Système solaire — sa masse dépasse à elle seule celle de toutes les autres réunies. Son atmosphère est composée principalement d'hydrogène et d'hélium, animée de bandes nuageuses parallèles et de tempêtes pluri-séculaires dont la <em>Grande Tache rouge</em>.",
      "Visible à l'œil nu comme le second astre le plus brillant après Vénus dans nos latitudes, Jupiter dévoile aux jumelles ses quatre satellites galiléens — Io, Europe, Ganymède et Callisto — observés pour la première fois par Galilée en 1610.",
      "À l'opposition de septembre, sa distance à la Terre tombe à environ 600 millions de kilomètres, et son disque atteint 50 secondes d'arc, suffisant pour distinguer les principales bandes équatoriales dans une lunette de 60 mm."
    ]
  },
  {
    id: "m31",
    cat: "Galaxie",
    name: "Galaxie d'Andromède",
    bayer: "M 31",
    constellation: "Andromède",
    type: "Galaxie spirale (SA(s)b)",
    distance: "2,537 millions a.l.",
    magnitude: "3,44",
    rightAscension: "00h 42m 44s",
    declination: "+41° 16′ 09″",
    spectral: "—",
    mass: "1,5 × 10¹² M☉",
    radius: "110 000 a.l.",
    discovery: "Observée par Al-Soufi en 964",
    prose: [
      "Plus grande galaxie du Groupe local, M 31 est l'objet le plus lointain visible à l'œil nu — sa lumière, partie il y a deux millions et demi d'années, atteint nos rétines comme une pâle ovale floue dans Andromède.",
      "Elle abriterait environ mille milliards d'étoiles, presque deux fois la population de la Voie lactée. Une rencontre frontale avec notre galaxie est attendue dans quatre milliards d'années.",
      "Dans un ciel campagnard et sans lune, son grand axe couvre près de six fois le diamètre de la Pleine Lune ; aux jumelles 10×50, on devine le bulbe central et la galaxie satellite M 110."
    ]
  },
  {
    id: "orion-nebula",
    cat: "Nébuleuse",
    name: "Nébuleuse d'Orion",
    bayer: "M 42",
    constellation: "Orion",
    type: "Nébuleuse en émission/réflexion",
    distance: "1 344 a.l.",
    magnitude: "4,0",
    rightAscension: "05h 35m 17s",
    declination: "−05° 23′ 28″",
    spectral: "—",
    mass: "2 000 M☉",
    radius: "12 a.l.",
    discovery: "Peiresc, 1610",
    prose: [
      "Nuage moléculaire géant et pouponnière d'étoiles, M 42 est visible à l'œil nu comme la nébulosité du milieu du baudrier d'Orion. C'est l'une des régions de formation stellaire les plus étudiées du ciel.",
      "Son cœur est éclairé par le <em>Trapèze</em>, un amas de jeunes étoiles très chaudes dont le rayonnement ultraviolet ionise l'hydrogène environnant, lui donnant cette teinte rosée caractéristique sur les photographies longue pose.",
      "Aux jumelles, elle apparaît comme une brume verdâtre étendue ; un télescope de 200 mm révèle de fines structures filamentaires et l'amas central."
    ]
  },
  {
    id: "polaris",
    cat: "Étoile",
    name: "Polaris",
    bayer: "α UMi",
    constellation: "Petite Ourse",
    type: "Supergéante jaune Cepheïde",
    distance: "433 a.l.",
    magnitude: "1,98",
    rightAscension: "02h 31m 49s",
    declination: "+89° 15′ 51″",
    spectral: "F7 Ib",
    mass: "5,4 M☉",
    radius: "37,5 R☉",
    discovery: "Connue depuis l'Antiquité",
    prose: [
      "Étoile la plus proche du pôle céleste nord — à moins d'un degré — Polaris semble immobile dans le ciel tandis que l'ensemble de la voûte tourne autour d'elle au cours de la nuit. Sa hauteur au-dessus de l'horizon donne directement la latitude de l'observateur.",
      "Bien que perçue comme une étoile unique à l'œil nu, c'est en réalité un système triple. La composante principale est une Céphéide de très faible amplitude, pulsant d'environ 0,03 magnitude tous les 3,97 jours.",
      "La précession des équinoxes décale lentement l'axe terrestre : Polaris cédera son rôle d'étoile polaire à Errai vers l'an 3000, puis à Aldéramin vers 7500."
    ]
  },
  {
    id: "iss",
    cat: "Satellite",
    name: "Station spatiale internationale",
    bayer: "ISS — ZARYA",
    constellation: "Orbite basse",
    type: "Station habitée — orbite terrestre",
    distance: "≈ 408 km",
    magnitude: "−4 à −0,5",
    rightAscension: "—",
    declination: "—",
    spectral: "—",
    mass: "≈ 420 t",
    radius: "L: 109 m  •  l: 73 m",
    discovery: "Premier module : 20 nov. 1998",
    prose: [
      "Plus grand objet artificiel jamais assemblé en orbite, l'ISS effectue le tour de la Terre en 92 minutes à environ 28 000 km/h. Aux latitudes tempérées, elle est visible à l'aube et au crépuscule, lorsque le sol est dans l'ombre mais que la station est encore éclairée par le Soleil.",
      "Elle traverse alors le ciel d'ouest en est en quelques minutes, sans clignotement, plus brillante que n'importe quelle étoile et souvent que Vénus.",
      "L'application notifie automatiquement les passages dépassant 30° d'altitude depuis votre position."
    ]
  },
  {
    id: "m13",
    cat: "Amas globulaire",
    name: "Grand amas d'Hercule",
    bayer: "M 13",
    constellation: "Hercule",
    type: "Amas globulaire",
    distance: "22 200 a.l.",
    magnitude: "5,8",
    rightAscension: "16h 41m 41s",
    declination: "+36° 27′ 35″",
    spectral: "—",
    mass: "6 × 10⁵ M☉",
    radius: "84 a.l.",
    discovery: "Halley, 1714",
    prose: [
      "Plus bel amas globulaire du ciel boréal, M 13 rassemble plusieurs centaines de milliers d'étoiles vieilles de plus de douze milliards d'années dans une sphère d'une centaine d'années-lumière de diamètre.",
      "Aux jumelles 10×50, il apparaît comme une boule floue ; un télescope de 150 mm commence à le résoudre en étoiles individuelles vers ses bords.",
      "C'est vers lui qu'a été émis, le 16 novembre 1974, le célèbre <em>message d'Arecibo</em> — 1 679 bits de code binaire à destination d'éventuelles civilisations qui le recevront dans environ 25 000 ans."
    ]
  },
  {
    id: "saturn",
    cat: "Planète",
    name: "Saturne",
    bayer: "♄",
    constellation: "Verseau",
    type: "Géante gazeuse à anneaux",
    distance: "9,5 UA",
    magnitude: "0,6",
    rightAscension: "—",
    declination: "—",
    spectral: "—",
    mass: "95 M⊕",
    radius: "9,4 R⊕",
    discovery: "Connue depuis l'Antiquité",
    prose: [
      "Sixième planète du Système solaire, célèbre pour son spectaculaire système d'anneaux composé principalement de glaces et de poussières, large de 280 000 km mais épais de quelques dizaines de mètres seulement.",
      "Visible à l'œil nu comme une étoile jaune pâle au scintillement stable. Une simple lunette de 50 mm grossissant 30 fois suffit à révéler le disque ovale et les anneaux qui le ceignent.",
      "Inclinés à 26,7° par rapport au plan orbital, les anneaux se présentent à nous tantôt par la tranche, tantôt grands ouverts ; ils seront vus presque par la tranche en mars 2025, puis se rouvriront progressivement."
    ]
  }
];

// Preset locations (selected major cities + observatories — Europe francophone et au-delà)
const LOCATIONS = [
  // ─── Belgique ───
  { id: "liege",     name: "Liège",      region: "Wallonie, Belgique",   lat: 50.633, lon:  5.567, bortle: 6 },
  { id: "bruxelles", name: "Bruxelles",  region: "Belgique",             lat: 50.851, lon:  4.351, bortle: 8 },
  { id: "namur",     name: "Namur",      region: "Wallonie",             lat: 50.467, lon:  4.873, bortle: 5 },
  { id: "anvers",    name: "Anvers",     region: "Flandre",              lat: 51.221, lon:  4.402, bortle: 7 },
  { id: "ardennes",  name: "Ardennes belges", region: "Saint-Hubert ·  ciel sombre", lat: 50.029, lon:  5.387, bortle: 3 },

  // ─── France ───
  { id: "paris",     name: "Paris",      region: "Île-de-France",        lat: 48.857, lon:  2.351, bortle: 8 },
  { id: "lyon",      name: "Lyon",       region: "Rhône, France",        lat: 45.764, lon:  4.835, bortle: 5 },
  { id: "marseille", name: "Marseille",  region: "Provence",             lat: 43.296, lon:  5.370, bortle: 7 },
  { id: "toulouse",  name: "Toulouse",   region: "Haute-Garonne",        lat: 43.604, lon:  1.444, bortle: 6 },
  { id: "bordeaux",  name: "Bordeaux",   region: "Gironde",              lat: 44.838, lon: -0.578, bortle: 5 },
  { id: "nice",      name: "Nice",       region: "Côte d'Azur",          lat: 43.710, lon:  7.262, bortle: 7 },
  { id: "rennes",    name: "Rennes",     region: "Bretagne",             lat: 48.117, lon: -1.677, bortle: 5 },
  { id: "strasbourg",name: "Strasbourg", region: "Alsace",               lat: 48.573, lon:  7.752, bortle: 5 },
  { id: "lille",     name: "Lille",      region: "Hauts-de-France",      lat: 50.633, lon:  3.058, bortle: 7 },

  // ─── Suisse + Luxembourg ───
  { id: "geneve",    name: "Genève",     region: "Suisse",               lat: 46.204, lon:  6.143, bortle: 7 },
  { id: "lausanne",  name: "Lausanne",   region: "Suisse",               lat: 46.520, lon:  6.633, bortle: 6 },
  { id: "luxembourg",name: "Luxembourg", region: "Luxembourg-Ville",     lat: 49.611, lon:  6.131, bortle: 6 },

  // ─── Québec ───
  { id: "montreal",  name: "Montréal",   region: "Québec, Canada",       lat: 45.502, lon:-73.567, bortle: 8 },
  { id: "quebec",    name: "Québec",     region: "Capitale, Canada",     lat: 46.813, lon:-71.208, bortle: 6 },

  // ─── Observatoires & ciels sombres ───
  { id: "pic-midi",  name: "Pic du Midi",region: "Pyrénées · 2877 m",    lat: 42.937, lon:  0.143, bortle: 2 },
  { id: "calern",    name: "Plateau de Calern", region: "Alpes · 1270 m",lat: 43.752, lon:  6.923, bortle: 3 },
  { id: "haute-pro", name: "Haute-Provence", region: "Observatoire · 650 m", lat: 43.932, lon:  5.713, bortle: 3 },
  { id: "jungfrau",  name: "Jungfraujoch",region: "Alpes suisses · 3463 m",  lat: 46.547, lon:  7.985, bortle: 2 },
];

Object.assign(window, {
  NAMED_STARS,
  CONSTELLATION_LINES,
  PLANETS,
  ISS_PASS,
  TONIGHT,
  ATLAS_ENTRIES,
  LOCATIONS
});
