/**
 * Split clipboard text into candidate attribute values.
 * Commas, semicolons, tabs, and newlines count as separators — not spaces,
 * so "United States" stays one value.
 */
export const parsePastedAttributeValues = (text: string): string[] => {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parts = normalized
    .split(/[,;\n\t]+/)
    .map(part => part.trim())
    .filter(part => part.length > 0);

  const seen = new Set<string>();
  const unique: string[] = [];

  parts.forEach(part => {
    if (seen.has(part)) {
      return;
    }

    seen.add(part);
    unique.push(part);
  });

  return unique;
};
