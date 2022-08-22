import {
  CountryFragment,
  CountryWithCodeFragment,
  TaxClassFragment,
  TaxCountryConfigurationFragment,
  TaxRateFragment,
} from "@saleor/graphql";
import uniqBy from "lodash/uniqBy";

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
  configurations: TaxCountryConfigurationFragment[],
) =>
  countries.filter(
    country =>
      !configurations.find(config => config.country.code === country.code),
  );
export const mapUndefinedTaxRatesToCountries = (
  taxConfigurations: TaxCountryConfigurationFragment[],
  taxClasses: TaxClassFragment[],
): TaxCountryConfigurationFragment[] =>
  taxConfigurations
    .map(config => {
      if ((config.taxClassCountryRates?.length ?? 0) === taxClasses.length) {
        return config;
      } else {
        const taxClassCountryRates = uniqBy(
          [
            ...config.taxClassCountryRates,
            ...taxClasses.map(taxClass => ({
              taxClass,
              rate: undefined,
              __typename: "TaxClassCountryRate" as const,
            })),
          ],
          "taxClass.id",
        );
        const defaultRate = taxClassCountryRates.find(
          rate => rate.taxClass.isDefault,
        );
        const parsedCountryRates = taxClassCountryRates.filter(
          rate => !rate.taxClass.isDefault,
        );
        parsedCountryRates.unshift(defaultRate);

        return {
          ...config,
          taxClassCountryRates: parsedCountryRates,
        };
      }
    })
    .sort((a, b) => a.country.country.localeCompare(b.country.country));
