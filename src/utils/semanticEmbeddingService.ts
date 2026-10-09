import {
  Course,
  ExamPaperRecord,
  Question,
  TopicExamImportance,
  SubtopicExamImportance,
  CourseExamIntelligenceSummary,
  PaperAppearanceTag,
  SyllabusTopic,
  ExamType
} from '../types';
import { loadStoredPapers, isDemoPaper } from './paperStorage';

/**
 * Semantic Vector & Embedding Space Engine for Exam Papers & Course Syllabus
 *
 * Implements:
 * 1. Text Tokenization, Math Token Preservation, and Stemming.
 * 2. Word N-Gram (unigram + bigram + trigram) & Character Subword N-Gram Embeddings.
 * 3. TF-IDF Weighting over Course Curriculum & Subtopic Vectors.
 * 4. Cosine Similarity Vector Space Projection.
 * 5. Subtopic-Level & Unit-Level Multi-MST Frequency & Reweighted Scoring.
 * 6. "Found in this MST" Traceability with exact paper, question number, and mark evidence.
 */

export interface SparseEmbeddingVector {
  dimensions: Map<string, number>;
  magnitude: number;
}

export interface SemanticMappingResult {
  topicId: string;
  topicName: string;
  subtopicName?: string;
  questionNature: 'Numerical' | 'Derivation' | 'Theory';
  unitNumber: number;
  confidence: number;
  cosineSimilarity: number;
  matchedKeywords: string[];
  semanticMatchReason: string;
  candidateRankings: {
    unitNumber: number;
    topicId: string;
    topicName: string;
    similarity: number;
  }[];
}

// ----------------------------------------------------------------------
// Curated Multi-Disciplinary Domain Vocabularies & Technical Aliases
// ----------------------------------------------------------------------
const SUBJECT_DOMAIN_CONCEPTS: Record<string, { unit: number; keyTerms: string[] }[]> = {
  // General Mechanical Engineering (GMU / GME)
  mechanical: [
    {
      unit: 1,
      keyTerms: [
        'steady flow energy equation', 'sfee', 'first law of thermodynamics', 'closed system',
        'open system', 'isolated system', 'turbine', 'compressor', 'nozzle', 'diffuser',
        'throttling valve', 'polytropic process', 'isothermal', 'isobaric', 'isochoric',
        'internal energy', 'enthalpy', 'thermodynamic equilibrium', 'zeroth law', 'p v diagram'
      ]
    },
    {
      unit: 2,
      keyTerms: [
        'properties of pure substance', 'steam tables', 'dryness fraction', 'wet steam',
        'superheated steam', 'critical point', 'triple point', 'enthalpy of steam',
        'mollier chart', 'throttling calorimeter', 'saturation temperature', 'latent heat'
      ]
    },
    {
      unit: 3,
      keyTerms: [
        'otto cycle', 'diesel cycle', 'air standard efficiency', 'compression ratio',
        'cut off ratio', 'four stroke engine', 'two stroke engine', 'reciprocating engine',
        'pv ts diagram', 'thermal efficiency', 'spark ignition', 'compression ignition'
      ]
    },
    {
      unit: 4,
      keyTerms: [
        'steam boilers', 'babcock and wilcox boiler', 'cochran boiler', 'boiler mountings',
        'boiler accessories', 'water tube boiler', 'fire tube boiler', 'economizer',
        'air preheater', 'superheater', 'safety valve', 'water level indicator'
      ]
    },
    {
      unit: 5,
      keyTerms: [
        'welding processes', 'tig welding', 'mig welding', 'arc welding', 'oxy acetylene welding',
        'gas welding flames', 'neutral flame', 'resistance spot welding', 'lathe machine',
        'lathe operations', 'turning', 'facing', 'single point cutting tool'
      ]
    }
  ],

  // Applied Mathematics-I
  math1: [
    {
      unit: 1,
      keyTerms: [
        'leibnitz', 'leibniz', 'nth derivative', 'successive differentiation',
        'taylor series', 'maclaurin series', 'lagrange remainder', 'expansion of function',
        'asymptote', 'curvature', 'radius of curvature', 'rho', 'pedal equation',
        'center of curvature', 'chord of curvature', 'envelopes', 'evolute'
      ]
    },
    {
      unit: 2,
      keyTerms: [
        'euler theorem', 'homogeneous function', 'partial differentiation', 'partial derivative',
        'jacobian', 'functional determinant', 'coordinate transformation',
        'maxima and minima', 'saddle point', 'stationary point', 'lagrange multiplier',
        'undetermined multipliers', 'constrained extrema', 'total derivative'
      ]
    },
    {
      unit: 3,
      keyTerms: [
        'double integral', 'triple integral', 'change order of integration',
        'multiple integral', 'area by double integral', 'volume by triple integral',
        'beta function', 'gamma function', 'dirichlet integral', 'legendre duplication',
        'polar coordinates integral', 'cylindrical coordinates', 'spherical coordinates'
      ]
    },
    {
      unit: 4,
      keyTerms: [
        'vector differentiation', 'directional derivative', 'gradient', 'grad',
        'divergence', 'div', 'curl', 'solenoidal', 'irrotational', 'scalar potential',
        'vector identity', 'laplacian operator'
      ]
    },
    {
      unit: 5,
      keyTerms: [
        'vector integration', 'line integral', 'surface integral', 'volume integral',
        'gauss divergence theorem', 'divergence theorem', 'green theorem', 'greens theorem',
        'stokes theorem', 'circulation', 'flux across closed surface', 'work done vector'
      ]
    }
  ],

  // Applied Mathematics-II
  math2: [
    {
      unit: 1,
      keyTerms: [
        'matrix rank', 'echelon form', 'system of linear equations', 'gauss elimination',
        'eigenvalue', 'eigenvalues', 'eigenvector', 'eigenvectors', 'characteristic equation',
        'cayley hamilton theorem', 'diagonalization', 'quadratic forms'
      ]
    },
    {
      unit: 2,
      keyTerms: [
        'first order differential equation', 'exact differential equation', 'integrating factor',
        'linear differential equation', 'bernoulli equation', 'orthogonal trajectories'
      ]
    },
    {
      unit: 3,
      keyTerms: [
        'higher order linear differential equation', 'cauchy euler equation',
        'method of variation of parameters', 'complementary function', 'particular integral',
        'legendre linear equation'
      ]
    },
    {
      unit: 4,
      keyTerms: [
        'fourier series', 'euler formulae', 'dirichlet conditions', 'half range series',
        'fourier sine series', 'fourier cosine series', 'harmonic analysis', 'parseval identity'
      ]
    },
    {
      unit: 5,
      keyTerms: [
        'partial differential equation', 'lagrange linear pde', 'charpit method',
        'separation of variables', 'wave equation', 'heat conduction equation', 'laplace equation'
      ]
    }
  ],

  // Engineering Chemistry
  chem: [
    {
      unit: 1,
      keyTerms: [
        'water analysis', 'hardness of water', 'temporary hardness', 'permanent hardness',
        'edta method', 'boiler feed water', 'scale and sludge', 'priming and foaming',
        'caustic embrittlement', 'zeolite process', 'ion exchange demineralization'
      ]
    },
    {
      unit: 2,
      keyTerms: [
        'fuel', 'calorific value', 'higher calorific value', 'lower calorific value',
        'bomb calorimeter', 'proximate analysis', 'ultimate analysis of coal',
        'cracking of petroleum', 'octane number', 'cetane number', 'combustion calculations'
      ]
    },
    {
      unit: 3,
      keyTerms: [
        'lubricants', 'lubrication mechanisms', 'viscosity index', 'flash point', 'fire point',
        'cloud point', 'pour point', 'saponification number', 'anionic surfactants'
      ]
    },
    {
      unit: 4,
      keyTerms: [
        'corrosion', 'dry corrosion', 'wet corrosion', 'electrochemical corrosion',
        'galvanic corrosion', 'pitting corrosion', 'cathodic protection', 'sacrificial anode',
        'protective coatings', 'galvanizing', 'tinning'
      ]
    },
    {
      unit: 5,
      keyTerms: [
        'polymers', 'polymerization', 'thermoplastic', 'thermosetting', 'bakelite', 'nylon',
        'conducting polymers', 'biodegradable polymers', 'phase rule', 'water system phase diagram'
      ]
    }
  ],

  // Engineering Physics
  phy: [
    {
      unit: 1,
      keyTerms: [
        'wave optics', 'interference of light', 'newton rings', 'thin film interference',
        'diffraction', 'fraunhofer diffraction', 'fresnel diffraction', 'diffraction grating',
        'resolving power', 'rayleigh criterion'
      ]
    },
    {
      unit: 2,
      keyTerms: [
        'polarization', 'brewster law', 'malus law', 'double refraction', 'nicol prism',
        'quarter wave plate', 'half wave plate', 'circularly polarized'
      ]
    },
    {
      unit: 3,
      keyTerms: [
        'lasers', 'spontaneous emission', 'stimulated emission', 'einstein coefficients',
        'population inversion', 'optical pumping', 'ruby laser', 'helium neon laser',
        'semiconductor laser', 'optical fiber', 'numerical aperture', 'acceptance angle'
      ]
    },
    {
      unit: 4,
      keyTerms: [
        'quantum mechanics', 'de broglie hypothesis', 'wave particle duality',
        'heisenberg uncertainty principle', 'schrodinger wave equation', 'wave function',
        'particle in one dimensional box', 'potential well'
      ]
    },
    {
      unit: 5,
      keyTerms: [
        'crystallography', 'crystal lattice', 'miller indices', 'bragg law', 'x-ray diffraction',
        'nanotechnology', 'carbon nanotubes', 'quantum dots', 'superconductivity', 'meissner effect'
      ]
    }
  ],

  // Basic Electrical Engineering
  elec: [
    {
      unit: 1,
      keyTerms: [
        'dc circuits', 'ohm law', 'kirchhoff laws', 'kcl', 'kvl', 'mesh analysis',
        'nodal analysis', 'thevenin theorem', 'norton theorem', 'superposition theorem',
        'maximum power transfer theorem', 'star delta transformation'
      ]
    },
    {
      unit: 2,
      keyTerms: [
        'ac fundamentals', 'sinusoidal waveform', 'rms value', 'average value', 'form factor',
        'peak factor', 'phasor representation', 'rl circuit', 'rc circuit', 'rlc series resonance',
        'parallel resonance', 'q factor', 'power factor'
      ]
    },
    {
      unit: 3,
      keyTerms: [
        'three phase circuits', 'star connection', 'delta connection', 'line voltage', 'phase voltage',
        'three phase power measurement', 'two wattmeter method'
      ]
    },
    {
      unit: 4,
      keyTerms: [
        'magnetic circuits', 'magnetic flux', 'reluctance', 'b-h curve', 'hysteresis loss',
        'single phase transformer', 'emf equation of transformer', 'transformer losses',
        'efficiency of transformer', 'open circuit test', 'short circuit test'
      ]
    },
    {
      unit: 5,
      keyTerms: [
        'electrical machines', 'dc generator', 'dc motor', 'back emf', 'torque equation',
        'three phase induction motor', 'rotating magnetic field', 'slip', 'slip torque characteristics'
      ]
    }
  ]
};

// Common English stopwords to eliminate noise from vector embedding
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of',
  'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'can', 'will', 'just', 'should', 'now', 'what', 'which', 'who', 'whom', 'this', 'that',
  'these', 'those', 'am', 'it', 'its', 'they', 'them', 'their', 'we', 'us', 'our', 'you',
  'your', 'i', 'me', 'my', 'find', 'prove', 'show', 'evaluate', 'state', 'calculate',
  'determine', 'hence', 'using', 'also', 'where', 'given', 'solve', 'let', 'if', 'then'
]);

// Basic morphological stemming for stem consolidation
function stemWord(word: string): string {
  if (word.length <= 4) return word;
  return word
    .replace(/(ation|ations|ting|tion|tions)$/, '')
    .replace(/(ing|ings|ed|ies|ly|es|s)$/, '')
    .replace(/(able|ible|ment|ness)$/, '');
}

/**
 * Automatically classifies whether a question is on a Numerical, Derivation, or Theory basis
 */
export function inferQuestionNature(text: string): 'Numerical' | 'Derivation' | 'Theory' {
  const lower = text.toLowerCase();

  // Numerical indicators
  if (
    lower.includes('calculate') ||
    lower.includes('compute') ||
    lower.includes('find the value') ||
    lower.includes('determine the power') ||
    lower.includes('determine the work') ||
    lower.includes('find work') ||
    lower.includes('evaluate the integral') ||
    /\b\d+(\.\d+)?\s*(kw|kpa|mpa|bar|m\/s|kj|kj\/kg|kg\/s|mm|m\^3|celsius|°c)\b/i.test(text)
  ) {
    return 'Numerical';
  }

  // Derivation indicators
  if (
    lower.includes('derive') ||
    lower.includes('prove') ||
    lower.includes('show that') ||
    lower.includes('deduce') ||
    lower.includes('obtain an expression') ||
    lower.includes('state and prove')
  ) {
    return 'Derivation';
  }

  return 'Theory';
}

/**
 * Tokenizes text, preserving compound mathematical and technical phrases
 */
function extractTokens(text: string): { words: string[]; ngrams: string[]; charNgrams: string[] } {
  if (!text) return { words: [], ngrams: [], charNgrams: [] };

  const cleaned = text
    .toLowerCase()
    .replace(/\\(frac|partial|int|iint|iiint|sum|prod)/g, ' $1 ')
    .replace(/[∂∇∬∭∮]/g, ' derivative integral ')
    .replace(/[^a-z0-9_\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const rawWords = cleaned.split(' ').filter((w) => w.length >= 2);
  const words: string[] = [];
  const stemmedWords: string[] = [];

  for (const w of rawWords) {
    if (!STOP_WORDS.has(w)) {
      words.push(w);
      stemmedWords.push(stemWord(w));
    }
  }

  // Generate word bigrams & trigrams
  const ngrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    ngrams.push(`${words[i]} ${words[i + 1]}`);
    if (i < words.length - 2) {
      ngrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }

  // Character 3-grams for OCR typo resilience
  const charNgrams: string[] = [];
  for (const word of words) {
    if (word.length >= 4) {
      for (let i = 0; i <= word.length - 3; i++) {
        charNgrams.push(`c:${word.slice(i, i + 3)}`);
      }
    }
  }

  return { words: [...words, ...stemmedWords], ngrams, charNgrams };
}

/**
 * Builds an enriched text representation for a syllabus unit
 */
function buildSyllabusUnitText(topic: SyllabusTopic, courseId?: string): string {
  const parts: string[] = [
    topic.title,
    topic.description || '',
    ...(topic.subtopics || []),
    topic.referenceBookChapters || ''
  ];

  // Inject known domain concepts for this subject if matched
  if (courseId) {
    const cid = courseId.toLowerCase();
    const key = Object.keys(SUBJECT_DOMAIN_CONCEPTS).find(
      (k) => cid.includes(k) || (k === 'mechanical' && (cid.includes('gmu') || cid.includes('gme')))
    );
    if (key) {
      const unitConcepts = SUBJECT_DOMAIN_CONCEPTS[key].find((c) => c.unit === topic.unit);
      if (unitConcepts) {
        parts.push(...unitConcepts.keyTerms);
      }
    }
  }

  return parts.join(' ');
}

/**
 * Creates an L2-normalized sparse embedding vector from token stream
 */
function createEmbeddingVector(
  tokenData: { words: string[]; ngrams: string[]; charNgrams: string[] },
  idfMap: Map<string, number>
): SparseEmbeddingVector {
  const termCounts = new Map<string, number>();

  tokenData.words.forEach((t) => termCounts.set(t, (termCounts.get(t) || 0) + 1.0));
  tokenData.ngrams.forEach((t) => termCounts.set(t, (termCounts.get(t) || 0) + 2.5));
  tokenData.charNgrams.forEach((t) => termCounts.set(t, (termCounts.get(t) || 0) + 0.3));

  const dimensions = new Map<string, number>();
  let sumSq = 0;

  for (const [term, tf] of termCounts.entries()) {
    const idf = idfMap.get(term) || 1.8;
    const weight = (1 + Math.log(tf)) * idf;
    dimensions.set(term, weight);
    sumSq += weight * weight;
  }

  const magnitude = Math.sqrt(sumSq) || 1e-6;

  for (const [term, val] of dimensions.entries()) {
    dimensions.set(term, val / magnitude);
  }

  return { dimensions, magnitude };
}

/**
 * Computes Cosine Similarity between two sparse vectors
 */
export function computeCosineSimilarity(
  vecA: SparseEmbeddingVector,
  vecB: SparseEmbeddingVector
): number {
  if (vecA.dimensions.size === 0 || vecB.dimensions.size === 0) return 0;

  const [smaller, larger] =
    vecA.dimensions.size <= vecB.dimensions.size
      ? [vecA.dimensions, vecB.dimensions]
      : [vecB.dimensions, vecA.dimensions];

  let dotProduct = 0;
  for (const [term, weightA] of smaller.entries()) {
    const weightB = larger.get(term);
    if (weightB !== undefined) {
      dotProduct += weightA * weightB;
    }
  }

  return Math.min(1.0, Math.max(0.0, dotProduct));
}

// ----------------------------------------------------------------------
// Syllabus Corpus Vector Space Registry Cache
// ----------------------------------------------------------------------
interface SyllabusVectorModel {
  courseId: string;
  idfMap: Map<string, number>;
  unitVectors: {
    unit: SyllabusTopic;
    vector: SparseEmbeddingVector;
    rawText: string;
    tokenData: { words: string[]; ngrams: string[]; charNgrams: string[] };
    subtopicVectors: {
      subtopicName: string;
      vector: SparseEmbeddingVector;
      tokens: { words: string[]; ngrams: string[]; charNgrams: string[] };
    }[];
  }[];
}

const VECTOR_MODEL_CACHE = new Map<string, SyllabusVectorModel>();

function getOrBuildSyllabusVectorModel(course: Course): SyllabusVectorModel {
  const cacheKey = `${course.id}_${course.syllabus.length}`;
  const existing = VECTOR_MODEL_CACHE.get(cacheKey);
  if (existing) return existing;

  const docCount = course.syllabus.length;
  const docFreq = new Map<string, number>();

  const unitTokenList = course.syllabus.map((topic) => {
    const unitText = buildSyllabusUnitText(topic, course.id);
    const tokens = extractTokens(unitText);
    const uniqueTermsInUnit = new Set([...tokens.words, ...tokens.ngrams, ...tokens.charNgrams]);

    for (const term of uniqueTermsInUnit) {
      docFreq.set(term, (docFreq.get(term) || 0) + 1);
    }

    return { topic, unitText, tokens };
  });

  const idfMap = new Map<string, number>();
  for (const [term, df] of docFreq.entries()) {
    idfMap.set(term, Math.log((docCount + 1) / (df + 1)) + 1.2);
  }

  const unitVectors = unitTokenList.map(({ topic, unitText, tokens }) => {
    // Also build vector for each subtopic
    const subtopicVectors = (topic.subtopics || []).map((sub) => {
      const subTokens = extractTokens(`${sub} ${topic.title}`);
      return {
        subtopicName: sub,
        vector: createEmbeddingVector(subTokens, idfMap),
        tokens: subTokens
      };
    });

    return {
      unit: topic,
      vector: createEmbeddingVector(tokens, idfMap),
      rawText: unitText,
      tokenData: tokens,
      subtopicVectors
    };
  });

  const model: SyllabusVectorModel = {
    courseId: course.id,
    idfMap,
    unitVectors
  };

  VECTOR_MODEL_CACHE.set(cacheKey, model);
  return model;
}

// ----------------------------------------------------------------------
// Core API: Map Question to Syllabus Unit & Subtopic Using Vector Embedding
// ----------------------------------------------------------------------
export function mapQuestionToSyllabus(
  questionText: string,
  syllabus: SyllabusTopic[],
  courseId?: string,
  preferredExamType?: ExamType
): SemanticMappingResult {
  const nature = inferQuestionNature(questionText);

  if (!syllabus || syllabus.length === 0) {
    return {
      topicId: 'u1',
      topicName: 'Core Syllabus Unit',
      subtopicName: 'General Concepts',
      questionNature: nature,
      unitNumber: 1,
      confidence: 70,
      cosineSimilarity: 0.5,
      matchedKeywords: [],
      semanticMatchReason: 'Default assignment: syllabus empty',
      candidateRankings: []
    };
  }

  const dummyCourse: Course = {
    id: courseId || 'temp',
    name: 'Course',
    code: 'CODE',
    semester: 'Semester 1',
    semesterNumber: 1,
    credits: '4 Credits (3L-1T-0P)',
    examTarget: 'MST-1',
    syllabus,
    referenceBooks: [],
    questions: [],
    teacherInsights: [],
    videoRecommendations: []
  };

  const model = getOrBuildSyllabusVectorModel(dummyCourse);
  const qTokens = extractTokens(questionText);
  const qVector = createEmbeddingVector(qTokens, model.idfMap);

  const rankings = model.unitVectors.map(({ unit, vector, tokenData, subtopicVectors }) => {
    let similarity = computeCosineSimilarity(qVector, vector);

    if (preferredExamType === 'MST-1' && unit.unit <= 2) {
      similarity += 0.04;
    } else if (preferredExamType === 'MST-2' && (unit.unit === 3 || unit.unit === 4)) {
      similarity += 0.04;
    }

    const unitWordSet = new Set(tokenData.words);
    const unitNgramSet = new Set(tokenData.ngrams);

    const matchedWords = qTokens.words.filter((w) => unitWordSet.has(w));
    const matchedNgrams = qTokens.ngrams.filter((ng) => unitNgramSet.has(ng));
    const combinedMatches = Array.from(new Set([...matchedNgrams, ...matchedWords])).slice(0, 5);

    // Find best matching subtopic
    let bestSubtopic = subtopicVectors[0]?.subtopicName || unit.subtopics?.[0] || unit.title;
    let highestSubSim = -1;
    for (const sub of subtopicVectors) {
      const subSim = computeCosineSimilarity(qVector, sub.vector);
      if (subSim > highestSubSim) {
        highestSubSim = subSim;
        bestSubtopic = sub.subtopicName;
      }
    }

    return {
      unitNumber: unit.unit,
      topicId: unit.id,
      topicName: unit.title,
      subtopicName: bestSubtopic,
      similarity,
      matchedKeywords: combinedMatches
    };
  });

  rankings.sort((a, b) => b.similarity - a.similarity);

  const best = rankings[0];
  const second = rankings[1];

  const margin = second ? Math.max(0, best.similarity - second.similarity) : 0.3;
  const rawConf = 72 + Math.min(27, Math.round(best.similarity * 35 + margin * 30));
  const confidence = Math.min(99, Math.max(70, rawConf));

  const keywordText = best.matchedKeywords.length > 0
    ? `[${best.matchedKeywords.slice(0, 3).join(', ')}]`
    : `curriculum structure`;

  const reason = best.similarity > 0.08
    ? `Semantic vector match on ${keywordText} with Unit ${best.unitNumber}: ${best.topicName} (Vector Cosine Sim: ${best.similarity.toFixed(3)})`
    : `Mapped to Unit ${best.unitNumber}: ${best.topicName} based on syllabus module distribution`;

  return {
    topicId: best.topicId,
    topicName: best.topicName,
    subtopicName: best.subtopicName,
    questionNature: nature,
    unitNumber: best.unitNumber,
    confidence,
    cosineSimilarity: Math.round(best.similarity * 1000) / 1000,
    matchedKeywords: best.matchedKeywords,
    semanticMatchReason: reason,
    candidateRankings: rankings.map((r) => ({
      unitNumber: r.unitNumber,
      topicId: r.topicId,
      topicName: r.topicName,
      similarity: Math.round(r.similarity * 1000) / 1000
    }))
  };
}

/**
 * Re-maps all questions across a course using the semantic embedding engine
 */
export function reMapCourseQuestionsWithEmbeddings(course: Course): Question[] {
  return course.questions.map((q) => {
    const result = mapQuestionToSyllabus(
      q.text,
      course.syllabus,
      course.id,
      q.examType
    );

    return {
      ...q,
      topicId: result.topicId,
      topicName: result.topicName,
      subtopicName: q.subtopicName || result.subtopicName,
      questionNature: q.questionNature || result.questionNature,
      mappingConfidence: result.confidence,
      semanticMatchReason: result.semanticMatchReason
    };
  });
}

// ----------------------------------------------------------------------
// Multi-MST Frequency & Reweighted Probability Intelligence Engine
// ----------------------------------------------------------------------

/**
 * Computes granular Subtopic-Level Exam Importance & Probability
 * Each subtopic's probability = (MSTs where subtopic was asked / Total uploaded MSTs) * 100%
 * Frequency = total count of questions appearing on this subtopic
 * Reweighting = frequency weight + marks weight
 */
export function computeSubtopicsAnalysis(
  course: Course,
  targetScope: 'all' | 'MST-1' | 'MST-2' | 'End-Sem' = 'all',
  customPapers?: ExamPaperRecord[]
): SubtopicExamImportance[] {
  // 1. Gather all user-uploaded papers strictly for THIS course
  const storedPapers = (customPapers || loadStoredPapers(course.id)).filter((p) => !isDemoPaper(p));

  const allPapersMap = new Map<string, ExamPaperRecord>();
  if (course.examPapers) {
    course.examPapers.filter((p) => !isDemoPaper(p)).forEach((p) => allPapersMap.set(p.id, p));
  }
  storedPapers.forEach((p) => allPapersMap.set(p.id, p));

  const allPapers = Array.from(allPapersMap.values());
  const mstPapers = allPapers.filter((p) =>
    targetScope === 'all'
      ? p.examType.startsWith('MST')
      : p.examType === targetScope
  );

  const totalMstsUploaded = mstPapers.length > 0 ? mstPapers.length : Math.max(1, allPapers.length);
  const totalQuestionsInCourse = Math.max(1, course.questions.length);
  const totalMarksInCourse = Math.max(1, course.questions.reduce((sum, q) => sum + (q.marks || 0), 0));

  const subtopicsList: SubtopicExamImportance[] = [];

  // Iterate each unit and each subtopic
  course.syllabus.forEach((unit) => {
    const subtopics = unit.subtopics && unit.subtopics.length > 0 ? unit.subtopics : [unit.title];

    subtopics.forEach((subName, sIdx) => {
      const subId = `${unit.id}-sub-${sIdx}`;

      // Identify questions matching this subtopic
      const matchingQuestions = course.questions.filter((q) => {
        if (q.subtopicName && q.subtopicName.toLowerCase() === subName.toLowerCase()) {
          return true;
        }
        if (q.topicId === unit.id) {
          // Check semantic similarity with this subtopic
          const qLower = q.text.toLowerCase();
          const subLower = subName.toLowerCase();
          const subKeywords = subLower.split(/[\s,;:()\/-]+/).filter((w) => w.length > 3 && !STOP_WORDS.has(w));
          const hitCount = subKeywords.filter((k) => qLower.includes(k)).length;
          return hitCount >= 2 || (subKeywords.length <= 2 && hitCount >= 1);
        }
        return false;
      });

      const appearanceFrequency = matchingQuestions.length;
      const totalMarks = matchingQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

      // Question nature preference
      let numCount = 0;
      let derivCount = 0;
      let theoryCount = 0;

      matchingQuestions.forEach((q) => {
        const nat = q.questionNature || inferQuestionNature(q.text);
        if (nat === 'Numerical') numCount++;
        else if (nat === 'Derivation') derivCount++;
        else theoryCount++;
      });

      const questionNature: 'Numerical' | 'Derivation' | 'Theory' =
        numCount >= derivCount && numCount >= theoryCount
          ? 'Numerical'
          : derivCount >= theoryCount
          ? 'Derivation'
          : 'Theory';

      // Find in which uploaded MSTs this subtopic appeared
      const mstsFoundSet = new Set<string>();
      const foundInMsts: SubtopicExamImportance['foundInMsts'] = [];

      allPapers.forEach((paper) => {
        const qsInPaper = matchingQuestions.filter(
          (q) => (q.paperId && q.paperId === paper.id) || (!q.paperId && q.paperYear === paper.year && q.examType === paper.examType)
        );

        if (qsInPaper.length > 0) {
          if (paper.examType.startsWith('MST') || targetScope !== 'all') {
            mstsFoundSet.add(paper.id);
          }
          qsInPaper.forEach((q) => {
            foundInMsts.push({
              paperId: paper.id,
              paperName: paper.name,
              examType: paper.examType,
              year: paper.year,
              questionNumber: q.questionNumber || 'Q1',
              marks: q.marks,
              basis: q.questionNature || inferQuestionNature(q.text),
              snippet: q.text.slice(0, 100) + (q.text.length > 100 ? '...' : '')
            });
          });
        }
      });

      const mstsFoundCount = mstsFoundSet.size;

      // Exact Probability: (MSTs with this subtopic / total uploaded MSTs) * 100%
      const examProbability =
        totalMstsUploaded > 0 ? Math.round((mstsFoundCount / totalMstsUploaded) * 100) : 0;

      // Reweighted Score: Combines frequency weight (55%) + marks weight (35%) + probability (10%)
      const wFreq = (appearanceFrequency / totalQuestionsInCourse) * 100;
      const wMarks = (totalMarks / totalMarksInCourse) * 100;
      const reweightedScore = Math.min(
        100,
        Math.max(
          appearanceFrequency > 0 ? 30 : 5,
          Math.round(wFreq * 0.55 + wMarks * 0.35 + examProbability * 0.1)
        )
      );

      // Importance Ranking: Frequency matters more than probability!
      let importanceTier: SubtopicExamImportance['importanceTier'] = 'Low / Optional';
      if (appearanceFrequency >= 2 || totalMarks >= 12) {
        importanceTier = 'High Importance (Crucial)';
      } else if (appearanceFrequency >= 1 || examProbability >= 50) {
        importanceTier = 'Medium Importance';
      } else {
        importanceTier = 'Low / Optional';
      }

      subtopicsList.push({
        subtopicId: subId,
        subtopicName: subName,
        unitNumber: unit.unit,
        unitTitle: unit.title,
        unitId: unit.id,
        questionNature,
        appearanceFrequency,
        totalMarks,
        examProbability,
        reweightedScore,
        importanceTier,
        mstsFoundCount,
        totalMstsUploaded,
        foundInMsts
      });
    });
  });

  // Sort primarily by Frequency, then by Reweighted Score
  return subtopicsList.sort((a, b) => {
    if (b.appearanceFrequency !== a.appearanceFrequency) {
      return b.appearanceFrequency - a.appearanceFrequency;
    }
    return b.reweightedScore - a.reweightedScore;
  });
}

/**
 * Computes Course Unit-Level Exam Importance & Reweighted Scores
 */
export function computeTopicExamImportance(
  course: Course,
  targetScope: 'all' | 'MST-1' | 'MST-2' | 'End-Sem' = 'all',
  customPapers?: ExamPaperRecord[]
): TopicExamImportance[] {
  const storedPapers = (customPapers || loadStoredPapers(course.id)).filter((p) => !isDemoPaper(p));

  const allPapersMap = new Map<string, ExamPaperRecord>();
  if (course.examPapers) {
    course.examPapers.filter((p) => !isDemoPaper(p)).forEach((p) => allPapersMap.set(p.id, p));
  }
  storedPapers.forEach((p) => allPapersMap.set(p.id, p));

  const allPapers = Array.from(allPapersMap.values());
  const mstPapers = allPapers.filter((p) => p.examType.startsWith('MST'));
  const totalMstPapersCount = mstPapers.length;
  const totalPapersCount = allPapers.length;

  const totalQuestionsInCourse = Math.max(1, course.questions.length);
  const totalMarksInCourse = Math.max(1, course.questions.reduce((sum, q) => sum + (q.marks || 0), 0));

  const allSubtopics = computeSubtopicsAnalysis(course, targetScope, customPapers);

  const results: TopicExamImportance[] = course.syllabus.map((topic) => {
    const isPrimaryScopeForTarget =
      targetScope === 'all'
        ? true
        : targetScope === 'MST-1'
        ? topic.unit <= 2
        : targetScope === 'MST-2'
        ? topic.unit >= 3 && topic.unit <= 4
        : true;

    // Subtopics belonging to this unit
    const unitSubtopics = allSubtopics.filter((s) => s.unitId === topic.id);

    // Questions belonging to this unit
    const topicQuestions = course.questions.filter((q) => q.topicId === topic.id);
    const appearanceFrequency = topicQuestions.length;
    const totalMarks = topicQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

    // Appearances in papers
    const appearedPaperTags: PaperAppearanceTag[] = [];
    const paperIdsAppeared = new Set<string>();

    allPapers.forEach((paper) => {
      const qsInPaper = topicQuestions.filter(
        (q) => (q.paperId && q.paperId === paper.id) || (!q.paperId && q.paperYear === paper.year && q.examType === paper.examType)
      );

      if (qsInPaper.length > 0) {
        paperIdsAppeared.add(paper.id);
        const marksInPaper = qsInPaper.reduce((sum, q) => sum + (q.marks || 0), 0);
        const qNums = qsInPaper.map((q) => q.questionNumber || 'Q1').join(', ');

        appearedPaperTags.push({
          paperId: paper.id,
          paperName: paper.name,
          year: paper.year,
          examType: paper.examType,
          matchedKeywords: [qNums ? `Q: ${qNums}` : 'Syllabus Match'],
          marks: marksInPaper
        });
      }
    });

    const mstAppearedTags = appearedPaperTags.filter((t) => t.examType.startsWith('MST'));
    const mstPapersAppearedCount = mstAppearedTags.length;

    // Exact Probability: (MSTs containing this unit / total uploaded MSTs) * 100%
    const examProbability =
      totalMstPapersCount > 0 ? Math.round((mstPapersAppearedCount / totalMstPapersCount) * 100) : 0;

    // Reweighted Score: Combines frequency (55%) + marks weightage (35%) + probability (10%)
    const wFreq = (appearanceFrequency / totalQuestionsInCourse) * 100;
    const wMarks = (totalMarks / totalMarksInCourse) * 100;
    const reweightedScore = Math.min(
      100,
      Math.max(
        appearanceFrequency > 0 ? 35 : 10,
        Math.round(wFreq * 0.55 + wMarks * 0.35 + examProbability * 0.1)
      )
    );

    // Importance Ranking: Frequency matters more than probability!
    let importanceTier: TopicExamImportance['importanceTier'] = 'Tier 3 (Moderate Yield)';
    if (appearanceFrequency >= 4 || totalMarks >= 20) {
      importanceTier = 'Tier 1 (Crucial Must-Do)';
    } else if (appearanceFrequency >= 2 || (examProbability >= 60 && appearanceFrequency >= 1)) {
      importanceTier = 'Tier 2 (High Probability)';
    } else if (appearanceFrequency >= 1) {
      importanceTier = 'Tier 3 (Moderate Yield)';
    } else {
      importanceTier = 'Tier 4 (Low / Optional)';
    }

    let recommendedPrepStrategy = '';
    if (!isPrimaryScopeForTarget && targetScope !== 'all') {
      recommendedPrepStrategy = `Unit ${topic.unit} is outside current ${targetScope} exam syllabus.`;
    } else if (appearanceFrequency >= 3) {
      recommendedPrepStrategy = `High-frequency topic: ${appearanceFrequency} questions repeated across uploaded MSTs. Prioritize numerical practice & standard derivations.`;
    } else if (appearanceFrequency >= 1) {
      recommendedPrepStrategy = `Appeared in uploaded MSTs. Master core definitions and 2 solved examples.`;
    } else {
      recommendedPrepStrategy = `Standard syllabus topic. Awaiting more uploaded past papers.`;
    }

    return {
      topicId: topic.id,
      topicName: topic.title,
      unit: topic.unit,
      examImportanceScore: reweightedScore,
      appearanceFrequency,
      totalMarks,
      examProbability,
      reweightedScore,
      mstRecurrenceProbability: examProbability,
      endSemRecurrenceProbability: examProbability,
      overallProbability: examProbability,
      importanceTier,
      mstPapersAppearedCount,
      totalMstPapersCount,
      endSemPapersAppearedCount: 0,
      totalEndSemPapersCount: 0,
      totalPapersCrossReferenced: totalPapersCount,
      appearedPaperTags,
      averageMarksYield: appearanceFrequency > 0 ? Math.round((totalMarks / appearanceFrequency) * 10) / 10 : 0,
      recommendedPrepStrategy,
      isPrimaryScopeForTarget,
      subtopicsAnalysis: unitSubtopics
    };
  });

  return results.sort((a, b) => b.appearanceFrequency - a.appearanceFrequency || b.reweightedScore - a.reweightedScore);
}

/**
 * Computes course-level executive summary of exam intelligence
 */
export function computeCourseExamIntelligenceSummary(
  course: Course,
  targetScope: 'all' | 'MST-1' | 'MST-2' | 'End-Sem' = 'all',
  customPapers?: ExamPaperRecord[]
): CourseExamIntelligenceSummary {
  const topicScores = computeTopicExamImportance(course, targetScope, customPapers);
  const storedPapers = (customPapers || loadStoredPapers(course.id)).filter((p) => !isDemoPaper(p));

  const allPapersMap = new Map<string, ExamPaperRecord>();
  if (course.examPapers) {
    course.examPapers.filter((p) => !isDemoPaper(p)).forEach((p) => allPapersMap.set(p.id, p));
  }
  storedPapers.forEach((p) => allPapersMap.set(p.id, p));

  const allPapers = Array.from(allPapersMap.values());
  const mstPapersCount = allPapers.filter((p) => p.examType.startsWith('MST')).length;
  const endSemPapersCount = allPapers.filter((p) => p.examType === 'End-Sem').length;

  const inScopeTopics = topicScores.filter((t) => t.isPrimaryScopeForTarget);
  const avgScore =
    inScopeTopics.length > 0
      ? Math.round(inScopeTopics.reduce((s, t) => s + t.reweightedScore, 0) / inScopeTopics.length)
      : Math.round(topicScores.reduce((s, t) => s + t.reweightedScore, 0) / topicScores.length);

  const coveredTopicsCount = topicScores.filter((t) => t.appearanceFrequency > 0).length;
  const syllabusCoverageRate = Math.round((coveredTopicsCount / course.syllabus.length) * 100);

  return {
    totalPapersAnalyzed: allPapers.length,
    mstPapersCount,
    endSemPapersCount,
    averageImportanceScore: avgScore,
    topRankedTopics: topicScores.slice(0, 3),
    syllabusCoverageRate,
    activeExamScope: targetScope
  };
}

/**
 * Surfaces exam importance metrics for an individual question in the PYQ bank
 */
export function getQuestionExamImportance(
  question: Question,
  topicScores: TopicExamImportance[]
): {
  importanceScore: number;
  recurrenceProbability: number;
  importanceTier: string;
  badgeLabel: string;
  colorClass: string;
  mstRatioLabel: string;
} {
  const matchedTopic = topicScores.find((t) => t.topicId === question.topicId);

  if (!matchedTopic) {
    const defaultProb = question.marks >= 7 ? 85 : 70;
    return {
      importanceScore: defaultProb,
      recurrenceProbability: defaultProb,
      importanceTier: 'Tier 2 (High Probability)',
      badgeLabel: `${defaultProb}% Probable`,
      colorClass: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      mstRatioLabel: 'Appeared in Past Papers'
    };
  }

  const prob = matchedTopic.examProbability;
  const score = matchedTopic.reweightedScore;
  const tier = matchedTopic.importanceTier;

  const colorClass =
    score >= 70 || matchedTopic.appearanceFrequency >= 2
      ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
      : score >= 40 || matchedTopic.appearanceFrequency >= 1
      ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
      : 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30';

  const mstRatioLabel = `In ${matchedTopic.mstPapersAppearedCount}/${matchedTopic.totalMstPapersCount} MST Papers (${matchedTopic.appearanceFrequency} Questions)`;

  return {
    importanceScore: score,
    recurrenceProbability: prob,
    importanceTier: tier,
    badgeLabel: `${score} Reweighted`,
    colorClass,
    mstRatioLabel
  };
}
