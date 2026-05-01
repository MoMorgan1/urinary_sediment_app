// All flashcard data. Images served from /img/ (public folder).

export const CRYSTALS = [
  { id: "c1",  slug: "uric_acid",                 name: "Uric Acid",                       ph: "acid",     interp: "Gout; associated with kidney stone formation" },
  { id: "c2",  slug: "amorphous_urates",          name: "Amorphous Urates",                ph: "acid",     interp: "No specific clinical interpretation" },
  { id: "c3",  slug: "ca_oxalate_dihydrate",      name: "Calcium Oxalate Dihydrate",       ph: "acid",     interp: "Can be normal; or oxalate calculi (kidney stones)" },
  { id: "c4",  slug: "ca_oxalate_monohydrate",    name: "Calcium Oxalate Monohydrate",     ph: "acid",     interp: "Hyperoxaluria, ethylene glycol intoxication, or oxalate calculi" },
  { id: "c5",  slug: "tyrosine",                  name: "Tyrosine",                        ph: "acid",     interp: "Severe liver disease — impaired amino acid metabolism (rare)" },
  { id: "c6",  slug: "cystine",                   name: "Cystine",                         ph: "acid",     interp: "Inherited defect of renal tubular reabsorption of cystine" },
  { id: "c7",  slug: "cholesterol",               name: "Cholesterol",                     ph: "acid",     interp: "Renal disease — nephritis, nephrotic syndrome" },
  { id: "c8",  slug: "bilirubin",                 name: "Bilirubin",                       ph: "acid",     interp: "Hepatic disorders & cholestasis causing bilirubinuria" },
  { id: "c9",  slug: "leucine",                   name: "Leucine",                         ph: "acid",     interp: "Liver disorders — impaired amino acid metabolism" },
  { id: "c10", slug: "sulfonamide",               name: "Sulfonamide",                     ph: "acid",     interp: "Following antibiotic therapy with sulfonamides" },
  { id: "c11", slug: "amorphous_phosphates",      name: "Amorphous Phosphates",            ph: "alkaline", interp: "No specific clinical interpretation" },
  { id: "c12", slug: "triple_phosphate",          name: "Triple Phosphate (Struvite)",     ph: "alkaline", interp: "Normal; kidney stones; UTI (urease-splitting bacteria)" },
  { id: "c13", slug: "ammonium_biurate",          name: "Ammonium Biurate",                ph: "alkaline", interp: "Hyperammonemia — portosystemic shunt or hepatic failure" },
  { id: "c14", slug: "calcium_carbonate",         name: "Calcium Carbonate",               ph: "alkaline", interp: "Normal in horses; abnormal in dogs/cats" },
  { id: "c15", slug: "calcium_phosphate",         name: "Calcium Phosphate",               ph: "alkaline", interp: "Normal; kidney stones; UTI (urease-splitting bacteria)" },
  { id: "c16", slug: "fat_droplets",              name: "Fat Droplets",                    ph: "any",      interp: "Obesity, high fat diet, hypothyroidism, diabetes mellitus, greasy containers" },
];

export const ORGANIZED = [
  { id: "o1",  slug: "rbc",                       name: "Red Blood Cells",                 ph: null, interp: "Hemorrhage, inflammation, trauma, hemostatic disorders, neoplasia (Normal: 0–3/HPF)" },
  { id: "o2",  slug: "wbc",                       name: "White Blood Cells",               ph: null, interp: "Pyuria — indicates infection or inflammation (Normal: 0–5/HPF)" },
  { id: "o3",  slug: "squamous_epithelial",       name: "Squamous Epithelial Cells",       ph: null, interp: "Contamination from vaginal secretion (Normal: 0–2/HPF)" },
  { id: "o4",  slug: "transitional_epithelial",   name: "Transitional Epithelial Cells",   ph: null, interp: "Renal inflammation — pelvis, ureters, bladder, proximal urethra (Normal: 0–2/HPF)" },
  { id: "o5",  slug: "renal_epithelial",          name: "Renal Epithelial Cells",          ph: null, interp: "Tubular damage or necrosis (Normal: 0–2/HPF)" },
  { id: "o6",  slug: "bacteria",                  name: "Bacteria",                        ph: null, interp: "Urinary tract infection (Normal: Negative)" },
  { id: "o7",  slug: "neoplastic_cells",          name: "Neoplastic Cells",                ph: null, interp: "Tumors of urinary tract — transitional cell carcinoma, renal carcinoma" },
  { id: "o8",  slug: "hyaline_cast",              name: "Hyaline Cast",                    ph: null, interp: "Transient (fever, stress, exercise); mild renal disease (Normal: Few)" },
  { id: "o9",  slug: "epithelial_cast",           name: "Epithelial Cast",                 ph: null, interp: "Acute inflammation of urinary tract — especially acute nephritis with tubular injury" },
  { id: "o10", slug: "granular_cast_coarse",      name: "Granular Cast (Coarse)",          ph: null, interp: "Early stage — acute nephritis" },
  { id: "o11", slug: "granular_cast_fine",        name: "Granular Cast (Fine)",            ph: null, interp: "Late stage — chronic nephritis" },
  { id: "o12", slug: "waxy_cast",                 name: "Waxy Cast",                       ph: null, interp: "Chronic nephritis and degeneration (last stage of cast degeneration)" },
  { id: "o13", slug: "fatty_cast",                name: "Fatty Cast",                      ph: null, interp: "Fatty degeneration of tubules — diabetes mellitus, nephrotic syndrome" },
  { id: "o14", slug: "rbc_cast",                  name: "RBC Cast (Bloody Cast)",          ph: null, interp: "Hemorrhage in urinary tract; acute glomerular disorder" },
  { id: "o15", slug: "wbc_cast",                  name: "WBC Cast",                        ph: null, interp: "Inflammation or infection of the urinary tract" },
  { id: "o16", slug: "starch_crystals",           name: "Starch Crystals",                 ph: null, interp: "Contaminant from powdered gloves" },
];

export const ALL = [...CRYSTALS, ...ORGANIZED];

export const DECKS = {
  all:       { label: "All",       cards: ALL,       icon: "Layers" },
  crystals:  { label: "Crystals",  cards: CRYSTALS,  icon: "FlaskConical" },
  organized: { label: "Organized", cards: ORGANIZED, icon: "Microscope" },
};
