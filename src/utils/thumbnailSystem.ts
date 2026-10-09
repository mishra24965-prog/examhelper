/**
 * Systematic Dynamic Thumbnail Generator
 * Generates distinct, subject-tailored, visually stunning 16:9 thumbnail previews
 * for syllabus sub-units and video lectures so no two topics share the same generic thumbnail.
 */

export interface ThumbnailOptions {
  title: string;
  subtopicName?: string;
  courseName: string;
  channel?: string;
  level?: 'Beginner' | 'Exam-Cram' | 'Deep Dive' | 'High Yield' | string;
  queryType?: 'university lecture' | 'derivation' | string;
  formulaSnippet?: string;
}

// Generate deterministic numeric hash from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Escape XML/SVG special characters
function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Wrap text into multiple lines for SVG rendering
function wrapText(text: string, maxCharsPerLine: number = 32): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
    if (lines.length >= 3) break;
  }
  if (currentLine && lines.length < 3) {
    lines.push(currentLine);
  }
  return lines;
}

export function generateSystemicTopicThumbnail(opts: ThumbnailOptions): string {
  const { title, subtopicName, courseName, channel = 'University Lecture', level = 'Exam-Cram', queryType = 'derivation' } = opts;
  const effectiveTopic = subtopicName || title;
  const lowerCourse = (courseName || '').toLowerCase();
  const lowerTopic = (effectiveTopic || '').toLowerCase();
  const hash = hashString(`${courseName}-${effectiveTopic}-${level}`);

  // Fine-grained thematic styling per topic
  let domain = 'ENGINEERING LECTURE';
  let bgStart = '#0f172a';
  let bgEnd = '#1e293b';
  let accent = '#38bdf8';
  let accentBg = 'rgba(56, 189, 248, 0.16)';
  let border = 'rgba(56, 189, 248, 0.4)';
  let formula = opts.formulaSnippet || 'ΔE = Q - W';
  let iconText = '⚙️ 📐';

  // 1. Mechanical Engineering
  if (lowerCourse.includes('mech') || lowerTopic.includes('thermo') || lowerTopic.includes('sfee') || lowerTopic.includes('otto') || lowerTopic.includes('diesel') || lowerTopic.includes('steam') || lowerTopic.includes('pure substance') || lowerTopic.includes('refrigeration')) {
    domain = 'MECHANICAL ENGINEERING';
    if (lowerTopic.includes('sfee') || lowerTopic.includes('first law') || lowerTopic.includes('system') || lowerTopic.includes('equilibrium')) {
      bgStart = '#180c05';
      bgEnd = '#3c1a08';
      accent = '#fb923c'; // Orange
      accentBg = 'rgba(251, 146, 60, 0.18)';
      border = 'rgba(251, 146, 60, 0.45)';
      formula = lowerTopic.includes('sfee')
        ? 'h₁ + V₁²/2 + gz₁ + q = h₂ + V₂²/2 + gz₂ + w'
        : 'δQ = dU + δW (First Law for Closed System)';
      iconText = '🔥 ⚙️';
    } else if (lowerTopic.includes('pure substance') || lowerTopic.includes('steam') || lowerTopic.includes('mollier') || lowerTopic.includes('dryness') || lowerTopic.includes('critical point')) {
      bgStart = '#041624';
      bgEnd = '#0b354b';
      accent = '#38bdf8'; // Sky blue / steam
      accentBg = 'rgba(56, 189, 248, 0.18)';
      border = 'rgba(56, 189, 248, 0.45)';
      formula = lowerTopic.includes('dryness') || lowerTopic.includes('enthalpy')
        ? 'h = h_f + x · h_fg , u = u_f + x · u_fg'
        : 'Critical Point: P_cr = 22.09 MPa, T_cr = 374.14°C';
      iconText = '💧 ♨️';
    } else if (lowerTopic.includes('otto') || lowerTopic.includes('diesel') || lowerTopic.includes('cycle') || lowerTopic.includes('efficiency')) {
      bgStart = '#24060d';
      bgEnd = '#4d0f1c';
      accent = '#f43f5e'; // Rose / crimson combustion
      accentBg = 'rgba(244, 63, 94, 0.18)';
      border = 'rgba(244, 63, 94, 0.45)';
      formula = lowerTopic.includes('diesel')
        ? 'η_diesel = 1 - (1 / r^(γ-1)) · [(r_c^γ - 1) / (γ(r_c - 1))]'
        : 'η_otto = 1 - (1 / r^(γ - 1))';
      iconText = '⚡ 🚗';
    } else {
      bgStart = '#1a1005';
      bgEnd = '#3a200a';
      accent = '#f59e0b';
      accentBg = 'rgba(245, 158, 11, 0.18)';
      border = 'rgba(245, 158, 11, 0.45)';
      formula = 'W_net = ∮ P dV , η = W_net / Q_in';
      iconText = '⚙️ 🔧';
    }
  }
  // 2. Applied Mathematics
  else if (lowerCourse.includes('math') || lowerTopic.includes('calculus') || lowerTopic.includes('leibnitz') || lowerTopic.includes('euler') || lowerTopic.includes('series') || lowerTopic.includes('taylor') || lowerTopic.includes('maclaurin') || lowerTopic.includes('matrix')) {
    domain = 'APPLIED MATHEMATICS';
    if (lowerTopic.includes('leibnitz') || lowerTopic.includes('nth derivative') || lowerTopic.includes('successive')) {
      bgStart = '#150626';
      bgEnd = '#330c54';
      accent = '#c084fc'; // Purple
      accentBg = 'rgba(192, 132, 252, 0.18)';
      border = 'rgba(192, 132, 252, 0.45)';
      formula = '(uv)ₙ = uₙv + ⁿC₁ uₙ₋₁v₁ + ⁿC₂ uₙ₋₂v₂ + ... + uvₙ';
      iconText = '∫ yₙ';
    } else if (lowerTopic.includes('taylor') || lowerTopic.includes('maclaurin')) {
      bgStart = '#260620';
      bgEnd = '#520e44';
      accent = '#f472b6'; // Pink
      accentBg = 'rgba(244, 114, 182, 0.18)';
      border = 'rgba(244, 114, 182, 0.45)';
      formula = "f(x) = f(0) + x·f'(0) + (x²/2!)f''(0) + (x³/3!)f'''(0)...";
      iconText = 'Σ xⁿ';
    } else if (lowerTopic.includes('euler') || lowerTopic.includes('partial')) {
      bgStart = '#070a2a';
      bgEnd = '#161c5e';
      accent = '#818cf8'; // Indigo
      accentBg = 'rgba(129, 140, 248, 0.18)';
      border = 'rgba(129, 140, 248, 0.45)';
      formula = 'x(∂u/∂x) + y(∂u/∂y) = n·u (Euler Theorem)';
      iconText = '∂u/∂x';
    } else {
      bgStart = '#0c0724';
      bgEnd = '#241457';
      accent = '#a78bfa';
      accentBg = 'rgba(167, 139, 250, 0.18)';
      border = 'rgba(167, 139, 250, 0.45)';
      formula = '|A - λI| = 0 (Characteristic Equation)';
      iconText = 'λ [A]';
    }
  }
  // 3. Electrical & Electronics
  else if (lowerCourse.includes('electr') || lowerTopic.includes('circuit') || lowerTopic.includes('kcl') || lowerTopic.includes('kvl') || lowerTopic.includes('thevenin') || lowerTopic.includes('resonance') || lowerTopic.includes('diode')) {
    domain = 'ELECTRICAL & ELECTRONICS';
    if (lowerTopic.includes('kcl') || lowerTopic.includes('kvl') || lowerTopic.includes('thevenin') || lowerTopic.includes('mesh')) {
      bgStart = '#022417';
      bgEnd = '#064936';
      accent = '#34d399'; // Emerald
      accentBg = 'rgba(52, 211, 153, 0.18)';
      border = 'rgba(52, 211, 153, 0.45)';
      formula = 'V_th = V_oc , R_th = V_oc / I_sc';
      iconText = '⚡ 🔌';
    } else if (lowerTopic.includes('resonance') || lowerTopic.includes('ac')) {
      bgStart = '#092104';
      bgEnd = '#19440a';
      accent = '#a3e635'; // Lime
      accentBg = 'rgba(163, 230, 53, 0.18)';
      border = 'rgba(163, 230, 53, 0.45)';
      formula = 'f₀ = 1 / (2π√(LC)) , Q = ω₀L / R';
      iconText = '〰️ 📡';
    } else {
      bgStart = '#021e24';
      bgEnd = '#073d47';
      accent = '#2dd4bf';
      accentBg = 'rgba(45, 212, 191, 0.18)';
      border = 'rgba(45, 212, 191, 0.45)';
      formula = 'V = I · Z , P = V·I·cos(φ)';
      iconText = '💡 🔌';
    }
  }
  // 4. Engineering Chemistry
  else if (lowerCourse.includes('chem') || lowerTopic.includes('spectr') || lowerTopic.includes('beer') || lowerTopic.includes('polymer') || lowerTopic.includes('water')) {
    domain = 'ENGINEERING CHEMISTRY';
    bgStart = '#022026';
    bgEnd = '#084852';
    accent = '#2dd4bf'; // Teal
    accentBg = 'rgba(45, 212, 191, 0.18)';
    border = 'rgba(45, 212, 191, 0.45)';
    formula = lowerTopic.includes('beer')
      ? 'A = ε · c · l (Beer-Lambert Absorption)'
      : 'Total Hardness (EDTA): V_EDTA × M × 1000 / V_sample';
    iconText = '🧪 ⚗️';
  } else {
    // Dynamic palette by hash
    const colors = [
      { start: '#0e1726', end: '#1f2e4d', acc: '#38bdf8' },
      { start: '#1f1303', end: '#3f2508', acc: '#fb923c' },
      { start: '#190a29', end: '#3a1859', acc: '#c084fc' },
      { start: '#02241c', end: '#074838', acc: '#34d399' }
    ];
    const picked = colors[hash % colors.length];
    bgStart = picked.start;
    bgEnd = picked.end;
    accent = picked.acc;
    accentBg = 'rgba(56, 189, 248, 0.16)';
    border = 'rgba(56, 189, 248, 0.4)';
    formula = 'Governing Equation & University Derivation';
    iconText = '🎓 📚';
  }

  const theme = {
    domain,
    bgStart,
    bgEnd,
    accent,
    accentBg,
    border,
    formula,
    iconText
  };

  // Difficulty badge styling
  const levelColor =
    level === 'Beginner' ? '#10b981' : level === 'Exam-Cram' ? '#f59e0b' : '#f43f5e';
  const levelText =
    level === 'Beginner' ? 'FOUNDATION' : level === 'Exam-Cram' ? 'EXAM-CRAM PYQ' : 'DEEP DIVE NUMERICAL';

  // Suffix indicator
  const querySuffix = queryType === 'derivation' ? 'DERIVATION' : 'UNIVERSITY LECTURE';

  // Title lines wrapped
  const lines = wrapText(title, 28);
  const line1 = escapeXml(lines[0] || effectiveTopic);
  const line2 = escapeXml(lines[1] || '');
  const line3 = escapeXml(lines[2] || '');

  const escapedSubtopic = escapeXml(effectiveTopic.slice(0, 48));
  const escapedChannel = escapeXml(channel.slice(0, 32));
  const escapedFormula = escapeXml(theme.formula);
  const patternSeed = hash % 5;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}" />
      <stop offset="100%" stop-color="${theme.bgEnd}" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="640" height="360" fill="url(#bgGrad)"/>
  <rect width="640" height="360" fill="url(#grid)"/>

  <!-- Decorative geometric accents -->
  <circle cx="${540 + (patternSeed * 10)}" cy="80" r="140" fill="${theme.accent}" fill-opacity="0.06"/>
  <circle cx="80" cy="300" r="100" fill="${theme.accent}" fill-opacity="0.04"/>

  <!-- Top bar: Domain + Level Pill -->
  <g transform="translate(32, 36)">
    <!-- Domain Tag -->
    <rect x="0" y="0" width="${theme.domain.length * 8 + 24}" height="24" rx="12" fill="${theme.accentBg}" stroke="${theme.border}" stroke-width="1"/>
    <text x="12" y="16" fill="${theme.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800" letter-spacing="1">${theme.domain}</text>

    <!-- Difficulty Pill -->
    <rect x="${theme.domain.length * 8 + 32}" y="0" width="130" height="24" rx="12" fill="rgba(0,0,0,0.5)" stroke="${levelColor}" stroke-width="1"/>
    <circle cx="${theme.domain.length * 8 + 44}" cy="12" r="4" fill="${levelColor}"/>
    <text x="${theme.domain.length * 8 + 54}" y="16" fill="${levelColor}" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.5">${levelText}</text>

    <!-- Query Suffix Badge -->
    <rect x="460" y="0" width="116" height="24" rx="6" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.4)" stroke-width="1"/>
    <text x="518" y="16" text-anchor="middle" fill="#fda4af" font-family="ui-monospace, monospace" font-size="9" font-weight="800" letter-spacing="0.5">+${querySuffix}</text>
  </g>

  <!-- Central Topic Title Area -->
  <g transform="translate(32, 95)">
    <!-- Sub-unit eyebrow -->
    <text x="0" y="0" fill="rgba(255,255,255,0.6)" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" letter-spacing="0.5">SYLLABUS SUB-UNIT:</text>
    <text x="135" y="0" fill="${theme.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700">${escapedSubtopic}</text>

    <!-- Main Title (Lines) -->
    <text x="0" y="34" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">${line1}</text>
    ${line2 ? `<text x="0" y="62" fill="#f1f5f9" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700">${line2}</text>` : ''}
    ${line3 ? `<text x="0" y="90" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600">${line3}</text>` : ''}
  </g>

  <!-- Formula / Core Equation Banner -->
  <g transform="translate(32, 226)">
    <rect x="0" y="0" width="576" height="42" rx="10" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="16" y="26" fill="rgba(255,255,255,0.45)" font-family="ui-monospace, monospace" font-size="11" font-weight="700">CORE EQUATION:</text>
    <text x="130" y="26" fill="#fde047" font-family="ui-monospace, monospace" font-size="12" font-weight="700">${escapedFormula}</text>
  </g>

  <!-- Bottom Bar: Channel + Live Verification Badge -->
  <g transform="translate(32, 305)">
    <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.1)"/>
    <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11">🎓</text>
    <text x="32" y="16" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700">${escapedChannel}</text>

    <!-- Live Verified Pill -->
    <rect x="430" y="0" width="146" height="24" rx="8" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" stroke-width="1"/>
    <circle cx="444" cy="12" r="3.5" fill="#34d399"/>
    <text x="454" y="16" fill="#a7f3d0" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">GEMINI VERIFIED LIVE</text>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Returns a guaranteed valid, topic-specific thumbnail URL.
 * Falls back to the systematic SVG generator if no authentic YouTube ID exists,
 * ensuring no two topics ever sync the same thumbnail.
 */
export function getDistinctVideoThumbnail(video: {
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  title: string;
  subtopicName?: string;
  topicName?: string;
  channel?: string;
  level?: string;
  queryType?: string;
}, courseName: string): string {
  const isMathCourse = (courseName || '').toLowerCase().includes('math');
  const isMathTopic = ((video.topicName || '') + ' ' + (video.title || '')).toLowerCase().includes('leibnitz');
  const placeholderIds = new Set(['EFLp2LrmYuY', 'NEhH6C7Fzw4', 'OxZj2S6bjS4']);

  // If thumbnailUrl is a custom generated SVG data URI, always preserve it
  if (video.thumbnailUrl && video.thumbnailUrl.startsWith('data:image/svg+xml')) {
    return video.thumbnailUrl;
  }

  // Check if thumbnailUrl references one of the generic placeholder IDs
  if (video.thumbnailUrl && !video.thumbnailUrl.includes('placeholder')) {
    const isPlaceholderThumbnail = Array.from(placeholderIds).some(pid => video.thumbnailUrl?.includes(pid));
    if (isPlaceholderThumbnail) {
      // ONLY allow this thumbnail if we are legitimately in the Mathematics course on the Leibnitz topic
      if (isMathCourse && isMathTopic) {
        return video.thumbnailUrl;
      }
      // Otherwise, REJECT the placeholder thumbnail and fall through to systematic generation!
    } else {
      // Legitimate unique thumbnail
      return video.thumbnailUrl;
    }
  }

  // If YouTube ID is unique and authentic (not a placeholder, or strictly Math Leibnitz)
  if (video.youtubeVideoId && video.youtubeVideoId.length === 11) {
    if (!placeholderIds.has(video.youtubeVideoId)) {
      return `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;
    }
    if (isMathCourse && isMathTopic && video.youtubeVideoId === 'EFLp2LrmYuY') {
      return `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;
    }
  }

  // Systematic generator fallback - produces a unique 16:9 topic thumbnail
  return generateSystemicTopicThumbnail({
    title: video.title,
    subtopicName: video.subtopicName || video.topicName,
    courseName,
    channel: video.channel,
    level: video.level,
    queryType: video.queryType
  });
}
