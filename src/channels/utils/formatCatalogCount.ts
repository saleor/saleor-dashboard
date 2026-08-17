/** Locale-aware counts for catalog status labels; compact notation from 10k upward. */
export const formatCatalogCount = (count: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: count >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: count >= 10_000 ? 1 : 0,
  }).format(count);
