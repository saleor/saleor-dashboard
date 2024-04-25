import { Locale } from "@dashboard/components/Locale";

import { parseCurrency } from "./utils";

describe("parseCurrency", () => {
  it("rounds down to 3 decimals in 3 digit currency - EN locale (dot)", () => {
    // Arrange
    const value = "5.6777";
    const currency = "BHD";
    const locale = Locale.EN;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(5.677);
  });
  it("rounds down to 0 decimals in 0 digit currency - PL locale (comma)", () => {
    // Arrange
    const value = "12,90679";
    const currency = "JPY";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(12);
  });
  it("rounds down to 2 decimals in 2 digit currency - EN locale (dot)", () => {
    // Arrange
    const value = "244.98721";
    const currency = "PLN";
    const locale = Locale.EN;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(244.98);
  });
  it("rounds down to 3 decimals in 3 digit currency - PL locale (comma)", () => {
    // Arrange
    const value = "0,27386";
    const currency = "TND";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(0.273);
  });
  it("rounds down correctly (floating point difficult case)", () => {
    // Arrange
    const value = "2.07";
    const currency = "EUR";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(2.07);
  });
  it("should not trim price without decimal", () => {
    // Arrange
    const value = "2123";
    const currency = "EUR";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(2123);
  });
});
