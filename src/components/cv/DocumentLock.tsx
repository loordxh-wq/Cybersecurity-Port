/**
 * The CV as a sealed document: a graphite sheet with redacted lines, a folded
 * corner, registration ticks and a lock seal. A slow scan passes over the sheet.
 * Decorative SVG; the section's text carries the meaning.
 */
export function DocumentLock() {
  const rows = [
    [60, 150],
    [60, 196],
    [60, 120],
    [60, 176],
    [60, 98],
    [60, 160],
    [60, 132],
  ] as const;
  return (
    <div aria-hidden="true" className="cv-doc">
      <svg viewBox="0 0 320 380" className="cv-doc-svg">
        <defs>
          <linearGradient id="cvSheet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#101a2e" />
            <stop offset="1" stopColor="#070b14" />
          </linearGradient>
          <linearGradient id="cvChrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#c9d3e1" />
            <stop offset="1" stopColor="#8f9db2" />
          </linearGradient>
          <radialGradient id="cvSealGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#2f6bff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cvScan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#42d5f6" stopOpacity="0" />
            <stop offset="0.85" stopColor="#42d5f6" stopOpacity="0.16" />
            <stop offset="0.9" stopColor="#a5f0ff" stopOpacity="0.55" />
            <stop offset="0.93" stopColor="#42d5f6" stopOpacity="0" />
          </linearGradient>
          <clipPath id="cvSheetClip">
            <path d="M44 34h188l44 44v268H44Z" />
          </clipPath>
        </defs>

        {/* Stacked sheet behind */}
        <path d="M58 22h186l40 40v270" fill="none" stroke="rgb(148 180 220 / 0.18)" />
        {/* Front sheet with folded corner */}
        <path d="M44 34h188l44 44v268H44Z" fill="url(#cvSheet)" stroke="rgb(148 180 220 / 0.34)" />
        <path d="M232 34v44h44" fill="rgb(148 180 220 / 0.06)" stroke="rgb(148 180 220 / 0.34)" />

        {/* Header: monogram and redacted identity line */}
        <text x="60" y="78" className="cv-doc-mono">CV</text>
        <rect x="60" y="92" width="112" height="7" rx="3.5" fill="rgb(201 211 225 / 0.32)" />
        <rect x="60" y="106" width="74" height="5" rx="2.5" fill="rgb(127 220 255 / 0.35)" />
        <path d="M60 128h200" stroke="rgb(148 180 220 / 0.18)" />

        {/* Redacted body */}
        <g clipPath="url(#cvSheetClip)">
          {rows.map(([x, w], i) => (
            <rect key={i} x={x} y={146 + i * 22} width={w} height="7" rx="3.5" fill="rgb(201 211 225 / 0.13)" />
          ))}
          <rect className="cv-doc-scan" x="44" y="34" width="232" height="46" fill="url(#cvScan)" />
        </g>

        {/* Lock seal */}
        <circle cx="160" cy="240" r="78" fill="url(#cvSealGlow)" />
        <circle cx="160" cy="240" r="44" fill="#05080f" stroke="rgb(127 220 255 / 0.6)" />
        <circle className="cv-doc-ring" cx="160" cy="240" r="54" fill="none" stroke="rgb(127 220 255 / 0.45)" strokeDasharray="2 6" />
        <path d="M148 236v-9a12 12 0 0 1 24 0v9" fill="none" stroke="url(#cvChrome)" strokeWidth="3.2" strokeLinecap="round" />
        <rect x="141" y="235" width="38" height="28" rx="4" fill="url(#cvChrome)" />
        <circle cx="160" cy="246" r="3.4" fill="#05080f" />
        <path d="M160 248v6" stroke="#05080f" strokeWidth="2.4" strokeLinecap="round" />

        {/* Registration ticks */}
        <g stroke="rgb(127 220 255 / 0.7)">
          <path d="M28 18h14M28 18v14" />
          <path d="M292 18h-14M292 18v14" />
          <path d="M28 362h14M28 362v-14" />
          <path d="M292 362h-14M292 362v-14" />
        </g>
      </svg>
    </div>
  );
}
