import currencyCodes from "currency-codes";

import { getCurrencyCountryLabels } from "./currencyCountryLabels";

export interface CurrencyCodeSource {
  code: string;
  currency: string;
  countries: string[];
}

export const getCurrencyCodeSources = (): CurrencyCodeSource[] =>
  currencyCodes.data.map(currencyData => ({
    code: currencyData.code,
    currency: currencyData.currency,
    countries: currencyData.countries,
  }));

export const getCurrencySymbol = (code: string, locale: string): string => {
  try {
    const currencyPart = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find(part => part.type === "currency");

    return currencyPart?.value ?? code;
  } catch {
    return code;
  }
};

/**
 * currency-codes uses synthetic "Zz…" placeholders for non-country units
 * (e.g. XBA "European_eurco"). Those should not drive search matches.
 */
export const getCurrencyCountriesForSearch = (countries: string[]): string[] =>
  countries.filter(country => !/^zz\d/i.test(country));

/**
 * Searchable label for Macaw's built-in filter.
 * Includes symbol so queries like "$" / "€" match the right currencies. Countries are named in the
 * Dashboard language, and the English names are kept so English searches still match.
 */
export const getCurrencySearchLabel = (
  source: CurrencyCodeSource,
  symbol: string,
  locale = "en",
): string => {
  const englishCountries = getCurrencyCountriesForSearch(source.countries);
  const countries = getCurrencyCountryLabels(englishCountries, locale);
  const englishAliases = countries.some((country, index) => country !== englishCountries[index])
    ? ` ${englishCountries.join(",")}`
    : "";

  return `${source.code} ${symbol} - ${countries.join(",")}${englishAliases}`;
};
