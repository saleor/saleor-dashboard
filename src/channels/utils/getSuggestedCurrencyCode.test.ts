import { getSuggestedCurrencyCode } from "./getSuggestedCurrencyCode";

describe("getSuggestedCurrencyCode", () => {
  it("maps common country codes to currencies", () => {
    // Arrange & Act & Assert
    expect(getSuggestedCurrencyCode("US")).toBe("USD");
    expect(getSuggestedCurrencyCode("DE")).toBe("EUR");
    expect(getSuggestedCurrencyCode("GB")).toBe("GBP");
    expect(getSuggestedCurrencyCode("PL")).toBe("PLN");
    expect(getSuggestedCurrencyCode("jp")).toBe("JPY");
    expect(getSuggestedCurrencyCode("EU")).toBe("EUR");
  });

  it("returns undefined for unknown or empty codes", () => {
    // Arrange & Act & Assert
    expect(getSuggestedCurrencyCode("")).toBeUndefined();
    expect(getSuggestedCurrencyCode("ZZ")).toBeUndefined();
  });
});
