import {
  CountryFragment,
  CountryWithCodeFragment,
  TaxClassFragment,
  TaxCountryConfigurationFragment,
  TaxRateFragment
} from "@saleor/graphql";

export const getDefaultTaxRateInCountry = (
  taxClasses: TaxClassFragment[] | undefined,
  selectedCountry: CountryWithCodeFragment,
): TaxRateFragment["rate"] | undefined =>
  taxClasses
    ?.find(taxClass => taxClass.isDefault)
    .countries.find(country => country.country.code === selectedCountry.code)
    .rate;

export const encodeURIComponentOptional = (
  uriComponent: string | number | boolean | undefined,
): string | undefined =>
  uriComponent ? encodeURIComponent(uriComponent) : undefined;

export const filterChosenCountries = (
  countries: CountryFragment[],
  configurations: TaxCountryConfigurationFragment[]
) =>
  countries.filter(
    country =>
      !configurations.find(config => config.country.code === country.code)
  );
