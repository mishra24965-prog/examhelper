/**
 * Standard Mathematical Notation & Derivation Formatter
 * 
 * Replaces complex, messy LaTeX markup and raw code syntax with
 * readable, standard mathematical notations commonly used on student exam sheets
 * and verified university model answers.
 */

// Mapping tables for Unicode Superscripts & Subscripts
const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'i': 'ⁱ', 't': 'ᵗ', 'x': 'ˣ', 'y': 'ʸ',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'm': 'ᵐ',
  'k': 'ᵏ', 'T': 'ᵀ'
};

const SUBSCRIPTS: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ'
};

export function toSuperscript(str: string): string {
  return str.split('').map(c => SUPERSCRIPTS[c] || c).join('');
}

export function toSubscript(str: string): string {
  return str.split('').map(c => SUBSCRIPTS[c] || c).join('');
}

/**
 * Converts LaTeX matrix environments into clean textual bracket representation
 */
function cleanMatrixEnvironments(input: string): string {
  return input.replace(/\\begin\{(?:b|p|v|V|B)?matrix\}([\s\S]*?)\\end\{(?:b|p|v|V|B)?matrix\}/g, (_, content) => {
    // Split by \\ or newline
    const rows = content
      .trim()
      .split(/\\\\|\\r?\\n/)
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0 && !r.startsWith('\\begin') && !r.startsWith('\\end'));

    if (rows.length === 0) return '[ ]';

    const parsedRows = rows.map((r: string) => {
      const cells = r.split('&').map((cell: string) => cleanLatexTokens(cell.trim()));
      return `[ ${cells.join('   ')} ]`;
    });

    return parsedRows.join('\n');
  });
}

/**
 * Recursively resolves \frac{A}{B} to readable (A) / (B)
 */
function cleanFractions(input: string): string {
  let str = input;
  let prev = '';
  let iterations = 0;

  // Max 6 passes to prevent infinite loops on malformed inputs
  while (str !== prev && iterations < 6) {
    prev = str;
    iterations++;

    str = str.replace(/\\(?:d|t)?frac\{([^{}]+)\}\{([^{}]+)\}/g, (_, num, den) => {
      const cleanNum = cleanLatexTokens(num.trim());
      const cleanDen = cleanLatexTokens(den.trim());

      // If single variable or number, avoid unnecessary outer parentheses
      const formattedNum = /^[0-9a-zA-Z]+$/.test(cleanNum) ? cleanNum : `(${cleanNum})`;
      const formattedDen = /^[0-9a-zA-Z]+$/.test(cleanDen) ? cleanDen : `(${cleanDen})`;

      return `${formattedNum} / ${formattedDen}`;
    });
  }

  return str;
}

/**
 * Handles core token replacements for LaTeX symbols
 */
function cleanLatexTokens(text: string): string {
  if (!text) return '';

  return text
    // Remove boxed and text wrappers
    .replace(/\\boxed\{([^{}]+(?:\{[^{}]*\}[^{}]*)*)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\mathit\{([^}]+)\}/g, '$1')
    .replace(/\\underline\{([^}]+)\}/g, '$1')
    .replace(/\\bm\{([^}]+)\}/g, '$1')
    
    // Standard arrows & implications
    .replace(/\\implies\s*/g, ' ⇒ ')
    .replace(/\\Rightarrow\s*/g, ' ⇒ ')
    .replace(/\\rightarrow\s*/g, ' → ')
    .replace(/\\to\b\s*/g, ' → ')
    .replace(/\\Leftarrow\s*/g, ' ⇐ ')
    .replace(/\\leftarrow\s*/g, ' ← ')
    .replace(/\\iff\s*/g, ' ⇔ ')
    .replace(/\\Leftrightarrow\s*/g, ' ⇔ ')

    // Comparison & equality relations
    .replace(/\\leq\s*/g, ' ≤ ')
    .replace(/\\le\b\s*/g, ' ≤ ')
    .replace(/\\geq\s*/g, ' ≥ ')
    .replace(/\\ge\b\s*/g, ' ≥ ')
    .replace(/\\neq\s*/g, ' ≠ ')
    .replace(/\\ne\b\s*/g, ' ≠ ')
    .replace(/\\approx\s*/g, ' ≈ ')
    .replace(/\\equiv\s*/g, ' ≡ ')
    .replace(/\\sim\s*/g, ' ~ ')
    .replace(/\\propto\s*/g, ' ∝ ')
    .replace(/\\pm\s*/g, ' ± ')
    .replace(/\\mp\s*/g, ' ∓ ')
    .replace(/\\times\s*/g, ' × ')
    .replace(/\\cdot\s*/g, ' · ')
    .replace(/\\div\s*/g, ' ÷ ')

    // Calculus & limits
    .replace(/\\lim_\{([^}]+)\to([^}]+)\}/g, 'lim($1 → $2)')
    .replace(/\\lim_\{([^}]+)\}/g, 'lim($1)')
    .replace(/\\partial/g, '∂')
    .replace(/\\nabla/g, '∇')
    .replace(/\\int_\{([^{}]+)\}\^\{([^{}]+)\}/g, '∫[$1 to $2]')
    .replace(/\\int_([0-9a-zA-Z]+)\^([0-9a-zA-Z]+)/g, '∫[$1 to $2]')
    .replace(/\\int\b/g, '∫')
    .replace(/\\iint\b/g, '∬')
    .replace(/\\iiint\b/g, '∭')
    .replace(/\\oint\b/g, '∮')
    .replace(/\\sum_\{([^{}]+)\}\^\{([^{}]+)\}/g, 'Σ($1 to $2)')
    .replace(/\\sum_([0-9a-zA-Z]+)\^([0-9a-zA-Z]+)/g, 'Σ($1 to $2)')
    .replace(/\\sum\b/g, 'Σ')
    .replace(/\\prod_\{([^{}]+)\}\^\{([^{}]+)\}/g, 'Π($1 to $2)')
    .replace(/\\prod\b/g, 'Π')
    .replace(/\\infty/g, '∞')

    // Binomial Coefficients: \binom{n}{k} -> C(n, k)
    .replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g, 'C($1, $2)')

    // Square roots: \sqrt{x} -> √(x), \sqrt[3]{x} -> ³√(x)
    .replace(/\\sqrt\[3\]\{([^{}]+)\}/g, '³√($1)')
    .replace(/\\sqrt\[([^{}]+)\]\{([^{}]+)\}/g, '$1√($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt\b/g, '√')

    // Parentheses & brackets
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\left\\\{/g, '{')
    .replace(/\\right\\\}/g, '}')
    .replace(/\\left\|/g, '|')
    .replace(/\\right\|/g, '|')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')

    // Greek Alphabet
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\\gamma\b/g, 'γ')
    .replace(/\\Gamma\b/g, 'Γ')
    .replace(/\\delta\b/g, 'δ')
    .replace(/\\Delta\b/g, 'Δ')
    .replace(/\\epsilon\b/g, 'ε')
    .replace(/\\varepsilon\b/g, 'ε')
    .replace(/\\zeta\b/g, 'ζ')
    .replace(/\\eta\b/g, 'η')
    .replace(/\\theta\b/g, 'θ')
    .replace(/\\Theta\b/g, 'Θ')
    .replace(/\\kappa\b/g, 'κ')
    .replace(/\\lambda\b/g, 'λ')
    .replace(/\\Lambda\b/g, 'Λ')
    .replace(/\\mu\b/g, 'μ')
    .replace(/\\nu\b/g, 'ν')
    .replace(/\\xi\b/g, 'ξ')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\Pi\b/g, 'Π')
    .replace(/\\rho\b/g, 'ρ')
    .replace(/\\sigma\b/g, 'σ')
    .replace(/\\Sigma\b/g, 'Σ')
    .replace(/\\tau\b/g, 'τ')
    .replace(/\\phi\b/g, 'φ')
    .replace(/\\Phi\b/g, 'Φ')
    .replace(/\\psi\b/g, 'ψ')
    .replace(/\\Psi\b/g, 'Ψ')
    .replace(/\\omega\b/g, 'ω')
    .replace(/\\Omega\b/g, 'Ω')

    // Standard Trig & Log functions
    .replace(/\\sin\^\{(-?1)\}/g, 'sin⁻¹')
    .replace(/\\cos\^\{(-?1)\}/g, 'cos⁻¹')
    .replace(/\\tan\^\{(-?1)\}/g, 'tan⁻¹')
    .replace(/\\arcsin\b/g, 'sin⁻¹')
    .replace(/\\arccos\b/g, 'cos⁻¹')
    .replace(/\\arctan\b/g, 'tan⁻¹')
    .replace(/\\sin\b/g, 'sin')
    .replace(/\\cos\b/g, 'cos')
    .replace(/\\tan\b/g, 'tan')
    .replace(/\\sec\b/g, 'sec')
    .replace(/\\csc\b/g, 'csc')
    .replace(/\\cot\b/g, 'cot')
    .replace(/\\sinh\b/g, 'sinh')
    .replace(/\\cosh\b/g, 'cosh')
    .replace(/\\tanh\b/g, 'tanh')
    .replace(/\\ln\b/g, 'ln')
    .replace(/\\log_\{([^{}]+)\}/g, 'log_($1)')
    .replace(/\\log\b/g, 'log')
    .replace(/\\exp\b/g, 'exp')

    // Spacing commands
    .replace(/\\quad\s*/g, '   ')
    .replace(/\\qquad\s*/g, '      ')
    .replace(/\\[,;:!]\s*/g, ' ')

    // Units
    .replace(/\\circ\b/g, '°')
    .replace(/\\degree\b/g, '°');
}

/**
 * Converts complex LaTeX formatting to clear, readable standard mathematical notations
 */
export function formatLatexToStandardMath(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // 1. Remove markdown code fences and backticks if wrapping formulas
  text = text.replace(/```(?:latex|math)?([\s\S]*?)```/g, '$1');
  text = text.replace(/`([^`]+)`/g, '$1');

  // 2. Remove display and inline math delimiters ($$...$$, $...$)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  text = text.replace(/\$([^$]+)\$/g, '$1');

  // 3. Process matrix environments
  text = cleanMatrixEnvironments(text);

  // 4. Clean aligned / equation environments
  text = text.replace(/\\begin\{(?:align\*?|equation\*?|gather\*?|split)\}([\s\S]*?)\\end\{(?:align\*?|equation\*?|gather\*?|split)\}/g, '$1');

  // 5. Clean fractions
  text = cleanFractions(text);

  // 6. Token replacement
  text = cleanLatexTokens(text);

  // 7. Superscripts with curly braces: ^{n-1}, ^{2}, etc.
  text = text.replace(/\^\{([^{}]+)\}/g, (_, exp) => {
    // If all chars can be converted to superscript
    const converted = toSuperscript(exp);
    return converted === exp ? `^(${exp})` : converted;
  });

  // 8. Single character superscripts: ^2, ^3, ^n, ^T, ^-1
  text = text.replace(/\^([0-9nNtiTa-z])/g, (_, char) => SUPERSCRIPTS[char] || `^${char}`);
  text = text.replace(/\^-1\b/g, '⁻¹');

  // 9. Subscripts with curly braces: _{n+1}, _{0}, etc.
  text = text.replace(/_\{([^{}]+)\}/g, (_, sub) => {
    const converted = toSubscript(sub);
    return converted === sub ? `_(${sub})` : converted;
  });

  // 10. Single character/digit subscripts: y_n -> yₙ, y_0 -> y₀, T_1 -> T₁, x_2 -> x₂, a_ij
  text = text.replace(/([A-Za-zα-ωΑ-Ω])_([0-9a-zA-Z])/g, (_, variable, sub) => {
    return `${variable}${SUBSCRIPTS[sub] || `_${sub}`}`;
  });

  // 11. Normalize alignment tabs (&) and line continuation (\\)
  text = text.replace(/&/g, ' ');
  text = text.replace(/\\\\/g, '\n');

  // 12. Remove any remaining stray backslashes before plain words
  text = text.replace(/\\([a-zA-Z]+)/g, '$1');

  // 13. Remove remaining raw LaTeX artifacts
  text = text.replace(/\\/g, '');

  // 14. Clean multiple spaces
  text = text.replace(/[ \t]+/g, ' ').trim();

  return text;
}

export interface DerivationLine {
  id: string;
  raw: string;
  formatted: string;
  kind: 'equation' | 'substitution' | 'rule' | 'explanation' | 'result';
  annotation?: string;
  isBoxed?: boolean;
}

export interface ParsedDerivationStep {
  stepNumber: number;
  title: string;
  summary: string;
  lines: DerivationLine[];
  finalResult?: string;
}

/**
 * Classifies a derivation line to apply appropriate visual styles
 */
function classifyLine(line: string): {
  kind: DerivationLine['kind'];
  annotation?: string;
  isBoxed: boolean;
} {
  const lower = line.toLowerCase();

  // Final result / Boxed outcome
  if (
    lower.startsWith('final answer') ||
    lower.startsWith('hence,') ||
    lower.startsWith('therefore,') ||
    lower.includes('boxed') ||
    lower.startsWith('result:') ||
    /\b=\s*[\-0-9\.]+\s*(?:kJ|kPa|bar|m³|K|J|kW|V|A|Hz|rad|°C|m\/s|kN|N|kg|ohms?|Ω)\b/i.test(line)
  ) {
    return { kind: 'result', annotation: 'Final Evaluated Result', isBoxed: true };
  }

  // Formula statement / Governing law
  if (
    lower.startsWith('formula:') ||
    lower.startsWith('governing equation:') ||
    lower.startsWith('by leibnitz theorem:') ||
    lower.startsWith('we know that:') ||
    lower.startsWith('standard relation:') ||
    lower.startsWith('base relation:')
  ) {
    return { kind: 'rule', annotation: 'Governing Formulation', isBoxed: false };
  }

  // Substitution step
  if (
    lower.startsWith('substituting') ||
    lower.startsWith('putting') ||
    lower.startsWith('at x =') ||
    lower.startsWith('for x =') ||
    lower.startsWith('given values:') ||
    lower.startsWith('values:')
  ) {
    return { kind: 'substitution', annotation: 'Parameter Substitution', isBoxed: false };
  }

  // Mathematical equation line (contains '=' with symbols or arithmetic)
  if (
    line.includes('=') &&
    !lower.startsWith('note:') &&
    !lower.startsWith('step') &&
    !lower.startsWith('where')
  ) {
    return { kind: 'equation', annotation: 'Derivation Step', isBoxed: false };
  }

  return { kind: 'explanation', isBoxed: false };
}

/**
 * Parses raw solution text into clean, structured derivation steps
 * ensuring all derivations follow a clear and simplified textual format.
 */
export function parseSolutionToDerivationSteps(raw: string): ParsedDerivationStep[] {
  if (!raw) return [];

  // Split by step headers (Step 1, Step 2, ###, 1., etc.)
  const rawSections = raw.split(/(?:\r?\n)(?=#{1,4}\s+|\bStep\s+\d+[:.]|\b\d+\.\s+[A-Za-z])/i);
  const steps: ParsedDerivationStep[] = [];

  rawSections.forEach((section, sIdx) => {
    const trimmed = section.trim();
    if (!trimmed) return;

    const rawLines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) return;

    // First line is step title
    let headerText = rawLines[0]
      .replace(/^#{1,4}\s*/, '')
      .replace(/^\d+[\.\)]\s*/, '')
      .replace(/^[*\-•]\s*/, '')
      .trim();

    // Ensure friendly step naming
    if (!/^Step\s+\d+/i.test(headerText)) {
      headerText = `Step ${steps.length + 1}: ${headerText}`;
    }

    const cleanTitle = formatLatexToStandardMath(headerText);
    const bodyLines = rawLines.length > 1 ? rawLines.slice(1) : rawLines;

    const lines: DerivationLine[] = [];
    let detectedFinalResult: string | undefined;

    bodyLines.forEach((bLine, lIdx) => {
      // Skip repeating header
      if (bLine === rawLines[0] && rawLines.length > 1) return;

      // Extract explicit \boxed{...} if present
      const boxedMatch = bLine.match(/\\boxed\{([^{}]+)\}/);
      if (boxedMatch) {
        detectedFinalResult = formatLatexToStandardMath(boxedMatch[1]);
      }

      const stripped = bLine.replace(/^[*\-•]\s*/, '').trim();
      if (!stripped) return;

      const formatted = formatLatexToStandardMath(stripped);
      const classification = classifyLine(formatted);

      if (classification.kind === 'result' && !detectedFinalResult) {
        detectedFinalResult = formatted.replace(/^(?:final answer:?|result:?|therefore,?\s*|hence,?\s*)/i, '').trim();
      }

      lines.push({
        id: `s${steps.length + 1}-l${lIdx + 1}`,
        raw: bLine,
        formatted,
        kind: classification.kind,
        annotation: classification.annotation,
        isBoxed: classification.isBoxed || !!boxedMatch
      });
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: cleanTitle,
      summary: lines.find(l => l.kind === 'explanation')?.formatted || 'Follow the step-by-step mathematical working below.',
      lines,
      finalResult: detectedFinalResult
    });
  });

  // Fallback if no steps were recognized
  if (steps.length === 0) {
    const allLines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const formattedLines = allLines.map((l, idx) => {
      const formatted = formatLatexToStandardMath(l.replace(/^[*\-•]\s*/, ''));
      const classification = classifyLine(formatted);
      return {
        id: `fb-l${idx}`,
        raw: l,
        formatted,
        kind: classification.kind,
        annotation: classification.annotation,
        isBoxed: classification.isBoxed
      };
    });

    steps.push({
      stepNumber: 1,
      title: 'Step 1: Standard Step-by-Step Derivation & Solution',
      summary: 'Complete mathematical solution formatted in standard engineering notation.',
      lines: formattedLines,
      finalResult: formattedLines.find(l => l.kind === 'result')?.formatted
    });
  }

  return steps;
}
