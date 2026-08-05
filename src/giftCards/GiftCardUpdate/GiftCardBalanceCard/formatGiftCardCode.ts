/** Strip separators so we can reason about the raw code payload. */
export const stripGiftCardCodeSeparators = (code: string): string => code.replace(/-/g, "");

/**
 * Display grouping for gift card codes.
 * Saleor auto-generates 12 hex chars as `ABCD-EFGH-IJKL` (see `generate_random_code`).
 * Custom codes may be 8–16 chars without hyphens — we still group in fours for readability.
 * If the value already contains hyphens, return it unchanged.
 */
export const formatGiftCardCodeDisplay = (code: string): string => {
  if (code.includes("-")) {
    return code;
  }

  return code.replace(/(.{4})(?=.)/g, "$1-");
};

/** Mask all but the last four payload characters, preserving Saleor's hyphen grouping. */
export const maskGiftCardCode = (last4CodeChars: string, code?: string | null): string => {
  const last4 = last4CodeChars.slice(-4);

  if (code) {
    const raw = stripGiftCardCodeSeparators(code);
    const maskedRaw = `${"•".repeat(Math.max(raw.length - last4.length, 0))}${last4}`;

    // Prefer the original hyphen pattern when present (e.g. ABCD-EFGH-IJKL → ••••-••••-IJKL).
    if (code.includes("-")) {
      let rawIndex = 0;

      return code
        .split("")
        .map(char => {
          if (char === "-") {
            return "-";
          }

          const next = maskedRaw[rawIndex] ?? "•";

          rawIndex += 1;

          return next;
        })
        .join("");
    }

    return formatGiftCardCodeDisplay(maskedRaw);
  }

  // Fallback when full code is unavailable — assume generated 12-char / 4-4-4 shape.
  return formatGiftCardCodeDisplay(`${"•".repeat(8)}${last4}`);
};
