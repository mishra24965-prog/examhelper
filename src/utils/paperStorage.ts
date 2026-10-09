import { Course, ExamPaperRecord, Question, ExamType } from '../types';

/**
 * Subject-Specific Exam Papers & Questions Repository
 * Ensures every subject (GMU / General Mechanical Engineering, Applied Mathematics-I,
 * Chemistry, Electronics, etc.) maintains strictly its own uploaded and pre-loaded MST papers.
 */

// ----------------------------------------------------------------------
// 1. GMU (General Mechanical Engineering - 1RMES3) Pre-Loaded MST Papers
// ----------------------------------------------------------------------
const GMU_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-gmu-mst1-2024',
    name: 'MST-1 Examination 2024 (General Mechanical Engineering)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 12, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[OCR SCAN - IET-DAVV - MID-SEMESTER TEST 1]
COURSE: General Mechanical Engineering (1RMES3)   YEAR: 2024
Time: 1 Hour | Max Marks: 20

Q1. (a) A gas turbine receives 10 kg/s of air at 400 kPa, 300°C with velocity 60 m/s and expands to 100 kPa, 150°C with velocity 150 m/s. The heat loss from the turbine casing is 25 kW. Using the Steady Flow Energy Equation (SFEE), determine the power developed by the turbine in kW. Take cp = 1.005 kJ/kg-K. [7 Marks]
Q1. (b) Derive the general Steady Flow Energy Equation (SFEE) from the First Law of Thermodynamics for an open system. State all governing assumptions. [5 Marks]

Q2. (a) A closed system undergoes a thermodynamic cycle comprising three processes: (1-2) Reversible adiabatic compression with W12 = -40 kJ; (2-3) Constant volume heat addition with Q23 = 90 kJ; (3-1) Constant pressure expansion to original state with Q31 = -30 kJ. Calculate the net work done and change in internal energy for each process. [5 Marks]
Q2. (b) Differentiate between open, closed, and isolated thermodynamic systems. Explain the concept of thermodynamic equilibrium with mechanical, chemical, and thermal conditions. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: General Mechanical Engineering (1RMES3)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) A gas turbine receives 10 kg/s of air at 400 kPa, 300°C with velocity 60 m/s and expands to 100 kPa, 150°C with velocity 150 m/s. The heat loss from the turbine casing is 25 kW. Using the Steady Flow Energy Equation (SFEE), determine the power developed by the turbine in kW. Take cp = 1.005 kJ/kg-K. [7 Marks]
Q1. (b) Derive the general Steady Flow Energy Equation (SFEE) from the First Law of Thermodynamics for an open system. State all governing assumptions. [5 Marks]

Q2. (a) A closed system undergoes a thermodynamic cycle comprising three processes: (1-2) Reversible adiabatic compression with W12 = -40 kJ; (2-3) Constant volume heat addition with Q23 = 90 kJ; (3-1) Constant pressure expansion to original state with Q31 = -30 kJ. Calculate the net work done and change in internal energy for each process. [5 Marks]
Q2. (b) Differentiate between open, closed, and isolated thermodynamic systems. Explain the concept of thermodynamic equilibrium with mechanical, chemical, and thermal conditions. [3 Marks]`
  },
  {
    id: 'paper-gmu-mst2-2024',
    name: 'MST-2 Examination 2024 (General Mechanical Engineering)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 20, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[OCR SCAN - IET-DAVV - MID-SEMESTER TEST 2]
COURSE: General Mechanical Engineering (1RMES3)   YEAR: 2024
Time: 1 Hour | Max Marks: 20

Q1. (a) Derive the air-standard efficiency of an Otto cycle in terms of compression ratio (r) and adiabatic index (gamma). Draw the cycle clearly on p-v and T-s diagrams. [6 Marks]
Q1. (b) An engine operating on air-standard Diesel cycle has a cylinder bore of 200 mm, stroke of 300 mm, and clearance volume of 0.0006 m^3. If cut-off takes place at 5% of the stroke, calculate the compression ratio and air-standard efficiency. [6 Marks]

Q2. (a) Calculate the specific enthalpy, specific volume, and internal energy of 1 kg of wet steam at a pressure of 10 bar having a dryness fraction of 0.90 using steam tables. [5 Marks]
Q2. (b) Define critical point and triple point for water on a temperature-entropy (T-s) diagram. Explain why dryness fraction has no meaning beyond the critical point. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: General Mechanical Engineering (1RMES3)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Derive the air-standard efficiency of an Otto cycle in terms of compression ratio (r) and adiabatic index (gamma). Draw the cycle clearly on p-v and T-s diagrams. [6 Marks]
Q1. (b) An engine operating on air-standard Diesel cycle has a cylinder bore of 200 mm, stroke of 300 mm, and clearance volume of 0.0006 m^3. If cut-off takes place at 5% of the stroke, calculate the compression ratio and air-standard efficiency. [6 Marks]

Q2. (a) Calculate the specific enthalpy, specific volume, and internal energy of 1 kg of wet steam at a pressure of 10 bar having a dryness fraction of 0.90 using steam tables. [5 Marks]
Q2. (b) Define critical point and triple point for water on a temperature-entropy (T-s) diagram. Explain why dryness fraction has no meaning beyond the critical point. [3 Marks]`
  },
  {
    id: 'paper-gmu-mst1-2023',
    name: 'MST-1 Examination 2023 (General Mechanical Engineering)',
    year: 2023,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Sep 28, 2023',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[OCR SCAN - IET-DAVV - MID-SEMESTER TEST 1 - 2023]
COURSE: General Mechanical Engineering (1RMES3)   YEAR: 2023
Time: 1 Hour | Max Marks: 20

Q1. (a) Air flows steadily at the rate of 0.5 kg/s through an air compressor, entering at 7 m/s, 100 kPa, 0.95 m^3/kg and leaving at 5 m/s, 700 kPa, 0.19 m^3/kg. The internal energy of the air leaving is 90 kJ/kg greater than that entering. Cooling water in the jacket absorbs heat from the air at the rate of 58 kW. Compute the rate of shaft work input to the air using SFEE. [7 Marks]
Q1. (b) Show that for a reversible polytropic process p v^n = C, the work done during expansion from (p1, v1) to (p2, v2) is given by W = (p1 v1 - p2 v2) / (n - 1). [5 Marks]

Q2. (a) A fluid in a piston-cylinder device is heated at constant pressure of 2 bar from an initial volume of 0.05 m^3 to 0.15 m^3. During the process, 50 kJ of heat is supplied. Find the work done and the change in internal energy. [5 Marks]
Q2. (b) State the Zeroth Law of Thermodynamics and explain how it forms the fundamental basis of temperature measurement. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2023
COURSE: General Mechanical Engineering (1RMES3)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Air flows steadily at the rate of 0.5 kg/s through an air compressor, entering at 7 m/s, 100 kPa, 0.95 m^3/kg and leaving at 5 m/s, 700 kPa, 0.19 m^3/kg. The internal energy of the air leaving is 90 kJ/kg greater than that entering. Cooling water in the jacket absorbs heat from the air at the rate of 58 kW. Compute the rate of shaft work input to the air using SFEE. [7 Marks]
Q1. (b) Show that for a reversible polytropic process p v^n = C, the work done during expansion from (p1, v1) to (p2, v2) is given by W = (p1 v1 - p2 v2) / (n - 1). [5 Marks]

Q2. (a) A fluid in a piston-cylinder device is heated at constant pressure of 2 bar from an initial volume of 0.05 m^3 to 0.15 m^3. During the process, 50 kJ of heat is supplied. Find the work done and the change in internal energy. [5 Marks]
Q2. (b) State the Zeroth Law of Thermodynamics and explain how it forms the fundamental basis of temperature measurement. [3 Marks]`
  }
];

// ----------------------------------------------------------------------
// 2. Math-I (Applied Mathematics-I - 1RABS1) Pre-Loaded MST Papers
// ----------------------------------------------------------------------
const MATH1_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-math1-mst1-2024',
    name: 'MST-1 Examination 2024 (Applied Mathematics-I)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 15, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[OCR SCAN - IET-DAVV - MID-SEMESTER TEST 1]
COURSE: Applied Mathematics-I (1RABS1)   YEAR: 2024
Time: 1 Hour | Max Marks: 20

Q1. (a) If y = (sin^-1 x)^2, prove using Leibnitz's theorem that (1-x^2) y_(n+2) - (2n+1)x y_(n+1) - n^2 y_n = 0. Hence find y_n at x=0. [6 Marks]
Q1. (b) Expand log(1 + e^x) in powers of x up to x^3 using Maclaurin's theorem. [4 Marks]

Q2. (a) If u = sin^-1((x + y)/(√x + √y)), show that x(∂u/∂x) + y(∂u/∂y) = (1/2) tan u by Euler's theorem on homogeneous functions. [5 Marks]
Q2. (b) Find the Jacobian J = ∂(u,v)/∂(x,y) where u = x^2 - y^2 and v = 2xy. Verify that J * J' = 1. [5 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: Applied Mathematics-I (1RABS1)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) If y = (sin^-1 x)^2, prove using Leibnitz's theorem that (1 - x^2) y_(n+2) - (2n+1)x y_(n+1) - n^2 y_n = 0. Hence find y_n at x = 0. [6 Marks]
Q1. (b) Expand log(1 + e^x) in powers of x up to x^3 using Maclaurin's theorem. [4 Marks]

Q2. (a) If u = sin^-1((x + y)/(√x + √y)), show that x(∂u/∂x) + y(∂u/∂y) = (1/2) tan u by Euler's theorem on homogeneous functions. [5 Marks]
Q2. (b) Find the Jacobian J = ∂(u,v)/∂(x,y) where u = x^2 - y^2 and v = 2xy. Verify that J * J' = 1. [5 Marks]`
  },
  {
    id: 'paper-math1-mst2-2024',
    name: 'MST-2 Examination 2024 (Applied Mathematics-I)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 22, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[OCR SCAN - IET-DAVV - MID-SEMESTER TEST 2]
COURSE: Applied Mathematics-I (1RABS1)   YEAR: 2024
Time: 1 Hour | Max Marks: 20

Q1. (a) Change the order of integration of ∬ x y dx dy over the parabolic region bounded by y = x^2 and y = 2 - x, and evaluate. [5 Marks]
Q1. (b) Prove that B(m,n) = Γ(m)Γ(n)/Γ(m+n) using double integrals and polar coordinates. [5 Marks]

Q2. (a) Verify Gauss Divergence Theorem for vector field F = (x^3 - yz)i - 2x^2 y j + 2k over the cube bounded by x=0, x=a, y=0, y=a, z=0, z=a. [5 Marks]
Q2. (b) Apply Green's Theorem in a plane to evaluate ∮ (xy + y^2) dx + x^2 dy where C is bounded by y = x and y = x^2. [5 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: Applied Mathematics-I (1RABS1)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Change the order of integration of ∬ x y dx dy over the parabolic region bounded by y = x^2 and y = 2 - x, and evaluate the integral. [5 Marks]
Q1. (b) Prove that B(m,n) = Γ(m)Γ(n)/Γ(m+n) using double integrals and polar coordinate transformation. [5 Marks]

Q2. (a) Verify Gauss Divergence Theorem for vector field F = (x^3 - yz)i - 2x^2 y j + 2k over the cube bounded by coordinate planes. [5 Marks]
Q2. (b) Apply Green's Theorem in a plane to evaluate ∮_C (xy + y^2) dx + x^2 dy where C is bounded by y = x and y = x^2. [5 Marks]`
  },
  {
    id: 'paper-math1-mst1-2023',
    name: 'MST-1 Examination 2023 (Applied Mathematics-I)',
    year: 2023,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Sep 30, 2023',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[OCR SCAN - IET-DAVV - MID-SEMESTER TEST 1 - 2023]
COURSE: Applied Mathematics-I (1RABS1)   YEAR: 2023
Time: 1 Hour | Max Marks: 20

Q1. (a) If y = e^(m sin^-1 x), prove using Leibnitz's theorem that (1-x^2) y_(n+2) - (2n+1)x y_(n+1) - (n^2 + m^2) y_n = 0. [6 Marks]
Q1. (b) Find the expansion of tan^-1(x) in powers of (x - 1) using Taylor's series up to third degree. [4 Marks]

Q2. (a) If u = log((x^3 + y^3)/(x + y)), verify Euler's theorem for homogeneous functions and evaluate x^2(∂^2 u/∂x^2) + 2xy(∂^2 u/∂x∂y) + y^2(∂^2 u/∂y^2). [5 Marks]
Q2. (b) If x = r cos θ and y = r sin θ, find the Jacobian ∂(x,y)/∂(r,θ) and show that J * J' = 1. [5 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2023
COURSE: Applied Mathematics-I (1RABS1)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) If y = e^(m sin^-1 x), prove using Leibnitz's theorem that (1 - x^2) y_(n+2) - (2n+1)x y_(n+1) - (n^2 + m^2) y_n = 0. [6 Marks]
Q1. (b) Find the expansion of tan^-1(x) in powers of (x - 1) using Taylor's theorem up to third degree terms. [4 Marks]

Q2. (a) If u = log((x^3 + y^3)/(x + y)), verify Euler's theorem on homogeneous functions. [5 Marks]
Q2. (b) If x = r cos θ and y = r sin θ, evaluate the transformation Jacobian ∂(x,y)/∂(r,θ). [5 Marks]`
  }
];

// ----------------------------------------------------------------------
// 3. Subject-Specific Pre-Loaded Questions
// ----------------------------------------------------------------------
const GMU_QUESTIONS: Question[] = [
  // From MST-1 2024
  {
    id: 'q-gmu-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2024',
    paperName: 'MST-1 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q1 (a)',
    text: 'A gas turbine receives 10 kg/s of air at 400 kPa, 300°C with velocity 60 m/s and expands to 100 kPa, 150°C with velocity 150 m/s. The heat loss from the turbine casing is 25 kW. Using the Steady Flow Energy Equation (SFEE), determine the power developed by the turbine in kW. Take cp = 1.005 kJ/kg-K.',
    marks: 7,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'Application of SFEE to Nozzle, Diffuser, Turbine, Compressor, and Throttling valve',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 96,
    semanticMatchReason: 'Direct semantic match with SFEE application to turbine & compressor',
    tags: ['SFEE', 'Turbine', 'First Law', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-gmu-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2024',
    paperName: 'MST-1 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q1 (b)',
    text: 'Derive the general Steady Flow Energy Equation (SFEE) from the First Law of Thermodynamics for an open system: h1 + V1^2/2 + gz1 + q = h2 + V2^2/2 + gz2 + w. State all governing assumptions.',
    marks: 5,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'Steady Flow Energy Equation (SFEE) derivation: h1 + V1^2/2 + gz1 + q = h2 + V2^2/2 + gz2 + w',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Standard 5-mark SFEE derivation from First Law',
    tags: ['SFEE Derivation', 'First Law', 'Open System', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-gmu-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2024',
    paperName: 'MST-1 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q2 (a)',
    text: 'A closed system undergoes a thermodynamic cycle comprising three processes: (1-2) Reversible adiabatic compression with W12 = -40 kJ; (2-3) Constant volume heat addition with Q23 = 90 kJ; (3-1) Constant pressure expansion to original state with Q31 = -30 kJ. Calculate the net work done and change in internal energy for each process.',
    marks: 5,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'First Law of Thermodynamics for closed system undergoing a process and cycle',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'easy',
    mappingConfidence: 95,
    semanticMatchReason: 'Closed system First Law cyclic energy balance',
    tags: ['First Law', 'Cyclic Process', 'Work Calculation', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-gmu-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2024',
    paperName: 'MST-1 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q2 (b)',
    text: 'Differentiate between open, closed, and isolated thermodynamic systems. Explain the concept of thermodynamic equilibrium with mechanical, chemical, and thermal conditions.',
    marks: 3,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'Open, closed, and isolated systems with thermodynamic equilibrium',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 97,
    semanticMatchReason: 'Thermodynamic system definitions and equilibrium types',
    tags: ['Open Closed System', 'Equilibrium', 'Theory', 'PYQ', '2024', 'MST-1']
  },

  // From MST-2 2024
  {
    id: 'q-gmu-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-gmu-mst2-2024',
    paperName: 'MST-2 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q1 (a)',
    text: 'Derive the air-standard efficiency of an Otto cycle in terms of compression ratio (r) and adiabatic index (gamma): η = 1 - 1 / r^(gamma - 1). Draw the cycle clearly on p-v and T-s diagrams.',
    marks: 6,
    topicId: 'me-u3',
    topicName: 'Air Standard Cycles (Otto & Diesel)',
    subtopicName: 'Otto cycle: p-v and T-s diagrams, derivation of thermal efficiency: η_otto = 1 - (1 / r^(γ-1))',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Classic Otto cycle air-standard efficiency proof',
    tags: ['Otto Cycle', 'Air Standard', 'p-v T-s', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-gmu-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-gmu-mst2-2024',
    paperName: 'MST-2 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q1 (b)',
    text: 'An engine operating on air-standard Diesel cycle has a cylinder bore of 200 mm, stroke of 300 mm, and clearance volume of 0.0006 m^3. If cut-off takes place at 5% of the stroke, calculate the compression ratio and air-standard efficiency.',
    marks: 6,
    topicId: 'me-u3',
    topicName: 'Air Standard Cycles (Otto & Diesel)',
    subtopicName: 'Diesel cycle: cut-off ratio r_c, derivation of thermal efficiency: η_diesel',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'hard',
    mappingConfidence: 95,
    semanticMatchReason: 'Diesel cycle compression ratio and cut-off numerical problem',
    tags: ['Diesel Cycle', 'Cut-off Ratio', 'Numerical', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-gmu-7',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-gmu-mst2-2024',
    paperName: 'MST-2 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q2 (a)',
    text: 'Calculate the specific enthalpy, specific volume, and internal energy of 1 kg of wet steam at a pressure of 10 bar having a dryness fraction of 0.90 using steam tables.',
    marks: 5,
    topicId: 'me-u2',
    topicName: 'Properties of Pure Substance & Steam Tables',
    subtopicName: 'Enthalpy and internal energy of steam, quality or dryness fraction (x)',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 96,
    semanticMatchReason: 'Steam table properties evaluation for wet steam',
    tags: ['Steam Tables', 'Dryness Fraction', 'Enthalpy', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-gmu-8',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-gmu-mst2-2024',
    paperName: 'MST-2 Examination 2024 (General Mechanical Engineering)',
    questionNumber: 'Q2 (b)',
    text: 'Define critical point and triple point for water on a temperature-entropy (T-s) diagram. Explain why dryness fraction has no meaning beyond the critical point.',
    marks: 3,
    topicId: 'me-u2',
    topicName: 'Properties of Pure Substance & Steam Tables',
    subtopicName: 'Critical point and Triple point, enthalpy and internal energy of steam',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 95,
    semanticMatchReason: 'Critical and triple point thermodynamics concepts',
    tags: ['Critical Point', 'Triple Point', 'Steam', 'PYQ', '2024', 'MST-2']
  },

  // From MST-1 2023
  {
    id: 'q-gmu-9',
    paperYear: 2023,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2023',
    paperName: 'MST-1 Examination 2023 (General Mechanical Engineering)',
    questionNumber: 'Q1 (a)',
    text: 'Air flows steadily at the rate of 0.5 kg/s through an air compressor, entering at 7 m/s, 100 kPa, 0.95 m^3/kg and leaving at 5 m/s, 700 kPa, 0.19 m^3/kg. The internal energy of the air leaving is 90 kJ/kg greater than that entering. Cooling water in the jacket absorbs heat from the air at the rate of 58 kW. Compute the rate of shaft work input to the air using SFEE.',
    marks: 7,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'Application of SFEE to Nozzle, Diffuser, Turbine, Compressor, and Throttling valve',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'hard',
    mappingConfidence: 97,
    semanticMatchReason: 'Compressor shaft power evaluation via SFEE',
    tags: ['Compressor', 'SFEE', 'Work Input', 'PYQ', '2023', 'MST-1']
  },
  {
    id: 'q-gmu-10',
    paperYear: 2023,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2023',
    paperName: 'MST-1 Examination 2023 (General Mechanical Engineering)',
    questionNumber: 'Q1 (b)',
    text: 'Show that for a reversible polytropic process p v^n = C, the work done during expansion from (p1, v1) to (p2, v2) is given by W = (p1 v1 - p2 v2) / (n - 1). How does it reduce to isothermal work when n = 1?',
    marks: 5,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'Reversible processes (Isobaric, Isochoric, Isothermal, Polytropic p v^n = c)',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Polytropic process work integral derivation',
    tags: ['Polytropic Process', 'Work Done', 'Derivation', 'PYQ', '2023', 'MST-1']
  },
  {
    id: 'q-gmu-11',
    paperYear: 2023,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2023',
    paperName: 'MST-1 Examination 2023 (General Mechanical Engineering)',
    questionNumber: 'Q2 (a)',
    text: 'A fluid in a piston-cylinder device is heated at constant pressure of 2 bar from an initial volume of 0.05 m^3 to 0.15 m^3. During the process, 50 kJ of heat is supplied. Find the work done and the change in internal energy.',
    marks: 5,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'First Law of Thermodynamics for closed system undergoing a process and cycle',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'easy',
    mappingConfidence: 96,
    semanticMatchReason: 'Constant pressure closed system expansion problem',
    tags: ['Constant Pressure', 'Internal Energy', 'First Law', 'PYQ', '2023', 'MST-1']
  },
  {
    id: 'q-gmu-12',
    paperYear: 2023,
    examType: 'MST-1',
    paperId: 'paper-gmu-mst1-2023',
    paperName: 'MST-1 Examination 2023 (General Mechanical Engineering)',
    questionNumber: 'Q2 (b)',
    text: 'State the Zeroth Law of Thermodynamics and explain how it forms the fundamental basis of temperature measurement.',
    marks: 3,
    topicId: 'me-u1',
    topicName: 'Thermodynamics Processes & Systems',
    subtopicName: 'Open, closed, and isolated systems with thermodynamic equilibrium',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 96,
    semanticMatchReason: 'Zeroth Law thermometry principle',
    tags: ['Zeroth Law', 'Temperature', 'Theory', 'PYQ', '2023', 'MST-1']
  }
];

const MATH1_QUESTIONS: Question[] = [
  {
    id: 'q-math1-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-math1-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Mathematics-I)',
    questionNumber: 'Q1 (a)',
    text: "If y = (sin^-1 x)^2, prove using Leibnitz's theorem that (1-x^2) y_(n+2) - (2n+1)x y_(n+1) - n^2 y_n = 0. Hence find y_n at x=0.",
    marks: 6,
    topicId: 'm1-u1',
    topicName: 'Differential Calculus & Successive Differentiation',
    subtopicName: "Leibnitz's theorem for nth derivative of a product of two functions",
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: "Classic Leibnitz theorem nth derivative formula",
    tags: ['Leibnitz Theorem', 'nth Derivative', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-math1-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-math1-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Mathematics-I)',
    questionNumber: 'Q1 (b)',
    text: "Expand log(1 + e^x) in powers of x up to x^3 using Maclaurin's theorem.",
    marks: 4,
    topicId: 'm1-u1',
    topicName: 'Differential Calculus & Successive Differentiation',
    subtopicName: "Taylor's and Maclaurin's series expansions of functions of one variable",
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 96,
    semanticMatchReason: "Maclaurin series polynomial expansion",
    tags: ['Maclaurin Series', 'Log Expansion', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-math1-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-math1-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Mathematics-I)',
    questionNumber: 'Q2 (a)',
    text: "If u = sin^-1((x + y)/(√x + √y)), show that x(∂u/∂x) + y(∂u/∂y) = (1/2) tan u by Euler's theorem on homogeneous functions.",
    marks: 5,
    topicId: 'm1-u2',
    topicName: 'Advanced Differential Calculus & Several Variables',
    subtopicName: "Euler's theorem on homogeneous functions and extensions",
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: "Euler theorem homogeneous function relation",
    tags: ['Euler Theorem', 'Partial Differentiation', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-math1-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-math1-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Mathematics-I)',
    questionNumber: 'Q2 (b)',
    text: "Find the Jacobian J = ∂(u,v)/∂(x,y) where u = x^2 - y^2 and v = 2xy. Verify that J * J' = 1.",
    marks: 5,
    topicId: 'm1-u2',
    topicName: 'Advanced Differential Calculus & Several Variables',
    subtopicName: 'Jacobians and coordinate transformations',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: "Jacobian functional determinant computation",
    tags: ['Jacobian', 'Transformations', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-math1-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-math1-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Mathematics-I)',
    questionNumber: 'Q1 (a)',
    text: "Change the order of integration of ∬ x y dx dy over the parabolic region bounded by y = x^2 and y = 2 - x, and evaluate the integral.",
    marks: 5,
    topicId: 'm1-u4',
    topicName: 'Advanced Integral Calculus & Multiple Integrals',
    subtopicName: 'Change of order of integration in double integrals',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: "Double integral change of order technique",
    tags: ['Double Integral', 'Change of Order', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-math1-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-math1-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Mathematics-I)',
    questionNumber: 'Q2 (a)',
    text: "Verify Gauss Divergence Theorem for vector field F = (x^3 - yz)i - 2x^2 y j + 2k over the cube bounded by coordinate planes x=0, x=a, y=0, y=a, z=0, z=a.",
    marks: 5,
    topicId: 'm1-u5',
    topicName: 'Vector Calculus & Integral Theorems',
    subtopicName: "Gauss Divergence Theorem and surface flux evaluations",
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'hard',
    mappingConfidence: 97,
    semanticMatchReason: "Gauss divergence theorem volume flux integral",
    tags: ['Gauss Divergence', 'Vector Calculus', 'PYQ', '2024', 'MST-2']
  }
];

// Map of all course-specific preset papers
export const PRESET_PAPERS_BY_COURSE: Record<string, ExamPaperRecord[]> = {
  'course-sem1-mechanical': GMU_MST_PAPERS,
  'course-sem1-math1': MATH1_MST_PAPERS
};

// Map of all course-specific preset questions
export const PRESET_QUESTIONS_BY_COURSE: Record<string, Question[]> = {
  'course-sem1-mechanical': GMU_QUESTIONS,
  'course-sem1-math1': MATH1_QUESTIONS
};

// Legacy alias for backwards compatibility
export const PRESET_EXAM_PAPERS = MATH1_MST_PAPERS;

export function getPresetPapersForCourse(courseId: string): ExamPaperRecord[] {
  return PRESET_PAPERS_BY_COURSE[courseId] || [];
}

const STORAGE_KEY_PAPERS = 'examintel_stored_papers_v2';
const STORAGE_KEY_COURSES = 'examintel_custom_courses_v2';

export function isDemoPaper(paper: Partial<ExamPaperRecord> | any): boolean {
  return false;
}

export function isDemoQuestion(question: Question | any): boolean {
  return false;
}

export function loadStoredPapers(courseId: string): ExamPaperRecord[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PAPERS}_${courseId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load stored papers from localStorage', e);
    }
  }

  // Pure course-specific pre-uploaded papers
  return PRESET_PAPERS_BY_COURSE[courseId] || [];
}

export function saveStoredPapers(courseId: string, papers: ExamPaperRecord[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PAPERS}_${courseId}`, JSON.stringify(papers));
    } catch (e) {
      console.error('Failed to save stored papers to localStorage', e);
    }
  }
}

export function saveCourseState(courses: Course[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses to localStorage', e);
    }
  }
}

export function loadSavedCourses(fallback: Course[]): Course[] {
  const populateCourseDefaults = (c: Course): Course => {
    const defaultQuestions = PRESET_QUESTIONS_BY_COURSE[c.id] || [];
    const defaultPapers = PRESET_PAPERS_BY_COURSE[c.id] || [];

    return {
      ...c,
      questions: c.questions && c.questions.length > 0 ? c.questions : defaultQuestions,
      examPapers: c.examPapers && c.examPapers.length > 0 ? c.examPapers : defaultPapers
    };
  };

  const initializedFallback = fallback.map(populateCourseDefaults);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COURSES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: Course) => populateCourseDefaults(c));
        }
      }
    } catch (e) {
      console.error('Failed to load courses from localStorage', e);
    }
  }
  return initializedFallback;
}
