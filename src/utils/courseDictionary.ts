import { DictionaryTerm, Course } from '../types';

export const DEFAULT_MATH1_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'dict-1',
    term: 'Leibnitz Theorem',
    canonicalName: "Leibnitz's Theorem for nth Derivative",
    unit: 1,
    topicId: 'm1-u1',
    aliases: ['leibnitz', 'leibniz', 'le!bn!tz', 'nth derivative of product', 'product rule nth'],
    definition: 'Formula for the nth derivative of the product of two functions u and v: (uv)_n = Σ C(n,r) u_(n-r) v_r.',
    formula: '(u v)_n = Σ [nCr * u_(n-r) * v_r]',
    frequencyAppeared: 6
  },
  {
    id: 'dict-2',
    term: "Taylor's Theorem",
    canonicalName: "Taylor's Series with Remainder",
    unit: 1,
    topicId: 'm1-u1',
    aliases: ['taylor', 'tayl0r', 'taylors theorem', 'lagrange remainder form'],
    definition: 'Expansion of f(x) about x=a in powers of (x-a) with Lagrange or Cauchy form of remainder term.',
    formula: "f(x) = f(a) + (x-a)f'(a) + ... + (x-a)^n/n! f^(n)(c)",
    frequencyAppeared: 4
  },
  {
    id: 'dict-3',
    term: "Maclaurin's Series",
    canonicalName: "Maclaurin's Expansion at x = 0",
    unit: 1,
    topicId: 'm1-u1',
    aliases: ['maclaurin', 'maclaur!n', 'macl@urin', 'expansion at 0'],
    definition: 'Special case of Taylor series expanded around the origin (x = 0).',
    formula: "f(x) = f(0) + x f'(0) + (x^2/2!) f''(0) + ...",
    frequencyAppeared: 5
  },
  {
    id: 'dict-4',
    term: 'Asymptotes',
    canonicalName: 'Parallel & Oblique Asymptotes',
    unit: 1,
    topicId: 'm1-u1',
    aliases: ['asymptote', 'parallel asymptote', 'oblique asymptote', 'curve asymptote'],
    definition: 'A straight line tangent to an algebraic curve at infinity.',
    formula: 'y = m x + c, where m = lim(y/x), c = lim(y - mx)',
    frequencyAppeared: 3
  },
  {
    id: 'dict-5',
    term: 'Radius of Curvature',
    canonicalName: 'Curvature in Cartesian & Polar Coordinates',
    unit: 1,
    topicId: 'm1-u1',
    aliases: ['curvature', 'radius of curvature', 'rho', 'pedal curvature', 'involute', 'evolute'],
    definition: 'The reciprocal of curvature kappa, representing the radius of the osculating circle at a given point.',
    formula: 'ρ = [1 + (y\')^2]^(3/2) / |y\'\'|',
    frequencyAppeared: 4
  },
  {
    id: 'dict-6',
    term: "Euler's Theorem",
    canonicalName: "Euler's Theorem on Homogeneous Functions",
    unit: 2,
    topicId: 'm1-u2',
    aliases: ['euler', 'eul3r', 'homogeneous function', 'euler formula', 'x du/dx'],
    definition: 'Relates first-order partial derivatives of a homogeneous function of degree n: x(∂u/∂x) + y(∂u/∂y) = n*u.',
    formula: 'x(∂u/∂x) + y(∂u/∂y) = n u',
    frequencyAppeared: 6
  },
  {
    id: 'dict-7',
    term: 'Jacobian',
    canonicalName: 'Jacobian Determinant & Coordinate Transformations',
    unit: 2,
    topicId: 'm1-u2',
    aliases: ['jacobian', 'jac0b!an', 'jac0bian', 'functional determinant', 'd(u,v)/d(x,y)'],
    definition: 'Matrix of first-order partial derivatives of a vector-valued function, used for variable transformations.',
    formula: 'J = ∂(u,v)/∂(x,y) = |(∂u/∂x ∂u/∂y), (∂v/∂x ∂v/∂y)|',
    frequencyAppeared: 5
  },
  {
    id: 'dict-8',
    term: 'Lagrange Multipliers',
    canonicalName: "Lagrange's Undetermined Multipliers",
    unit: 2,
    topicId: 'm1-u2',
    aliases: ['lagrange', 'lagr4nge', 'undetermined multipliers', 'constrained extrema'],
    definition: 'Strategy for finding the local maxima and minima of a function subject to equality constraints.',
    formula: '∇f(x,y,z) = λ ∇g(x,y,z)',
    frequencyAppeared: 4
  },
  {
    id: 'dict-9',
    term: 'Maxima and Minima',
    canonicalName: 'Multivariable Extrema & Saddle Points',
    unit: 2,
    topicId: 'm1-u2',
    aliases: ['maxima', 'minima', 'saddle point', 'ac - b^2', 'stationary points'],
    definition: 'Extreme values on two-variable surfaces determined by the discriminant AC - B^2 criterion.',
    formula: 'Discriminant = AC - B^2, where A = f_xx, B = f_xy, C = f_yy',
    frequencyAppeared: 4
  },
  {
    id: 'dict-10',
    term: 'Change of Order of Integration',
    canonicalName: 'Change of Order of Integration in Double Integrals',
    unit: 3,
    topicId: 'm1-u3',
    aliases: ['change order', 'order of integration', 'double integral', 'region sketching'],
    definition: 'Reversing the sequence dx dy to dy dx across an integration domain to simplify evaluation.',
    formula: '∬ f(x,y) dy dx = ∬ f(x,y) dx dy',
    frequencyAppeared: 5
  },
  {
    id: 'dict-11',
    term: 'Beta and Gamma Functions',
    canonicalName: 'Eulerian Integrals: Beta & Gamma Functions',
    unit: 3,
    topicId: 'm1-u3',
    aliases: ['beta function', 'gamma function', 'dirichlet integral', 'legendre duplication', 'gamma(1/2)'],
    definition: 'Non-elementary definite integrals with vital recurrence properties: B(m,n) = Γ(m)Γ(n)/Γ(m+n).',
    formula: 'B(m,n) = ∫[0 to 1] x^(m-1) (1-x)^(n-1) dx = Γ(m)Γ(n)/Γ(m+n)',
    frequencyAppeared: 5
  },
  {
    id: 'dict-12',
    term: 'Gauss Divergence Theorem',
    canonicalName: 'Gauss Divergence Theorem (Flux across Closed Surface)',
    unit: 5,
    topicId: 'm1-u5',
    aliases: ['gauss', 'g@uss', 'divergence theorem', 'surface to volume', 'flux integral'],
    definition: 'Equates the outward flux of a vector field across a closed surface to the volume integral of its divergence.',
    formula: '∬_S F · n dS = ∭_V (∇ · F) dV',
    frequencyAppeared: 6
  },
  {
    id: 'dict-13',
    term: "Green's Theorem",
    canonicalName: "Green's Theorem in a Plane",
    unit: 5,
    topicId: 'm1-u5',
    aliases: ['green', 'greens theorem', 'gr3en', 'line integral plane', 'circulation'],
    definition: 'Relates a line integral around a simple closed curve C to a double integral over the plane region D bounded by C.',
    formula: '∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA',
    frequencyAppeared: 4
  },
  {
    id: 'dict-14',
    term: "Stokes' Theorem",
    canonicalName: "Stokes' Curl Theorem",
    unit: 5,
    topicId: 'm1-u5',
    aliases: ['stokes', 'st0kes', 'curl theorem', 'circulation over surface'],
    definition: 'Relates the surface integral of the curl of a vector field to the line integral around the boundary curve.',
    formula: '∮_C F · dr = ∬_S (∇ × F) · n dS',
    frequencyAppeared: 5
  }
];

export const DEFAULT_CHEMISTRY_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'chem-d1',
    term: 'EDTA Hardness Method',
    canonicalName: 'EDTA Complexometric Titration for Water Hardness',
    unit: 1,
    topicId: 'chem-u1',
    aliases: ['edta', 'hardness titration', 'ebt indicator', 'buffer ph 10', 'ca-edta complex'],
    definition: 'Disodium EDTA forms stable, soluble 1:1 chelates with Ca²⁺ and Mg²⁺ at pH 9-10 with Eriochrome Black T indicator.',
    formula: 'Total Hardness (mg/L CaCO₃) = (V_EDTA × M × 100 × 1000) / V_sample',
    frequencyAppeared: 8
  },
  {
    id: 'chem-d2',
    term: 'Boiler Scales & Sludges',
    canonicalName: 'Boiler Troubles: Scales vs Sludges & Blowdown',
    unit: 1,
    topicId: 'chem-u1',
    aliases: ['sludge', 'scale', 'caustic embrittlement', 'boiler corrosion', 'priming and foaming'],
    definition: 'Sludges are loose, slimy precipitates (MgCO₃, MgCl₂) in cooler zones; Scales are hard adherent crusts (CaSO₄, CaSiO₃) on boiler heating tubes.',
    formula: 'Ca(HCO₃)₂ → CaCO₃↓ + CO₂↑ + H₂O (Precipitation under heat)',
    frequencyAppeared: 6
  },
  {
    id: 'chem-d3',
    term: 'Bomb Calorimeter & HCV',
    canonicalName: 'Higher Calorific Value by Bomb Calorimeter',
    unit: 2,
    topicId: 'chem-u2',
    aliases: ['bomb calorimeter', 'hcv', 'gross calorific value', 'dulongs formula'],
    definition: 'Determination of calorific value of solid/liquid fuel burned in pure O₂ (25-30 atm) under adiabatic water jacket.',
    formula: 'HCV = [(W + w)(T₂ - T₁ + t_corr) - (Acid + Fuse + Cotton corr.)] / m',
    frequencyAppeared: 7
  },
  {
    id: 'chem-d4',
    term: 'Dulong’s Formula',
    canonicalName: 'Theoretical Calorific Value by Dulong Formulation',
    unit: 2,
    topicId: 'chem-u2',
    aliases: ['dulong', 'dulongs equation', 'lcv from hcv', 'theoretical calorific value'],
    definition: 'Calculates HCV from elemental percentages of Carbon, Hydrogen, Oxygen, and Sulfur.',
    formula: 'HCV = 1/100 [8080 C + 34500 (H - O/8) + 2240 S] kcal/kg ; LCV = HCV - 0.09 H × 587 kcal/kg',
    frequencyAppeared: 5
  },
  {
    id: 'chem-d5',
    term: 'Boundary vs Hydrodynamic Lubrication',
    canonicalName: 'Mechanisms of Lubrication (Thick-Film vs Boundary Monolayer)',
    unit: 3,
    topicId: 'chem-u3',
    aliases: ['lubrication mechanism', 'hydrodynamic', 'thick film', 'boundary lubrication', 'extreme pressure'],
    definition: 'Hydrodynamic separates metal asperities with fluid film (>1000 Å); Boundary forms adsorbed monomolecular soap layer under high load/low speed.',
    formula: 'Z N / P (Hersey Number for hydrodynamic fluid regime)',
    frequencyAppeared: 6
  },
  {
    id: 'chem-d6',
    term: 'Portland Cement Compounds (Bogue)',
    canonicalName: 'Bogue Compounds in Portland Cement Setting & Hardening',
    unit: 4,
    topicId: 'chem-u4',
    aliases: ['bogue compounds', 'c3s', 'c2s', 'c3a', 'c4af', 'cement setting', 'hydration of cement'],
    definition: 'Tricalcium silicate (C₃S), Dicalcium silicate (C₂S), Tricalcium aluminate (C₃A), Tetracalcium aluminoferrite (C₄AF). C₃A causes initial flash set; C₃S governs early 7-day strength.',
    formula: '2(3CaO·SiO₂) + 6H₂O → 3CaO·2SiO₂·3H₂O (C-S-H Gel) + 3Ca(OH)₂',
    frequencyAppeared: 5
  },
  {
    id: 'chem-d7',
    term: 'Beer-Lambert Law',
    canonicalName: 'Spectrophotometric Beer-Lambert Absorption Law',
    unit: 5,
    topicId: 'chem-u5',
    aliases: ['beer lambert', 'absorbance', 'transmittance', 'molar absorptivity', 'uv-vis spectroscopy'],
    definition: 'Absorbance of light by a chemical solute is directly proportional to path length (b) and molar concentration (c).',
    formula: 'A = -log₁₀(I / I₀) = ε · c · l',
    frequencyAppeared: 4
  }
];

export const DEFAULT_ELECTRONICS_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'elec-d1',
    term: 'Full Wave Bridge Rectifier',
    canonicalName: 'Bridge Rectifier Operation, PIV & Efficiency',
    unit: 1,
    topicId: 'elec-u1',
    aliases: ['bridge rectifier', 'full wave', 'ripple factor', 'piv', 'rectifier efficiency'],
    definition: 'Uses 4 diodes in a bridge arrangement to rectify both AC half-cycles without center-tapped transformer.',
    formula: 'V_dc = (2V_m)/π , Ripple Factor γ = 0.482 , Efficiency η = 81.2% , PIV = V_m',
    frequencyAppeared: 7
  },
  {
    id: 'elec-d2',
    term: 'Zener Diode Voltage Regulator',
    canonicalName: 'Zener Breakdown & Shunt Voltage Regulation',
    unit: 1,
    topicId: 'elec-u1',
    aliases: ['zener diode', 'zener breakdown', 'voltage regulator', 'avalanche breakdown'],
    definition: 'Operates in reverse breakdown region with nearly vertical I-V curve, maintaining constant V_z across load despite source fluctuations.',
    formula: 'I_s = (V_in - V_z) / R_s , I_s = I_z + I_L',
    frequencyAppeared: 6
  },
  {
    id: 'elec-d3',
    term: 'BJT Common Emitter (CE) Configuration',
    canonicalName: 'BJT CE Input & Output Characteristics & Current Gain',
    unit: 2,
    topicId: 'elec-u2',
    aliases: ['common emitter', 'ce configuration', 'beta', 'transistor alpha beta', 'q point', 'load line'],
    definition: 'Input applied between base and emitter; output taken between collector and emitter. Provides high current gain beta and 180° phase inversion.',
    formula: 'β = α / (1 - α) ; I_c = β · I_b + I_ceo ; V_ce = V_cc - I_c · R_c',
    frequencyAppeared: 8
  },
  {
    id: 'elec-d4',
    term: 'Ideal Op-Amp & Virtual Ground',
    canonicalName: 'Operational Amplifier Characteristics & Inverting Amplifier',
    unit: 3,
    topicId: 'elec-u3',
    aliases: ['op-amp', 'virtual ground', 'inverting amplifier', 'non-inverting', 'cmrr', 'slew rate'],
    definition: 'Infinite open-loop gain A_ol, infinite input impedance R_in, zero output impedance R_out, infinite CMRR. Virtual ground implies V+ = V-.',
    formula: 'V_out = -(R_f / R_in) · V_in (Inverting) ; V_out = (1 + R_f / R_1) · V_in (Non-inverting)',
    frequencyAppeared: 6
  },
  {
    id: 'elec-d5',
    term: 'Barkhausen Criterion for Oscillations',
    canonicalName: 'Barkhausen Condition for Sinusoidal Oscillators',
    unit: 4,
    topicId: 'elec-u4',
    aliases: ['barkhausen', 'oscillator condition', 'rc phase shift', 'wein bridge', 'hartley colpitts'],
    definition: 'For sustained oscillations, the loop gain |Aβ| must be equal to 1, and total loop phase shift must be 0° or 360° (2π radians).',
    formula: '|A · β| = 1 and ∠(A · β) = 0° (or 2nπ)',
    frequencyAppeared: 5
  }
];

export const DEFAULT_MECHANICAL_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'mech-d1',
    term: 'Steady Flow Energy Equation (SFEE)',
    canonicalName: 'First Law SFEE for Open Systems (Nozzle, Turbine, Boiler)',
    unit: 1,
    topicId: 'mech-u1',
    aliases: ['sfee', 'steady flow energy equation', 'first law open system', 'nozzle sfee', 'turbine sfee'],
    definition: 'Conservation of energy for flowing control volumes accounting for internal energy, flow work (Pv), kinetic energy, and potential energy.',
    formula: 'h₁ + (V₁² / 2000) + (g z₁ / 1000) + q = h₂ + (V₂² / 2000) + (g z₂ / 1000) + w',
    frequencyAppeared: 8
  },
  {
    id: 'mech-d2',
    term: 'Dryness Fraction & Steam Properties',
    canonicalName: 'Enthalpy and Entropy of Wet and Superheated Steam',
    unit: 2,
    topicId: 'mech-u2',
    aliases: ['dryness fraction', 'wet steam', 'steam tables', 'enthalpy of steam', 'mollier chart'],
    definition: 'Ratio of mass of dry saturated steam to total mass of wet steam (m_s / (m_s + m_w)).',
    formula: 'h = h_f + x · h_fg (Wet Steam) ; h_sup = h_g + c_ps · (T_sup - T_sat) (Superheated Steam)',
    frequencyAppeared: 7
  },
  {
    id: 'mech-d3',
    term: 'Otto vs Diesel Air Standard Efficiency',
    canonicalName: 'Thermodynamic Efficiency of IC Engine Cycles',
    unit: 3,
    topicId: 'mech-u3',
    aliases: ['otto cycle', 'diesel cycle', 'air standard efficiency', 'compression ratio', 'cut off ratio'],
    definition: 'Otto operates at constant volume heat addition; Diesel operates at constant pressure heat addition.',
    formula: 'η_otto = 1 - (1 / r^(γ - 1)) ; η_diesel = 1 - (1 / r^(γ - 1)) · [(r_c^γ - 1) / (γ(r_c - 1))]',
    frequencyAppeared: 8
  }
];

export function getDictionaryForCourse(course: Course): DictionaryTerm[] {
  if (course.dictionary && course.dictionary.length > 0) {
    return course.dictionary;
  }
  const idLower = (course.id || '').toLowerCase();
  const nameLower = (course.name || '').toLowerCase();

  if (idLower.includes('chem') || nameLower.includes('chem')) {
    return DEFAULT_CHEMISTRY_DICTIONARY;
  }
  if (idLower.includes('elec') || nameLower.includes('electronic')) {
    return DEFAULT_ELECTRONICS_DICTIONARY;
  }
  if (idLower.includes('mech') || nameLower.includes('mechanic')) {
    return DEFAULT_MECHANICAL_DICTIONARY;
  }
  return DEFAULT_MATH1_DICTIONARY;
}

export interface DictionaryScanResult {
  matchedTerms: {
    term: DictionaryTerm;
    count: number;
  }[];
  totalMatches: number;
  unrecognizedTokens: string[];
  suggestedCorrections: {
    raw: string;
    corrected: string;
    term: string;
  }[];
}

/**
 * Scan text against syllabus dictionary and detect OCR errors
 */
export function checkTextAgainstDictionary(
  text: string,
  dictionary: DictionaryTerm[] = DEFAULT_MATH1_DICTIONARY
): DictionaryScanResult {
  const textLower = text.toLowerCase();
  const matchedTerms: { term: DictionaryTerm; count: number }[] = [];
  const suggestedCorrections: { raw: string; corrected: string; term: string }[] = [];
  let totalMatches = 0;

  for (const item of dictionary) {
    let count = 0;
    // Check main term
    if (textLower.includes(item.term.toLowerCase())) {
      count++;
    }

    // Check aliases
    for (const alias of item.aliases) {
      if (textLower.includes(alias.toLowerCase())) {
        count++;
        // If alias is an OCR typo (contains digits or symbols like 0, 3, 4, @, !), suggest correction
        if (/[034@!]/.test(alias)) {
          suggestedCorrections.push({
            raw: alias,
            corrected: item.term,
            term: item.canonicalName
          });
        }
      }
    }

    if (count > 0) {
      matchedTerms.push({ term: item, count });
      totalMatches += count;
    }
  }

  return {
    matchedTerms,
    totalMatches,
    unrecognizedTokens: [],
    suggestedCorrections
  };
}

/**
 * Recompute appearance frequencies in dictionary across all questions in course
 */
export function syncDictionaryFrequenciesWithCourse(
  course: Course,
  baseDictionary: DictionaryTerm[] = DEFAULT_MATH1_DICTIONARY
): DictionaryTerm[] {
  const allText = course.questions.map(q => q.text.toLowerCase()).join(' ');

  return baseDictionary.map(dictItem => {
    let freq = 0;
    const termLower = dictItem.term.toLowerCase();
    const count = (allText.match(new RegExp(termLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
    freq += count;

    for (const alias of dictItem.aliases) {
      if (!/[034@!]/.test(alias)) {
        const aliasCount = (allText.match(new RegExp(alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
        freq += aliasCount;
      }
    }

    return {
      ...dictItem,
      frequencyAppeared: Math.max(freq, dictItem.frequencyAppeared || 1)
    };
  });
}
