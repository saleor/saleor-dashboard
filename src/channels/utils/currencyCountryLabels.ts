import { getReferenceLabel } from "@dashboard/components/Locale/referenceLabels";
import { CountryCode } from "@dashboard/graphql/types.generated";

const normalizeName = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\bthe\b/g, "")
    .replace(/\bsaint\b/g, "st")
    .replace(/\band\b/g, "")
    .replace(/[^a-z0-9]/g, "");

// currency-codes uses ISO 4217 country names; these differ from the browser's English region names.
const isoNameAliases: Record<string, CountryCode> = {
  "Sint Maarten (Dutch Part)": CountryCode.SX,
  "Heard Island and Mcdonald Islands": CountryCode.HM,
  "Brunei Darussalam": CountryCode.BN,
  "Bolivia (Plurinational State Of)": CountryCode.BO,
  "Congo (The Democratic Republic of The)": CountryCode.CD,
  "Cabo Verde": CountryCode.CV,
  "Holy See (The)": CountryCode.VA,
  "Saint Martin (French Part)": CountryCode.MF,
  "Falkland Islands (The) [Malvinas]": CountryCode.FK,
  "United Kingdom of Great Britain and Northern Ireland (The)": CountryCode.GB,
  "Hong Kong": CountryCode.HK,
  "Iran (Islamic Republic Of)": CountryCode.IR,
  "Korea (The Democratic People’s Republic Of)": CountryCode.KP,
  "Korea (The Republic Of)": CountryCode.KR,
  "Lao People’s Democratic Republic (The)": CountryCode.LA,
  "Moldova (The Republic Of)": CountryCode.MD,
  Myanmar: CountryCode.MM,
  Macao: CountryCode.MO,
  Pitcairn: CountryCode.PN,
  "Russian Federation (The)": CountryCode.RU,
  "Saint Helena, Ascension and Tristan Da Cunha": CountryCode.SH,
  "Syrian Arab Republic": CountryCode.SY,
  "Taiwan (Province of China)": CountryCode.TW,
  "Tanzania, United Republic Of": CountryCode.TZ,
  "Bonaire, Sint Eustatius and Saba": CountryCode.BQ,
  "Micronesia (Federated States Of)": CountryCode.FM,
  "United States Minor Outlying Islands (The)": CountryCode.UM,
  "United States of America (The)": CountryCode.US,
  "Virgin Islands (British)": CountryCode.VG,
  "Virgin Islands (u.s.)": CountryCode.VI,
  "Venezuela (Bolivarian Republic Of)": CountryCode.VE,
  "Congo (The)": CountryCode.CG,
};

let countryCodesByName: Map<string, CountryCode> | undefined;

/** Finds the country code for a currency-codes country name, or undefined for non-countries. */
export const getCurrencyCountryCode = (name: string): CountryCode | undefined => {
  if (!countryCodesByName) {
    const codes = new Map<string, CountryCode>();
    const englishNames = new Intl.DisplayNames("en", { type: "region", fallback: "none" });

    Object.values(CountryCode).forEach(code => {
      const englishName = englishNames.of(code);

      if (englishName) {
        codes.set(normalizeName(englishName), code);
      }
    });
    Object.entries(isoNameAliases).forEach(([alias, code]) => {
      codes.set(normalizeName(alias), code);
    });
    countryCodesByName = codes;
  }

  return countryCodesByName.get(normalizeName(name));
};

/**
 * Names currency countries in the Dashboard language. Entries that aren't countries (for example
 * "International Monetary Fund (Imf)") keep their original name.
 */
export const getCurrencyCountryLabels = (countries: string[], locale: string): string[] =>
  countries.map(country => {
    const code = getCurrencyCountryCode(country);

    return code ? getReferenceLabel("region", code, country, locale) : country;
  });
