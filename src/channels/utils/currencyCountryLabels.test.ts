import currencyCodes from "currency-codes";

import { getCurrencyCountriesForSearch, getCurrencySearchLabel } from "./currencyCodeOptions";
import { getCurrencyCountryCode, getCurrencyCountryLabels } from "./currencyCountryLabels";

// currency-codes lists a few entries that aren't countries; they keep their original name.
const notCountries = new Set([
  "European Union",
  "International Monetary Fund (Imf)",
  "Member Countries of the African Development Bank Group",
  'Sistema Unitario De Compensacion Regional De Pagos "Sucre"',
]);

describe("getCurrencyCountryCode", () => {
  it("finds a country code for every country in currency-codes", () => {
    // Arrange
    const countries = new Set(
      currencyCodes.data.flatMap(({ countries }) => getCurrencyCountriesForSearch(countries)),
    );

    // Act
    const unresolved = [...countries].filter(
      country => !notCountries.has(country.trim()) && !getCurrencyCountryCode(country),
    );

    // Assert
    expect(unresolved).toEqual([]);
  });
});

describe("getCurrencyCountryLabels", () => {
  it("names countries in the Dashboard language and keeps non-countries", () => {
    // Arrange
    const countries = [
      "Germany",
      "United States of America (The)",
      "International Monetary Fund (Imf)",
    ];

    // Act
    const labels = getCurrencyCountryLabels(countries, "pt");

    // Assert
    expect(labels).toEqual(["Alemanha", "Estados Unidos", "International Monetary Fund (Imf)"]);
  });

  it("keeps the original names in English", () => {
    // Arrange
    const countries = ["Germany", "United States of America (The)"];

    // Act & Assert
    expect(getCurrencyCountryLabels(countries, "en")).toEqual(countries);
  });
});

describe("getCurrencySearchLabel", () => {
  it("matches both the translated and the English country names", () => {
    // Arrange
    const eur = { code: "EUR", currency: "Euro", countries: ["Germany", "Spain"] };

    // Act
    const label = getCurrencySearchLabel(eur, "€", "pt");

    // Assert
    expect(label).toBe("EUR € - Alemanha,Espanha Germany,Spain");
  });
});
