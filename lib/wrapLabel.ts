// Pure label-wrapping helper for radar axis labels. Kept free of React/recharts
// imports so it can be unit-tested in the node vitest environment.
//
// Multi-word dimension labels (e.g. "Technology Infrastructure") are wrapped one
// word per line so they don't overflow and clip on narrow viewports. A lone "&"
// token is glued to the following word so labels like "Talent & Skills" render
// as "Talent" / "& Skills" instead of dropping a dangling "&" on its own line.
export function wrapDimensionLabel(value: string): string[] {
  const words = (value ?? "").split(" ").filter(Boolean);
  const lines: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word === "&" && i + 1 < words.length) {
      lines.push(`& ${words[i + 1]}`);
      i++;
    } else {
      lines.push(word);
    }
  }

  return lines;
}
