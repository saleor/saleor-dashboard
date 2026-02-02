import { formatPercentInput, formatPriceInput, getCurrencyDecimalPoints } from "./utils";

describe("formatPercentInput", () => {
  it("filters non-numeric characters", () => {
    expect(formatPercentInput("abc23.5def")).toBe("23.5");
    expect(formatPercentInput("%8.5")).toBe("8.5");
  });

  it("normalizes comma to dot", () => {
    expect(formatPercentInput("8,5")).toBe("8.5");
  });

  it("limits to 3 decimal places by default", () => {
    expect(formatPercentInput("8.12345")).toBe("8.123");
  });

  it("accepts custom decimal places", () => {
    expect(formatPercentInput("8.12345", 2)).toBe("8.12");
  });

  it("handles integers", () => {
    expect(formatPercentInput("23")).toBe("23");
  });

  it("handles empty string", () => {
    expect(formatPercentInput("")).toBe("");
  });

  it("preserves trailing decimal while typing", () => {
    expect(formatPercentInput("23.")).toBe("23.");
  });

  it("handles multiple separators as typing accidents (first wins)", () => {
    expect(formatPercentInput("8.5.3")).toBe("8.53");
    expect(formatPercentInput("8,5,3")).toBe("8.53");
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

describe("formatPriceInput", () => {
  describe("basic input", () => {
    it("filters non-numeric characters", () => {
      expect(formatPriceInput("abc123.45def", 2)).toBe("123.45");
      expect(formatPriceInput("$100.00", 2)).toBe("100.00");
    });

    it("normalizes comma to dot", () => {
      expect(formatPriceInput("10,50", 2)).toBe("10.50");
    });

    it("limits decimal places", () => {
      expect(formatPriceInput("10.12345", 2)).toBe("10.12");
      expect(formatPriceInput("10,12345", 2)).toBe("10.12");
    });

    it("handles integers without decimal", () => {
      expect(formatPriceInput("100", 2)).toBe("100");
    });

    it("handles empty string", () => {
      expect(formatPriceInput("", 2)).toBe("");
    });

    it("preserves trailing decimal point while typing", () => {
      expect(formatPriceInput("10.", 2)).toBe("10.");
    });

    it("adds leading zero for decimal-only values", () => {
      expect(formatPriceInput(".5", 2)).toBe("0.5");
      expect(formatPriceInput(",5", 2)).toBe("0.5");
      expect(formatPriceInput(".50", 2)).toBe("0.50");
    });
  });

  describe("currency-specific decimal places", () => {
    it("handles zero decimal places for currencies like JPY", () => {
      expect(formatPriceInput("1000.99", 0)).toBe("1000");
      expect(formatPriceInput("1000,99", 0)).toBe("1000");
    });

    it("handles three decimal places for currencies like KWD", () => {
      expect(formatPriceInput("10.12345", 3)).toBe("10.123");
    });
  });

  describe("typing (same separator type) - first wins", () => {
    it("handles multiple dots as typing accidents", () => {
      expect(formatPriceInput("10.5.6", 2)).toBe("10.56");
    });

    it("handles consecutive dots", () => {
      expect(formatPriceInput("10..5", 2)).toBe("10.5");
    });

    it("handles trailing dot after decimal", () => {
      expect(formatPriceInput("10.5.", 2)).toBe("10.5");
    });

    it("handles many same separators as typing accidents", () => {
      expect(formatPriceInput("1,2,3,4", 2)).toBe("1.23");
      expect(formatPriceInput("1.2.3.4", 2)).toBe("1.23");
    });

    it("returns empty for just separators (no digits)", () => {
      expect(formatPriceInput(".", 2)).toBe("");
      expect(formatPriceInput(",", 2)).toBe("");
      expect(formatPriceInput("....", 2)).toBe("");
      expect(formatPriceInput(".,.,", 2)).toBe("");
    });
  });

  describe("paste (mixed separators) - smart detection", () => {
    it("handles pasted European format", () => {
      expect(formatPriceInput("1.234,56", 2)).toBe("1234.56");
    });

    it("handles pasted US format", () => {
      expect(formatPriceInput("1,234.56", 2)).toBe("1234.56");
    });

    it("handles large pasted numbers", () => {
      expect(formatPriceInput("1,234,567.89", 2)).toBe("1234567.89");
      expect(formatPriceInput("1.234.567,89", 2)).toBe("1234567.89");
    });

    it("handles mixed separators with smart detection", () => {
      expect(formatPriceInput("1,234.5", 2)).toBe("1234.5");
      expect(formatPriceInput("1.234,5", 2)).toBe("1234.5");
    });
  });

  describe("edge cases", () => {
    it("strips negative sign (prices are positive)", () => {
      expect(formatPriceInput("-10.50", 2)).toBe("10.50");
    });

    it("keeps leading zeros", () => {
      expect(formatPriceInput("007.50", 2)).toBe("007.50");
    });

    it("handles malformed mixed format (multiple of both separators)", () => {
      // "1.222,333.88" has both multiple dots AND a comma - not a clean format
      // Falls back to "first separator wins" (typing mode)
      expect(formatPriceInput("1.222,333.88", 2)).toBe("1.22");
      expect(formatPriceInput("1,222.333,88", 2)).toBe("1.22");
    });

    it("limits integer part to 15 digits (float64 precision)", () => {
      expect(formatPriceInput("123456789012345678", 2)).toBe("123456789012345");
      expect(formatPriceInput("12345678901234567.89", 2)).toBe("123456789012345.89");
    });
  });
});
