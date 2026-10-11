import { ExamPaperRecord, Question } from '../types';

// ======================================================================
// 1. APPLIED CHEMISTRY (1RABS2) - PRESET PAPERS & QUESTIONS
// ======================================================================
export const CHEMISTRY_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-chem-mst1-2024',
    name: 'MST-1 Examination 2024 (Applied Chemistry)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 15, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 1 - 2024]
COURSE: Applied Chemistry & Environmental Science (1RABS2)
Time: 1 Hour | Max Marks: 20

Q1. (a) Explain the EDTA titration method for the determination of hardness of water. Write balanced chemical equations for reactions with Eriochrome Black-T (EBT) indicator and EDTA complexation. [7 Marks]
Q1. (b) Calculate the temporary, permanent, and total hardness of a water sample containing: Ca(HCO3)2 = 16.2 mg/L, Mg(HCO3)2 = 7.3 mg/L, CaSO4 = 13.6 mg/L, MgCl2 = 9.5 mg/L in mg/L of CaCO3 equivalents. [5 Marks]

Q2. (a) Discuss the chemical mechanism of setting and hardening of Portland cement with sequence of reactions of Bogue's compounds (C3S, C2S, C3A, C4AF). [5 Marks]
Q2. (b) Differentiate between Thermoplastic and Thermosetting polymers with suitable examples and cross-linking characteristics. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: Applied Chemistry & Environmental Science (1RABS2)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Explain the EDTA titration method for the determination of hardness of water. Write balanced chemical equations for reactions with Eriochrome Black-T (EBT) indicator and EDTA complexation. [7 Marks]
Q1. (b) Calculate the temporary, permanent, and total hardness of a water sample containing: Ca(HCO3)2 = 16.2 mg/L, Mg(HCO3)2 = 7.3 mg/L, CaSO4 = 13.6 mg/L, MgCl2 = 9.5 mg/L in mg/L of CaCO3 equivalents. [5 Marks]

Q2. (a) Discuss the chemical mechanism of setting and hardening of Portland cement with sequence of reactions of Bogue's compounds (C3S, C2S, C3A, C4AF). [5 Marks]
Q2. (b) Differentiate between Thermoplastic and Thermosetting polymers with suitable examples and cross-linking characteristics. [3 Marks]`
  },
  {
    id: 'paper-chem-mst2-2024',
    name: 'MST-2 Examination 2024 (Applied Chemistry)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 22, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 2 - 2024]
COURSE: Applied Chemistry & Environmental Science (1RABS2)
Time: 1 Hour | Max Marks: 20

Q1. (a) Describe the construction, working, and formula derivation of a Bomb Calorimeter for the determination of Higher Calorific Value (HCV) of solid fuels. [6 Marks]
Q1. (b) A 0.85 g coal sample was burned in a Bomb Calorimeter. The mass of water was 2200 g and water equivalent of calorimeter was 380 g. The rise in temperature observed was 2.42 °C. Calculate HCV and LCV if the coal contains 5% hydrogen. (Latent heat = 587 cal/g). [6 Marks]

Q2. (a) Explain the electrochemical mechanism of rusting of iron in neutral aqueous environment with anode and cathode half-reactions. [5 Marks]
Q2. (b) State any 4 principles of Green Chemistry with suitable industrial examples. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: Applied Chemistry & Environmental Science (1RABS2)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Describe the construction, working, and formula derivation of a Bomb Calorimeter for the determination of Higher Calorific Value (HCV) of solid fuels. [6 Marks]
Q1. (b) A 0.85 g coal sample was burned in a Bomb Calorimeter. The mass of water was 2200 g and water equivalent of calorimeter was 380 g. The rise in temperature observed was 2.42 °C. Calculate HCV and LCV if the coal contains 5% hydrogen. (Latent heat = 587 cal/g). [6 Marks]

Q2. (a) Explain the electrochemical mechanism of rusting of iron in neutral aqueous environment with anode and cathode half-reactions. [5 Marks]
Q2. (b) State any 4 principles of Green Chemistry with suitable industrial examples. [3 Marks]`
  }
];

export const CHEMISTRY_QUESTIONS: Question[] = [
  {
    id: 'q-chem-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-chem-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q1 (a)',
    text: 'Explain the EDTA titration method for the determination of hardness of water. Write balanced chemical equations for reactions with Eriochrome Black-T (EBT) indicator and EDTA complexation.',
    marks: 7,
    topicId: 'ch-u2',
    topicName: 'Water & Its Applications',
    subtopicName: 'EDTA titration method principle, equations, and indicator (EBT)',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Direct match with EDTA titration method and hardness determination',
    tags: ['EDTA', 'Water Hardness', 'EBT', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-chem-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-chem-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q1 (b)',
    text: 'Calculate the temporary, permanent, and total hardness of a water sample containing: Ca(HCO3)2 = 16.2 mg/L, Mg(HCO3)2 = 7.3 mg/L, CaSO4 = 13.6 mg/L, MgCl2 = 9.5 mg/L in mg/L of CaCO3 equivalents.',
    marks: 5,
    topicId: 'ch-u2',
    topicName: 'Water & Its Applications',
    subtopicName: 'Numerical problems on Lime-Soda and EDTA hardness calculation',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'Numerical on CaCO3 equivalent hardness conversion',
    tags: ['Hardness Numerical', 'CaCO3 Equivalent', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-chem-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-chem-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q2 (a)',
    text: "Discuss the chemical mechanism of setting and hardening of Portland cement with sequence of reactions of Bogue's compounds (C3S, C2S, C3A, C4AF).",
    marks: 5,
    topicId: 'ch-u1',
    topicName: 'Engineering Materials & Testing',
    subtopicName: 'Portland Cement: Chemical composition, manufacturing, setting and hardening mechanism',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 96,
    semanticMatchReason: "Portland cement setting and hardening reactions",
    tags: ['Cement', 'Bogue Compounds', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-chem-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-chem-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q2 (b)',
    text: 'Differentiate between Thermoplastic and Thermosetting polymers with suitable examples and cross-linking characteristics.',
    marks: 3,
    topicId: 'ch-u1',
    topicName: 'Engineering Materials & Testing',
    subtopicName: 'Polymers: Thermosetting vs Thermoplastics, elastomer synthesis and vulcanization',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 95,
    semanticMatchReason: 'Polymer classification and crosslinking',
    tags: ['Polymers', 'Thermoplastics', 'Thermosetting', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-chem-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-chem-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q1 (a)',
    text: 'Describe the construction, working, and formula derivation of a Bomb Calorimeter for the determination of Higher Calorific Value (HCV) of solid fuels.',
    marks: 6,
    topicId: 'ch-u3',
    topicName: 'Fuels & Lubricants',
    subtopicName: 'Bomb Calorimeter working and numerical calculation of calorific value',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Bomb Calorimeter apparatus and calorific value derivation',
    tags: ['Bomb Calorimeter', 'HCV', 'Fuels', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-chem-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-chem-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q1 (b)',
    text: 'A 0.85 g coal sample was burned in a Bomb Calorimeter. The mass of water was 2200 g and water equivalent of calorimeter was 380 g. The rise in temperature observed was 2.42 °C. Calculate HCV and LCV if the coal contains 5% hydrogen. (Latent heat = 587 cal/g).',
    marks: 6,
    topicId: 'ch-u3',
    topicName: 'Fuels & Lubricants',
    subtopicName: 'Higher Calorific Value (HCV) vs Lower Calorific Value (LCV) relation',
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'hard',
    mappingConfidence: 96,
    semanticMatchReason: 'Bomb calorimeter numerical calculation of HCV and LCV',
    tags: ['Calorific Value Numerical', 'HCV', 'LCV', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-chem-7',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-chem-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q2 (a)',
    text: 'Explain the electrochemical mechanism of rusting of iron in neutral aqueous environment with anode and cathode half-reactions.',
    marks: 5,
    topicId: 'ch-u4',
    topicName: 'Corrosion & Its Control',
    subtopicName: 'Wet electrochemical corrosion mechanism (Oxygen absorption vs Hydrogen evolution)',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'Electrochemical mechanism of corrosion',
    tags: ['Corrosion', 'Rusting of Iron', 'Electrochemical', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-chem-8',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-chem-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Chemistry)',
    questionNumber: 'Q2 (b)',
    text: 'State any 4 principles of Green Chemistry with suitable industrial examples.',
    marks: 3,
    topicId: 'ch-u5',
    topicName: 'Environmental Pollution & Green Chemistry',
    subtopicName: '12 Principles of Green Chemistry and sustainable synthesis pathways',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 95,
    semanticMatchReason: 'Principles of green chemistry',
    tags: ['Green Chemistry', 'Sustainability', 'PYQ', '2024', 'MST-2']
  }
];

// ======================================================================
// 2. BASIC ELECTRONICS (1REES4) - PRESET PAPERS & QUESTIONS
// ======================================================================
export const ELECTRONICS_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-el-mst1-2024',
    name: 'MST-1 Examination 2024 (Basic Electronics)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 14, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 1 - 2024]
COURSE: Basic Electronics Engineering (1REES4)
Time: 1 Hour | Max Marks: 20

Q1. (a) Draw the circuit diagram of a Center-Tapped Full-Wave Rectifier. Derive the expression for ripple factor r = sqrt((Irms/Idc)^2 - 1) and show that r = 0.482. [7 Marks]
Q1. (b) Explain the working principle and V-I characteristics of a Zener Diode in reverse breakdown. Explain how it regulates output voltage. [5 Marks]

Q2. (a) Draw the input and output characteristics of an NPN Bipolar Junction Transistor (BJT) in Common Emitter (CE) configuration. Define active, saturation, and cut-off regions. [5 Marks]
Q2. (b) Establish the mathematical relation between transistor current amplification factors alpha (alpha) and beta (beta). [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: Basic Electronics Engineering (1REES4)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Draw the circuit diagram of a Center-Tapped Full-Wave Rectifier. Derive the expression for ripple factor r = sqrt((Irms/Idc)^2 - 1) and show that r = 0.482. [7 Marks]
Q1. (b) Explain the working principle and V-I characteristics of a Zener Diode in reverse breakdown. Explain how it regulates output voltage. [5 Marks]

Q2. (a) Draw the input and output characteristics of an NPN Bipolar Junction Transistor (BJT) in Common Emitter (CE) configuration. Define active, saturation, and cut-off regions. [5 Marks]
Q2. (b) Establish the mathematical relation between transistor current amplification factors alpha (alpha) and beta (beta). [3 Marks]`
  },
  {
    id: 'paper-el-mst2-2024',
    name: 'MST-2 Examination 2024 (Basic Electronics)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 20, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 2 - 2024]
COURSE: Basic Electronics Engineering (1REES4)
Time: 1 Hour | Max Marks: 20

Q1. (a) Explain the construction and drain characteristics of an N-channel JFET. Define Pinch-off voltage (Vp) and transconductance (gm). [6 Marks]
Q1. (b) Draw the circuit of an Op-Amp configured as an Inverting Amplifier and Non-Inverting Amplifier. Derive the closed-loop voltage gain expressions. [6 Marks]

Q2. (a) State and prove De Morgan's First and Second Laws using Boolean truth tables and logic gate implementations. [5 Marks]
Q2. (b) Explain the difference between Enhancement-mode and Depletion-mode MOSFETs with neat transfer characteristics. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: Basic Electronics Engineering (1REES4)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Explain the construction and drain characteristics of an N-channel JFET. Define Pinch-off voltage (Vp) and transconductance (gm). [6 Marks]
Q1. (b) Draw the circuit of an Op-Amp configured as an Inverting Amplifier and Non-Inverting Amplifier. Derive the closed-loop voltage gain expressions. [6 Marks]

Q2. (a) State and prove De Morgan's First and Second Laws using Boolean truth tables and logic gate implementations. [5 Marks]
Q2. (b) Explain the difference between Enhancement-mode and Depletion-mode MOSFETs with neat transfer characteristics. [3 Marks]`
  }
];

export const ELECTRONICS_QUESTIONS: Question[] = [
  {
    id: 'q-el-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-el-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q1 (a)',
    text: 'Draw the circuit diagram of a Center-Tapped Full-Wave Rectifier. Derive the expression for ripple factor r = sqrt((Irms/Idc)^2 - 1) and show that r = 0.482.',
    marks: 7,
    topicId: 'el-u2',
    topicName: 'P-N Diode Applications (Rectifiers & Clippers)',
    subtopicName: 'Center-tapped and Bridge Full-wave rectifiers: Efficiency (81.2%), Ripple Factor (r=0.482), PIV',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 99,
    semanticMatchReason: 'Ripple factor derivation for center-tapped rectifier',
    tags: ['Rectifier', 'Ripple Factor', 'Derivation', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-el-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-el-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q1 (b)',
    text: 'Explain the working principle and V-I characteristics of a Zener Diode in reverse breakdown. Explain how it regulates output voltage.',
    marks: 5,
    topicId: 'el-u1',
    topicName: 'Semiconductor Physics & Diode Fundamentals',
    subtopicName: 'Zener diode breakdown mechanism (Zener vs Avalanche breakdown) and voltage regulator',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Zener diode breakdown and voltage regulation',
    tags: ['Zener Diode', 'Voltage Regulator', 'Breakdown', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-el-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-el-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q2 (a)',
    text: 'Draw the input and output characteristics of an NPN Bipolar Junction Transistor (BJT) in Common Emitter (CE) configuration. Define active, saturation, and cut-off regions.',
    marks: 5,
    topicId: 'el-u3',
    topicName: 'Bipolar Junction Transistors (BJT)',
    subtopicName: 'Common Emitter (CE) configuration: Input and output V-I curves, Early Effect',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'BJT CE configuration curves and operation regions',
    tags: ['BJT', 'Common Emitter', 'Characteristics', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-el-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-el-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q2 (b)',
    text: 'Establish the mathematical relation between transistor current amplification factors alpha (alpha) and beta (beta).',
    marks: 3,
    topicId: 'el-u3',
    topicName: 'Bipolar Junction Transistors (BJT)',
    subtopicName: 'Current relationships: IE = IB + IC and parameter relations (beta = alpha / (1 - alpha))',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'easy',
    mappingConfidence: 99,
    semanticMatchReason: 'Alpha and beta transistor relationship proof',
    tags: ['Alpha Beta Relation', 'Transistor Current', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-el-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-el-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q1 (a)',
    text: 'Explain the construction and drain characteristics of an N-channel JFET. Define Pinch-off voltage (Vp) and transconductance (gm).',
    marks: 6,
    topicId: 'el-u4',
    topicName: 'Field Effect Transistors (FETs)',
    subtopicName: 'JFET construction, principle of operation, drain and transfer characteristics, Pinch-off voltage Vp',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'JFET drain curve and pinch-off voltage definition',
    tags: ['JFET', 'Pinch-off', 'Transconductance', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-el-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-el-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q1 (b)',
    text: 'Draw the circuit of an Op-Amp configured as an Inverting Amplifier and Non-Inverting Amplifier. Derive the closed-loop voltage gain expressions.',
    marks: 6,
    topicId: 'el-u5',
    topicName: 'Operational Amplifiers & Digital Circuits',
    subtopicName: 'Inverting amplifier (Av = -Rf/R1) and Non-inverting amplifier (Av = 1 + Rf/R1) derivations',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Op-amp gain derivations using virtual ground concept',
    tags: ['Op-Amp', 'Inverting Amplifier', 'Non-Inverting', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-el-7',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-el-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q2 (a)',
    text: "State and prove De Morgan's First and Second Laws using Boolean truth tables and logic gate implementations.",
    marks: 5,
    topicId: 'el-u5',
    topicName: 'Operational Amplifiers & Digital Circuits',
    subtopicName: "Boolean algebra theorems, De Morgan's laws, and logic gate truth tables",
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 96,
    semanticMatchReason: "De Morgan's theorem proof and truth tables",
    tags: ['De Morgan', 'Boolean Algebra', 'Logic Gates', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-el-8',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-el-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electronics)',
    questionNumber: 'Q2 (b)',
    text: 'Explain the difference between Enhancement-mode and Depletion-mode MOSFETs with neat transfer characteristics.',
    marks: 3,
    topicId: 'el-u4',
    topicName: 'Field Effect Transistors (FETs)',
    subtopicName: 'MOSFET types: Enhancement-mode vs Depletion-mode characteristics',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 95,
    semanticMatchReason: 'MOSFET types comparison',
    tags: ['MOSFET', 'Enhancement Mode', 'Depletion Mode', 'PYQ', '2024', 'MST-2']
  }
];

// ======================================================================
// 3. APPLIED PHYSICS (2RABS1) - PRESET PAPERS & QUESTIONS
// ======================================================================
export const PHYSICS_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-phy-mst1-2024',
    name: 'MST-1 Examination 2024 (Applied Physics)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 16, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 1 - 2024]
COURSE: Applied Physics (2RABS1)
Time: 1 Hour | Max Marks: 20

Q1. (a) Derive the expression for the diameters of dark and bright rings in Newton's Rings experiment by reflected monochromatic light. Show that diameters of dark rings are proportional to the square root of natural numbers. [7 Marks]
Q1. (b) In a Newton's rings experiment, the diameter of the 4th dark ring is 4.0 mm and that of the 12th dark ring is 7.0 mm. If the wavelength of light used is 5890 A, calculate the radius of curvature of the plano-convex lens. [5 Marks]

Q2. (a) Explain Fraunhofer diffraction at a single slit. Derive the conditions for central maximum, secondary maxima, and minima with intensity distribution. [5 Marks]
Q2. (b) State and prove Brewster's Law of polarization. Show that reflected and refracted rays are perpendicular to each other at polarizing angle. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: Applied Physics (2RABS1)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Derive the expression for the diameters of dark and bright rings in Newton's Rings experiment by reflected monochromatic light. Show that diameters of dark rings are proportional to the square root of natural numbers. [7 Marks]
Q1. (b) In a Newton's rings experiment, the diameter of the 4th dark ring is 4.0 mm and that of the 12th dark ring is 7.0 mm. If the wavelength of light used is 5890 A, calculate the radius of curvature of the plano-convex lens. [5 Marks]

Q2. (a) Explain Fraunhofer diffraction at a single slit. Derive the conditions for central maximum, secondary maxima, and minima with intensity distribution. [5 Marks]
Q2. (b) State and prove Brewster's Law of polarization. Show that reflected and refracted rays are perpendicular to each other at polarizing angle. [3 Marks]`
  },
  {
    id: 'paper-phy-mst2-2024',
    name: 'MST-2 Examination 2024 (Applied Physics)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 25, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 2 - 2024]
COURSE: Applied Physics (2RABS1)
Time: 1 Hour | Max Marks: 20

Q1. (a) Set up the time-independent Schrodinger wave equation for a quantum particle in a one-dimensional infinite potential box. Find the normalized wave functions and quantized energy eigenvalues. [7 Marks]
Q1. (b) State Heisenberg's Uncertainty Principle. Prove that an electron cannot reside inside the atomic nucleus using the uncertainty principle. [5 Marks]

Q2. (a) Describe the construction and working of a He-Ne laser with a neat energy-level transition diagram. Explain the role of helium atoms in pumping. [5 Marks]
Q2. (b) Define Numerical Aperture (NA) and Acceptance Angle of an optical fiber. Derive the expression for NA in terms of core and cladding refractive indices n1 and n2. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: Applied Physics (2RABS1)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Set up the time-independent Schrodinger wave equation for a quantum particle in a one-dimensional infinite potential box. Find the normalized wave functions and quantized energy eigenvalues. [7 Marks]
Q1. (b) State Heisenberg's Uncertainty Principle. Prove that an electron cannot reside inside the atomic nucleus using the uncertainty principle. [5 Marks]

Q2. (a) Describe the construction and working of a He-Ne laser with a neat energy-level transition diagram. Explain the role of helium atoms in pumping. [5 Marks]
Q2. (b) Define Numerical Aperture (NA) and Acceptance Angle of an optical fiber. Derive the expression for NA in terms of core and cladding refractive indices n1 and n2. [3 Marks]`
  }
];

export const PHYSICS_QUESTIONS: Question[] = [
  {
    id: 'q-phy-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-phy-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Physics)',
    questionNumber: 'Q1 (a)',
    text: "Derive the expression for the diameters of dark and bright rings in Newton's Rings experiment by reflected monochromatic light. Show that diameters of dark rings are proportional to the square root of natural numbers.",
    marks: 7,
    topicId: 'ph-u1',
    topicName: 'Wave Optics & Interference',
    subtopicName: "Newton's rings diameter derivation: D_n^2 = 4n lambda R (dark rings)",
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 99,
    semanticMatchReason: "Newton's rings dark and bright rings diameter derivation",
    tags: ["Newton's Rings", 'Interference', 'Derivation', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-phy-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-phy-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Physics)',
    questionNumber: 'Q1 (b)',
    text: "In a Newton's rings experiment, the diameter of the 4th dark ring is 4.0 mm and that of the 12th dark ring is 7.0 mm. If the wavelength of light used is 5890 A, calculate the radius of curvature of the plano-convex lens.",
    marks: 5,
    topicId: 'ph-u1',
    topicName: 'Wave Optics & Interference',
    subtopicName: "Radius of curvature determination: R = (D_{n+p}^2 - D_n^2) / (4 p lambda)",
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: "Newton's rings lens radius numerical calculation",
    tags: ["Newton's Rings", 'Wavelength', 'Numerical', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-phy-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-phy-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Physics)',
    questionNumber: 'Q2 (a)',
    text: 'Explain Fraunhofer diffraction at a single slit. Derive the conditions for central maximum, secondary maxima, and minima with intensity distribution.',
    marks: 5,
    topicId: 'ph-u2',
    topicName: 'Diffraction & Polarization',
    subtopicName: 'Fraunhofer single slit diffraction derivation: a sin theta = m lambda',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'Single slit Fraunhofer diffraction intensity derivation',
    tags: ['Diffraction', 'Single Slit', 'Fraunhofer', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-phy-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-phy-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Applied Physics)',
    questionNumber: 'Q2 (b)',
    text: "State and prove Brewster's Law of polarization. Show that reflected and refracted rays are perpendicular to each other at polarizing angle.",
    marks: 3,
    topicId: 'ph-u2',
    topicName: 'Diffraction & Polarization',
    subtopicName: "Brewster's Law (mu = tan ip) and polarization by reflection",
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 99,
    semanticMatchReason: "Brewster's law proof and perpendicular ray geometry",
    tags: ["Brewster's Law", 'Polarization', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-phy-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-phy-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Physics)',
    questionNumber: 'Q1 (a)',
    text: 'Set up the time-independent Schrodinger wave equation for a quantum particle in a one-dimensional infinite potential box. Find the normalized wave functions and quantized energy eigenvalues.',
    marks: 7,
    topicId: 'ph-u5',
    topicName: 'Quantum Physics & Wave Mechanics',
    subtopicName: 'Particle in 1D infinite box: psi_n = sqrt(2/L) sin(n pi x / L) and E_n = n^2 h^2 / (8 m L^2)',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'hard',
    mappingConfidence: 99,
    semanticMatchReason: 'Particle in 1D box wave equation solution and eigenvalues',
    tags: ['Schrodinger Equation', 'Particle in Box', 'Quantum', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-phy-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-phy-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Physics)',
    questionNumber: 'Q1 (b)',
    text: "State Heisenberg's Uncertainty Principle. Prove that an electron cannot reside inside the atomic nucleus using the uncertainty principle.",
    marks: 5,
    topicId: 'ph-u5',
    topicName: 'Quantum Physics & Wave Mechanics',
    subtopicName: 'Heisenberg uncertainty principle: Delta x * Delta p >= h / 4pi and non-existence of electron in nucleus',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Uncertainty principle non-existence of electron in nucleus',
    tags: ['Uncertainty Principle', 'Electron in Nucleus', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-phy-7',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-phy-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Physics)',
    questionNumber: 'Q2 (a)',
    text: 'Describe the construction and working of a He-Ne laser with a neat energy-level transition diagram. Explain the role of helium atoms in pumping.',
    marks: 5,
    topicId: 'ph-u3',
    topicName: 'Lasers & Fiber Optics',
    subtopicName: 'He-Ne gas laser working, 632.8 nm red output, resonant energy transfer from He to Ne',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'He-Ne laser construction, energy levels, and operation',
    tags: ['He-Ne Laser', 'Population Inversion', 'Lasers', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-phy-8',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-phy-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Applied Physics)',
    questionNumber: 'Q2 (b)',
    text: 'Define Numerical Aperture (NA) and Acceptance Angle of an optical fiber. Derive the expression for NA in terms of core and cladding refractive indices n1 and n2.',
    marks: 3,
    topicId: 'ph-u3',
    topicName: 'Lasers & Fiber Optics',
    subtopicName: 'Numerical Aperture derivation: NA = sin theta_a = sqrt(n1^2 - n2^2)',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'easy',
    mappingConfidence: 98,
    semanticMatchReason: 'Numerical aperture and acceptance angle derivation',
    tags: ['Numerical Aperture', 'Optical Fiber', 'Derivation', 'PYQ', '2024', 'MST-2']
  }
];

// ======================================================================
// 4. BASIC ELECTRICAL ENGINEERING (2REES3) - PRESET PAPERS & QUESTIONS
// ======================================================================
export const ELECTRICAL_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-ee-mst1-2024',
    name: 'MST-1 Examination 2024 (Basic Electrical)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 17, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 1 - 2024]
COURSE: Basic Electrical Engineering (2REES3)
Time: 1 Hour | Max Marks: 20

Q1. (a) State and prove Thevenin's Theorem for DC circuits. Find the Thevenin equivalent circuit across terminals A and B and compute the load current I_L in a 10 Ohm load resistor. [7 Marks]
Q1. (b) Derive the condition for resonance in a series R-L-C circuit. Define resonant frequency f0, Quality factor Q, and bandwidth BW. [5 Marks]

Q2. (a) Define RMS value and Average value of an alternating sinusoidal waveform. Prove that Form Factor is 1.11 and Peak Factor is 1.414 for a pure sine wave. [5 Marks]
Q2. (b) State Maximum Power Transfer Theorem for DC resistive circuits and show that maximum transfer efficiency is 50%. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: Basic Electrical Engineering (2REES3)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) State and prove Thevenin's Theorem for DC circuits. Find the Thevenin equivalent circuit across terminals A and B and compute the load current I_L in a 10 Ohm load resistor. [7 Marks]
Q1. (b) Derive the condition for resonance in a series R-L-C circuit. Define resonant frequency f0, Quality factor Q, and bandwidth BW. [5 Marks]

Q2. (a) Define RMS value and Average value of an alternating sinusoidal waveform. Prove that Form Factor is 1.11 and Peak Factor is 1.414 for a pure sine wave. [5 Marks]
Q2. (b) State Maximum Power Transfer Theorem for DC resistive circuits and show that maximum transfer efficiency is 50%. [3 Marks]`
  },
  {
    id: 'paper-ee-mst2-2024',
    name: 'MST-2 Examination 2024 (Basic Electrical)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 26, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 2 - 2024]
COURSE: Basic Electrical Engineering (2REES3)
Time: 1 Hour | Max Marks: 20

Q1. (a) Derive the EMF equation of a single-phase transformer: E = 4.44 f N Phi_m. State all governing assumptions. [6 Marks]
Q1. (b) Explain the two-wattmeter method for power measurement in a balanced 3-phase star connected load. Derive the expression for power factor cos phi = cos(tan^-1(sqrt(3)(W1 - W2)/(W1 + W2))). [6 Marks]

Q2. (a) Explain the principle of operation and back EMF equation of a DC Motor. Derive the torque equation. [5 Marks]
Q2. (b) Explain the production of a Rotating Magnetic Field (RMF) in a 3-phase induction motor with mathematical proof. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: Basic Electrical Engineering (2REES3)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) Derive the EMF equation of a single-phase transformer: E = 4.44 f N Phi_m. State all governing assumptions. [6 Marks]
Q1. (b) Explain the two-wattmeter method for power measurement in a balanced 3-phase star connected load. Derive the expression for power factor cos phi = cos(tan^-1(sqrt(3)(W1 - W2)/(W1 + W2))). [6 Marks]

Q2. (a) Explain the principle of operation and back EMF equation of a DC Motor. Derive the torque equation. [5 Marks]
Q2. (b) Explain the production of a Rotating Magnetic Field (RMF) in a 3-phase induction motor with mathematical proof. [3 Marks]`
  }
];

export const ELECTRICAL_QUESTIONS: Question[] = [
  {
    id: 'q-ee-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-ee-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q1 (a)',
    text: "State and prove Thevenin's Theorem for DC circuits. Find the Thevenin equivalent circuit across terminals A and B and compute the load current I_L in a 10 Ohm load resistor.",
    marks: 7,
    topicId: 'ee-u1',
    topicName: 'DC Circuit Analysis & Theorems',
    subtopicName: "Thevenin's theorem statement, Vth and Rth computation, and load current IL",
    questionNature: 'Numerical',
    questionType: 'numerical',
    difficulty: 'medium',
    mappingConfidence: 99,
    semanticMatchReason: "Thevenin's theorem equivalent circuit and numerical computation",
    tags: ["Thevenin's Theorem", 'Network Theorems', 'DC Circuits', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-ee-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-ee-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q1 (b)',
    text: 'Derive the condition for resonance in a series R-L-C circuit. Define resonant frequency f0, Quality factor Q, and bandwidth BW.',
    marks: 5,
    topicId: 'ee-u2',
    topicName: 'Single-Phase AC Fundamentals & Resonance',
    subtopicName: 'Series RLC resonance: omega0 = 1/sqrt(LC), Q-factor = (1/R)sqrt(L/C), Bandwidth',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Series RLC resonance derivation and Q-factor formulation',
    tags: ['Resonance', 'Series RLC', 'Q Factor', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-ee-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-ee-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q2 (a)',
    text: 'Define RMS value and Average value of an alternating sinusoidal waveform. Prove that Form Factor is 1.11 and Peak Factor is 1.414 for a pure sine wave.',
    marks: 5,
    topicId: 'ee-u2',
    topicName: 'Single-Phase AC Fundamentals & Resonance',
    subtopicName: 'Sinusoidal AC quantities: RMS (Vm/sqrt(2)), Average (2Vm/pi), Form Factor (1.11)',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 99,
    semanticMatchReason: 'RMS and average value sine wave proof with form factor',
    tags: ['RMS Value', 'Form Factor', 'Peak Factor', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-ee-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-ee-mst1-2024',
    paperName: 'MST-1 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q2 (b)',
    text: 'State Maximum Power Transfer Theorem for DC resistive circuits and show that maximum transfer efficiency is 50%.',
    marks: 3,
    topicId: 'ee-u1',
    topicName: 'DC Circuit Analysis & Theorems',
    subtopicName: 'Maximum Power Transfer theorem (RL = Rth) and 50% efficiency derivation',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'easy',
    mappingConfidence: 98,
    semanticMatchReason: 'Maximum power transfer theorem proof and efficiency',
    tags: ['Max Power Transfer', 'Theorems', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-ee-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-ee-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q1 (a)',
    text: 'Derive the EMF equation of a single-phase transformer: E = 4.44 f N Phi_m. State all governing assumptions.',
    marks: 6,
    topicId: 'ee-u4',
    topicName: 'Single-Phase Transformers',
    subtopicName: 'Transformer EMF equation: E1 = 4.44 f N1 Phi_m and turns ratio',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 99,
    semanticMatchReason: 'Transformer EMF equation derivation from Faraday law',
    tags: ['Transformer EMF', 'Single Phase', 'Derivation', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-ee-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-ee-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q1 (b)',
    text: 'Explain the two-wattmeter method for power measurement in a balanced 3-phase star connected load. Derive the expression for power factor cos phi = cos(tan^-1(sqrt(3)(W1 - W2)/(W1 + W2))).',
    marks: 6,
    topicId: 'ee-u3',
    topicName: 'Three-Phase AC Systems',
    subtopicName: 'Two-wattmeter method for 3-phase power and power factor angle phi derivation',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'hard',
    mappingConfidence: 98,
    semanticMatchReason: 'Two-wattmeter method 3-phase power factor proof',
    tags: ['Two Wattmeter', '3-Phase AC', 'Power Factor', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-ee-7',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-ee-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q2 (a)',
    text: 'Explain the principle of operation and back EMF equation of a DC Motor. Derive the torque equation.',
    marks: 5,
    topicId: 'ee-u5',
    topicName: 'Electrical Machines & Drives',
    subtopicName: 'DC Motor principle: Back EMF Eb = (P Phi Z N)/(60 A) and electromagnetic torque Ta',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'DC motor operation and torque derivation',
    tags: ['DC Motor', 'Back EMF', 'Torque Equation', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-ee-8',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-ee-mst2-2024',
    paperName: 'MST-2 Examination 2024 (Basic Electrical)',
    questionNumber: 'Q2 (b)',
    text: 'Explain the production of a Rotating Magnetic Field (RMF) in a 3-phase induction motor with mathematical proof.',
    marks: 3,
    topicId: 'ee-u5',
    topicName: 'Electrical Machines & Drives',
    subtopicName: 'Rotating Magnetic Field (RMF) resultant flux = 1.5 Phi_m proof',
    questionNature: 'Derivation',
    questionType: 'derivation',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: '3-phase RMF constant magnitude 1.5 Phi_m proof',
    tags: ['Rotating Magnetic Field', 'Induction Motor', 'PYQ', '2024', 'MST-2']
  }
];

// ======================================================================
// 5. OBJECT ORIENTED PROGRAMMING WITH C++ (2RCES2) - PRESET PAPERS & QUESTIONS
// ======================================================================
export const CPP_MST_PAPERS: ExamPaperRecord[] = [
  {
    id: 'paper-cpp-mst1-2024',
    name: 'MST-1 Examination 2024 (OOP in C++)',
    year: 2024,
    examType: 'MST-1',
    totalMarks: 20,
    uploadedAt: 'Oct 18, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 1 - 2024]
COURSE: Object Oriented Programming with C++ (2RCES2)
Time: 1 Hour | Max Marks: 20

Q1. (a) What is object-oriented programming? Explain the core principles: Encapsulation, Abstraction, Inheritance, and Polymorphism with C++ code examples. [7 Marks]
Q1. (b) Write a C++ program to demonstrate Constructor Overloading and Copy Constructor in a Matrix class with dynamic memory allocation. [5 Marks]

Q2. (a) Explain the order of execution of constructors and destructors in multiple and multilevel inheritance with code snippets. [5 Marks]
Q2. (b) What is the diamond problem in C++ inheritance? How is it resolved using virtual base classes? [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 1 - 2024
COURSE: Object Oriented Programming with C++ (2RCES2)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) What is object-oriented programming? Explain the core principles: Encapsulation, Abstraction, Inheritance, and Polymorphism with C++ code examples. [7 Marks]
Q1. (b) Write a C++ program to demonstrate Constructor Overloading and Copy Constructor in a Matrix class with dynamic memory allocation. [5 Marks]

Q2. (a) Explain the order of execution of constructors and destructors in multiple and multilevel inheritance with code snippets. [5 Marks]
Q2. (b) What is the diamond problem in C++ inheritance? How is it resolved using virtual base classes? [3 Marks]`
  },
  {
    id: 'paper-cpp-mst2-2024',
    name: 'MST-2 Examination 2024 (OOP in C++)',
    year: 2024,
    examType: 'MST-2',
    totalMarks: 20,
    uploadedAt: 'Nov 27, 2024',
    questionCount: 4,
    sourceType: 'pdf',
    rawText: `[IET-DAVV - MID-SEMESTER TEST 2 - 2024]
COURSE: Object Oriented Programming with C++ (2RCES2)
Time: 1 Hour | Max Marks: 20

Q1. (a) What are Virtual Functions and Pure Virtual Functions? Explain dynamic polymorphism and abstract classes with a complete C++ program. [7 Marks]
Q1. (b) Write a C++ program to overload the '+' binary arithmetic operator and '<<' stream insertion operator for a Complex number class using friend functions. [5 Marks]

Q2. (a) What are function templates and class templates in C++? Write a generic class template for a Stack with push() and pop() operations. [5 Marks]
Q2. (b) Explain C++ exception handling mechanism using try, catch, and throw blocks with multiple catch handlers. [3 Marks]`,
    cleanedText: `INSTITUTE OF ENGINEERING & TECHNOLOGY (IET-DAVV)
MID-SEMESTER TEST 2 - 2024
COURSE: Object Oriented Programming with C++ (2RCES2)
Time: 1 Hour | Maximum Marks: 20

Q1. (a) What are Virtual Functions and Pure Virtual Functions? Explain dynamic polymorphism and abstract classes with a complete C++ program. [7 Marks]
Q1. (b) Write a C++ program to overload the '+' binary arithmetic operator and '<<' stream insertion operator for a Complex number class using friend functions. [5 Marks]

Q2. (a) What are function templates and class templates in C++? Write a generic class template for a Stack with push() and pop() operations. [5 Marks]
Q2. (b) Explain C++ exception handling mechanism using try, catch, and throw blocks with multiple catch handlers. [3 Marks]`
  }
];

export const CPP_QUESTIONS: Question[] = [
  {
    id: 'q-cpp-1',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-cpp-mst1-2024',
    paperName: 'MST-1 Examination 2024 (OOP in C++)',
    questionNumber: 'Q1 (a)',
    text: 'What is object-oriented programming? Explain the core principles: Encapsulation, Abstraction, Inheritance, and Polymorphism with C++ code examples.',
    marks: 7,
    topicId: 'cp-u1',
    topicName: 'Introduction to OOP & C++ Basics',
    subtopicName: 'OOP paradigms: Classes, objects, data hiding, encapsulation, inheritance, polymorphism',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 99,
    semanticMatchReason: 'Core OOP principles definition and code demonstration',
    tags: ['OOP Paradigms', 'Encapsulation', 'Polymorphism', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-cpp-2',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-cpp-mst1-2024',
    paperName: 'MST-1 Examination 2024 (OOP in C++)',
    questionNumber: 'Q1 (b)',
    text: 'Write a C++ program to demonstrate Constructor Overloading and Copy Constructor in a Matrix class with dynamic memory allocation.',
    marks: 5,
    topicId: 'cp-u1',
    topicName: 'Introduction to OOP & C++ Basics',
    subtopicName: 'Constructors (default, parameterized, copy) and destructors with new/delete',
    questionNature: 'Theory',
    questionType: 'code',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Copy constructor and dynamic memory management in C++',
    tags: ['Copy Constructor', 'Dynamic Memory', 'Code', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-cpp-3',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-cpp-mst1-2024',
    paperName: 'MST-1 Examination 2024 (OOP in C++)',
    questionNumber: 'Q2 (a)',
    text: 'Explain the order of execution of constructors and destructors in multiple and multilevel inheritance with code snippets.',
    marks: 5,
    topicId: 'cp-u2',
    topicName: 'Inheritance & Reusability',
    subtopicName: 'Order of constructor and destructor invocation in multiple and multilevel inheritance',
    questionNature: 'Theory',
    questionType: 'code',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'Constructor execution hierarchy in inheritance',
    tags: ['Inheritance', 'Constructor Order', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-cpp-4',
    paperYear: 2024,
    examType: 'MST-1',
    paperId: 'paper-cpp-mst1-2024',
    paperName: 'MST-1 Examination 2024 (OOP in C++)',
    questionNumber: 'Q2 (b)',
    text: 'What is the diamond problem in C++ inheritance? How is it resolved using virtual base classes?',
    marks: 3,
    topicId: 'cp-u2',
    topicName: 'Inheritance & Reusability',
    subtopicName: 'Multipath inheritance ambiguity (Diamond problem) and virtual base classes',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 99,
    semanticMatchReason: 'Diamond problem resolution via virtual base class',
    tags: ['Diamond Problem', 'Virtual Base Class', 'PYQ', '2024', 'MST-1']
  },
  {
    id: 'q-cpp-5',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-cpp-mst2-2024',
    paperName: 'MST-2 Examination 2024 (OOP in C++)',
    questionNumber: 'Q1 (a)',
    text: 'What are Virtual Functions and Pure Virtual Functions? Explain dynamic polymorphism and abstract classes with a complete C++ program.',
    marks: 7,
    topicId: 'cp-u2',
    topicName: 'Inheritance & Reusability',
    subtopicName: 'Virtual functions, pure virtual functions (= 0), abstract classes, and vtable mechanism',
    questionNature: 'Theory',
    questionType: 'code',
    difficulty: 'medium',
    mappingConfidence: 99,
    semanticMatchReason: 'Virtual functions dynamic binding and abstract base class',
    tags: ['Virtual Functions', 'Dynamic Binding', 'Code', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-cpp-6',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-cpp-mst2-2024',
    paperName: 'MST-2 Examination 2024 (OOP in C++)',
    questionNumber: 'Q1 (b)',
    text: "Write a C++ program to overload the '+' binary arithmetic operator and '<<' stream insertion operator for a Complex number class using friend functions.",
    marks: 5,
    topicId: 'cp-u3',
    topicName: 'Polymorphism & Operator Overloading',
    subtopicName: 'Overloading binary operators and stream operators (<<, >>) using friend functions',
    questionNature: 'Theory',
    questionType: 'code',
    difficulty: 'medium',
    mappingConfidence: 98,
    semanticMatchReason: 'Operator overloading using friend functions in C++',
    tags: ['Operator Overloading', 'Friend Function', 'Code', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-cpp-7',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-cpp-mst2-2024',
    paperName: 'MST-2 Examination 2024 (OOP in C++)',
    questionNumber: 'Q2 (a)',
    text: 'What are function templates and class templates in C++? Write a generic class template for a Stack with push() and pop() operations.',
    marks: 5,
    topicId: 'cp-u4',
    topicName: 'Templates & Generic Programming',
    subtopicName: 'Class templates: template <class T> class Stack with dynamic array operations',
    questionNature: 'Theory',
    questionType: 'code',
    difficulty: 'medium',
    mappingConfidence: 97,
    semanticMatchReason: 'Generic programming and class template Stack implementation',
    tags: ['Templates', 'Generic Stack', 'Code', 'PYQ', '2024', 'MST-2']
  },
  {
    id: 'q-cpp-8',
    paperYear: 2024,
    examType: 'MST-2',
    paperId: 'paper-cpp-mst2-2024',
    paperName: 'MST-2 Examination 2024 (OOP in C++)',
    questionNumber: 'Q2 (b)',
    text: 'Explain C++ exception handling mechanism using try, catch, and throw blocks with multiple catch handlers.',
    marks: 3,
    topicId: 'cp-u5',
    topicName: 'Exception Handling & File Streams',
    subtopicName: 'try, throw, and catch blocks, re-throwing exceptions, catch-all (...) handler',
    questionNature: 'Theory',
    questionType: 'theory',
    difficulty: 'easy',
    mappingConfidence: 96,
    semanticMatchReason: 'C++ exception handling mechanics and syntax',
    tags: ['Exception Handling', 'Try Catch', 'PYQ', '2024', 'MST-2']
  }
];
