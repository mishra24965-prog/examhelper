/**
 * Technical Academic Diagram Generator
 * Generates rich, authentic academic SVG schematics and apparatus diagrams
 * for Engineering Chemistry, Mechanical, Electrical, and Mathematics (Curve Tracing).
 */

export interface AcademicDiagramOptions {
  topicName: string;
  questionText: string;
  courseName: string;
  diagramType?: string;
  labels?: string[];
}

export function generateAcademicDiagramSvg(options: AcademicDiagramOptions): string {
  const { topicName, questionText, courseName, diagramType } = options;
  const combined = `${courseName} ${topicName} ${questionText}`.toLowerCase();

  // 1. Chemistry: EDTA Hardness Titration / Water Analysis
  if (combined.includes('edta') || combined.includes('hardness') || combined.includes('titration') || combined.includes('water')) {
    return generateEdtaTitrationSvg();
  }

  // 2. Chemistry: Bomb Calorimeter / Proximate Analysis / Fuels
  if (combined.includes('bomb calorimeter') || combined.includes('calorific') || combined.includes('fuel')) {
    return generateBombCalorimeterSvg();
  }

  // 3. Chemistry: Boiler Troubles / Scales & Sludges
  if (combined.includes('boiler') || combined.includes('scale') || combined.includes('sludge') || combined.includes('embrittlement')) {
    return generateBoilerTroublesSvg();
  }

  // 4. Mathematics: Curve Tracing (Cartesian / Polar / Parametric / Folium of Descartes / Astroid / Cycloid / Cardioid)
  if (combined.includes('curve') || combined.includes('trace') || combined.includes('asymptote') || combined.includes('folium') || combined.includes('astroid') || combined.includes('cardioid') || combined.includes('cycloid')) {
    return generateCurveTracingSvg(combined);
  }

  // 5. Mechanical / Thermodynamics: SFEE / Heat Engine / Carnot Cycle / Otto Cycle
  if (combined.includes('sfee') || combined.includes('thermo') || combined.includes('carnot') || combined.includes('otto') || combined.includes('diesel') || combined.includes('cycle')) {
    return generateThermodynamicCycleSvg();
  }

  // 6. Electrical / Electronics: Diode / Rectifier / Circuit / RLC
  if (combined.includes('rectifier') || combined.includes('diode') || combined.includes('circuit') || combined.includes('rlc') || combined.includes('transistor')) {
    return generateCircuitSchematicSvg();
  }

  // Default: Generic Academic Mechanism Diagram
  return generateGenericEngineeringSchematicSvg(topicName, courseName);
}

function generateEdtaTitrationSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2"/>
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.3"/>
      </linearGradient>
      <linearGradient id="wineRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#be123c" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="edtaSol" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.75"/>
      </linearGradient>
    </defs>

    <!-- Title Header -->
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="14" font-weight="800">EXPERIMENT SCHEMATIC: EDTA COMPLEXOMETRIC TITRATION</text>
    <text x="560" y="40" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">pH 10 BUFFER</text>

    <!-- Retort Stand -->
    <rect x="120" y="380" width="180" height="12" rx="4" fill="#64748b"/>
    <rect x="175" y="70" width="10" height="315" fill="#94a3b8"/>
    <!-- Clamp -->
    <rect x="185" y="140" width="45" height="8" rx="2" fill="#cbd5e1"/>
    <circle cx="180" cy="144" r="7" fill="#475569"/>

    <!-- Burette Tube -->
    <rect x="230" y="80" width="22" height="200" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="232" y="110" width="18" height="170" fill="url(#edtaSol)"/>
    <!-- Burette graduations -->
    <line x1="230" y1="120" x2="236" y2="120" stroke="#ffffff" stroke-width="1"/>
    <line x1="230" y1="140" x2="240" y2="140" stroke="#ffffff" stroke-width="1.5"/>
    <line x1="230" y1="160" x2="236" y2="160" stroke="#ffffff" stroke-width="1"/>
    <line x1="230" y1="180" x2="240" y2="180" stroke="#ffffff" stroke-width="1.5"/>
    <line x1="230" y1="200" x2="236" y2="200" stroke="#ffffff" stroke-width="1"/>
    <!-- Burette Stopcock & Nozzle -->
    <polygon points="230,280 252,280 243,300 239,300" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="226" y="288" width="30" height="6" rx="2" fill="#f59e0b"/>
    <rect x="240" y="300" width="2" height="15" fill="#38bdf8"/>
    <!-- Drops falling -->
    <circle cx="241" cy="322" r="2.5" fill="#60a5fa"/>

    <!-- Conical Flask -->
    <path d="M 233 330 L 249 330 L 247 342 L 285 385 A 6 6 0 0 1 280 392 L 202 392 A 6 6 0 0 1 197 385 L 235 342 Z" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1.8"/>
    <!-- Liquid in Flask (Wine Red to Steel Blue) -->
    <path d="M 218 365 L 264 365 L 282 387 A 3 3 0 0 1 279 390 L 203 390 A 3 3 0 0 1 200 387 Z" fill="url(#wineRed)"/>

    <!-- Annotations & Explanations Panel -->
    <g transform="translate(350, 80)">
      <!-- Card 1: Burette Reagent -->
      <rect x="0" y="0" width="320" height="74" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="-90" y1="50" x2="0" y2="35" stroke="#38bdf8" stroke-dasharray="3,3" stroke-width="1.5"/>
      <circle cx="-90" cy="50" r="3" fill="#38bdf8"/>
      <text x="16" y="24" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="12" font-weight="700">1. BURETTE SOLUTION (TITRANT)</text>
      <text x="16" y="44" fill="#e2e8f0" font-family="monospace" font-size="11">Standard 0.01 M Disodium EDTA</text>
      <text x="16" y="62" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10.5">Forms 1:1 hexadentate chelate with Ca²⁺ / Mg²⁺</text>

      <!-- Card 2: Conical Flask Reagents -->
      <rect x="0" y="90" width="320" height="96" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="-65" y1="280" x2="0" y2="135" stroke="#f43f5e" stroke-dasharray="3,3" stroke-width="1.5"/>
      <circle cx="-65" cy="280" r="3" fill="#f43f5e"/>
      <text x="16" y="114" fill="#f43f5e" font-family="system-ui,sans-serif" font-size="12" font-weight="700">2. TITRATION MIXTURE IN FLASK</text>
      <text x="16" y="134" fill="#e2e8f0" font-family="system-ui,sans-serif" font-size="11">• 50 mL Hard Water sample</text>
      <text x="16" y="152" fill="#e2e8f0" font-family="system-ui,sans-serif" font-size="11">• 2 mL NH₄Cl + NH₄OH Buffer (pH = 10)</text>
      <text x="16" y="170" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="11">• 2-3 drops Eriochrome Black-T (EBT) Indicator</text>

      <!-- Card 3: Color Transition Mechanism -->
      <rect x="0" y="202" width="320" height="98" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
      <text x="16" y="226" fill="#34d399" font-family="system-ui,sans-serif" font-size="12" font-weight="800">3. COLOR CHANGE AT ENDPOINT</text>
      <rect x="16" y="238" width="110" height="24" rx="4" fill="#be123c"/>
      <text x="24" y="254" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">WINE RED [M-EBT]</text>
      <text x="135" y="254" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="14" font-weight="900">→</text>
      <rect x="155" y="238" width="145" height="24" rx="4" fill="#0369a1"/>
      <text x="163" y="254" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">STEEL BLUE [Free EBT]</text>
      <text x="16" y="284" fill="#cbd5e1" font-family="monospace" font-size="9.5">Total Hardness = (V₁ × 1000) / V₂ ppm CaCO₃</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateCurveTracingSvg(query: string): string {
  const isFolium = query.includes('folium');
  const isAstroid = query.includes('astroid');
  const isCardioid = query.includes('cardioid');

  let curveTitle = 'CURVE TRACING: CARTESIAN & POLAR CO-ORDINATES';
  let equation = 'y²(a - x) = x²(a + x)  [Strophoid]';
  let pathD = 'M 80 200 C 180 80, 220 320, 320 200 C 220 80, 180 320, 80 200';

  if (isFolium) {
    curveTitle = 'CURVE TRACING: FOLIUM OF DESCARTES';
    equation = 'x³ + y³ = 3axy  (Loop in 1st Quadrant)';
    pathD = 'M 200 200 C 200 120, 280 120, 290 190 C 295 240, 240 295, 190 290 C 120 280, 120 200, 200 200';
  } else if (isAstroid) {
    curveTitle = 'CURVE TRACING: ASTROID (FOUR-CUSPED HYPOCYCLOID)';
    equation = 'x^(2/3) + y^(2/3) = a^(2/3)';
    pathD = 'M 300 200 Q 200 200 200 100 Q 200 200 100 200 Q 200 200 200 300 Q 200 200 300 200';
  } else if (isCardioid) {
    curveTitle = 'CURVE TRACING: CARDIOID';
    equation = 'r = a(1 + cos θ)';
    pathD = 'M 310 200 C 310 90, 160 90, 140 200 C 160 310, 310 310, 310 200';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <!-- Title -->
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#c084fc" font-family="system-ui,sans-serif" font-size="14" font-weight="800">${curveTitle}</text>
    <text x="530" y="40" fill="#fde047" font-family="monospace" font-size="11" font-weight="700">MATHEMATICS-I</text>

    <!-- Graph Grid -->
    <g transform="translate(40, 70)">
      <rect x="0" y="0" width="320" height="320" fill="#020617" stroke="#1e293b" stroke-width="1.5" rx="6"/>
      <!-- Grid lines -->
      <line x1="40" y1="0" x2="40" y2="320" stroke="#0f172a" stroke-width="1"/>
      <line x1="80" y1="0" x2="80" y2="320" stroke="#0f172a" stroke-width="1"/>
      <line x1="120" y1="0" x2="120" y2="320" stroke="#0f172a" stroke-width="1"/>
      <line x1="160" y1="0" x2="160" y2="320" stroke="#334155" stroke-width="1.5"/>
      <line x1="200" y1="0" x2="200" y2="320" stroke="#0f172a" stroke-width="1"/>
      <line x1="240" y1="0" x2="240" y2="320" stroke="#0f172a" stroke-width="1"/>
      <line x1="280" y1="0" x2="280" y2="320" stroke="#0f172a" stroke-width="1"/>

      <line x1="0" y1="40" x2="320" y2="40" stroke="#0f172a" stroke-width="1"/>
      <line x1="0" y1="80" x2="320" y2="80" stroke="#0f172a" stroke-width="1"/>
      <line x1="0" y1="120" x2="320" y2="120" stroke="#0f172a" stroke-width="1"/>
      <line x1="0" y1="160" x2="320" y2="160" stroke="#334155" stroke-width="1.5"/>
      <line x1="0" y1="200" x2="320" y2="200" stroke="#0f172a" stroke-width="1"/>
      <line x1="0" y1="240" x2="320" y2="240" stroke="#0f172a" stroke-width="1"/>
      <line x1="0" y1="280" x2="320" y2="280" stroke="#0f172a" stroke-width="1"/>

      <!-- X and Y Axes -->
      <!-- X-axis -->
      <line x1="10" y1="160" x2="310" y2="160" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="315,160 305,156 305,164" fill="#94a3b8"/>
      <text x="305" y="150" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">X</text>

      <!-- Y-axis -->
      <line x1="160" y1="310" x2="160" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="160,5 156,15 164,15" fill="#94a3b8"/>
      <text x="170" y="18" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">Y</text>

      <!-- Origin O -->
      <text x="145" y="175" fill="#94a3b8" font-family="monospace" font-size="10">O(0,0)</text>

      <!-- Asymptote Line (dotted) -->
      <line x1="280" y1="10" x2="280" y2="310" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="1.5"/>
      <text x="210" y="30" fill="#f87171" font-family="monospace" font-size="9">Asymptote x = a</text>

      <!-- Plotted Curve -->
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <!-- Symmetrical Reflection / Highlight -->
      <circle cx="160" cy="160" r="4" fill="#fde047"/>
      <circle cx="280" cy="160" r="4" fill="#38bdf8"/>
      <text x="260" y="180" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="700">(a, 0)</text>
    </g>

    <!-- Curve Analysis Checklist -->
    <g transform="translate(380, 70)">
      <rect x="0" y="0" width="300" height="320" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <text x="16" y="28" fill="#c084fc" font-family="system-ui,sans-serif" font-size="12" font-weight="800">5-STEP CURVE TRACING PROTOCOL</text>
      <text x="16" y="48" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="700">${equation}</text>

      <rect x="12" y="62" width="276" height="42" rx="6" fill="#1e293b"/>
      <text x="20" y="80" fill="#34d399" font-family="system-ui,sans-serif" font-size="11" font-weight="700">1. Symmetry</text>
      <text x="20" y="96" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Even powers of y → Symmetrical about X-axis</text>

      <rect x="12" y="112" width="276" height="42" rx="6" fill="#1e293b"/>
      <text x="20" y="130" fill="#34d399" font-family="system-ui,sans-serif" font-size="11" font-weight="700">2. Origin & Tangents</text>
      <text x="20" y="146" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Lowest degree terms = 0 → y = ±x (Node at origin)</text>

      <rect x="12" y="162" width="276" height="42" rx="6" fill="#1e293b"/>
      <text x="20" y="180" fill="#34d399" font-family="system-ui,sans-serif" font-size="11" font-weight="700">3. Asymptotes</text>
      <text x="20" y="196" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Equating coeff. of highest power of y to 0: x = a</text>

      <rect x="12" y="212" width="276" height="42" rx="6" fill="#1e293b"/>
      <text x="20" y="230" fill="#34d399" font-family="system-ui,sans-serif" font-size="11" font-weight="700">4. Region of Existence</text>
      <text x="20" y="246" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">For x > a, y is imaginary (No curve exists)</text>

      <rect x="12" y="262" width="276" height="46" rx="6" fill="#1e293b"/>
      <text x="20" y="280" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="11" font-weight="700">5. Special Points of Inflexion</text>
      <text x="20" y="296" fill="#cbd5e1" font-family="monospace" font-size="9.5">dy/dx = 0 at extreme turning limits</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateBombCalorimeterSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <!-- Title -->
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#f97316" font-family="system-ui,sans-serif" font-size="14" font-weight="800">APPARATUS SCHEMATIC: BOMB CALORIMETER (HCV/LCV OF SOLID FUEL)</text>
    <text x="550" y="40" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">CHEMISTRY UNIT 3</text>

    <!-- Outer Jacket & Air Jacket -->
    <rect x="60" y="75" width="270" height="315" rx="8" fill="#0f172a" stroke="#475569" stroke-width="3"/>
    <rect x="75" y="90" width="240" height="285" rx="6" fill="#020617" stroke="#334155" stroke-width="1.5"/>
    <rect x="90" y="110" width="210" height="250" rx="4" fill="#0369a1" fill-opacity="0.3" stroke="#0284c7" stroke-width="1.5"/>

    <!-- Inner Bomb Vessel (Heavy Stainless Steel) -->
    <rect x="145" y="170" width="100" height="160" rx="10" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
    <polygon points="175,170 215,170 210,140 180,140" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
    <!-- Oxygen Valve -->
    <rect x="192" y="120" width="6" height="20" fill="#f59e0b"/>
    <circle cx="195" cy="115" r="7" fill="#ea580c"/>

    <!-- Crucible & Fuel Sample inside Bomb -->
    <path d="M 180 280 L 210 280 L 205 295 L 185 295 Z" fill="#cbd5e1" stroke="#f1f5f9" stroke-width="1"/>
    <!-- Fuel Sample Pellet -->
    <ellipse cx="195" cy="286" rx="8" ry="4" fill="#18181b"/>
    <!-- Ignition Wire (Mg wire / Cotton thread) -->
    <path d="M 175 220 L 175 275 L 195 285 L 215 275 L 215 220" fill="none" stroke="#ef4444" stroke-width="1.5"/>

    <!-- Beckmann Thermometer -->
    <rect x="110" y="70" width="12" height="230" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
    <rect x="113" y="180" width="6" height="120" fill="#dc2626"/>
    <circle cx="116" cy="305" r="7" fill="#dc2626"/>

    <!-- Mechanical Motor Stirrer -->
    <rect x="260" y="70" width="8" height="240" fill="#94a3b8"/>
    <path d="M 250 300 L 278 300 L 278 310 L 250 310 Z" fill="#64748b"/>

    <!-- Annotations Panel -->
    <g transform="translate(360, 75)">
      <rect x="0" y="0" width="310" height="315" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <text x="16" y="26" fill="#f97316" font-family="system-ui,sans-serif" font-size="12" font-weight="800">APPARATUS COMPONENTS & DULONG FORMULA</text>

      <rect x="12" y="40" width="286" height="52" rx="6" fill="#1e293b"/>
      <text x="20" y="58" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="11" font-weight="700">1. Stainless Steel Bomb</text>
      <text x="20" y="74" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Pressurized with pure Oxygen at 25-30 atm</text>
      <text x="20" y="86" fill="#cbd5e1" font-family="monospace" font-size="9.5">Prevents gas leakage during detonation</text>

      <rect x="12" y="100" width="286" height="50" rx="6" fill="#1e293b"/>
      <text x="20" y="118" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="11" font-weight="700">2. Beckmann Thermometer</text>
      <text x="20" y="134" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Measures differential rise ΔT accurately to 0.01°C</text>

      <rect x="12" y="158" width="286" height="50" rx="6" fill="#1e293b"/>
      <text x="20" y="176" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="11" font-weight="700">3. Water & Air Jackets</text>
      <text x="20" y="192" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Eliminates heat losses due to radiation/convection</text>

      <rect x="12" y="216" width="286" height="84" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1"/>
      <text x="20" y="234" fill="#34d399" font-family="system-ui,sans-serif" font-size="11" font-weight="800">4. High Calorific Value (HCV) Formula:</text>
      <text x="20" y="254" fill="#fde047" font-family="monospace" font-size="11" font-weight="700">HCV = [(W + w)(ΔT + t₁) - (c_acid + c_fuse)] / m</text>
      <text x="20" y="272" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="9.5">W = Mass of water, w = Water equivalent of calorimeter</text>
      <text x="20" y="286" fill="#fca5a5" font-family="monospace" font-size="9.5">LCV = HCV - 0.09 × H × 587 cal/g</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateBoilerTroublesSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <!-- Title -->
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#f43f5e" font-family="system-ui,sans-serif" font-size="14" font-weight="800">BOILER TROUBLES SCHEMATIC: SCALES VS SLUDGES & CAUSTIC EMBRITTLEMENT</text>
    <text x="560" y="40" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">WATER TECH</text>

    <!-- Boiler Cross Section -->
    <g transform="translate(40, 75)">
      <!-- Outer Metal Boiler Tube -->
      <rect x="0" y="20" width="310" height="150" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <!-- Inner Water Flow -->
      <rect x="25" y="45" width="260" height="100" fill="#0284c7" fill-opacity="0.3"/>
      <!-- Scale (Hard adherent layer) -->
      <rect x="25" y="45" width="260" height="14" fill="#f59e0b" stroke="#d97706" stroke-width="1"/>
      <text x="35" y="40" fill="#fde047" font-family="monospace" font-size="10" font-weight="700">HARD ADHERENT SCALE (CaSO₄, CaCO₃)</text>
      <!-- Sludge (Loose slimy precipitate) -->
      <ellipse cx="80" cy="135" rx="30" ry="7" fill="#64748b"/>
      <ellipse cx="170" cy="138" rx="45" ry="6" fill="#64748b"/>
      <ellipse cx="250" cy="136" rx="25" ry="6" fill="#64748b"/>
      <text x="70" y="125" fill="#cbd5e1" font-family="monospace" font-size="10" font-weight="700">LOOSE SLUDGE (MgCO₃, MgCl₂)</text>

      <!-- Heat flow arrows from bottom -->
      <g transform="translate(50, 180)">
        <polygon points="20,25 30,10 40,25 32,25 32,45 28,45 28,25" fill="#ef4444"/>
        <polygon points="100,25 110,10 120,25 112,25 112,45 108,45 108,25" fill="#ef4444"/>
        <polygon points="180,25 190,10 200,25 192,25 192,45 188,45 188,25" fill="#ef4444"/>
        <text x="25" y="65" fill="#f87171" font-family="system-ui,sans-serif" font-size="11" font-weight="700">HEAT SOURCE FROM FURNACE (Inefficient Heat Transfer)</text>
      </g>
    </g>

    <!-- Comparison & Mechanism Table -->
    <g transform="translate(380, 75)">
      <rect x="0" y="0" width="295" height="315" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <text x="16" y="24" fill="#f43f5e" font-family="system-ui,sans-serif" font-size="12" font-weight="800">SCIENTIFIC COMPARISON & DANGERS</text>

      <rect x="12" y="38" width="271" height="74" rx="6" fill="#1e293b"/>
      <text x="20" y="56" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="11" font-weight="700">SLUDGES (Soft & Slimy)</text>
      <text x="20" y="72" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="10">• Formed at colder bends of boiler</text>
      <text x="20" y="86" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="10">• Easily removed by "Blow-down operation"</text>
      <text x="20" y="100" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="9.5">• Precipitates: MgCO₃, MgCl₂, CaCl₂</text>

      <rect x="12" y="120" width="271" height="86" rx="6" fill="#1e293b"/>
      <text x="20" y="138" fill="#f87171" font-family="system-ui,sans-serif" font-size="11" font-weight="700">SCALES (Hard & Inflexible)</text>
      <text x="20" y="154" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="10">• Adheres firmly to inner metallic walls</text>
      <text x="20" y="168" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="10">• Waste of fuel: 1 mm scale causes ~12% fuel loss</text>
      <text x="20" y="182" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="10">• Overheating causes boiler explosion risk</text>
      <text x="20" y="196" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="9.5">• Precipitates: CaSO₄, CaSiO₃</text>

      <rect x="12" y="214" width="271" height="88" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
      <text x="20" y="232" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="11" font-weight="800">CAUSTIC EMBRITTLEMENT MECHANISM</text>
      <text x="20" y="250" fill="#cbd5e1" font-family="monospace" font-size="9.5">Na₂CO₃ + H₂O → 2NaOH + CO₂ ↑</text>
      <text x="20" y="266" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="9.5">NaOH seeps into hair-cracks at rivet joints.</text>
      <text x="20" y="280" fill="#34d399" font-family="system-ui,sans-serif" font-size="9.5">Prevention: Add Sodium Phosphate or Lignin.</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateThermodynamicCycleSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#fb923c" font-family="system-ui,sans-serif" font-size="14" font-weight="800">THERMODYNAMIC SYSTEM SCHEMATIC: STEADY FLOW ENERGY EQUATION (SFEE)</text>
    <text x="560" y="40" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">MECHANICAL</text>

    <!-- Control Volume (Nozzle/Turbine body) -->
    <g transform="translate(50, 90)">
      <polygon points="40,80 260,30 260,210 40,160" fill="#0f172a" stroke="#fb923c" stroke-width="3"/>
      <!-- Center Dashed Boundary -->
      <polygon points="55,90 245,45 245,195 55,150" fill="none" stroke="#64748b" stroke-dasharray="4,4" stroke-width="1.5"/>
      <text x="110" y="125" fill="#fb923c" font-family="system-ui,sans-serif" font-size="12" font-weight="800">CONTROL VOLUME</text>

      <!-- Inlet State 1 -->
      <g transform="translate(-20, 110)">
        <line x1="-10" y1="10" x2="50" y2="10" stroke="#38bdf8" stroke-width="3"/>
        <polygon points="55,10 45,5 45,15" fill="#38bdf8"/>
        <text x="-15" y="-10" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="700">INLET 1</text>
        <text x="-15" y="32" fill="#cbd5e1" font-family="monospace" font-size="9.5">m₁, p₁, v₁, T₁, Z₁</text>
      </g>

      <!-- Exit State 2 -->
      <g transform="translate(250, 110)">
        <line x1="10" y1="10" x2="70" y2="10" stroke="#10b981" stroke-width="3"/>
        <polygon points="75,10 65,5 65,15" fill="#10b981"/>
        <text x="35" y="-10" fill="#34d399" font-family="monospace" font-size="11" font-weight="700">EXIT 2</text>
        <text x="35" y="32" fill="#cbd5e1" font-family="monospace" font-size="9.5">m₂, p₂, v₂, T₂, Z₂</text>
      </g>

      <!-- Heat Input Q -->
      <g transform="translate(130, -10)">
        <line x1="20" y1="-10" x2="20" y2="40" stroke="#ef4444" stroke-width="2.5"/>
        <polygon points="20,45 15,35 25,35" fill="#ef4444"/>
        <text x="32" y="20" fill="#f87171" font-family="monospace" font-size="12" font-weight="700">+Q (Heat Added)</text>
      </g>

      <!-- Work Output W -->
      <g transform="translate(130, 215)">
        <line x1="20" y1="0" x2="20" y2="50" stroke="#a855f7" stroke-width="2.5"/>
        <polygon points="20,55 15,45 25,45" fill="#a855f7"/>
        <text x="32" y="35" fill="#c084fc" font-family="monospace" font-size="12" font-weight="700">+W (Shaft Work)</text>
      </g>
    </g>

    <!-- Formula Breakdown Panel -->
    <g transform="translate(390, 80)">
      <rect x="0" y="0" width="285" height="305" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <text x="16" y="24" fill="#fb923c" font-family="system-ui,sans-serif" font-size="12" font-weight="800">SFEE GOVERNING CONSERVATION LAW</text>

      <rect x="12" y="38" width="261" height="65" rx="6" fill="#1e293b"/>
      <text x="20" y="56" fill="#fde047" font-family="monospace" font-size="10.5" font-weight="700">h₁ + V₁²/2 + gz₁ + q</text>
      <text x="20" y="74" fill="#ffffff" font-family="monospace" font-size="12" font-weight="900">= h₂ + V₂²/2 + gz₂ + w</text>
      <text x="20" y="92" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="9.5">Enthalpy + Kinetic + Potential + Heat = Work</text>

      <rect x="12" y="112" width="261" height="84" rx="6" fill="#1e293b"/>
      <text x="20" y="130" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="11" font-weight="700">SPECIAL CASES FOR UNIVERSITY EXAMS:</text>
      <text x="20" y="148" fill="#cbd5e1" font-family="monospace" font-size="9.5">• Nozzle (q=0, w=0): V₂ = √(2000(h₁-h₂) + V₁²)</text>
      <text x="20" y="166" fill="#cbd5e1" font-family="monospace" font-size="9.5">• Turbine (q=0, Δpe=0): w = h₁ - h₂</text>
      <text x="20" y="184" fill="#cbd5e1" font-family="monospace" font-size="9.5">• Compressor (q=0): w_in = h₂ - h₁</text>

      <rect x="12" y="206" width="261" height="85" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1"/>
      <text x="20" y="226" fill="#34d399" font-family="system-ui,sans-serif" font-size="11" font-weight="800">EVALUATOR MARKING CHECKLIST</text>
      <text x="20" y="244" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="9.5">1. State continuity equation: m = ρ₁A₁V₁ = ρ₂A₂V₂</text>
      <text x="20" y="260" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="9.5">2. Divide kinetic energy term V²/2 by 1000 for kJ/kg</text>
      <text x="20" y="276" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="9.5">3. Box final enthalpy drop and power output</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateCircuitSchematicSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#34d399" font-family="system-ui,sans-serif" font-size="14" font-weight="800">CIRCUIT SCHEMATIC: FULL-WAVE BRIDGE RECTIFIER WITH CAPACITOR FILTER</text>
    <text x="560" y="40" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">ELECTRONICS</text>

    <!-- AC Transformer & Bridge Diode Loop -->
    <g transform="translate(60, 90)">
      <!-- AC Source -->
      <circle cx="40" cy="120" r="24" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <path d="M 28 120 Q 34 110 40 120 Q 46 130 52 120" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="22" y="160" fill="#38bdf8" font-family="monospace" font-size="10">230V AC</text>

      <!-- Bridge Quad Nodes -->
      <polygon points="180,60 240,120 180,180 120,120" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
      <!-- Diodes in Bridge -->
      <text x="140" y="85" fill="#34d399" font-family="monospace" font-size="10" font-weight="700">D₁ ⯈</text>
      <text x="205" y="85" fill="#34d399" font-family="monospace" font-size="10" font-weight="700">D₂ ⯈</text>
      <text x="205" y="165" fill="#34d399" font-family="monospace" font-size="10" font-weight="700">D₃ ⯈</text>
      <text x="140" y="165" fill="#34d399" font-family="monospace" font-size="10" font-weight="700">D₄ ⯈</text>

      <!-- Connecting Lines -->
      <line x1="40" y1="96" x2="40" y2="60" stroke="#38bdf8" stroke-width="2"/>
      <line x1="40" y1="60" x2="180" y2="60" stroke="#38bdf8" stroke-width="2"/>
      <line x1="40" y1="144" x2="40" y2="180" stroke="#38bdf8" stroke-width="2"/>
      <line x1="40" y1="180" x2="180" y2="180" stroke="#38bdf8" stroke-width="2"/>

      <!-- Filter Capacitor C & Load Resistor RL -->
      <line x1="240" y1="120" x2="310" y2="120" stroke="#34d399" stroke-width="2"/>
      <!-- Parallel branch for C -->
      <line x1="270" y1="120" x2="270" y2="150" stroke="#34d399" stroke-width="2"/>
      <line x1="260" y1="150" x2="280" y2="150" stroke="#f59e0b" stroke-width="3"/>
      <line x1="260" y1="156" x2="280" y2="156" stroke="#f59e0b" stroke-width="3"/>
      <line x1="270" y1="156" x2="270" y2="190" stroke="#34d399" stroke-width="2"/>
      <text x="285" y="156" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="700">C</text>

      <!-- Parallel branch for RL -->
      <line x1="310" y1="120" x2="310" y2="140" stroke="#34d399" stroke-width="2"/>
      <!-- Zigzag resistor -->
      <path d="M 310 140 L 316 144 L 304 150 L 316 156 L 304 162 L 310 166" fill="none" stroke="#f43f5e" stroke-width="2.5"/>
      <line x1="310" y1="166" x2="310" y2="190" stroke="#34d399" stroke-width="2"/>
      <text x="325" y="156" fill="#f43f5e" font-family="monospace" font-size="10" font-weight="700">RL</text>
      <!-- Bottom Return -->
      <line x1="120" y1="120" x2="120" y2="190" stroke="#94a3b8" stroke-width="2"/>
      <line x1="120" y1="190" x2="310" y2="190" stroke="#94a3b8" stroke-width="2"/>

      <text x="250" y="220" fill="#34d399" font-family="monospace" font-size="11" font-weight="700">V_DC OUTPUT</text>
    </g>

    <!-- Engineering Formula Card -->
    <g transform="translate(420, 80)">
      <rect x="0" y="0" width="255" height="305" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <text x="16" y="24" fill="#34d399" font-family="system-ui,sans-serif" font-size="12" font-weight="800">PERFORMANCE PARAMETERS</text>

      <rect x="12" y="38" width="231" height="52" rx="6" fill="#1e293b"/>
      <text x="20" y="56" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="11" font-weight="700">1. Rectification Efficiency (η)</text>
      <text x="20" y="74" fill="#fde047" font-family="monospace" font-size="12" font-weight="700">η = 81.2% (Max Theoretical)</text>

      <rect x="12" y="100" width="231" height="54" rx="6" fill="#1e293b"/>
      <text x="20" y="118" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="11" font-weight="700">2. Ripple Factor (γ)</text>
      <text x="20" y="136" fill="#cbd5e1" font-family="monospace" font-size="10.5">γ = 1 / (4√3 · f · C · R_L) = 0.48</text>

      <rect x="12" y="164" width="231" height="54" rx="6" fill="#1e293b"/>
      <text x="20" y="182" fill="#f87171" font-family="system-ui,sans-serif" font-size="11" font-weight="700">3. Peak Inverse Voltage (PIV)</text>
      <text x="20" y="200" fill="#cbd5e1" font-family="monospace" font-size="11" font-weight="700">PIV = V_m (Per Diode)</text>

      <rect x="12" y="228" width="231" height="65" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1"/>
      <text x="20" y="248" fill="#34d399" font-family="system-ui,sans-serif" font-size="10.5" font-weight="800">EXAM PRO-TIP:</text>
      <text x="20" y="266" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="9.5">State diode conduction pairs: (D1, D3) on positive half, (D2, D4) on negative half.</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateGenericEngineeringSchematicSvg(topicName: string, courseName: string): string {
  const cleanTopic = (topicName || 'Engineering Concept').slice(0, 35);
  const cleanCourse = (courseName || 'University Syllabus').slice(0, 30);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#090d16; border-radius:16px;">
    <rect x="20" y="16" width="660" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="35" y="40" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="14" font-weight="800">EXAMINATION DIAGRAM SCHEMATIC: ${cleanTopic.toUpperCase()}</text>
    <text x="540" y="40" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="700">${cleanCourse.toUpperCase()}</text>

    <!-- Block Diagram System Flow -->
    <g transform="translate(60, 90)">
      <!-- Stage 1 Input -->
      <rect x="0" y="80" width="140" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <text x="16" y="115" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="12" font-weight="700">1. INPUT STATE</text>
      <text x="16" y="135" fill="#94a3b8" font-family="monospace" font-size="10">Boundary Conditions</text>

      <!-- Connecting Arrow 1 -->
      <line x1="140" y1="120" x2="190" y2="120" stroke="#38bdf8" stroke-width="2"/>
      <polygon points="195,120 185,115 185,125" fill="#38bdf8"/>

      <!-- Stage 2 Mechanism -->
      <rect x="195" y="60" width="180" height="120" rx="10" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
      <text x="215" y="95" fill="#fde047" font-family="system-ui,sans-serif" font-size="13" font-weight="800">2. CORE MECHANISM</text>
      <text x="215" y="118" fill="#cbd5e1" font-family="monospace" font-size="10">Kinetic / Chemical / Matrix</text>
      <text x="215" y="138" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="10">Governing Equation: f(x, y) = 0</text>
      <text x="215" y="156" fill="#34d399" font-family="monospace" font-size="10">Conserved Quantities</text>

      <!-- Connecting Arrow 2 -->
      <line x1="375" y1="120" x2="425" y2="120" stroke="#10b981" stroke-width="2"/>
      <polygon points="430,120 420,115 420,125" fill="#10b981"/>

      <!-- Stage 3 Output -->
      <rect x="430" y="80" width="140" height="80" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <text x="446" y="115" fill="#34d399" font-family="system-ui,sans-serif" font-size="12" font-weight="700">3. OUTPUT RESULT</text>
      <text x="446" y="135" fill="#cbd5e1" font-family="monospace" font-size="10">Boxed Final Scalar/Unit</text>
    </g>

    <!-- Lower Summary Card -->
    <g transform="translate(60, 310)">
      <rect x="0" y="0" width="580" height="75" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <text x="18" y="24" fill="#38bdf8" font-family="system-ui,sans-serif" font-size="12" font-weight="800">EXAMINATION DRAWING GUIDELINE</text>
      <text x="18" y="44" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="10.5">• Draw neatly with a sharp pencil using a ruler; label all state variables and directional flow arrows.</text>
      <text x="18" y="62" fill="#fde047" font-family="system-ui,sans-serif" font-size="10.5">• Mention input units, boundary parameters, and boxed step numbers matching your answer script.</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
