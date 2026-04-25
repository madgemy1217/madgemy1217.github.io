/**
 * Apply a tint to the document root by setting --tint-h (hue) and --tint-c (chroma)
 * derived from a CSS hex color. Falls back gracefully for non-hex inputs.
 */
export function applySiteTint(hex: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const { h, c } = hexToHueChroma(hex);
  root.style.setProperty("--tint-h", String(h));
  root.style.setProperty("--tint-c", c.toFixed(3));
}

export function clearSiteTint() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.removeProperty("--tint-h");
  root.style.removeProperty("--tint-c");
}

/** Convert hex (#rrggbb) to approximate hue (deg) and chroma (oklch-ish 0..0.15). */
function hexToHueChroma(hex: string): { h: number; c: number } {
  const m = /^#?([a-f\d]{6})$/i.exec(hex);
  if (!m) return { h: 60, c: 0 };
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 0xff) / 255;
  const g = ((int >> 8) & 0xff) / 255;
  const b = (int & 0xff) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  // Saturation-like measure → mapped to chroma so the page tint is visible but tasteful
  const s = max === 0 ? 0 : d / max;
  const c = Math.min(0.12, s * 0.18);
  return { h, c };
}
