const PALETTES = [
  ["#E25A3C", "#F5C14B"],
  ["#2D8B8B", "#F0B8A8"],
  ["#6B4A74", "#F5C14B"],
  ["#E25A3C", "#6B4A74"],
  ["#F5C14B", "#2D8B8B"],
  ["#F0B8A8", "#E25A3C"],
  ["#2D8B8B", "#F5C14B"],
  ["#F0B8A8", "#6B4A74"],
];

const DOODLES = ["✷", "✦", "❋", "✱", "✺", "❉", "✧"];

export function placeholderStyle(seed: number) {
  const idx = Math.abs(seed) % PALETTES.length;
  const [from, to] = PALETTES[idx];
  const angle = (seed * 37) % 360;
  return {
    backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
  };
}

export function placeholderDoodle(seed: number) {
  return DOODLES[Math.abs(seed) % DOODLES.length];
}

export function colorCircleFor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const palette = PALETTES[Math.abs(hash) % PALETTES.length];
  return palette[0];
}
