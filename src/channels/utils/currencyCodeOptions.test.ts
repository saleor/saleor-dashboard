import {
  type CurrencyCodeSource,
  getCurrencyCountriesForSearch,
  getCurrencySearchLabel,
  getCurrencySymbol,
} from "./currencyCodeOptions";

const eur: CurrencyCodeSource = {
  code: "EUR",
  currency: "Euro",
  countries: ["Andorra", "Austria", "European Union", "Spain"],
};

const usd: CurrencyCodeSource = {
  code: "USD",
  currency: "US Dollar",
  countries: ["United States of America (The)"],
};

const xba: CurrencyCodeSource = {
  code: "XBA",
  currency: "Bond Markets Unit European Composite Unit (EURCO)",
  countries: ["Zz01_bond Markets Unit European_eurco"],
};

describe("currencyCodeOptions", () => {
  it("resolves a locale currency symbol", () => {
    // Arrange / Act / Assert
    expect(getCurrencySymbol("PLN", "pl-PL")).toBe("zł");
    expect(getCurrencySymbol("USD", "en-US")).toBe("$");
    expect(getCurrencySymbol("EUR", "en-US")).toBe("€");
  });

  it("includes code, symbol, and countries in the search label", () => {
    // Arrange / Act / Assert
    expect(getCurrencySearchLabel(eur, "€")).toBe("EUR € - Andorra,Austria,European Union,Spain");
    expect(getCurrencySearchLabel(eur, "€").includes("Andorra")).toBe(true);
    expect(getCurrencySearchLabel(usd, "$").includes("$")).toBe(true);
  });

  it("omits synthetic Zz country placeholders from search labels", () => {
    // Arrange / Act / Assert — avoids "eur" matching XBA via "European_eurco"
    expect(getCurrencyCountriesForSearch(xba.countries)).toEqual([]);
    expect(getCurrencySearchLabel(xba, "XBA")).toBe("XBA XBA - ");
    expect(getCurrencySearchLabel(xba, "XBA").toLowerCase().includes("eur")).toBe(false);
  });

  it("still matches EUR for eur via code and European Union", () => {
    // Arrange / Act / Assert
    expect(getCurrencySearchLabel(eur, "€").toLowerCase().includes("eur")).toBe(true);
  });
});
