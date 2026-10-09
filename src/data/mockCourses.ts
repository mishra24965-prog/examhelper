import { Course } from '../types';

export const INITIAL_COURSES: Course[] = [
  // ==========================================
  // SEMESTER 1 SUBJECTS (IET-DAVV 2024 SCHEME)
  // ==========================================
  {
    id: 'course-sem1-math1',
    name: 'Applied Mathematics-I',
    code: '1RABS1',
    semester: 'Semester-I (Common to all branches)',
    semesterNumber: 1,
    credits: '4 (L:3, T:1, P:0)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#6366f1',
    syllabus: [
      {
        id: 'm1-u1',
        unit: 1,
        title: 'Differential Calculus & Successive Differentiation',
        description: 'Successive differentiation, Leibnitz theorem and its standard problems; Expansion of functions by Taylor’s and Maclaurin’s Theorem; Asymptotes; Curvature in Cartesian and Polar Coordinates; Envelopes; Evolutes and Involutes.',
        subtopics: [
          'Leibnitz Theorem nth derivative proofs (y = (sin^-1 x)^2 or y = e^(m sin^-1 x))',
          'Taylor and Maclaurin series expansions with remainder term',
          'Asymptotes of algebraic curves (parallel and oblique)',
          'Radius of Curvature rho in Cartesian, Polar, and Pedal equations',
          'Envelopes and Evolutes of family of curves'
        ],
        conceptSummary: 'Focuses on higher-order rates of change. The cornerstone is Leibnitz theorem for product derivatives and Taylor expansions for polynomial approximations near a point.',
        keyFormulas: [
          '(u v)_n = Σ (nCr * u_(n-r) * v_r)',
          'Taylor Series: f(x) = f(a) + f\'(a)(x-a) + f\'\'(a)(x-a)^2/2! + ...',
          'Radius of Curvature: ρ = [1 + (y\')^2]^(3/2) / |y\'\'|',
          'Pedal Curvature: ρ = r * (dr / dp)'
        ],
        mindMap: {
          centralTopic: 'Differential Calculus',
          branches: [
            {
              title: 'Leibnitz Rule',
              keyPoints: ['Product rule for nth derivative', 'y = (sin^-1 x)^2 standard proof', 'Evaluating y_n at x = 0'],
              icon: 'Sigma'
            },
            {
              title: 'Series Expansions',
              keyPoints: ['Maclaurin series at x=0', 'Taylor series about x=a', 'Standard expansions of sin x, cos x, e^x'],
              icon: 'TrendingUp'
            },
            {
              title: 'Curvature & Asymptotes',
              keyPoints: ['Parallel asymptotes (coeff of highest power = 0)', 'Oblique asymptotes y = mx + c', 'Pedal equation p = r sin φ'],
              icon: 'CircleDot'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 4 & 5 (pp. 75-135); Erwin Kreyszig Chapter 9',
        suggestedHours: 8
      },
      {
        id: 'm1-u2',
        unit: 2,
        title: 'Advanced Differential Calculus & Several Variables',
        description: 'Function of several variables; Partial differentiation; Approximations and errors; Jacobians; Taylor’s series of two variables; Maxima and Minima of function of two and more variables; Lagrange’s method of undetermined multipliers.',
        subtopics: [
          'Euler’s Theorem on homogeneous functions',
          'Jacobians J = ∂(u,v)/∂(x,y) and chain rule properties',
          'Taylor’s Series in two variables up to 2nd degree',
          'Maxima, Minima and Saddle points (AC - B^2 criterion)',
          'Lagrange’s Method of Undetermined Multipliers'
        ],
        conceptSummary: 'Calculus of multivariable surfaces. Evaluates slopes along different axes (partial derivatives), coordinate transformations via Jacobians, and finding constrained extreme values on surfaces.',
        keyFormulas: [
          'Euler Theorem: x(∂u/∂x) + y(∂u/∂y) = n*u',
          'Jacobian: J = |(∂u/∂x  ∂u/∂y), (∂v/∂x  ∂v/∂y)|',
          'Extrema condition: A = f_xx, B = f_xy, C = f_yy; If AC - B^2 > 0 and A < 0 -> Maximum',
          'Lagrange Multiplier: ∇f = λ ∇g'
        ],
        mindMap: {
          centralTopic: 'Multivariable Calculus',
          branches: [
            {
              title: 'Partial Derivatives',
              keyPoints: ['Chain rule for several variables', 'Homogeneous functions Euler Theorem', 'Total differential df = fx dx + fy dy'],
              icon: 'Split'
            },
            {
              title: 'Jacobians',
              keyPoints: ['Coordinate transformations', 'Property: J * J\' = 1', 'Implicit function Jacobians'],
              icon: 'Grid'
            },
            {
              title: 'Constrained Extrema',
              keyPoints: ['Lagrange multipliers (Box, sphere optimization)', 'Discriminant AC - B^2 test', 'Saddle point vs Local Extrema'],
              icon: 'Compass'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 5 & 6 (pp. 140-210); Erwin Kreyszig Chapter 9',
        suggestedHours: 9
      },
      {
        id: 'm1-u3',
        unit: 3,
        title: 'Integral Calculus & Curve Tracing',
        description: 'Beta and Gamma functions; Detailed study of tracing of curves - Cartesian, polar and parametric curves; Area; Length of Curve; Volume; Surface of Revolution; Theorems of Pappus and Guldin and problems.',
        subtopics: [
          'Beta and Gamma functions properties and relation B(m,n) = Γ(m)Γ(n)/Γ(m+n)',
          'Duplication formula and integral evaluation',
          'Curve tracing: Symmetry, origin, asymptotes, tangents',
          'Length of arc (Rectification) in Cartesian & polar forms',
          'Volume and surface area of revolution; Pappus & Guldin theorems'
        ],
        conceptSummary: 'Integrals as continuous sum of areas and volumes. Beta-Gamma functions act as shortcut evaluation tools for definite trigonometric and algebraic integrals.',
        keyFormulas: [
          'Γ(n+1) = n Γ(n), Γ(1/2) = √π',
          '∫_0^(π/2) sin^p(θ) cos^q(θ) dθ = Γ((p+1)/2) Γ((q+1)/2) / [2 Γ((p+q+2)/2)]',
          'Arc Length: s = ∫ √(1 + (dy/dx)^2) dx',
          'Surface of Revolution: S = 2π ∫ y √(1 + (y\')^2) dx'
        ],
        mindMap: {
          centralTopic: 'Integral Calculus',
          branches: [
            {
              title: 'Beta & Gamma',
              keyPoints: ['Reduction formulas', 'Trigonometric integral shortcut', 'Duplication theorem'],
              icon: 'FunctionSquare'
            },
            {
              title: 'Curve Tracing',
              keyPoints: ['Symmetry about axes & origin', 'Cardioid, Lemniscate, Astroid', 'Tangent at origin'],
              icon: 'Activity'
            },
            {
              title: 'Applications',
              keyPoints: ['Arc length rectification', 'Volume of solids of revolution', 'Pappus & Guldin theorems'],
              icon: 'Box'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 7 (pp. 215-285); Ramana B V Chapter 4',
        suggestedHours: 8
      },
      {
        id: 'm1-u4',
        unit: 4,
        title: 'Advanced Integral Calculus & Multiple Integrals',
        description: 'Multiple integrals: Double and Triple Integration; Change of Order of Integration; Area; Volume; Centre of Gravity; Moment of Inertia.',
        subtopics: [
          'Evaluation of double integrals over rectangular and general domains',
          'Change of order of integration with region boundary sketches',
          'Double integrals in polar coordinates (x = r cos θ, y = r sin θ, dx dy = r dr dθ)',
          'Triple integrals for volumes of solid regions',
          'Calculation of Centre of Gravity and Moment of Inertia'
        ],
        conceptSummary: 'Extends integration to 2D and 3D geometries. Change of order of integration is one of the highest-weightage exam questions in university papers.',
        keyFormulas: [
          'Cartesian to Polar: ∬ f(x,y) dx dy = ∬ f(r cos θ, r sin θ) r dr dθ',
          'Volume = ∭ dx dy dz',
          'Center of Gravity: x_bar = ∬ x dm / ∬ dm',
          'Moment of Inertia: I_z = ∬ (x^2 + y^2) dm'
        ],
        mindMap: {
          centralTopic: 'Multiple Integrals',
          branches: [
            {
              title: 'Double Integrals',
              keyPoints: ['Iterated integration', 'Polar coordinate transformations', 'Area enclosed by curves'],
              icon: 'Layers'
            },
            {
              title: 'Change of Order',
              keyPoints: ['Drawing boundary curves', 'Converting dx strip to dy strip', 'Recalculating inner & outer limits'],
              icon: 'Repeat'
            },
            {
              title: 'Physical Properties',
              keyPoints: ['Centroid & Center of Gravity', 'Moment of Inertia calculations', 'Triple integral volumes'],
              icon: 'Weight'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 7 & 8; Erwin Kreyszig Chapter 10',
        suggestedHours: 10
      },
      {
        id: 'm1-u5',
        unit: 5,
        title: 'Vector Calculus & Integral Theorems',
        description: 'Differentiation of a Vector; Gradient; Divergence; Curl; Integration of a Vector Function; Gauss’s Divergence, Green’s and Stoke’s Theorems.',
        subtopics: [
          'Gradient of scalar field, Directional Derivative, Unit normal vector',
          'Divergence (solenoidal: ∇·F = 0) and Curl (irrotational: ∇×F = 0)',
          'Line integrals and conservative fields (work done)',
          'Gauss’s Divergence Theorem (Flux across closed surface = Volume integral)',
          'Green’s Theorem in plane and Stoke’s Theorem'
        ],
        conceptSummary: 'Calculus of 3D vector fields. Fundamental for fluid mechanics, electromagnetic fields, and forces. Focus heavily on Gauss Divergence LHS=RHS proofs.',
        keyFormulas: [
          'Grad φ = ∇φ = i(∂φ/∂x) + j(∂φ/∂y) + k(∂φ/∂z)',
          'Div F = ∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z',
          'Curl F = ∇×F = |(i j k), (∂/∂x ∂/∂y ∂/∂z), (Fx Fy Fz)|',
          'Gauss Divergence: ∬_S F·n dS = ∭_V (∇·F) dV',
          'Stoke\'s Theorem: ∮_C F·dr = ∬_S (∇×F)·n dS'
        ],
        mindMap: {
          centralTopic: 'Vector Calculus',
          branches: [
            {
              title: 'Operators',
              keyPoints: ['Gradient & Directional Derivative', 'Divergence (Flux density)', 'Curl (Circulation & Irrotational)'],
              icon: 'Compass'
            },
            {
              title: 'Gauss Divergence',
              keyPoints: ['Surface to Volume integral', '6 faces of a cube verification', 'Cylindrical region verification'],
              icon: 'Box'
            },
            {
              title: 'Green & Stoke',
              keyPoints: ['Line integral work done', 'Green theorem in a plane', 'Stoke surface circulation'],
              icon: 'RefreshCw'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 8 (pp. 310-385); Erwin Kreyszig Chapter 10',
        suggestedHours: 10
      }
    ],
    referenceBooks: [
      {
        title: 'Higher Engineering Mathematics',
        authors: 'B. S. Grewal',
        edition: '39th/44th Edition, Khanna Publishers, 2006',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'Advanced Engineering Mathematics',
        authors: 'Erwin Kreyszig',
        edition: '8th/10th Edition, John Wiley & Sons, 1999',
        role: 'Supplementary Numerical Practice',
        coverImageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'Higher Engineering Mathematics',
        authors: 'Ramana B V',
        edition: 'Tata McGraw Hill Publishing Co. Ltd., 2006',
        role: 'Supplementary Numerical Practice',
        coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [
      {
        topicId: 'm1-u1',
        topicName: 'Differential Calculus & Successive Differentiation',
        gradingMindset: 'DAVV evaluators strictly look for the initial two derivatives y1 and y2 written cleanly. Expanding each term with nC0, nC1, nC2 must be shown explicitly. If student directly writes the final line, 4 out of 7 marks are lost.',
        mustIncludeElements: [
          'Form the base differential equation relating y1, y2, and y before applying Leibnitz',
          'Write down Leibnitz statement: (u v)_n = Σ nCr u_(n-r) v_r',
          'Explicit substitution at x = 0 to obtain the recurrence relation'
        ],
        frequentDeductionTraps: [
          'Sign error in the middle term: (2n + 1) vs (2n - 1)',
          'Not simplifying nC1 = n and nC2 = n(n-1)/2'
        ],
        teacherCopyPastePattern: 'Problem y = (sin^-1 x)^2 and y = e^(m cos^-1 x) are lifted word-for-word from B.S. Grewal Chapter 4, Exercise 4.2.',
        bookSectionToPrioritize: 'B.S. Grewal Chapter 4 (Successive Differentiation) - Solved Examples 4.8 through 4.16.',
        bookSectionsToSkip: 'Skip Section 4.5 on high-degree algebraic partial fraction expansions.'
      }
    ],
    videoRecommendations: [
      {
        id: 'vid-m1-1',
        topicId: 'm1-u1',
        topicName: 'Differential Calculus & Successive Differentiation',
        title: 'Successive Differentiation & Leibnitz Theorem nth Derivative Complete Concept',
        channel: 'Dr. Gajendra Purohit',
        durationMinutes: 24,
        conceptFocus: 'Standard method to solve y = (sin^-1 x)^2 and find y_n at x=0 for university exams.',
        youtubeSearchQuery: 'Gajendra Purohit Leibnitz Theorem successive differentiation',
        youtubeUrl: 'https://www.youtube.com/watch?v=EFLp2LrmYuY',
        thumbnailUrl: 'https://img.youtube.com/vi/EFLp2LrmYuY/mqdefault.jpg',
        youtubeVideoId: 'EFLp2LrmYuY',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '02:15', topic: 'Leibnitz Theorem Statement' },
          { time: '07:30', topic: 'y = (sin^-1 x)^2 Step-by-Step Proof' },
          { time: '16:45', topic: 'Evaluating nth derivative at x = 0' }
        ]
      },
      {
        id: 'vid-m1-2',
        topicId: 'm1-u2',
        topicName: 'Mean Value Theorems, Taylor & Maclaurin Series',
        title: 'Taylor Series & Maclaurin Series Expansion with Solved University Problems',
        channel: 'Dr. Gajendra Purohit',
        durationMinutes: 22,
        conceptFocus: 'Maclaurin and Taylor expansion for sin x, e^x, log(1+x) frequently asked in 7-mark questions.',
        youtubeSearchQuery: 'Gajendra Purohit Taylor Series Maclaurin Series',
        youtubeUrl: 'https://www.youtube.com/watch?v=Ac1mr2WrO-g',
        thumbnailUrl: 'https://img.youtube.com/vi/Ac1mr2WrO-g/mqdefault.jpg',
        youtubeVideoId: 'Ac1mr2WrO-g',
        level: 'High Yield',
        keyTimestamps: [
          { time: '01:50', topic: 'Taylor Series Formula' },
          { time: '08:20', topic: 'Standard Function Expansions' }
        ]
      },
      {
        id: 'vid-m1-3',
        topicId: 'm1-u3',
        topicName: 'Matrices, Rank & Eigenvalues',
        title: 'Rank of Matrix & Normal Form (Echelon & Canonical Form)',
        channel: 'Dr. Gajendra Purohit',
        durationMinutes: 26,
        conceptFocus: 'Finding Rank of 3x3 and 4x4 matrices using elementary row and column transformations.',
        youtubeSearchQuery: 'Gajendra Purohit Rank of Matrix Normal Form',
        youtubeUrl: 'https://www.youtube.com/watch?v=p5rBJj5CKCg',
        thumbnailUrl: 'https://img.youtube.com/vi/p5rBJj5CKCg/mqdefault.jpg',
        youtubeVideoId: 'p5rBJj5CKCg',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '02:00', topic: 'Rank Definition & Echelon Form' },
          { time: '11:15', topic: 'Normal Form [Ir 0; 0 0] Conversion' }
        ]
      },
      {
        id: 'vid-m1-4',
        topicId: 'm1-u5',
        topicName: 'Vector Calculus & Integral Theorems',
        title: 'Gauss Divergence Theorem Full Proof & Cube / Cylinder Verification',
        channel: 'Dr. Gajendra Purohit',
        durationMinutes: 28,
        conceptFocus: 'LHS surface integral matching RHS volume integral in Cartesian & cylindrical coordinates.',
        youtubeSearchQuery: 'Gajendra Purohit Gauss Divergence Theorem',
        youtubeUrl: 'https://www.youtube.com/watch?v=cQARyhhj67I',
        thumbnailUrl: 'https://img.youtube.com/vi/cQARyhhj67I/mqdefault.jpg',
        youtubeVideoId: 'cQARyhhj67I',
        level: 'Deep Dive',
        keyTimestamps: [
          { time: '03:10', topic: 'Gauss Divergence Formula' },
          { time: '12:40', topic: 'LHS Surface Integral Calculation' },
          { time: '21:15', topic: 'RHS Volume Integral Verification' }
        ]
      }
    ]
  },
  {
    id: 'course-sem1-chemistry',
    name: 'Applied Chemistry & Environment Science',
    code: '1RABS2',
    semester: 'Semester-I (Common to all branches)',
    semesterNumber: 1,
    credits: '3+1(P) (L:2, T:1, P:2)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#0ea5e9',
    syllabus: [
      {
        id: 'ch-u1',
        unit: 1,
        title: 'Engineering Materials & Testing',
        description: 'Introduction, classification and requirement of engineering materials, Material testing and types. Polymers, Cement, Glass and Refractories: Different types, composition, properties and uses. Introduction to Nano materials.',
        subtopics: [
          'Classification of engineering materials and mechanical testing',
          'Polymers: Thermosetting vs Thermoplastics, elastomer synthesis and vulcanization',
          'Portland Cement: Chemical composition, manufacturing, setting and hardening mechanism',
          'Refractories: Definition, classification (acidic, basic, neutral), refractoriness (Seger cone test)',
          'Carbon Nanotubes (CNTs) and Nanomaterials synthesis'
        ],
        conceptSummary: 'Engineering materials focus on structure-property relationships in construction and manufacturing. Cement setting chemistry and polymer vulcanization are frequent 8-mark questions.',
        keyFormulas: [
          'Refractoriness: Pyrometric Cone Equivalent (PCE) test rating',
          'Polymerization degree: DP = M_polymer / M_monomer',
          'Cement compounds: C3S, C2S, C3A, C4AF (Bogue’s Compounds)'
        ],
        mindMap: {
          centralTopic: 'Engineering Materials',
          branches: [
            {
              title: 'Polymers',
              keyPoints: ['Thermoplastics vs Thermosetting', 'Vulcanization of rubber', 'Conducting polymers'],
              icon: 'Box'
            },
            {
              title: 'Cement & Glass',
              keyPoints: ['Bogue compounds (C3S, C2S)', 'Setting & hardening chemistry', 'Refractory Seger cones'],
              icon: 'Layers'
            },
            {
              title: 'Nanomaterials',
              keyPoints: ['Carbon Nanotubes (SWCNT/MWCNT)', 'Sol-gel synthesis', 'Applications in electronics'],
              icon: 'Atom'
            }
          ]
        },
        referenceBookChapters: 'Jain & Jain Chapter 4 & 7; S. S. Dara Chapter 3',
        suggestedHours: 7
      },
      {
        id: 'ch-u2',
        unit: 2,
        title: 'Water & Its Applications',
        description: 'Sources, impurities, applications, Hardness- its expression and determination; Boiler troubles (sludge, scale, priming, foaming, caustic embrittlement); Water softening (Zeolite, Ion-exchange); De-ionization; Numericals on water analysis and treatment.',
        subtopics: [
          'Temporary vs Permanent hardness and CaCO3 equivalent calculation',
          'EDTA titration method principle, equations, and indicator (EBT)',
          'Boiler Troubles: Scales vs Sludges, Caustic embrittlement mechanism',
          'Zeolite process and Ion-Exchange demineralization process',
          'Numerical problems on Lime-Soda and EDTA hardness calculation'
        ],
        conceptSummary: 'Hardness determination by EDTA and boiler trouble remedies account for ~25% of Chemistry exam marks. Always write CaCO3 equivalent formulas with multiplication factor.',
        keyFormulas: [
          'Hardness CaCO3 equivalent = [Mass of hardness causing salt * 50] / Eq. Wt. of salt',
          'Total Hardness (mg/L) = (V_EDTA * Molarity * 1000) / V_sample',
          'Ion-exchange regeneration: R-H + NaCl -> R-Na + HCl'
        ],
        mindMap: {
          centralTopic: 'Water Technology',
          branches: [
            {
              title: 'Hardness & EDTA',
              keyPoints: ['CaCO3 equivalent factor', 'EDTA titration with EBT indicator', 'Temporary vs Permanent hardness'],
              icon: 'Droplets'
            },
            {
              title: 'Boiler Troubles',
              keyPoints: ['Scale vs Sludge formation', 'Priming and Foaming', 'Caustic embrittlement mechanism'],
              icon: 'AlertTriangle'
            },
            {
              title: 'Water Softening',
              keyPoints: ['Ion-exchange demineralization', 'Zeolite (Permutit) process', 'Regeneration chemistry'],
              icon: 'Filter'
            }
          ]
        },
        referenceBookChapters: 'Jain & Jain Chapter 1 (pp. 1-60); S. S. Dara Chapter 1',
        suggestedHours: 8
      },
      {
        id: 'ch-u3',
        unit: 3,
        title: 'Fuels & Lubricants',
        description: 'Definition, classification, characteristics of good fuel, Calorific Values (HCV/LCV); Principle and mechanism of lubrication (Fluid film, Boundary, Extreme pressure); Lubricant properties (Flash point, Fire point, Cloud point, Pour point, Viscosity index).',
        subtopics: [
          'Higher Calorific Value (HCV) vs Lower Calorific Value (LCV) relation',
          'Bomb Calorimeter working and numerical calculation of calorific value',
          'Mechanisms of lubrication: Hydrodynamic, Boundary, and Extreme Pressure',
          'Testing of lubricants: Flash and Fire point (Pensky-Martens apparatus)',
          'Viscosity and Viscosity Index (Redwood viscometer)'
        ],
        conceptSummary: 'Energy and friction reduction. Bomb calorimeter numericals and hydrodynamic lubrication theory are university exam staples.',
        keyFormulas: [
          'Dulong’s Formula: HCV = (1/100) [8080 C + 34500 (H - O/8) + 2240 S] kcal/kg',
          'LCV = HCV - [0.09 * H * 587] kcal/kg',
          'Bomb Calorimeter: HCV = [(W + w) * (T2 - T1 + cooling correction)] / Mass of fuel'
        ],
        mindMap: {
          centralTopic: 'Fuels & Lubrication',
          branches: [
            {
              title: 'Calorific Values',
              keyPoints: ['HCV vs LCV Dulong formula', 'Bomb calorimeter apparatus', 'Proximate and ultimate analysis'],
              icon: 'Flame'
            },
            {
              title: 'Lubricant Mechanisms',
              keyPoints: ['Thick film (Hydrodynamic)', 'Thin film (Boundary)', 'Extreme pressure additives'],
              icon: 'Gauge'
            },
            {
              title: 'Properties & Tests',
              keyPoints: ['Flash & Fire point (Pensky Martens)', 'Cloud and pour point', 'Viscosity Index calculation'],
              icon: 'Thermometer'
            }
          ]
        },
        referenceBookChapters: 'Jain & Jain Chapter 2 & 6; S. S. Dara Chapter 2',
        suggestedHours: 7
      },
      {
        id: 'ch-u4',
        unit: 4,
        title: 'Instrumental Techniques in Material Characterization',
        description: 'Classification; Beer-Lambert’s Law; Spectroscopy: Principle and applications of Colorimetry, UV-Visible, Infrared (IR), NMR and Mass spectroscopy; Chromatographic techniques.',
        subtopics: [
          'Derivation of Beer-Lambert’s Law: A = ε * c * l',
          'UV-Visible spectroscopy: chromophores, auxochromes, electronic transitions (σ-σ*, π-π*)',
          'Infrared (IR) spectroscopy: molecular vibrations, functional group identification',
          'NMR spectroscopy: chemical shift δ, spin-spin splitting',
          'Chromatography: Thin Layer (TLC) and Gas Chromatography (GC)'
        ],
        conceptSummary: 'Analytical tools to determine molecular structures and chemical purity. Beer-Lambert derivation and IR functional group peaks (OH, C=O, NH) are guaranteed marks.',
        keyFormulas: [
          'Beer-Lambert Law: A = log10(I0 / I) = ε * c * l',
          'Infrared Frequency: ν_bar = (1 / 2πc) √(k / μ)',
          'NMR Chemical Shift: δ = [(ν_sample - ν_TMS) / operating frequency] * 10^6'
        ],
        mindMap: {
          centralTopic: 'Spectroscopy',
          branches: [
            {
              title: 'Beer-Lambert Law',
              keyPoints: ['Absorbance vs concentration', 'Derivation A = ε c l', 'Colorimetry limitations'],
              icon: 'Eye'
            },
            {
              title: 'UV-Vis & IR',
              keyPoints: ['Electronic transitions', 'IR functional group peaks', 'Carbonyl & hydroxyl detection'],
              icon: 'Radio'
            },
            {
              title: 'Chromatography',
              keyPoints: ['Rf value in TLC', 'Stationary vs mobile phase', 'Gas chromatography detectors'],
              icon: 'Filter'
            }
          ]
        },
        referenceBookChapters: 'Shashi Chawla Chapter 8; Jain & Jain Chapter 8',
        suggestedHours: 8
      },
      {
        id: 'ch-u5',
        unit: 5,
        title: 'Environmental Science & Green Chemistry',
        description: 'Components of Environment and interactions; Natural resources; Ecosystem; EIA; Environmental Protection Act; Green Chemistry principles; Air, Water, Land, and Noise pollution control; Global warming, Ozone depletion, Acid rain.',
        subtopics: [
          '12 Principles of Green Chemistry (Atom economy, prevention of waste)',
          'Air pollution control: Electrostatic Precipitator (ESP), scrubbers',
          'Acid rain mechanism (SO2, NOx reactions) and ozone layer depletion by CFCs',
          'Environmental Impact Assessment (EIA) process stages',
          'Rainwater harvesting and wastewater treatment'
        ],
        conceptSummary: 'Environmental sustainability and engineering solutions. The 12 Principles of Green Chemistry and Air pollution control devices are heavily repeated.',
        keyFormulas: [
          'Atom Economy = [Formula weight of desired product / Total formula weight of all reactants] * 100%',
          'Acid Rain reaction: SO3 + H2O -> H2SO4'
        ],
        mindMap: {
          centralTopic: 'Environmental Science',
          branches: [
            {
              title: 'Green Chemistry',
              keyPoints: ['12 Principles of Anastas', 'Atom economy calculations', 'Safer solvent design'],
              icon: 'Leaf'
            },
            {
              title: 'Pollution Control',
              keyPoints: ['Electrostatic Precipitator (ESP)', 'Venturi scrubber', 'Noise and land pollution remedies'],
              icon: 'Wind'
            },
            {
              title: 'Global Phenomena',
              keyPoints: ['Greenhouse effect & global warming', 'Ozone hole Chapman cycle', 'Eutrophication of lakes'],
              icon: 'Globe'
            }
          ]
        },
        referenceBookChapters: 'B. Joseph Chapter 1-4; A.K. De Environmental Chemistry',
        suggestedHours: 6
      }
    ],
    referenceBooks: [
      {
        title: 'Engineering Chemistry',
        authors: 'P.C. Jain & Monika Jain',
        edition: 'Dhanpat Rai Publications, 2007',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'A Text Book of Engineering Chemistry',
        authors: 'S. S. Dara',
        edition: 'S. Chand & Company, 2007',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [
      {
        topicId: 'ch-u2',
        topicName: 'Water & Its Applications',
        gradingMindset: 'Evaluators look for three specific equations: [1] Metal-indicator complex formation (wine red), [2] EDTA displacement (blue), and [3] Standard hardness CaCO3 conversion formula. Without chemical formulas, 40% marks are deducted.',
        mustIncludeElements: [
          'State role of NH4Cl-NH4OH buffer maintaining pH 10',
          'Write balanced equations: M^2+ + EBT -> [M-EBT] complex (wine red)',
          '[M-EBT] + EDTA -> [M-EDTA] + EBT (steel blue free indicator)'
        ],
        frequentDeductionTraps: [
          'Writing wrong color transitions (it is Wine Red to Steel Blue, not blue to red)',
          'Omitting the multiplication factor 50 in CaCO3 equivalent calculation'
        ],
        teacherCopyPastePattern: 'Jain & Jain Chapter 1 Solved Example 1.4 and Section 1.5.',
        bookSectionToPrioritize: 'Jain & Jain Chapter 1 (Water Technology) Sections 1.4, 1.8, 1.12.',
        bookSectionsToSkip: 'Section on colloidal silica estimation and marine water desalination history.'
      }
    ],
    videoRecommendations: [
      {
        id: 'vid-ch-1',
        topicId: 'ch-u2',
        topicName: 'Water & Its Applications',
        title: 'Determination of Hardness of Water by EDTA Method (Principle & Titration)',
        channel: 'Engineering Chemistry',
        durationMinutes: 18,
        conceptFocus: 'Principle, chemical equations, wine-red to steel-blue indicator transition, and buffer pH 10.',
        youtubeSearchQuery: 'EDTA method hardness of water engineering chemistry',
        youtubeUrl: 'https://www.youtube.com/watch?v=FCQ26RQBZLg',
        thumbnailUrl: 'https://img.youtube.com/vi/FCQ26RQBZLg/mqdefault.jpg',
        youtubeVideoId: 'FCQ26RQBZLg',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '02:00', topic: 'Principle of EDTA Titration' },
          { time: '07:45', topic: 'Indicator Reactions (EBT Buffer pH 10)' },
          { time: '13:20', topic: 'Hardness Calculation Formula' }
        ]
      },
      {
        id: 'vid-ch-2',
        topicId: 'ch-u2',
        topicName: 'Water & Its Applications',
        title: 'Hardness of Water Numerical Problems & CaCO3 Equivalent Calculation',
        channel: 'Engineering Chemistry Academy',
        durationMinutes: 21,
        conceptFocus: 'Step-by-step solving of university numericals on temporary and permanent hardness with multiplication factors.',
        youtubeSearchQuery: 'Hardness of water numerical problems CaCO3 equivalent',
        youtubeUrl: 'https://www.youtube.com/watch?v=KBo9VB30pbk',
        thumbnailUrl: 'https://img.youtube.com/vi/KBo9VB30pbk/mqdefault.jpg',
        youtubeVideoId: 'KBo9VB30pbk',
        level: 'High Yield',
        keyTimestamps: [
          { time: '01:30', topic: 'Equivalence Factor of Hardness Salts' },
          { time: '09:10', topic: 'Standard Numerical Example' }
        ]
      },
      {
        id: 'vid-ch-3',
        topicId: 'ch-u2',
        topicName: 'Water & Its Applications',
        title: 'Boiler Troubles: Scales, Sludges and Caustic Embrittlement Mechanism',
        channel: 'Engineering Chemistry Lessons',
        durationMinutes: 17,
        conceptFocus: 'Differences between sludge and scale, prevention by phosphate conditioning, and caustic embrittlement crack formation.',
        youtubeSearchQuery: 'Boiler troubles scale sludge caustic embrittlement',
        youtubeUrl: 'https://www.youtube.com/watch?v=bo0XVpMw_DM',
        thumbnailUrl: 'https://img.youtube.com/vi/bo0XVpMw_DM/mqdefault.jpg',
        youtubeVideoId: 'bo0XVpMw_DM',
        level: 'Deep Dive'
      }
    ]
  },
  {
    id: 'course-sem1-mechanical',
    name: 'General Mechanical Engineering',
    code: '1RMES3',
    semester: 'Semester-I (Common to all branches)',
    semesterNumber: 1,
    credits: '3+1(P) (L:2, T:1, P:2)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#f97316',
    syllabus: [
      {
        id: 'me-u1',
        unit: 1,
        title: 'Thermodynamics Processes & Systems',
        description: 'Thermodynamics processes, systems and control volume, properties of a system, internal energy and enthalpy of ideal gases, energy analysis of steady flow systems (SFEE), analysis of steady flow engineering devices.',
        subtopics: [
          'Open, closed, and isolated systems with thermodynamic equilibrium',
          'First Law of Thermodynamics for closed system undergoing a process and cycle',
          'Steady Flow Energy Equation (SFEE) derivation: h1 + V1^2/2 + gz1 + q = h2 + V2^2/2 + gz2 + w',
          'Application of SFEE to Nozzle, Diffuser, Turbine, Compressor, and Throttling valve',
          'Reversible processes (Isobaric, Isochoric, Isothermal, Polytropic p v^n = c)'
        ],
        conceptSummary: 'Foundational thermal engineering. SFEE applications to turbines and nozzles are guaranteed 8-mark numericals.',
        keyFormulas: [
          'SFEE: h1 + V1^2/2000 + g z1/1000 + q = h2 + V2^2/2000 + g z2/1000 + w',
          'Polytropic work: W = (p1 v1 - p2 v2) / (n - 1)',
          'First Law: dQ = dU + dW'
        ],
        mindMap: {
          centralTopic: 'Thermodynamics',
          branches: [
            {
              title: 'System Concepts',
              keyPoints: ['Open, closed, isolated boundaries', 'State, property, path function', 'Quasi-static reversible processes'],
              icon: 'Box'
            },
            {
              title: 'First Law & SFEE',
              keyPoints: ['SFEE general formulation', 'Turbine work output', 'Nozzle velocity exit equation'],
              icon: 'Zap'
            },
            {
              title: 'Gas Processes',
              keyPoints: ['Isothermal W = p1 v1 ln(v2/v1)', 'Adiabatic p v^γ = c', 'Internal energy u = cv dT'],
              icon: 'Flame'
            }
          ]
        },
        referenceBookChapters: 'P K Nag Chapter 3 & 4; R K Rajput Chapter 2',
        suggestedHours: 8
      },
      {
        id: 'me-u2',
        unit: 2,
        title: 'Properties of Pure Substance & Steam Tables',
        description: 'Properties of pure substance, wet, dry and superheated steam, Critical point and Triple point, enthalpy and internal energy of steam, quality or dryness fraction (x), use of steam tables and Mollier chart.',
        subtopics: [
          'Phase change on p-v, T-s, and h-s (Mollier) diagrams',
          'Critical point parameters of water (22.09 MPa, 374.14°C)',
          'Dryness fraction x = m_vapor / (m_liquid + m_vapor)',
          'Enthalpy of wet steam: h = h_f + x * h_fg',
          'Methods for measurement of steam quality (Throttling calorimeter)'
        ],
        conceptSummary: 'Water-steam phase changes. Reading steam tables for saturation pressure/temperature and solving dryness fraction equations.',
        keyFormulas: [
          'Wet steam volume: v = (1 - x) v_f + x * v_g ≈ x * v_g',
          'Wet steam enthalpy: h = h_f + x * h_fg',
          'Superheated steam: h = h_g + c_ps (T_sup - T_sat)'
        ],
        mindMap: {
          centralTopic: 'Pure Substances',
          branches: [
            {
              title: 'Phase Diagrams',
              keyPoints: ['p-v and T-s saturation domes', 'Triple point vs Critical point', 'Dry saturated vapor line'],
              icon: 'TrendingUp'
            },
            {
              title: 'Steam Properties',
              keyPoints: ['Dryness fraction x', 'Enthalpy h = hf + x hfg', 'Entropy s = sf + x sfg'],
              icon: 'Droplets'
            },
            {
              title: 'Measurement',
              keyPoints: ['Throttling calorimeter', 'Separating calorimeter', 'Constant enthalpy throttling'],
              icon: 'Thermometer'
            }
          ]
        },
        referenceBookChapters: 'P K Nag Chapter 8 (pp. 210-265); R K Rajput Chapter 3',
        suggestedHours: 8
      },
      {
        id: 'me-u3',
        unit: 3,
        title: 'Air Standard Cycles (Otto & Diesel)',
        description: 'Air standard assumptions; Internal combustion reciprocating engines (2-stroke & 4-stroke); Thermodynamic analysis of Otto cycle and Diesel cycle; Comparison of Otto and Diesel cycles.',
        subtopics: [
          'Air standard assumptions (air is ideal gas, constant specific heats)',
          'Otto cycle: p-v and T-s diagrams, derivation of thermal efficiency: η_otto = 1 - (1 / r^(γ-1))',
          'Diesel cycle: cut-off ratio r_c, derivation of thermal efficiency: η_diesel',
          'Comparison of Otto and Diesel cycles for same compression ratio vs same peak pressure',
          '4-stroke Petrol engine vs 4-stroke Diesel engine operation'
        ],
        conceptSummary: 'IC Engine thermodynamic cycles. The air-standard efficiency derivations of Otto and Diesel cycles on p-v/T-s diagrams are among the most frequently asked derivations.',
        keyFormulas: [
          'Otto Cycle: η = 1 - [1 / r^(γ - 1)] where r = v1/v2',
          'Diesel Cycle: η = 1 - [1 / r^(γ-1)] * [(r_c^γ - 1) / (γ * (r_c - 1))]',
          'Compression ratio: r = (V_c + V_s) / V_c'
        ],
        mindMap: {
          centralTopic: 'Air Standard Cycles',
          branches: [
            {
              title: 'Otto Cycle',
              keyPoints: ['Constant volume heat addition', 'p-v and T-s diagrams', 'Efficiency derivation vs compression ratio'],
              icon: 'Activity'
            },
            {
              title: 'Diesel Cycle',
              keyPoints: ['Constant pressure heat addition', 'Cut-off ratio rc effect', 'Comparison with Otto cycle'],
              icon: 'Zap'
            },
            {
              title: 'Engine Operation',
              keyPoints: ['Four-stroke petrol vs diesel', 'Two-stroke ports vs valves', 'Mean effective pressure (mep)'],
              icon: 'Settings'
            }
          ]
        },
        referenceBookChapters: 'P K Nag Chapter 13; R K Rajput Chapter 5',
        suggestedHours: 9
      },
      {
        id: 'me-u4',
        unit: 4,
        title: 'Manufacturing Processes: Casting & Forming',
        description: 'Classification of manufacturing processes; Introduction to metal casting; Pattern making and allowances; Elements of gating system; Solidification of castings; Sand casting and permanent mould casting; Casting defects; Metal forming operations.',
        subtopics: [
          'Sand casting step-by-step: Flask, pattern, cope, drag, core, gating system',
          'Pattern allowances: Shrinkage, draft, machining, distortion allowance',
          'Gating system components: Pouring basin, sprue, runner, gate, and riser function',
          'Casting defects: Blow holes, shrinkage cavity, hot tears, cold shut, misrun',
          'Metal forming: Forging, rolling, extrusion, and wire drawing overview'
        ],
        conceptSummary: 'Foundry and shaping processes. Riser design and pattern allowance diagrams are tested in descriptive questions.',
        keyFormulas: [
          'Chvorinov’s Rule: Solidification time t = C * (V / A)^2',
          'Riser design: (V/A)_riser > (V/A)_casting'
        ],
        mindMap: {
          centralTopic: 'Casting & Forming',
          branches: [
            {
              title: 'Sand Casting',
              keyPoints: ['Cope and Drag assembly', 'Types of patterns and allowances', 'Molding sand properties'],
              icon: 'Box'
            },
            {
              title: 'Gating & Riser',
              keyPoints: ['Chvorinov rule for solidification', 'Sprue and runner function', 'Choke area calculation'],
              icon: 'Sliders'
            },
            {
              title: 'Metal Forming',
              keyPoints: ['Hot vs Cold working', 'Rolling, Forging, Extrusion', 'Common casting defects and remedies'],
              icon: 'Wrench'
            }
          ]
        },
        referenceBookChapters: 'P N Rao Manufacturing Technology Vol-I; S K Hajra Choudhury Vol-I',
        suggestedHours: 8
      },
      {
        id: 'me-u5',
        unit: 5,
        title: 'Welding Processes & Lathe Machining',
        description: 'Classification of welding processes; Types of welded joints; Arc welding (TIG and MIG); Oxy-acetylene gas welding; Resistance welding (Spot and Seam); Fundamentals of metal machining, lathe construction and tooling.',
        subtopics: [
          'TIG (GTAW) vs MIG (GMAW) welding comparison and shielding gases (Argon, CO2)',
          'Oxy-acetylene gas welding flames: Neutral, Oxidizing, and Carburizing flames',
          'Resistance welding: Spot welding cycle and Heat generated H = I^2 R t',
          'Lathe machine: Bed, headstock, tailstock, carriage, lead screw',
          'Lathe operations: Turning, facing, knurling, thread cutting, parting-off'
        ],
        conceptSummary: 'Joining and machining. The flame types in gas welding and TIG vs MIG comparison table appear in almost every semester exam.',
        keyFormulas: [
          'Heat Generated in Spot Welding: H = I^2 * R * t (Joules)',
          'Lathe Cutting Speed: V = (π * D * N) / 1000 (m/min)'
        ],
        mindMap: {
          centralTopic: 'Welding & Machining',
          branches: [
            {
              title: 'Arc Welding',
              keyPoints: ['TIG welding (Non-consumable tungsten)', 'MIG welding (Consumable wire)', 'Shielding gas properties'],
              icon: 'Zap'
            },
            {
              title: 'Gas & Resistance',
              keyPoints: ['Oxy-acetylene 3 flames', 'Electric resistance spot welding', 'H = I^2 R t calculation'],
              icon: 'Flame'
            },
            {
              title: 'Lathe Machine',
              keyPoints: ['Lathe parts and specifications', 'Turning and facing operations', 'Single point cutting tool geometry'],
              icon: 'Disc'
            }
          ]
        },
        referenceBookChapters: 'P N Rao Vol-I; S K Hajra Choudhury Vol-II',
        suggestedHours: 8
      }
    ],
    referenceBooks: [
      {
        title: 'Engineering Thermodynamics',
        authors: 'P K Nag',
        edition: '6th Edition, McGraw-Hill, 2017',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'Thermal Engineering',
        authors: 'R K Rajput',
        edition: '11th Edition, Laxmi Publications, 2020',
        role: 'Supplementary Numerical Practice',
        coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [
      {
        topicId: 'me-u3',
        topicName: 'Air Standard Cycles (Otto & Diesel)',
        gradingMindset: 'Draw neat p-v and T-s diagrams with clear state numbers (1-2 is isentropic compression, 2-3 is constant volume heat addition, 3-4 is isentropic expansion, 4-1 is heat rejection). Explicitly write T-s temperature ratios in terms of compression ratio r.',
        mustIncludeElements: [
          'p-v and T-s diagrams labeled with directional arrows',
          'Assumption list (working fluid is ideal gas with constant specific heats)',
          'Relation T2/T1 = (v1/v2)^(γ-1) = r^(γ-1)'
        ],
        frequentDeductionTraps: [
          'Confusing constant volume heat addition in Otto with constant pressure in Diesel',
          'Omitting the negative sign or inversion step in 1 - (1 / r^(γ-1))'
        ],
        teacherCopyPastePattern: 'P K Nag Chapter 13 Solved Example 13.2.',
        bookSectionToPrioritize: 'P K Nag Chapter 13: Sections 13.1 to 13.5.',
        bookSectionsToSkip: 'Stirling and Ericsson cycle details.'
      }
    ],
    videoRecommendations: [
      {
        id: 'vid-me-1',
        topicId: 'me-u1',
        topicName: 'First Law of Thermodynamics & Systems',
        title: 'First Law of Thermodynamics for Closed & Open Systems (Full Concept & Numericals)',
        channel: 'Gate Academy',
        durationMinutes: 25,
        conceptFocus: 'Deriving Steady Flow Energy Equation (SFEE) and work done in isothermal, adiabatic, and polytropic processes.',
        youtubeSearchQuery: 'Gate Academy First Law of Thermodynamics engineering',
        youtubeUrl: 'https://www.youtube.com/watch?v=08aJpz_ZiMg',
        thumbnailUrl: 'https://img.youtube.com/vi/08aJpz_ZiMg/mqdefault.jpg',
        youtubeVideoId: '08aJpz_ZiMg',
        level: 'High Yield',
        keyTimestamps: [
          { time: '02:30', topic: 'First Law Statement & Joule Experiment' },
          { time: '11:40', topic: 'SFEE Equation Derivation' },
          { time: '18:50', topic: 'Nozzle, Turbine, Compressor Applications' }
        ]
      },
      {
        id: 'vid-me-2',
        topicId: 'me-u2',
        topicName: 'Second Law of Thermodynamics & Heat Engines',
        title: 'Second Law of Thermodynamics, Clausius & Kelvin Planck Statements & Carnot Engine',
        channel: 'Gate Academy',
        durationMinutes: 28,
        conceptFocus: 'Reversible and irreversible cycles, Carnot cycle thermal efficiency derivation on P-V and T-S coordinates.',
        youtubeSearchQuery: 'Second law of thermodynamics Carnot cycle Gate Academy',
        youtubeUrl: 'https://www.youtube.com/watch?v=0fG3aNRsSaA',
        thumbnailUrl: 'https://img.youtube.com/vi/0fG3aNRsSaA/mqdefault.jpg',
        youtubeVideoId: '0fG3aNRsSaA',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '03:15', topic: 'Kelvin-Planck & Clausius Statements' },
          { time: '14:20', topic: 'Carnot Cycle on P-V and T-S Diagram' }
        ]
      }
    ]
  },
  {
    id: 'course-sem1-electronics',
    name: 'Basic Electronics',
    code: '1RTES4',
    semester: 'Semester-I/II (Common to all branches)',
    semesterNumber: 1,
    credits: '3+1(P) (L:2, T:1, P:2)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#3b82f6',
    syllabus: [
      {
        id: 'el-u1',
        unit: 1,
        title: 'Semiconductor Physics & PN Junction Diodes',
        description: 'Intrinsic, Extrinsic semiconductors, PN Junction under Zero, Forward and reverse Bias, Space charge width, PN junction diode current equation, breakdown phenomena.',
        subtopics: [
          'Carrier concentration and mass action law n * p = ni^2',
          'Diode current equation: I = Is [exp(V / ηVt) - 1]',
          'Space charge depletion width and barrier potential',
          'Zener breakdown vs Avalanche breakdown comparison',
          'Piecewise linear equivalent circuit model'
        ],
        conceptSummary: 'Semiconductor charge mechanics and diode operation. Focus heavily on Zener vs Avalanche comparison table and diode current equation.',
        keyFormulas: [
          'I = I_0 [e^(V / η V_T) - 1], where V_T = k T / q ≈ 26 mV at 300K',
          'Dynamic resistance: r_d = η V_T / I_D',
          'Depletion width: W ∝ √(V_bi + V_R)'
        ],
        mindMap: {
          centralTopic: 'Semiconductors & Diodes',
          branches: [
            {
              title: 'Carrier Transport',
              keyPoints: ['Drift vs Diffusion currents', 'Intrinsic vs Extrinsic doping', 'Energy band gap Eg'],
              icon: 'Activity'
            },
            {
              title: 'PN Junction',
              keyPoints: ['Forward bias conduction', 'Reverse saturation current', 'Diode current equation'],
              icon: 'Split'
            },
            {
              title: 'Breakdown',
              keyPoints: ['Zener breakdown (< 6V, tunneling)', 'Avalanche breakdown (> 6V, impact ionization)', 'Temperature coefficients'],
              icon: 'AlertTriangle'
            }
          ]
        },
        referenceBookChapters: 'Boylestad & Nashelsky Chapter 1; Sedra & Smith Chapter 4',
        suggestedHours: 7
      },
      {
        id: 'el-u2',
        unit: 2,
        title: 'P-N Diode Applications (Rectifiers & Clippers)',
        description: 'Clipper circuits, Clamper circuits, DC power supply: Half wave rectifier, full wave rectifier (center tapped and bridge) with and without filter capacitor.',
        subtopics: [
          'Half wave rectifier: Vdc = Vm/π, Ripple factor = 1.21, Efficiency = 40.6%',
          'Full wave bridge rectifier: Vdc = 2Vm/π, Ripple factor = 0.482, Efficiency = 81.2%',
          'Positive and negative clipper circuits with DC bias voltages',
          'Positive and negative clamping circuits (Clamping theorem)',
          'Capacitor filter ripple factor r = 1 / (4√3 f R_L C)'
        ],
        conceptSummary: 'AC to DC conversion. The Full Wave Bridge rectifier working and ripple factor derivation is a mandatory 10-mark question.',
        keyFormulas: [
          'Bridge Rectifier V_dc = 2 V_m / π ≈ 0.636 V_m',
          'Ripple Factor r = √[(I_rms / I_dc)^2 - 1] = 0.482',
          'PIV = V_m (Bridge) vs 2 V_m (Center Tapped)'
        ],
        mindMap: {
          centralTopic: 'Rectifiers & Wave Shaping',
          branches: [
            {
              title: 'Rectifiers',
              keyPoints: ['Half-wave vs Bridge rectifier', 'PIV comparison', 'Ripple factor derivation (0.482)'],
              icon: 'Repeat'
            },
            {
              title: 'Clippers',
              keyPoints: ['Series vs Parallel clippers', 'Biased clipping levels', 'Transfer characteristic curve'],
              icon: 'Scissors'
            },
            {
              title: 'Filters & Clampers',
              keyPoints: ['Capacitor filter action', 'DC restoration clampers', 'Peak-to-peak output voltage'],
              icon: 'Filter'
            }
          ]
        },
        referenceBookChapters: 'Boylestad Chapter 2 (pp. 59-130); Sedra & Smith Chapter 4',
        suggestedHours: 8
      },
      {
        id: 'el-u3',
        unit: 3,
        title: 'Special Diodes & Voltage Regulation',
        description: 'Types of diodes: Zener diode and voltage regulator (line and load regulation), LED, 7-segment LED, Photo diode, PIN diode, Tunnel Diode, Varactor diode.',
        subtopics: [
          'Zener voltage regulator design formulas and Rs calculation',
          'Line regulation (varying Vin) and load regulation (varying RL)',
          'Tunnel diode negative resistance characteristics and tunneling',
          'Varactor diode voltage-variable capacitance application',
          'Photodiode reverse-biased photon detection and LED generation'
        ],
        conceptSummary: 'Voltage stabilization and optoelectronic transducers. Zener regulator numericals with Rs calculation are frequent in exams.',
        keyFormulas: [
          'R_s = (V_in(min) - V_z) / (I_z(min) + I_L(max))',
          'P_z(max) = V_z * I_z(max)',
          'Varactor Capacitance: C_T = C(0) / (1 + V_R / V_bi)^n'
        ],
        mindMap: {
          centralTopic: 'Special Diodes',
          branches: [
            {
              title: 'Zener Regulator',
              keyPoints: ['Reverse breakdown stability', 'Line & Load regulation formulas', 'Calculating series resistance Rs'],
              icon: 'ShieldCheck'
            },
            {
              title: 'Optoelectronics',
              keyPoints: ['LED spontaneous emission', '7-segment display pinout', 'Photodiode reverse mode'],
              icon: 'Sun'
            },
            {
              title: 'Microwave Diodes',
              keyPoints: ['Tunnel diode negative resistance', 'Varactor diode capacitance tuning', 'PIN diode RF switching'],
              icon: 'Radio'
            }
          ]
        },
        referenceBookChapters: 'Boylestad Chapter 3; Millman & Grabel Chapter 3',
        suggestedHours: 6
      },
      {
        id: 'el-u4',
        unit: 4,
        title: 'Bipolar Junction Transistor (BJT) & Biasing',
        description: 'Bipolar principal of operation, Different modes: Common Base, Common Emitter, Common Collector; Concept of Q point; Biasing methods (fixed bias, self/voltage divider bias); BJT as amplifier and switch.',
        subtopics: [
          'Transistor action and relation between α and β: β = α / (1 - α)',
          'CE input and output characteristics (Cutoff, Active, Saturation regions)',
          'DC load line construction and Q-point stability',
          'Voltage divider bias (self-bias) circuit analysis and stability factor S',
          'Transistor working as an inverting digital switch'
        ],
        conceptSummary: 'Three-terminal current-controlled amplifier. Voltage divider bias is preferred because its Q-point is independent of β.',
        keyFormulas: [
          'I_E = I_B + I_C, I_C = β I_B + I_CEO',
          'β = α / (1 - α), α = β / (1 + β)',
          'DC Load Line: V_CE = V_CC - I_C (R_C + R_E)',
          'Self-bias Stability: S ≈ 1 + (R_B / R_E)'
        ],
        mindMap: {
          centralTopic: 'BJT Transistors',
          branches: [
            {
              title: 'Configurations',
              keyPoints: ['CB, CE, CC modes comparison', 'CE current gain β', 'Input/Output characteristics curves'],
              icon: 'Sliders'
            },
            {
              title: 'Biasing Schemes',
              keyPoints: ['Fixed bias instability', 'Voltage divider (Self) bias', 'Operating Q-point selection'],
              icon: 'Compass'
            },
            {
              title: 'Applications',
              keyPoints: ['CE voltage amplifier', 'BJT as a saturated switch', 'Cutoff and saturation conditions'],
              icon: 'Zap'
            }
          ]
        },
        referenceBookChapters: 'Boylestad Chapter 4 & 5; Sedra & Smith Chapter 5',
        suggestedHours: 10
      },
      {
        id: 'el-u5',
        unit: 5,
        title: 'Operational Amplifiers (OP-AMP)',
        description: 'OP-AMP block diagram, ideal OP-AMP characteristics, transfer curve, open loop and close loop configuration. Feedback: positive and negative; Inverting, non-inverting op-amp, summer, subtractor, integrator, differentiator, comparator.',
        subtopics: [
          'Ideal OP-AMP parameters (Infinite gain, infinite Ri, zero Ro, infinite CMRR)',
          'Concept of Virtual Ground and Virtual Short',
          'Inverting amplifier gain derivation: Av = -Rf / R1',
          'Non-inverting amplifier gain derivation: Av = 1 + (Rf / R1)',
          'Summing amplifier, Subtractor, Integrator, and Differentiator circuits'
        ],
        conceptSummary: 'Universal analog computational block. Virtual ground concept and closed-loop gain derivations are tested in every exam.',
        keyFormulas: [
          'Inverting Gain: V_out / V_in = -R_f / R_1',
          'Non-Inverting Gain: V_out / V_in = 1 + (R_f / R_1)',
          'Integrator Output: V_out = -1/(R C) ∫ V_in dt',
          'Differentiator Output: V_out = -R C (dV_in / dt)'
        ],
        mindMap: {
          centralTopic: 'OP-AMP Applications',
          branches: [
            {
              title: 'Ideal Characteristics',
              keyPoints: ['Infinite gain A_OL', 'Virtual ground concept', 'Infinite input impedance Ri'],
              icon: 'Activity'
            },
            {
              title: 'Linear Amplifiers',
              keyPoints: ['Inverting Av = -Rf/R1', 'Non-inverting Av = 1 + Rf/R1', 'Voltage follower buffer Av = 1'],
              icon: 'Maximize'
            },
            {
              title: 'Mathematical Blocks',
              keyPoints: ['Summing amplifier', 'Integrator with capacitor feedback', 'Differentiator frequency limits'],
              icon: 'Sigma'
            }
          ]
        },
        referenceBookChapters: 'R.A. Gayakwad Chapter 1, 2, 7; Boylestad Chapter 10',
        suggestedHours: 9
      }
    ],
    referenceBooks: [
      {
        title: 'Electronic Devices and Circuit Theory',
        authors: 'R. L. Boylestad & L. Nashelsky',
        edition: 'Prentice Hall, 2002 / 11th Edition',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'OP-Amps and Linear Integrated Circuits',
        authors: 'R. A. Gayakwad',
        edition: 'Prentice Hall of India, 4th Edition',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [
      {
        topicId: 'el-u2',
        topicName: 'P-N Diode Applications (Rectifiers & Clippers)',
        gradingMindset: 'Evaluators strictly award marks based on neat waveform plots. In ripple factor derivation, proving r = sqrt((Irms/Idc)^2 - 1) = 0.482 is mandatory.',
        mustIncludeElements: [
          'Full wave bridge circuit diagram with 4 diodes labeled D1-D4',
          'Waveform diagrams for positive and negative half cycles',
          'Explicit calculus derivation for Idc = 2 Im / pi'
        ],
        frequentDeductionTraps: [
          'Confusing PIV of Bridge Rectifier (Vm) with Center-tapped Rectifier (2Vm)'
        ],
        teacherCopyPastePattern: 'Boylestad Chapter 2 Solved Example 2.18.',
        bookSectionToPrioritize: 'Boylestad Chapter 2 Sections 2.6 and 2.8.',
        bookSectionsToSkip: 'Section 2.11 on solar cells.'
      }
    ],
    videoRecommendations: [
      {
        id: 'vid-el-1',
        topicId: 'el-u1',
        topicName: 'DC Network Analysis & Theorems',
        title: 'Kirchhoff’s Laws (KCL & KVL) with Solved University Problems',
        channel: 'Neso Academy',
        durationMinutes: 20,
        conceptFocus: 'Kirchhoff’s Current Law and Voltage Law sign conventions with mesh and nodal analysis.',
        youtubeSearchQuery: 'Neso Academy KCL and KVL basic electrical',
        youtubeUrl: 'https://www.youtube.com/results?search_query=Neso+Academy+KCL+and+KVL+basic+electrical',
        thumbnailUrl: 'https://img.youtube.com/vi/7v3Z_oXk6pI/mqdefault.jpg',
        youtubeVideoId: '7v3Z_oXk6pI',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '01:45', topic: 'KCL Statement & Node Equations' },
          { time: '09:20', topic: 'KVL Statement & Loop Mesh Equations' },
          { time: '14:30', topic: 'Solved Example' }
        ]
      },
      {
        id: 'vid-el-2',
        topicId: 'el-u1',
        topicName: 'DC Network Analysis & Theorems',
        title: 'Thevenin’s Theorem Step-by-Step with Solved Circuit Numericals',
        channel: 'Neso Academy',
        durationMinutes: 23,
        conceptFocus: 'Finding Vth (open circuit voltage) and Rth (Thevenin resistance) with independent sources.',
        youtubeSearchQuery: 'Neso Academy Thevenins Theorem basic electrical',
        youtubeUrl: 'https://www.youtube.com/watch?v=veAFVTIpKyM',
        thumbnailUrl: 'https://img.youtube.com/vi/veAFVTIpKyM/mqdefault.jpg',
        youtubeVideoId: 'veAFVTIpKyM',
        level: 'High Yield',
        keyTimestamps: [
          { time: '02:10', topic: 'Thevenin Theorem Statement' },
          { time: '08:50', topic: 'Step-by-Step Procedure to find Vth and Rth' }
        ]
      },
      {
        id: 'vid-el-3',
        topicId: 'el-u2',
        topicName: 'P-N Diode Applications (Rectifiers & Clippers)',
        title: 'PN Junction Diode Working & V-I Characteristics Complete Concept',
        channel: 'Neso Academy',
        durationMinutes: 19,
        conceptFocus: 'Depletion layer, barrier potential, forward and reverse bias characteristics with rectifier applications.',
        youtubeSearchQuery: 'Neso Academy PN Junction diode working rectifiers',
        youtubeUrl: 'https://www.youtube.com/watch?v=gRyMzKVAO4s',
        thumbnailUrl: 'https://img.youtube.com/vi/gRyMzKVAO4s/mqdefault.jpg',
        youtubeVideoId: 'gRyMzKVAO4s',
        level: 'Deep Dive'
      },
      {
        id: 'vid-el-4',
        topicId: 'el-u4',
        topicName: 'Bipolar Junction Transistors (BJT)',
        title: 'BJT Transistor Construction, Working & CE Configuration Input-Output Characteristics',
        channel: 'Neso Academy',
        durationMinutes: 24,
        conceptFocus: 'Emitter, Base, Collector doping and current relations IE = IB + IC in Common Emitter configuration.',
        youtubeSearchQuery: 'Neso Academy BJT Transistor operation',
        youtubeUrl: 'https://www.youtube.com/watch?v=KFCgeI4j-Ig',
        thumbnailUrl: 'https://img.youtube.com/vi/KFCgeI4j-Ig/mqdefault.jpg',
        youtubeVideoId: 'KFCgeI4j-Ig',
        level: 'Exam-Cram'
      }
    ]
  },
  {
    id: 'course-sem1-english',
    name: 'Technical English',
    code: '1RAHS6',
    semester: 'Semester-I (Common to all branches)',
    semesterNumber: 1,
    credits: '3 (L:2, T:1, P:0)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#8b5cf6',
    syllabus: [
      {
        id: 'en-u1',
        unit: 1,
        title: 'Basics of Technical Communication',
        description: 'Meaning of technical communication; process of communication; Forms: Verbal and Non-verbal; barriers to communication; essentials of effective communication; defining audiences; global, ethical, legal aspects.',
        subtopics: [
          'Communication process model: Sender, encoding, channel, decoding, receiver, feedback',
          'Non-verbal communication: Kinesics, proxemics, paralanguage, chronemics',
          'Barriers to communication: Physical, psychological, semantic, organizational',
          '7 Cs of effective communication (Clarity, Conciseness, Completeness, etc.)'
        ],
        conceptSummary: 'Engineering communication channels and barrier elimination. The 7 Cs of communication and barriers are 10-mark theory questions.',
        keyFormulas: ['7 Cs: Clarity, Conciseness, Completeness, Concreteness, Courtesy, Correctness, Consideration'],
        referenceBookChapters: 'A. Esenberg Chapter 1; C. L. Bovee Chapter 1',
        suggestedHours: 6
      },
      {
        id: 'en-u2',
        unit: 2,
        title: 'Professional Correspondence & Letters',
        description: 'Qualities of professional correspondence; Business Letters: basic formats, inquiry, complaint, sales letters; Memos: format and writing; Job application letters & Designing Resumes; Meeting and Minutes.',
        subtopics: [
          'Business letter layout: Full-block vs semi-block format',
          'Job application letter (Cover letter) and Chronological vs Functional Resume',
          'Writing Memorandums (Memos) and Notice of meeting',
          'Drafting Minutes of Meeting (MOM)'
        ],
        conceptSummary: 'Formal workplace correspondence. Drafting a professional resume and cover letter carries maximum marks in the writing section.',
        referenceBookChapters: 'R. C. Sharma & K. Mohan Chapter 3 & 4',
        suggestedHours: 7
      },
      {
        id: 'en-u3',
        unit: 3,
        title: 'Technical Writing & Reports',
        description: 'Meaning and process of technical writing; Summaries, instructions, and user manuals; Technical Reports: essentials, formal vs informal report formats, progress reports, feasibility reports.',
        subtopics: [
          'Technical report structure: Title page, abstract, table of contents, findings, recommendations',
          'Progress reports, lab reports, and feasibility reports drafting',
          'Writing clear technical descriptions and user instructions'
        ],
        referenceBookChapters: 'A. J. Rutherford Basic Communication Skills',
        suggestedHours: 6
      },
      {
        id: 'en-u4',
        unit: 4,
        title: 'Reading Comprehension & Precis Writing',
        description: 'Reading comprehension; Precis writing; Expansion of an idea; Dialogue writing; Paragraph writing related to technical communication.',
        subtopics: [
          'Rules of Precis Writing (1/3rd length, third person, past tense, own words)',
          'Reading comprehension skimming and scanning techniques',
          'Paragraph development using cause-and-effect and comparison'
        ],
        referenceBookChapters: 'R. V. Lesikar Basic Business Communication',
        suggestedHours: 5
      },
      {
        id: 'en-u5',
        unit: 5,
        title: 'Grammar & Technical Vocabulary',
        description: 'Foreign words and phrases; Antonyms and synonyms; Transitional words; Articles, prepositions, modal verbs, connectives, correction of sentences; Technical words and jargons.',
        subtopics: [
          'Correction of grammatical errors and subject-verb agreement',
          'Common foreign words in technology (ad hoc, de facto, status quo)',
          'Use of active vs passive voice in scientific descriptions'
        ],
        referenceBookChapters: 'Wren & Martin High School English Grammar',
        suggestedHours: 5
      }
    ],
    referenceBooks: [
      {
        title: 'Business Correspondence and Report Writing',
        authors: 'R. C. Sharma and K. Mohan',
        edition: 'Tata McGraw-Hill, 2002',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [],
    videoRecommendations: []
  },
  {
    id: 'course-sem1-design-thinking',
    name: 'Design Thinking',
    code: '1RAHS6',
    semester: 'Semester 1 • First Year B.Tech',
    semesterNumber: 1,
    credits: '2.0 (L: 2, T: 0, P: 0)',
    examTarget: 'MST-1',
    heroImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
    badgeColor: 'amber',
    syllabus: [
      {
        id: 'dt-u1',
        unit: 1,
        title: 'Introduction to Design Thinking & Innovation',
        description: 'Need for Design Thinking; Cognitive science behind technical retention and creative thought; Introduction to engineering product innovation.',
        subtopics: ['Mindsets for design thinking', 'Creative vs analytical thought processes'],
        conceptSummary: 'Cognitive science behind technical retention and creative thought.',
        referenceBookChapters: 'E. Balaguruswamy Developing Thinking Skills Chapter 1',
        suggestedHours: 3
      },
      {
        id: 'dt-u2',
        unit: 2,
        title: '5 Stages of Design Thinking Process',
        description: 'Need for Design Thinking; Concepts & Brainstorming; Stages: Empathize, Define, Ideate, Prototype, Test, Implement with engineering examples.',
        subtopics: [
          'Empathize: User interviews, observation, empathy maps',
          'Define: Point of View (POV) problem statements',
          'Ideate: Brainstorming, SCAMPER technique, mind mapping',
          'Prototype: Low-fidelity wireframes, physical mockups',
          'Test: Gathering user feedback and iterative refinement'
        ],
        conceptSummary: 'The core 5-stage innovation cycle from Stanford d.school and IDEO.',
        keyFormulas: ['Stages: 1. Empathize -> 2. Define -> 3. Ideate -> 4. Prototype -> 5. Test'],
        referenceBookChapters: 'Tim Brown "Design Thinking" (Harvard Business Review); IDEO Handbook',
        suggestedHours: 4
      },
      {
        id: 'dt-u3',
        unit: 3,
        title: 'Key Principles & Design Thinking Tools',
        description: 'Creative thinking process; Problem solving; Experimentation; Creative problem solving tools.',
        subtopics: ['Divergent thinking vs Convergent thinking', 'Root cause analysis (5 Whys technique)'],
        referenceBookChapters: 'IDEO Design Thinking Handbook',
        suggestedHours: 3
      },
      {
        id: 'dt-u4',
        unit: 4,
        title: 'Process of Engineering Product Design',
        description: 'Process of engineering product design; Design thinking approach; Stages of product design; Collaboration, creativity, and solution development.',
        subtopics: ['Concept generation and screening', 'Design for Manufacturability (DFM)'],
        referenceBookChapters: 'E. Balaguruswamy Chapter 4',
        suggestedHours: 3
      },
      {
        id: 'dt-u5',
        unit: 5,
        title: 'Customer Centricity, Feedback & User Experience',
        description: 'Customer challenges; Use of design thinking to enhance customer experience; Feedback loops; Ergonomic challenges; User-focused engineering solutions.',
        subtopics: ['Human-centered design metrics', 'Iterative prototyping feedback cycles'],
        referenceBookChapters: 'IDEO Design Thinking Handbook',
        suggestedHours: 3
      }
    ],
    referenceBooks: [
      {
        title: 'Developing Thinking Skills (The Way to Success)',
        authors: 'E Balaguruswamy',
        edition: 'Khanna Book Publishing, 2022',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [],
    videoRecommendations: []
  },
  {
    id: 'math2',
    name: 'Applied Mathematics-II',
    code: '2RABS1',
    semester: 'Semester 2 • First Year B.Tech',
    semesterNumber: 2,
    credits: '4.0 (L: 3, T: 1, P: 0)',
    examTarget: 'MST-1',
    heroImageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
    badgeColor: 'emerald',
    syllabus: [
      {
        id: 'm2-u1',
        unit: 1,
        title: 'Linear Algebra & Matrices',
        description: 'Rank of a Matrix, Echelon and Normal form, System of Linear Equations, Consistency and Solution of AX=B, Eigenvalues and Eigenvectors, Cayley-Hamilton Theorem and its applications.',
        subtopics: [
          'Matrix rank using elementary transformations (Normal form [I_r 0; 0 0])',
          'Consistency of linear system AX = B and Rouche-Capelli theorem',
          'Eigenvalues, eigenvectors and characteristic polynomial |A - λI| = 0',
          'Cayley-Hamilton Theorem statement, verification and inverse calculation',
          'Diagonalization of symmetric matrices'
        ],
        conceptSummary: 'Linear systems and transformations. Finding rank by normal form and Cayley-Hamilton theorem verification are guaranteed 8-10 mark questions in every DAVV exam.',
        keyFormulas: [
          'Rank r = Number of non-zero rows in Echelon Form',
          'Eigenvalue equation: |A - λI| = 0',
          'Cayley-Hamilton: Matrix satisfies its own characteristic equation A^n + c1 A^(n-1) + ... = 0',
          'Trace(A) = Σ λ_i, Det(A) = Π λ_i'
        ],
        mindMap: {
          centralTopic: 'Matrix Algebra',
          branches: [
            {
              title: 'Rank & Systems',
              keyPoints: ['Echelon & Normal form', 'System consistency AX=B', 'Unique vs Infinite vs No solution'],
              icon: 'Grid'
            },
            {
              title: 'Eigenvalues & Vectors',
              keyPoints: ['Characteristic equation', 'Linear independence of eigenvectors', 'Diagonalization condition'],
              icon: 'Activity'
            },
            {
              title: 'Cayley-Hamilton',
              keyPoints: ['Theorem statement and proof', 'Computing matrix inverse A^-1', 'Evaluating higher powers A^4, A^8'],
              icon: 'Sparkles'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 2 & 3; Erwin Kreyszig Chapter 7 & 8',
        suggestedHours: 8
      },
      {
        id: 'm2-u2',
        unit: 2,
        title: 'Ordinary Differential Equations (First & Higher Order)',
        description: 'First Order ODEs: Exact Differential Equations, Equations solvable for x, y and p, Clairaut’s Form; Higher Order ODEs: Linear equations with constant and variable coefficients; Method of Variation of Parameters, Simultaneous Differential Equations.',
        subtopics: [
          'Exact ODE condition: ∂M/∂y = ∂N/∂x and integrating factors',
          'Clairaut’s equation y = p x + f(p) and singular solution',
          'Higher order linear ODEs with constant coefficients: CF + PI formulas for e^ax, sin ax, x^m',
          'Method of Variation of Parameters: Wronskian W(y1, y2) and PI = u y1 + v y2',
          'Cauchy-Euler homogeneous linear equations (substituting x = e^z)'
        ],
        conceptSummary: 'Dynamic mathematical modeling. Method of variation of parameters and Cauchy-Euler equations with CF/PI formulas appear in every paper.',
        keyFormulas: [
          'Exactness test: ∂M/∂y = ∂N/∂x -> Solution: ∫ M dx (y const) + ∫ (terms of N free from x) dy = C',
          'Method of Variation of Parameters: W = y1 y2\' - y2 y1\', u = -∫(y2 R/W) dx, v = ∫(y1 R/W) dx',
          'Cauchy-Euler substitution: x = e^z, x D = θ, x^2 D^2 = θ(θ - 1)'
        ],
        mindMap: {
          centralTopic: 'Differential Equations',
          branches: [
            {
              title: 'First Order ODEs',
              keyPoints: ['Exact differential equations', 'Integrating factors', 'Clairaut form y = px + f(p)'],
              icon: 'Sliders'
            },
            {
              title: 'Higher Order Linear',
              keyPoints: ['Complementary Function (CF)', 'Particular Integral (PI)', 'Right-hand side shortcuts'],
              icon: 'Sigma'
            },
            {
              title: 'Advanced Methods',
              keyPoints: ['Variation of parameters Wronskian', 'Cauchy-Euler x = e^z substitution', 'Simultaneous ODEs'],
              icon: 'Maximize'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 11, 13; Erwin Kreyszig Chapter 2 & 3',
        suggestedHours: 9
      },
      {
        id: 'm2-u3',
        unit: 3,
        title: 'Partial Differential Equations (PDEs)',
        description: 'First order PDEs: Formation of PDEs, Lagrange’s Linear PDE of first order (Pp + Qq = R); Higher Order PDEs: Linear homogeneous PDEs with constant coefficients; Method of Separation of Variables.',
        subtopics: [
          'Formation of PDE by eliminating arbitrary constants and functions',
          'Lagrange’s linear equation Pp + Qq = R and subsidiary equations dx/P = dy/Q = dz/R',
          'Method of multipliers to solve auxiliary equations',
          'Linear homogeneous PDE with constant coefficients (CF and PI)',
          'Method of Separation of Variables for 1D wave and heat equations'
        ],
        conceptSummary: 'Equations governing multi-dimensional physics. Solving Lagrange linear equation Pp + Qq = R with multipliers is a core 8-mark question.',
        keyFormulas: [
          'Lagrange auxiliary equations: dx / P = dy / Q = dz / R',
          'General solution: φ(u, v) = 0 where u=c1, v=c2',
          'Separation of variables: u(x,t) = X(x) * T(t)'
        ],
        mindMap: {
          centralTopic: 'Partial Differential Equations',
          branches: [
            {
              title: 'Formation',
              keyPoints: ['Eliminating arbitrary constants a, b', 'Eliminating arbitrary functions f', 'Order and degree of PDE'],
              icon: 'Split'
            },
            {
              title: 'Lagrange Linear',
              keyPoints: ['Form Pp + Qq = R', 'Method of groupings', 'Method of multipliers (l, m, n)'],
              icon: 'Sliders'
            },
            {
              title: 'Separation of Variables',
              keyPoints: ['1D Heat equation ∂u/∂t = c^2 ∂^2u/∂x^2', '1D Wave equation', 'Boundary condition satisfaction'],
              icon: 'Layers'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 17 & 18; Erwin Kreyszig Chapter 12',
        suggestedHours: 8
      },
      {
        id: 'm2-u4',
        unit: 4,
        title: 'Probability & Statistics',
        description: 'Conditional probability, Bayes’ Theorem; Binomial, Poisson and Normal distributions and their mean and variance; Methods of least squares and curve fitting; Correlation and Regression analysis.',
        subtopics: [
          'Conditional probability P(A|B) and Bayes’ Theorem formulation',
          'Binomial distribution P(r) = nCr p^r q^(n-r), Mean = np, Variance = npq',
          'Poisson distribution P(r) = (e^-λ * λ^r) / r!, Mean = Variance = λ',
          'Normal distribution curve properties and standard normal variate z = (x - μ) / σ',
          'Curve fitting by method of least squares (straight line y = a + bx and parabola y = a + bx + cx^2)',
          'Karl Pearson correlation coefficient r and lines of regression'
        ],
        conceptSummary: 'Engineering risk and stochastic analysis. Fitting a straight line/parabola by normal equations and Bayes theorem are high-yield scoring problems.',
        keyFormulas: [
          'Bayes Theorem: P(Bi|A) = [P(Bi) * P(A|Bi)] / [Σ P(Bj) * P(A|Bj)]',
          'Line Fitting Normal Equations: Σy = n*a + b*Σx, Σxy = a*Σx + b*Σx^2',
          'Regression Lines: (y - y_bar) = b_yx (x - x_bar), where b_yx = r * (σy / σx)'
        ],
        mindMap: {
          centralTopic: 'Probability & Statistics',
          branches: [
            {
              title: 'Bayes Theorem',
              keyPoints: ['Conditional probability P(A|B)', 'Prior vs Posterior probabilities', 'Partition theorem'],
              icon: 'HelpCircle'
            },
            {
              title: 'Distributions',
              keyPoints: ['Binomial distribution (Mean np)', 'Poisson distribution (Mean λ)', 'Normal distribution bell curve (68-95-99.7)'],
              icon: 'BarChart3'
            },
            {
              title: 'Fitting & Regression',
              keyPoints: ['Least squares normal equations', 'Fitting line y = ax + b', 'Correlation coefficient r'],
              icon: 'TrendingUp'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 26; S.C. Gupta & V.K. Kapoor',
        suggestedHours: 9
      },
      {
        id: 'm2-u5',
        unit: 5,
        title: 'Theory of Equations & Fuzzy Sets',
        description: 'Polynomial equations, relation between roots and coefficients, symmetric functions of roots, cube roots of unity, Cardon’s method for solution of cubic equations. Fuzzy sets: membership function, definition, operations on fuzzy sets, properties.',
        subtopics: [
          'Relations between roots and coefficients of polynomial equation of degree n',
          'Cardon’s method for solving cubic equation x^3 + 3Hx + G = 0',
          'Symmetric functions of roots (Σ α^2, Σ α^2 β)',
          'Fuzzy sets definition and membership values μ_A(x) ∈ [0, 1]',
          'Fuzzy operations: Union (max), Intersection (min), Complement (1 - μ_A)'
        ],
        conceptSummary: 'Algebraic equations and modern fuzzy computing. Cardon’s method for solving cubic equations and basic fuzzy operations (Union, Intersection, Complement) are highly scoring.',
        keyFormulas: [
          'Cardon substitution: Remove second term by x = y - (a1 / n a0)',
          'Fuzzy Union: μ_(A ∪ B)(x) = max(μ_A(x), μ_B(x))',
          'Fuzzy Intersection: μ_(A ∩ B)(x) = min(μ_A(x), μ_B(x))',
          'Fuzzy Complement: μ_A\'(x) = 1 - μ_A(x)'
        ],
        mindMap: {
          centralTopic: 'Equations & Fuzzy Sets',
          branches: [
            {
              title: 'Roots & Coefficients',
              keyPoints: ['Sum and product of roots', 'Transformation of equations', 'Reciprocal equations'],
              icon: 'Sigma'
            },
            {
              title: 'Cardon Method',
              keyPoints: ['Diminishing roots to remove 2nd term', 'Cardon formula u^3 + v^3', 'Resolving discriminant'],
              icon: 'Cpu'
            },
            {
              title: 'Fuzzy Sets',
              keyPoints: ['Crisp vs Fuzzy boundaries', 'Membership function μ(x) ∈ [0,1]', 'Max-min operations'],
              icon: 'Layers'
            }
          ]
        },
        referenceBookChapters: 'B.S. Grewal Chapter 1; Timothy J. Ross Fuzzy Logic',
        suggestedHours: 6
      }
    ],
    referenceBooks: [
      {
        title: 'Higher Engineering Mathematics',
        authors: 'B. S. Grewal',
        edition: '39th/44th Edition, Khanna Publishers, 2006',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'Advanced Engineering Mathematics',
        authors: 'Erwin Kreyszig',
        edition: '8th/10th Edition, John Wiley & Sons, 1999',
        role: 'Supplementary Numerical Practice',
        coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [
      {
        topicId: 'm2-u1',
        topicName: 'Matrix Algebra, Rank & Eigenvalues',
        gradingMindset: 'Evaluating Cayley-Hamilton requires finding characteristic polynomial |A - λI| = 0 first. Student MUST show matrix multiplication A^2 and A^3 explicitly and demonstrate that substitution yields the zero matrix O before computing A^-1.',
        mustIncludeElements: [
          'Characteristic equation statement λ^3 - s1 λ^2 + s2 λ - |A| = 0',
          'Explicit multiplication steps for A^2 and A^3',
          'Multiplying Cayley-Hamilton equation by A^-1 to isolate inverse'
        ],
        frequentDeductionTraps: [
          'Calculating determinant |A| incorrectly docks 50% marks throughout',
          'Writing A^-1 without dividing by determinant or constant term'
        ],
        teacherCopyPastePattern: 'B.S. Grewal Chapter 2 Solved Example 2.24.',
        bookSectionToPrioritize: 'B.S. Grewal Chapter 2 (Matrices & Eigenvalues).',
        bookSectionsToSkip: 'Section on infinite matrix series.'
      }
    ],
    videoRecommendations: [
      {
        id: 'vid-m2-1',
        topicId: 'm2-u1',
        topicName: 'Matrix Algebra, Rank & Eigenvalues',
        title: 'Cayley Hamilton Theorem Verification & Finding Inverse Matrix A^-1',
        channel: 'Dr. Gajendra Purohit',
        durationMinutes: 22,
        conceptFocus: 'Step-by-step verification of Cayley Hamilton characteristic equation |A - λI| = 0 and solving inverse matrices.',
        youtubeSearchQuery: 'Gajendra Purohit Cayley Hamilton theorem verification',
        youtubeUrl: 'https://www.youtube.com/watch?v=1wjXVdwzgX8',
        thumbnailUrl: 'https://img.youtube.com/vi/1wjXVdwzgX8/mqdefault.jpg',
        youtubeVideoId: '1wjXVdwzgX8',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '02:00', topic: 'Cayley-Hamilton Theorem Statement' },
          { time: '08:45', topic: 'Finding Characteristic Equation' },
          { time: '16:30', topic: 'Deriving Matrix Inverse A^-1' }
        ]
      },
      {
        id: 'vid-m2-2',
        topicId: 'm2-u1',
        topicName: 'Matrix Algebra, Rank & Eigenvalues',
        title: 'Eigenvalues and Eigenvectors of 3x3 Matrix with Solved University Questions',
        channel: 'Dr. Gajendra Purohit',
        durationMinutes: 25,
        conceptFocus: 'Calculating characteristic roots λ and non-trivial eigenvector solutions (A - λI)X = 0.',
        youtubeSearchQuery: 'Gajendra Purohit Eigenvalues and Eigenvectors Cayley Hamilton',
        youtubeUrl: 'https://www.youtube.com/watch?v=cHLN0Pqt_7U',
        thumbnailUrl: 'https://img.youtube.com/vi/cHLN0Pqt_7U/mqdefault.jpg',
        youtubeVideoId: 'cHLN0Pqt_7U',
        level: 'High Yield',
        keyTimestamps: [
          { time: '01:50', topic: 'Eigenvalues Definition' },
          { time: '12:10', topic: 'Step-by-step Eigenvectors Calculation' }
        ]
      }
    ]
  },
  {
    id: 'course-sem2-physics',
    name: 'Applied Physics',
    code: '2RABS2',
    semester: 'Semester-I/II (Common to all branches)',
    semesterNumber: 2,
    credits: '3+1(P) (L:2, T:1, P:2)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#06b6d4',
    syllabus: [
      {
        id: 'ph-u1',
        unit: 1,
        title: 'Optics-I: Interference & Diffraction',
        description: 'Interference of light waves: Thin film, Newton’s Ring experiment, Michelson interferometer; Diffraction: Fresnel’s & Fraunhofer diffraction, Zone plate, Single slit, Double slit, Plane transmission grating.',
        subtopics: [
          'Interference in thin film due to reflected light (path difference Δ = 2μt cos r ± λ/2)',
          'Newton’s Ring experiment: derivation of dark and bright ring diameters (D_n^2 ∝ n)',
          'Fraunhofer diffraction at single slit with intensity distribution graph',
          'Plane transmission grating: grating equation (a + b) sin θ = n λ and dispersive power',
          'Rayleigh criterion for resolving power of grating'
        ],
        conceptSummary: 'Wave nature of light. The Newton’s ring diameter derivation (D_n = √[4 n R λ / μ]) and plane grating derivation are guaranteed 8-mark questions.',
        keyFormulas: [
          'Thin Film condition: 2 μ t cos r = (2n - 1) λ/2 (Dark in reflected light)',
          'Newton\'s Ring Diameter: D_n^2 = 4 n R λ (for dark rings)',
          'Grating Equation: (a + b) sin θ = n λ'
        ],
        mindMap: {
          centralTopic: 'Interference & Diffraction',
          branches: [
            {
              title: 'Newton\'s Rings',
              keyPoints: ['Air film of varying thickness', 'Reflected light Stokes treatment', 'Diameter derivation Dn^2 = 4 n R λ'],
              icon: 'CircleDot'
            },
            {
              title: 'Diffraction',
              keyPoints: ['Fresnel (near) vs Fraunhofer (far)', 'Single slit central maxima', 'Zone plate action'],
              icon: 'Split'
            },
            {
              title: 'Grating',
              keyPoints: ['Grating element (a + b)', 'Principal maxima conditions', 'Resolving power λ / dλ = n N'],
              icon: 'Grid'
            }
          ]
        },
        referenceBookChapters: 'Gaur & Gupta Chapter 14 & 15; Malik & Singh Chapter 1 & 2',
        suggestedHours: 8
      },
      {
        id: 'ph-u2',
        unit: 2,
        title: 'Optics-II: Polarization, LASER & Optical Fibers',
        description: 'Polarization: Double refraction, Nicol Prism, Half wave and Quarter wave plates, Polarimeter; LASER: Stimulated emission, Population inversion, Einstein’s coefficients, He-Ne laser; Optical Fiber: Types, Acceptance angle, Numerical aperture.',
        subtopics: [
          'Double refraction in calcite: O-ray and E-ray properties and Nicol prism',
          'Quarter wave plate (thickness t = λ / 4(μo - μe)) and Half wave plate',
          'Einstein’s A and B coefficients derivation and population inversion',
          'He-Ne laser construction, energy level diagram (20.66 eV), and working',
          'Optical fiber: Acceptance angle θ_a = sin^-1(NA) and Numerical Aperture NA = √(n1^2 - n2^2)'
        ],
        conceptSummary: 'Modern quantum optics. He-Ne laser 4-level transition diagram and Optical fiber numerical aperture derivation are tested in every semester.',
        keyFormulas: [
          'Numerical Aperture: NA = √(n1^2 - n2^2)',
          'Acceptance Angle: θ_max = sin^-1(√(n1^2 - n2^2) / n0)',
          'Quarter wave plate thickness: t = λ / [4 (μ_o - μ_e)]'
        ],
        mindMap: {
          centralTopic: 'LASER & Photonics',
          branches: [
            {
              title: 'Polarization',
              keyPoints: ['Nicol prism double refraction', 'Quarter & Half wave plates', 'Specific rotation by polarimeter'],
              icon: 'Maximize'
            },
            {
              title: 'LASER Systems',
              keyPoints: ['Stimulated vs Spontaneous emission', 'Population inversion condition', 'He-Ne 632.8 nm transition'],
              icon: 'Zap'
            },
            {
              title: 'Optical Fibers',
              keyPoints: ['Total Internal Reflection', 'Numerical Aperture (NA)', 'Step index vs Graded index fibers'],
              icon: 'Radio'
            }
          ]
        },
        referenceBookChapters: 'Gaur & Gupta Chapter 16, 22, 23; Malik & Singh Chapter 3 & 4',
        suggestedHours: 8
      },
      {
        id: 'ph-u3',
        unit: 3,
        title: 'Crystal Structure & Semiconductors',
        description: 'Symmetry & properties of simple crystal structures; Miller Indices; Interplanar spacing; Production and properties of X-rays; Bragg’s law; Band theory of semiconductors; Fermi level; pn junction, LED, Zener diode, Transistors.',
        subtopics: [
          'Unit cell parameters (SC, BCC, FCC) and atomic packing factor (APF)',
          'Miller indices procedure (h k l) and interplanar distance d = a / √(h^2 + k^2 + l^2)',
          'Bragg’s law of X-ray diffraction: 2 d sin θ = n λ',
          'Kronig-Penney model band theory: valence band, conduction band, forbidden gap',
          'Fermi-Dirac distribution function and Fermi level shift with temperature/doping'
        ],
        conceptSummary: 'Solid state physics. Calculating Miller indices, interplanar distance d_hkl, and verifying Bragg\'s law 2d sin θ = n λ.',
        keyFormulas: [
          'Bragg\'s Law: 2 d sin θ = n λ',
          'Interplanar spacing: d_hkl = a / √(h^2 + k^2 + l^2)',
          'Fermi Function: f(E) = 1 / [1 + exp((E - E_F) / k T)]'
        ],
        mindMap: {
          centralTopic: 'Crystallography & Solids',
          branches: [
            {
              title: 'Crystal Lattices',
              keyPoints: ['SC, BCC, FCC packing factor', 'Miller indices coordinates', 'Interplanar spacing d_hkl'],
              icon: 'Box'
            },
            {
              title: 'X-Ray Diffraction',
              keyPoints: ['Bragg law derivation 2d sin θ = nλ', 'X-ray generation continuous & characteristic', 'Powder crystal method'],
              icon: 'Crosshair'
            },
            {
              title: 'Semiconductor Bands',
              keyPoints: ['Band theory valence & conduction', 'Fermi level in intrinsic vs extrinsic', 'Direct vs Indirect bandgap'],
              icon: 'Layers'
            }
          ]
        },
        referenceBookChapters: 'Gaur & Gupta Chapter 2, 3; S.O. Pillai Solid State Physics',
        suggestedHours: 8
      },
      {
        id: 'ph-u4',
        unit: 4,
        title: 'Electromagnetism & Maxwell’s Equations',
        description: 'Continuity equation for charge & current; Inconsistency of Ampere’s law for time varying fields; Concept of Displacement current; Maxwell’s equations; Wave equations for E & H; Propagation of EM waves in dielectric; Poynting Vector.',
        subtopics: [
          'Equation of continuity: ∇·J = -∂ρ/∂t',
          'Inconsistency of Ampere’s law and Maxwell’s displacement current J_d = ∂D/∂t',
          'Four Maxwell’s equations in differential and integral forms',
          'Electromagnetic wave equation in dielectric medium and velocity c = 1/√(μ0 ε0)',
          'Poynting vector S = E × H and energy density in electromagnetic fields'
        ],
        conceptSummary: 'Field electromagnetism. The derivation of displacement current and writing down all 4 Maxwell equations with physical interpretations is a guaranteed question.',
        keyFormulas: [
          'Displacement Current: J_d = ε0 (∂E / ∂t)',
          'Maxwell 1: ∇·D = ρ, Maxwell 2: ∇·B = 0',
          'Maxwell 3: ∇×E = -∂B/∂t, Maxwell 4: ∇×H = J + ∂D/∂t',
          'Poynting Vector: S = E × H (Watts/m^2)'
        ],
        mindMap: {
          centralTopic: 'Electromagnetism',
          branches: [
            {
              title: 'Displacement Current',
              keyPoints: ['Capacitor charging inconsistency', 'Modified Ampere-Maxwell law', 'J_d = ∂D/∂t equation'],
              icon: 'Zap'
            },
            {
              title: 'Maxwell\'s 4 Equations',
              keyPoints: ['Differential and integral forms', 'Physical interpretation of each law', 'Wave equation derivation in vacuum'],
              icon: 'Sigma'
            },
            {
              title: 'EM Wave Energy',
              keyPoints: ['Velocity c = 1/√(μ0 ε0)', 'Transverse nature of EM waves', 'Poynting vector S = E × H'],
              icon: 'Radio'
            }
          ]
        },
        referenceBookChapters: 'Gaur & Gupta Chapter 20; Halliday & Resnick Vol-II',
        suggestedHours: 9
      },
      {
        id: 'ph-u5',
        unit: 5,
        title: 'Quantum Physics & Wave Mechanics',
        description: 'Planck’s law; Compton effect; De Broglie concept of matter waves; Davisson & Germer experiment; Phase velocity & Group velocity; Heisenberg’s Uncertainty Principle; Schrödinger’s Wave Equations (Time dependent & independent); Particle in a 1D box.',
        subtopics: [
          'Compton scattering wavelength shift derivation: Δλ = (h / m0 c) (1 - cos θ)',
          'De Broglie wavelength λ = h / p and Davisson-Germer electron diffraction',
          'Phase velocity v_p = ω/k vs Group velocity v_g = dω/dk and proof v_g = v_particle',
          'Heisenberg Uncertainty Principle: Δx * Δp ≥ ħ/2',
          'Schrödinger’s time-independent wave equation derivation',
          'Application to Particle in a 1D infinite potential box: quantized energy En = n^2 h^2 / (8 m L^2)'
        ],
        conceptSummary: 'Quantum mechanics foundation. The particle in a 1D box energy eigenvalue derivation and Compton scattering formula are top-scoring questions.',
        keyFormulas: [
          'Compton Shift: Δλ = λ\' - λ = [h / (m_0 c)] (1 - cos θ)',
          'De Broglie: λ = h / p = h / √(2 m E)',
          'Time-Independent Schrödinger: d^2ψ/dx^2 + [2m/ħ^2](E - V)ψ = 0',
          'Particle in a Box: E_n = (n^2 h^2) / (8 m L^2), ψ_n(x) = √(2/L) sin(n π x / L)'
        ],
        mindMap: {
          centralTopic: 'Quantum Mechanics',
          branches: [
            {
              title: 'Matter Waves',
              keyPoints: ['De Broglie hypothesis', 'Davisson-Germer experiment', 'Phase vs Group velocity'],
              icon: 'Activity'
            },
            {
              title: 'Compton Effect',
              keyPoints: ['Particle nature of X-ray photons', 'Compton wavelength 0.0242 Å', 'Angular shift derivation'],
              icon: 'Crosshair'
            },
            {
              title: 'Schrödinger Equation',
              keyPoints: ['Wave function physical interpretation |ψ|^2', 'Time independent derivation', 'Particle in 1D box energy levels En'],
              icon: 'Box'
            }
          ]
        },
        referenceBookChapters: 'Gaur & Gupta Chapter 18, 19; Malik & Singh Chapter 7',
        suggestedHours: 9
      }
    ],
    referenceBooks: [
      {
        title: 'Engineering Physics',
        authors: 'R K Gaur & S L Gupta',
        edition: 'Dhanpat Rai & Sons, 2006',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'Engineering Physics',
        authors: 'H.K. Malik & A.K. Singh',
        edition: 'Tata McGraw Hill, 2011',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [
      {
        topicId: 'ph-u5',
        topicName: 'Quantum Physics & Wave Mechanics',
        gradingMindset: 'Evaluators evaluate 4 distinct checkpoints: [1] Setting up boundary conditions ψ(0)=0 and ψ(L)=0, [2] Finding general solution ψ = A sin kx + B cos kx, [3] Evaluating normalization integral ∫ |ψ|^2 dx = 1 to find A = √(2/L), and [4] Writing En = n^2 h^2 / (8mL^2).',
        mustIncludeElements: [
          'Boundary condition setup',
          'Normalization condition integral',
          'Sketching wave functions ψ1, ψ2, ψ3 and probability densities |ψ|^2'
        ],
        frequentDeductionTraps: [
          'Confusing Planck constant h with reduced Planck constant ħ = h / 2π in energy equation',
          'Forgetting that ground state is n = 1, not n = 0'
        ],
        teacherCopyPastePattern: 'Gaur & Gupta Chapter 19 Section 19.8 Solved Problem 19.3.',
        bookSectionToPrioritize: 'Gaur & Gupta Chapter 18 & 19 (Quantum Mechanics).',
        bookSectionsToSkip: 'Section on relativistic Dirac equation.'
      }
    ],
    videoRecommendations: [
      {
        id: 'vid-ph-1',
        topicId: 'ph-u1',
        topicName: 'Wave Optics: Interference & Diffraction',
        title: 'Interference in Thin Films Complete Derivation & Conditions for Maxima / Minima',
        channel: 'Engineering Physics Lessons',
        durationMinutes: 20,
        conceptFocus: 'Path difference Δ = 2μt cos r ± λ/2 with Stokes treatment for reflection from denser medium.',
        youtubeSearchQuery: 'Engineering Physics Thin Film Interference Michelson',
        youtubeUrl: 'https://www.youtube.com/watch?v=iG18FO71R3w',
        thumbnailUrl: 'https://img.youtube.com/vi/iG18FO71R3w/mqdefault.jpg',
        youtubeVideoId: 'iG18FO71R3w',
        level: 'High Yield',
        keyTimestamps: [
          { time: '02:10', topic: 'Thin Film Path Difference Formula' },
          { time: '11:30', topic: 'Constructive vs Destructive Interference' }
        ]
      },
      {
        id: 'vid-ph-2',
        topicId: 'ph-u2',
        topicName: 'Lasers & Optical Fibers',
        title: 'He-Ne Laser Working Principle, Energy Level Diagram & Construction',
        channel: 'Engineering Physics',
        durationMinutes: 18,
        conceptFocus: 'Population inversion, resonant cavity, spontaneous and stimulated emission in Helium-Neon gas laser.',
        youtubeSearchQuery: 'Engineering Physics He-Ne Laser optical fiber principles',
        youtubeUrl: 'https://www.youtube.com/watch?v=f4wUR_VranE',
        thumbnailUrl: 'https://img.youtube.com/vi/f4wUR_VranE/mqdefault.jpg',
        youtubeVideoId: 'f4wUR_VranE',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '01:50', topic: 'Population Inversion & Pumping' },
          { time: '09:20', topic: 'He-Ne Energy Level Transitions 632.8 nm' }
        ]
      }
    ]
  },
  {
    id: 'course-sem2-cpp',
    name: 'Computer Programming in C++',
    code: '2RCES3',
    semester: 'Semester-I/II (Common to all branches)',
    semesterNumber: 2,
    credits: '3+1(P) (L:2, T:1, P:2)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#10b981',
    syllabus: [
      {
        id: 'cp-u1',
        unit: 1,
        title: 'Flowcharts, Data Types & Control Structures',
        description: 'Introduction to flowcharts and problem solving. Types of programming languages; C++ Data Types; Variables, Constants, Operators, Expressions, Type casting; Control structures (loops, conditionals); Header files, Random numbers.',
        subtopics: [
          'Flowchart symbols and algorithm complexity',
          'Operators: Arithmetic, Relational, Logical, Bitwise, Ternary, Scope resolution (::)',
          'Implicit vs Explicit Type Casting (static_cast)',
          'Loops: while, do-while, for loops, break, continue, switch-case',
          'Header files and random number generation rand()'
        ],
        conceptSummary: 'Syntax fundamentals and algorithm flow. Scope resolution operator and nested control structures are common short questions.',
        keyFormulas: ['Scope resolution: ::global_var', 'static_cast<int>(float_val)'],
        referenceBookChapters: 'E Balagurusamy Chapter 2 & 3',
        suggestedHours: 6
      },
      {
        id: 'cp-u2',
        unit: 2,
        title: 'Functions, Arrays, Strings & Structures',
        description: 'Functions: Call by Value and Call by Reference, return values, recursion; Arrays: 1D and 2D arrays, passing arrays to functions; Strings and Standard Library String functions; Structures: Nested structures, Array of structures, passing structures.',
        subtopics: [
          'Call by value vs Call by reference (using references & and pointers *)',
          'Recursion stack frames (Factorial, Fibonacci series)',
          '2D Arrays (Matrix addition and multiplication programs)',
          'Standard library string functions (strlen, strcpy, strcmp, strcat)',
          'Structures memory layout and passing by reference'
        ],
        conceptSummary: 'Modular programming. Call by reference and matrix manipulation code are tested frequently.',
        referenceBookChapters: 'E Balagurusamy Chapter 4 & 5',
        suggestedHours: 7
      },
      {
        id: 'cp-u3',
        unit: 3,
        title: 'Pointers, Dynamic Memory & File Handling',
        description: 'Pointers: Declaration and initialization, Dynamic Memory allocation (new and delete); Array of pointers, Function returning pointer, Reference variables; Files: File structures, File handling functions (ifstream, ofstream), File types, Error handling.',
        subtopics: [
          'Pointer arithmetic and relation to arrays (*(arr + i) == arr[i])',
          'Dynamic memory allocation using new and delete / delete[] operators',
          'File streams: ifstream (read), ofstream (write), fstream',
          'File pointers: seekg(), seekp(), tellg(), tellp() with file modes (ios::in, ios::out, ios::app)'
        ],
        conceptSummary: 'Direct memory access and persistent storage. Dynamic memory allocation for arrays and file stream copying are tested in practical and theory papers.',
        keyFormulas: [
          'int *arr = new int[size]; delete[] arr;',
          'file.seekg(offset, ios::beg);'
        ],
        referenceBookChapters: 'E Balagurusamy Chapter 9 & 11',
        suggestedHours: 8
      },
      {
        id: 'cp-u4',
        unit: 4,
        title: 'OOP Paradigm, Classes & Constructors',
        description: 'Basic Concepts of OOP; Benefits of OOP; Class and object fundamentals, Visibility modes; Constructor types (Default, Parameterized, Overloaded, Copy constructor); Destructors; Function Overloading; Friend functions and Friend classes.',
        subtopics: [
          'Encapsulation, Data Hiding, Abstraction, and Polymorphism',
          'Private, Protected, and Public access specifiers',
          'Copy Constructor syntax: ClassName(const ClassName &obj) and Deep vs Shallow copy',
          'Destructors execution order (LIFO reverse of constructor call)',
          'Friend function declaration with friend keyword and accessing private members'
        ],
        conceptSummary: 'Core object-oriented design. Copy constructor deep vs shallow copy and friend functions are guaranteed 8-10 mark questions.',
        keyFormulas: [
          'Copy Constructor: Sample(const Sample &s) { data = new int(*s.data); }',
          'friend void showData(Sample s);'
        ],
        referenceBookChapters: 'E Balagurusamy Chapter 5 & 6',
        suggestedHours: 9
      },
      {
        id: 'cp-u5',
        unit: 5,
        title: 'Operator Overloading, Inheritance & Templates',
        description: 'Operator Overloading (unary and binary); Inheritance types (Single, Multiple, Multilevel, Hierarchical, Hybrid); Virtual Functions, Pure Virtual Functions and Abstract Classes; Class & Function Templates; Exception Handling.',
        subtopics: [
          'Operator overloading member function vs friend function (e.g. Complex operator+(Complex c))',
          'Ambiguity in Multiple Inheritance and Virtual Base Class solution (Diamond problem)',
          'Runtime Polymorphism using Virtual Functions and Pure Virtual function (= 0)',
          'Function Templates and Class Templates: template <typename T>',
          'Exception Handling mechanism: try, throw, catch blocks'
        ],
        conceptSummary: 'Advanced C++ features. Virtual functions for runtime polymorphism and resolving the diamond problem with virtual base classes are essential.',
        keyFormulas: [
          'Pure Virtual: virtual void display() = 0;',
          'Template: template <typename T> T add(T a, T b) { return a + b; }'
        ],
        referenceBookChapters: 'E Balagurusamy Chapter 7, 8, 9, 12, 13',
        suggestedHours: 10
      }
    ],
    referenceBooks: [
      {
        title: 'Object Oriented Programming with C++',
        authors: 'E Balagurusamy',
        edition: 'McGraw Hill Education, 6th/8th Edition',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'C++: The Complete Reference',
        authors: 'Herbert Schildt',
        edition: 'Tata McGraw Hill, 4th Edition',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [],
    videoRecommendations: [
      {
        id: 'vid-cp-1',
        topicId: 'cp-u1',
        topicName: 'Basics of C++, Control Structures & Functions',
        title: 'Binary Search Algorithm & Implementation with Time Complexity Analysis',
        channel: 'Gate Smashers',
        durationMinutes: 20,
        conceptFocus: 'Divide and conquer approach for sorted arrays, iterative and recursive implementation in C++.',
        youtubeSearchQuery: 'Gate Smashers Binary Search in Data Structure',
        youtubeUrl: 'https://www.youtube.com/results?search_query=Gate+Smashers+Binary+Search+in+Data+Structure',
        thumbnailUrl: 'https://img.youtube.com/vi/V_T5NuccwMR/mqdefault.jpg',
        youtubeVideoId: 'V_T5NuccwMR',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '01:30', topic: 'Binary Search Logic & Prerequisites' },
          { time: '08:40', topic: 'Mid calculation & Pointer Update' },
          { time: '14:20', topic: 'Worst Case O(log n) Complexity Proof' }
        ]
      },
      {
        id: 'vid-cp-2',
        topicId: 'cp-u4',
        topicName: 'OOP Paradigm, Classes & Constructors',
        title: 'Stack Data Structure: Push, Pop & Infix to Postfix Conversion',
        channel: 'Gate Smashers',
        durationMinutes: 22,
        conceptFocus: 'LIFO principle, stack implementation using arrays/classes, and parenthesis matching algorithm.',
        youtubeSearchQuery: 'Gate Smashers Stack and Queue data structures',
        youtubeUrl: 'https://www.youtube.com/watch?v=qNGyI95E5AE',
        thumbnailUrl: 'https://img.youtube.com/vi/qNGyI95E5AE/mqdefault.jpg',
        youtubeVideoId: 'qNGyI95E5AE',
        level: 'High Yield',
        keyTimestamps: [
          { time: '02:00', topic: 'Stack Operations (Push/Pop/Peek)' },
          { time: '11:15', topic: 'Infix to Postfix Algorithm' }
        ]
      }
    ]
  },
  {
    id: 'course-sem2-electrical',
    name: 'Basic Electrical Engineering',
    code: '2REES4',
    semester: 'Semester-II (Common to all branches)',
    semesterNumber: 2,
    credits: '3+1(P) (L:2, T:1, P:2)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#f59e0b',
    syllabus: [
      {
        id: 'ee-u1',
        unit: 1,
        title: 'AC Circuits & Resonance',
        description: 'Generation of EMF, Phasor Quantities, RMS, Average, Form Factor, Peak Factor, Phasor Diagrams; Single Phase AC Circuits: R, L, C and combinations, Resonance, Q-Factor, Bandwidth; Three Phase AC Circuits: Generation, Star and Delta Connections, Power Measurement.',
        subtopics: [
          'Derivation of RMS (Vm/√2) and Average (2Vm/π) for sine wave',
          'Series R-L-C circuit impedance Z = √(R^2 + (XL - XC)^2) and resonance condition fr = 1/(2π√LC)',
          'Quality factor Q = ω0 L / R and half-power bandwidth',
          '3-Phase Star: V_L = √3 V_ph, I_L = I_ph; Delta: V_L = V_ph, I_L = √3 I_ph',
          'Two-Wattmeter method: Total power P = W1 + W2, tan φ = √3 (W1 - W2) / (W1 + W2)'
        ],
        conceptSummary: 'Alternating current and 3-phase power. RLC resonance derivation and Two-Wattmeter power measurement formula are heavily tested.',
        keyFormulas: [
          'Resonance Frequency: f_r = 1 / [2 π √(L C)]',
          'Form Factor = RMS / Average = 1.11 (sine wave)',
          'Two-Wattmeter: tan φ = √3 (W1 - W2) / (W1 + W2), Power Factor = cos φ'
        ],
        referenceBookChapters: 'D P Kothari & I J Nagrath Chapter 2 & 3',
        suggestedHours: 9
      },
      {
        id: 'ee-u2',
        unit: 2,
        title: 'Circuit Analysis Tools & Network Theorems',
        description: 'Kirchhoff’s laws (KVL and KCL), Mesh and Nodal Analysis; Network Theorems: Thevenin’s theorem, Norton’s theorem, Maximum power transfer theorem, Superposition theorem, and Source transformation.',
        subtopics: [
          'KVL loop and KCL nodal matrix formulations',
          'Thevenin’s theorem: Finding open-circuit voltage V_th and equivalent resistance R_th',
          'Norton’s theorem: Short-circuit current I_n and dual representation',
          'Maximum Power Transfer Theorem proof: R_L = R_th, Max power P_max = V_th^2 / (4 R_th)',
          'Superposition theorem with independent sources'
        ],
        conceptSummary: 'Linear circuit reduction techniques. Thevenin theorem step-by-step numerical solving is tested in every exam.',
        keyFormulas: [
          'Thevenin Load Current: I_L = V_th / (R_th + R_L)',
          'Max Power: P_max = V_th^2 / (4 R_th)'
        ],
        referenceBookChapters: 'D P Kothari Chapter 1; A Sudhakar Chapter 3 & 4',
        suggestedHours: 10
      },
      {
        id: 'ee-u3',
        unit: 3,
        title: 'Magnetic Circuits & Transformers',
        description: 'Basic concept of magnetic circuits, Series magnetic circuits, BH Curve; Transformer: Single phase transformers: Construction, principle, EMF equations, Analysis on no load and load, Losses, Voltage regulation and efficiency, Auto transformer.',
        subtopics: [
          'Magnetic flux, MMF, and Reluctance S = l / (μ0 μr A)',
          'Single phase transformer EMF equation: E = 4.44 f N Φ_m',
          'Equivalent circuit referred to primary and secondary windings',
          'Core losses (Hysteresis & Eddy current) and Copper losses (I^2 R)',
          'Condition for maximum efficiency: Iron Losses = Copper Losses'
        ],
        conceptSummary: 'Electromagnetic energy transfer. The transformer EMF equation derivation and efficiency calculation numericals carry 10 marks.',
        keyFormulas: [
          'Transformer EMF: E1 = 4.44 f N1 Φ_m',
          'Efficiency η = [V2 I2 cos φ] / [V2 I2 cos φ + P_i + I2^2 R_eq] * 100%'
        ],
        referenceBookChapters: 'P S Bimbhara Chapter 1 & 2',
        suggestedHours: 9
      },
      {
        id: 'ee-u4',
        unit: 4,
        title: 'DC Generators & DC Motors',
        description: 'DC Generators: Construction, working principles, EMF equations, Armature reaction, DC Generator Characteristics; DC Motors: Construction, working principles, classification, Speed Control, Characteristics, Losses in DC Machines.',
        subtopics: [
          'DC Generator EMF equation: Eg = (Φ * Z * N * P) / (60 * A)',
          'Lap winding (A = P) vs Wave winding (A = 2)',
          'DC Motor back-EMF Eb = V - Ia Ra and Torque T ∝ Φ Ia',
          'Speed control of DC shunt motor: Armature resistance and Field flux control methods'
        ],
        conceptSummary: 'Rotational electromechanical machines. Speed control methods of DC shunt motors and torque equation derivations are crucial.',
        keyFormulas: ['EMF: E = (Φ Z N P) / (60 A)', 'Torque: T = (P Z / 2π A) * Φ I_a'],
        referenceBookChapters: 'P S Bimbhara Chapter 4 & 5',
        suggestedHours: 8
      },
      {
        id: 'ee-u5',
        unit: 5,
        title: 'AC Machines (Induction & Synchronous Motors)',
        description: 'General aspects of AC motors, Three Phase induction motor: working principle, rotating magnetic field (RMF), slip, construction; Single phase induction motor: starting methods; Three phase synchronous motor.',
        subtopics: [
          'Production of rotating magnetic field (RMF) of constant magnitude 1.5 Φ_m',
          'Slip equation s = (Ns - N) / Ns and rotor frequency fr = s * f',
          'Torque-slip characteristics of 3-phase induction motor',
          'Double revolving field theory for 1-phase induction motor self-starting inability'
        ],
        conceptSummary: 'AC motor industrial drives. The torque-slip curve and RMF generation proof are tested repeatedly.',
        keyFormulas: ['Synchronous Speed: N_s = 120 f / P', 'Slip: s = (N_s - N) / N_s'],
        referenceBookChapters: 'P S Bimbhara Chapter 7 & 8',
        suggestedHours: 8
      }
    ],
    referenceBooks: [
      {
        title: 'Basic Electrical Engineering',
        authors: 'D. P. Kothari & I. J. Nagrath',
        edition: 'Tata McGraw Hill, 2nd Edition (Fifth Reprint 2003)',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'
      },
      {
        title: 'Electrical Machinery',
        authors: 'P. S. Bimbhara',
        edition: 'Khanna Publishers, New Delhi, 7th Edition, 2006',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [],
    videoRecommendations: [
      {
        id: 'vid-ee-1',
        topicId: 'ee-u2',
        topicName: 'Circuit Analysis Tools & Network Theorems',
        title: 'Thevenin’s Theorem Solved Numericals & Norton Equivalent',
        channel: 'Neso Academy',
        durationMinutes: 23,
        conceptFocus: 'Step-by-step calculation of open circuit voltage Vth and looking-back resistance Rth.',
        youtubeSearchQuery: 'Neso Academy Thevenins Theorem basic electrical',
        youtubeUrl: 'https://www.youtube.com/watch?v=veAFVTIpKyM',
        thumbnailUrl: 'https://img.youtube.com/vi/veAFVTIpKyM/mqdefault.jpg',
        youtubeVideoId: 'veAFVTIpKyM',
        level: 'Exam-Cram',
        keyTimestamps: [
          { time: '02:10', topic: 'Thevenin Theorem Statement' },
          { time: '08:50', topic: 'Step-by-Step Procedure' },
          { time: '17:30', topic: 'Load Current IL Calculation' }
        ]
      },
      {
        id: 'vid-ee-2',
        topicId: 'ee-u1',
        topicName: 'AC Circuits & Resonance',
        title: 'RLC Series AC Circuit Analysis: Impedance Triangle, Phasor Diagram & Resonance',
        channel: 'Neso Academy',
        durationMinutes: 24,
        conceptFocus: 'Resonance condition XL = XC, minimum impedance Z = R, and quality factor Q derivation.',
        youtubeSearchQuery: 'Neso Academy RLC series circuit AC analysis',
        youtubeUrl: 'https://www.youtube.com/watch?v=5jI35F6kLa8',
        thumbnailUrl: 'https://img.youtube.com/vi/5jI35F6kLa8/mqdefault.jpg',
        youtubeVideoId: '5jI35F6kLa8',
        level: 'High Yield',
        keyTimestamps: [
          { time: '02:00', topic: 'RLC Phasor Diagram' },
          { time: '11:20', topic: 'Impedance and Power Factor' },
          { time: '18:40', topic: 'Resonance Frequency fr Derivation' }
        ]
      }
    ]
  },
  {
    id: 'course-sem2-graphics',
    name: 'Engineering Graphics and Design',
    code: '2RMES5',
    semester: 'Semester-II (Common to all branches)',
    semesterNumber: 2,
    credits: '2+2(P) (L:2, T:0, P:4)',
    examTarget: 'End-Sem',
    heroImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1400&auto=format&fit=crop&q=80',
    badgeColor: '#eab308',
    syllabus: [
      {
        id: 'eg-u1',
        unit: 1,
        title: 'Principles of Drawing, Scales & Engineering Curves',
        description: 'Drawing Instruments and uses, BIS standards (SP46), Lettering, Dimensioning, Engineering Scales (Plain, Diagonal), Engineering Curves (Conics, Involute, Cycloid, Spiral).',
        subtopics: [
          'Representative Fraction (RF) and Diagonal Scale construction',
          'Conic sections: Ellipse (Eccentricity, Concentric circle method), Parabola, Hyperbola',
          'Special curves: Cycloid, Epicycloid, Hypocycloid, Involute of circle and polygon'
        ],
        conceptSummary: 'Engineering drawing standards. Diagonal scales and cycloidal curves are standard drawing sheet questions.',
        keyFormulas: ['RF = Length of drawing / Actual length of object', 'Maximum Length = RF * Actual length to be measured'],
        referenceBookChapters: 'N.D. Bhatt Chapter 2, 4, 6',
        suggestedHours: 8
      },
      {
        id: 'eg-u2',
        unit: 2,
        title: 'Orthographic Projections: Points & Straight Lines',
        description: 'Principles of Orthographic Projections; First angle vs Third angle projection; Projection of Points in all four quadrants; Projection of Straight Lines inclined to one or both planes, True Length and Traces.',
        subtopics: [
          'First angle projection convention (object between observer and plane)',
          'Projection of straight lines inclined to both HP and VP: finding true length and true angles θ and φ',
          'Horizontal Trace (HT) and Vertical Trace (VT) of straight line'
        ],
        conceptSummary: 'Foundational spatial visualization. Projecting lines inclined to both reference planes is a compulsory 10-mark problem.',
        referenceBookChapters: 'N.D. Bhatt Chapter 9 & 10',
        suggestedHours: 10
      },
      {
        id: 'eg-u3',
        unit: 3,
        title: 'Projection of Planes, Solids & Sections',
        description: 'Projection of Plane Surfaces; Projection of Solids (Prism, Pyramid, Cylinder, Cone) inclined to one or both planes; Section of Solids and Development of Surfaces.',
        subtopics: [
          'Solids with axis inclined to HP and parallel to VP (and vice versa)',
          'Section planes perpendicular to VP and inclined to HP',
          'Development of lateral surfaces of prism, cylinder, and truncated cone'
        ],
        conceptSummary: '3D geometrical solids slicing and surface unrolling for sheet metal fabrication.',
        referenceBookChapters: 'N.D. Bhatt Chapter 11, 13, 14',
        suggestedHours: 10
      },
      {
        id: 'eg-u4',
        unit: 4,
        title: 'Interpenetration of Solids & Intersection of Surfaces',
        description: 'Interpenetration of Solids / Intersection of Surfaces; Oblique projection: principle and projection of various objects.',
        subtopics: [
          'Intersection of cylinder with cylinder',
          'Intersection of square prism with square prism',
          'Line of intersection curve construction'
        ],
        conceptSummary: 'Piping and ducting intersections in structural and mechanical engineering.',
        referenceBookChapters: 'N.D. Bhatt Chapter 16',
        suggestedHours: 8
      },
      {
        id: 'eg-u5',
        unit: 5,
        title: 'Isometric Projections & Computer Aided Design (CAD)',
        description: 'Principles of isometric projections and conversion of pictorial views into isometric projections/views and vice versa. Introduction to CAD software (AutoCAD, Fusion 360, SolidWorks).',
        subtopics: [
          'Isometric scale construction: Isometric length = 0.816 * True length',
          'Converting orthographic multi-views into 3D isometric view',
          'Basic 2D and 3D CAD commands (Line, Circle, Extrude, Revolve)'
        ],
        conceptSummary: '3D isometric drawing visualization and digital CAD modeling.',
        keyFormulas: ['Isometric length = √(2/3) * True length ≈ 0.816 * True length'],
        referenceBookChapters: 'N.D. Bhatt Chapter 17 & CAD section',
        suggestedHours: 8
      }
    ],
    referenceBooks: [
      {
        title: 'Engineering Drawing',
        authors: 'N.D. Bhatt & V.M. Panchal',
        edition: '48th Edition, Charotar Publishing House, 2005',
        role: 'Primary Teacher Reference',
        coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80'
      }
    ],
    questions: [],
    teacherInsights: [],
    videoRecommendations: []
  }
];
