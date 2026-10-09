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
