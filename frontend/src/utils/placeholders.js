// src/utils/placeholders.js

function hashString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function streamPlaceholderThumbnail({
  title = "Untitled Stream",
  streamerName = "Unknown",
  category = "Live",
} = {}) {
  const seed = `${title}|${streamerName}|${category}`;
  const h = hashString(seed);

  // Generate a consistent-ish gradient from the seed
  const hue1 = h % 360;
  const hue2 = (hue1 + 55) % 360;
  const sat = clamp(60 + (h % 25), 55, 85);
  const light1 = clamp(42 + (h % 12), 38, 54);
  const light2 = clamp(light1 + 8, 45, 62);

  const safe = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const t = safe(title).slice(0, 42);
  const s = safe(streamerName).slice(0, 28);
  const c = safe(category).slice(0, 22);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="hsl(${hue1} ${sat}% ${light1}%)"/>
        <stop offset="1" stop-color="hsl(${hue2} ${sat}% ${light2}%)"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>

    <rect width="1280" height="720" fill="url(#g)"/>
    <rect x="70" y="70" width="1140" height="580" rx="26" fill="rgba(0,0,0,0.30)" filter="url(#shadow)"/>

    <text x="120" y="230" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="700" fill="#fff">
      ${t}
    </text>

    <text x="120" y="310" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="600" fill="rgba(255,255,255,0.90)">
      ${s}
    </text>

    <text x="120" y="370" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500" fill="rgba(255,255,255,0.80)">
      ${c}
    </text>

    <g transform="translate(980 455)">
      <circle cx="90" cy="90" r="90" fill="rgba(0,0,0,0.35)"/>
      <polygon points="75,55 75,125 135,90" fill="rgba(255,255,255,0.92)"/>
    </g>
  </svg>
  `.trim();

  // Encode as data URL
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

