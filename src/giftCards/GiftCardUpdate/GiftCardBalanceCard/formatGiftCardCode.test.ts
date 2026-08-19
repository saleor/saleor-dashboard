import {
  formatGiftCardCodeDisplay,
  maskGiftCardCode,
  stripGiftCardCodeSeparators,
} from "./formatGiftCardCode";

describe("stripGiftCardCodeSeparators", () => {
  it("removes hyphens", () => {
    // Arrange / Act / Assert
    expect(stripGiftCardCodeSeparators("ABCD-EFGH-IJKL")).toBe("ABCDEFGHIJKL");
  });
});

describe("formatGiftCardCodeDisplay", () => {
  it("leaves Saleor-generated hyphenated codes unchanged", () => {
    // Arrange / Act / Assert
    expect(formatGiftCardCodeDisplay("ABCD-EFGH-IJKL")).toBe("ABCD-EFGH-IJKL");
  });

  it("groups raw characters in fours", () => {
    // Arrange / Act / Assert
    expect(formatGiftCardCodeDisplay("ABCDEFGHIJKL")).toBe("ABCD-EFGH-IJKL");
  });
});

describe("maskGiftCardCode", () => {
  it("masks a generated 4-4-4 code without breaking groups", () => {
    // Arrange / Act
    const result = maskGiftCardCode("IJKL", "ABCD-EFGH-IJKL");

    // Assert
    expect(result).toBe("••••-••••-IJKL");
  });

  it("masks a raw code by grouping in fours", () => {
    // Arrange / Act
    const result = maskGiftCardCode("IJKL", "ABCDEFGHIJKL");

    // Assert
    expect(result).toBe("••••-••••-IJKL");
  });

  it("defaults to 4-4-4 when full code is unknown", () => {
    // Arrange / Act
    const result = maskGiftCardCode("AB12");

    // Assert
    expect(result).toBe("••••-••••-AB12");
  });
});
