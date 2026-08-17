const normalizeIntegerToken = (value: string): string => {
  const cleaned = value
    .trim()
    .replace(/[\s\u00A0]/g, "")
    .replace(/[^\d.,-]/g, "");

  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === ",") {
    return "";
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > lastDot) {
    const integerPart = cleaned.slice(0, lastComma).replace(/[.,]/g, "");
    const decimalPart = cleaned.slice(lastComma + 1).replace(/[.,]/g, "");

    return decimalPart === "" ? integerPart : `${integerPart}.${decimalPart}`;
  }

  if (lastDot > lastComma) {
    const integerPart = cleaned.slice(0, lastDot).replace(/[.,]/g, "");
    const decimalPart = cleaned.slice(lastDot + 1).replace(/[.,]/g, "");

    return decimalPart === "" ? integerPart : `${integerPart}.${decimalPart}`;
  }

  return cleaned.replace(/,/g, "");
};

/** Normalizes spreadsheet cells to non-negative integer strings for stock quantities. */
export const sanitizeSpreadsheetInteger = (value: string): string | null => {
  const normalized = normalizeIntegerToken(value);

  if (normalized === "") {
    return "";
  }

  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return String(Math.trunc(parsed));
};
