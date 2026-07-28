/** ISO 3166-1 alpha-2 codes for EU member states (27). */
export const EU_MEMBER_STATE_COUNTRY_CODES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
] as const;

/** ISO 3166-1 alpha-2 codes for the North America preset (US, Canada, Mexico). */
export const NORTH_AMERICA_COUNTRY_CODES = ["US", "CA", "MX"] as const;

export type CountryPresetCode = "eu" | "northAmerica";

export const COUNTRY_PRESET_CODES: Record<CountryPresetCode, readonly string[]> = {
  eu: EU_MEMBER_STATE_COUNTRY_CODES,
  northAmerica: NORTH_AMERICA_COUNTRY_CODES,
};
