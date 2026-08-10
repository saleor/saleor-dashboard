import {
  formatPriceInput,
  getCurrencyDecimalPoints,
  getPriceFieldDisplayValue,
  padPriceToDecimalPlaces,
  sanitizeSpreadsheetPrice,
} from "./utils";

describe("getCurrencyDecimalPoints", () => {
  it("returns 2 for USD", () => {
    expect(getCurrencyDecimalPoints("USD")).toBe(2);
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

    it("preserves trailing decimal point while typing", () => {
      expect(formatPriceInput("10.", 2)).toBe("10.");
    });

    it("adds leading zero for decimal-only values", () => {
      expect(formatPriceInput(".5", 2)).toBe("0.5");
      expect(formatPriceInput(",5", 2)).toBe("0.5");
    });
  });

  describe("paste (mixed separators) - smart detection", () => {
    it("handles pasted European format", () => {
      expect(formatPriceInput("1.234,56", 2)).toBe("1234.56");
    });

    it("handles pasted US format", () => {
      expect(formatPriceInput("1,234.56", 2)).toBe("1234.56");
    });
  });

  describe("comma-only thousands detection", () => {
    it("recognizes comma as thousand separator when all groups are exactly 3 digits", () => {
      expect(formatPriceInput("1,000", 2)).toBe("1000");
      expect(formatPriceInput("1,000,000", 2)).toBe("1000000");
    });

    it("still treats single comma as decimal when group after is not 3 digits", () => {
      expect(formatPriceInput("10,50", 2)).toBe("10.50");
    });
  });

  describe("apostrophe as thousand separator", () => {
    it("strips apostrophes and parses with dot decimal", () => {
      expect(formatPriceInput("1'222.33", 2)).toBe("1222.33");
      expect(formatPriceInput("1'234'567.89", 2)).toBe("1234567.89");
    });
  });
});

describe("padPriceToDecimalPlaces", () => {
  it("pads to currency decimal places", () => {
    expect(padPriceToDecimalPlaces("10.2", 2)).toBe("10.20");
    expect(padPriceToDecimalPlaces("6", 2)).toBe("6.00");
    expect(padPriceToDecimalPlaces("10.", 2)).toBe("10.00");
  });

  it("leaves empty values unchanged", () => {
    expect(padPriceToDecimalPlaces("", 2)).toBe("");
    expect(padPriceToDecimalPlaces("   ", 2)).toBe("");
  });

  it("truncates to zero decimals for currencies like JPY", () => {
    expect(padPriceToDecimalPlaces("1000.9", 0)).toBe("1000");
  });
});

describe("getPriceFieldDisplayValue", () => {
  it("pads API values for display when not focused", () => {
    // Arrange
    // Act
    const displayValue = getPriceFieldDisplayValue("2.2", 2);

    // Assert
    expect(displayValue).toBe("2.20");
  });

  it("shows raw value while focused so partial input stays editable", () => {
    // Arrange
    // Act
    const displayValue = getPriceFieldDisplayValue("2.", 2, { isFocused: true });

    // Assert
    expect(displayValue).toBe("2.");
  });

  it("skips padding when disabled", () => {
    // Arrange
    // Act
    const displayValue = getPriceFieldDisplayValue("2.2", 2, { padDecimals: false });

    // Assert
    expect(displayValue).toBe("2.2");
  });
});

describe("sanitizeSpreadsheetPrice", () => {
  it("normalizes currency-formatted decimals", () => {
    expect(sanitizeSpreadsheetPrice("€1,234.56", "EUR")).toBe("1234.56");
    expect(sanitizeSpreadsheetPrice("12,50", "EUR")).toBe("12.50");
    expect(sanitizeSpreadsheetPrice("", "EUR")).toBe("");
  });

  it("rejects invalid decimals", () => {
    expect(sanitizeSpreadsheetPrice("not-a-number", "USD")).toBeNull();
    expect(sanitizeSpreadsheetPrice("-5", "USD")).toBeNull();
  });
});
