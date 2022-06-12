import {
  CountryFragment,
  TaxClassFragment,
  TaxRateFragment
} from "@saleor/graphql";

export interface NamedTaxRate {
  country: TaxRateFragment;
  name: string;
}

export const mapCountryNamesToCountryRates = (
  countries: TaxRateFragment[],
  countryNames: CountryFragment[]
): NamedTaxRate[] =>
  countries.map(country => ({
    country,
    name: countryNames?.find(
      countryName => countryName.code === country.countryCode
    )?.country
  }));

export const getDefaultTaxRateInCountry = (
  taxClasses: TaxClassFragment[],
  selectedCountry: TaxRateFragment
) =>
  taxClasses
    .find(taxClass => taxClass.isDefault)
    .countries.find(
      country => country.countryCode === selectedCountry.countryCode
    ).rate;
