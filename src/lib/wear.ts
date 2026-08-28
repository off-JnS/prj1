/**
 * Per-load variation for the newsprint wear field.
 *
 * The foxing spots and fold crease are authored once in CSS (free to render);
 * this nudges the whole field by a random offset, rotation and scale so no
 * two visits print identically. One write to the root element, no React state,
 * no re-render — the CSS reads the values through `var()`.
 */
export function randomiseWear() {
  if (typeof document === "undefined") return;

  const between = (min: number, max: number) => min + Math.random() * (max - min);
  const root = document.documentElement;

  root.style.setProperty("--wear-x", `${between(-9, 9).toFixed(2)}%`);
  root.style.setProperty("--wear-y", `${between(-9, 9).toFixed(2)}%`);
  root.style.setProperty("--wear-rot", `${between(-4, 4).toFixed(2)}deg`);
  root.style.setProperty("--wear-scale", between(0.92, 1.18).toFixed(3));
}
