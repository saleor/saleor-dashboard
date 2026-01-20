import {
  getCurrencyDecimalPoints,
  limitDecimalPlaces,
  normalizeDecimalSeparator,
  parseDecimalValue,
} from "./utils";

describe("normalizeDecimalSeparator", () => {
  it("converts comma to dot", () => {
    expect(normalizeDecimalSeparator("10,50")).toBe("10.50");
  });

  it("leaves dot unchanged", () => {
    expect(normalizeDecimalSeparator("10.50")).toBe("10.50");
  });

  it("handles integers without separator", () => {
    expect(normalizeDecimalSeparator("100")).toBe("100");
  });

  it("handles empty string", () => {
    expect(normalizeDecimalSeparator("")).toBe("");
  });

  it("handles European format with thousand separator (dot) and decimal comma", () => {
    // 1.234,56 = one thousand two hundred thirty-four and 56 cents
    expect(normalizeDecimalSeparator("1.234,56")).toBe("1234.56");
  });

  it("handles US format with thousand separator (comma) and decimal dot", () => {
    // 1,234.56 = one thousand two hundred thirty-four and 56 cents
    expect(normalizeDecimalSeparator("1,234.56")).toBe("1234.56");
  });

  it("handles large European format numbers", () => {
    expect(normalizeDecimalSeparator("1.234.567,89")).toBe("1234567.89");
  });

  it("handles large US format numbers", () => {
    expect(normalizeDecimalSeparator("1,234,567.89")).toBe("1234567.89");
  });

  it("handles US thousands-only format without decimal", () => {
    // 1,234,567 = one million two hundred thirty-four thousand five hundred sixty-seven
    expect(normalizeDecimalSeparator("1,234,567")).toBe("1234567");
  });

  it("handles European thousands-only format without decimal", () => {
    // 1.234.567 = one million two hundred thirty-four thousand five hundred sixty-seven
    expect(normalizeDecimalSeparator("1.234.567")).toBe("1234567");
  });
});

describe("parseDecimalValue", () => {
  it("parses dot-separated value", () => {
    expect(parseDecimalValue("10.50")).toBe(10.5);
  });

  it("parses comma-separated value", () => {
    expect(parseDecimalValue("10,50")).toBe(10.5);
  });

  it("parses integer", () => {
    expect(parseDecimalValue("100")).toBe(100);
  });

  it("returns 0 for empty string", () => {
    expect(parseDecimalValue("")).toBe(0);
  });

  it("returns 0 for invalid input", () => {
    expect(parseDecimalValue("abc")).toBe(0);
  });

  it("handles negative values", () => {
    expect(parseDecimalValue("-10.50")).toBe(-10.5);
  });
});

describe("limitDecimalPlaces", () => {
  it("limits decimal places with dot separator", () => {
    expect(limitDecimalPlaces("10.12345", 2)).toBe("10.12");
  });

  it("limits decimal places with comma separator", () => {
    expect(limitDecimalPlaces("10,12345", 2)).toBe("10,12");
  });

  it("preserves original separator when limiting", () => {
    expect(limitDecimalPlaces("10,999", 2)).toBe("10,99");
    expect(limitDecimalPlaces("10.999", 2)).toBe("10.99");
  });

  it("returns integer when maxDecimalPlaces is 0", () => {
    expect(limitDecimalPlaces("10.50", 0)).toBe("10");
    expect(limitDecimalPlaces("10,50", 0)).toBe("10");
  });

  it("returns value unchanged if decimal places are within limit", () => {
    expect(limitDecimalPlaces("10.12", 2)).toBe("10.12");
    expect(limitDecimalPlaces("10.1", 2)).toBe("10.1");
  });

  it("returns value unchanged if no decimal part", () => {
    expect(limitDecimalPlaces("100", 2)).toBe("100");
  });

  it("handles three decimal places for currencies like KWD", () => {
    expect(limitDecimalPlaces("10.1234", 3)).toBe("10.123");
  });

  it("handles zero decimal places for currencies like JPY", () => {
    expect(limitDecimalPlaces("1000.99", 0)).toBe("1000");
  });
});

describe("getCurrencyDecimalPoints", () => {
  it("returns 2 for USD", () => {
    expect(getCurrencyDecimalPoints("USD")).toBe(2);
  });

  it("returns 2 for EUR", () => {
    expect(getCurrencyDecimalPoints("EUR")).toBe(2);
  });

  it("returns 0 for JPY (Japanese Yen)", () => {
    expect(getCurrencyDecimalPoints("JPY")).toBe(0);
  });

  it("returns 3 for KWD (Kuwaiti Dinar)", () => {
    expect(getCurrencyDecimalPoints("KWD")).toBe(3);
  });

  it("returns 2 as fallback for undefined currency", () => {
    expect(getCurrencyDecimalPoints(undefined)).toBe(2);
  });

  it("returns 2 as fallback for invalid currency code", () => {
    expect(getCurrencyDecimalPoints("INVALID")).toBe(2);
  });
});
