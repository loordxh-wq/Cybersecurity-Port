/**
 * A small static drawing of the Cyber Command core: a dotted sphere, one orbit and
 * a node. `seed` rotates the orbit and node so each project gets its own mark.
 * Pure SVG, no animation cost; decorative.
 */
export function LatticeGlyph({ seed = 0, size = 56, className = "" }: { seed?: number; size?: number; className?: string }) {
  const dots: { x: number; y: number; o: number }[] = [];
  const n = 70;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * golden + seed * 0.7;
    const z = Math.sin(phi) * r;
    dots.push({ x: 28 + Math.cos(phi) * r * 17, y: 28 + y * 17, o: 0.25 + 0.75 * ((z + 1) / 2) });
  }
  const tilt = -25 + ((seed * 37) % 50);
  const node = ((seed * 83) % 360) * (Math.PI / 180);
  return (
    <svg aria-hidden="true" viewBox="0 0 56 56" width={size} height={size} className={`cc-glyph ${className}`}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r="0.75" fill="#7fdcff" opacity={d.o.toFixed(2)} />
      ))}
      <g transform={`rotate(${tilt} 28 28)`}>
        <ellipse cx="28" cy="28" rx="25" ry="8" fill="none" stroke="#8b7cff" strokeOpacity="0.7" strokeWidth="0.6" strokeDasharray="2 2.5" />
        <circle cx={(28 + Math.cos(node) * 25).toFixed(2)} cy={(28 + Math.sin(node) * 8).toFixed(2)} r="1.6" fill="#fff" />
      </g>
    </svg>
  );
}
