// @ts-strict-ignore
import {
  CountryFragment,
  TaxClassFragment,
  TaxCountriesListQuery,
  TaxCountryConfigurationFragment,
} from "@dashboard/graphql";
import uniqBy from "lodash/uniqBy";

export const encodeURIComponentOptional = (
  uriComponent: string | number | boolean | undefined,
): string | undefined => (uriComponent ? encodeURIComponent(uriComponent) : undefined);

export const filterChosenCountries = (
  countries: CountryFragment[],
  configurations: TaxCountryConfigurationFragment[],
) =>
  countries.filter(country => !configurations.find(config => config.country.code === country.code));
export const mapUndefinedTaxRatesToCountries = (
  taxConfigurations: TaxCountryConfigurationFragment[],
  taxClasses: TaxClassFragment[],
): TaxCountryConfigurationFragment[] =>
  taxConfigurations
    .map(config => {
      if (config.taxClassCountryRates.length === taxClasses.length + 1) {
        return {
          ...config,
          taxClassCountryRates: [...config.taxClassCountryRates].sort(rate =>
            rate.taxClass ? 1 : -1,
          ),
        };
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
        const defaultRate = taxClassCountryRates.find(rate => rate.taxClass === null);
        const parsedCountryRates = taxClassCountryRates.filter(rate => rate.taxClass !== null);
        parsedCountryRates.unshift(
          defaultRate ?? {
            rate: undefined,
            taxClass: null,
            __typename: "TaxClassCountryRate" as const,
          },
        );

        return {
          ...config,
          taxClassCountryRates: parsedCountryRates,
        };
      }
    })
    .sort((a, b) => a.country.country.localeCompare(b.country.country));

export const getCountriesFromCountryConfigurations = (
  data: TaxCountriesListQuery,
): CountryFragment[] => data?.taxCountryConfigurations?.map(config => config.country);

export const mapUndefinedCountriesToTaxClasses = (
  taxConfigurations: TaxCountryConfigurationFragment[],
  taxClasses: TaxClassFragment[],
): TaxClassFragment[] =>
  taxClasses.map(taxClass => ({
    ...taxClass,
    countries: uniqBy(
      [
        ...taxClass.countries,
        ...taxConfigurations.map(({ country }) => ({
          __typename: "TaxClassCountryRate" as const,
          rate: undefined,
          country,
        })),
      ],
      "country.code",
    ),
  }));

export const isLastElement = (arr: any[], index: number): boolean => index === arr.length - 1;

export const excludeExistingCountries = (
  allCountries: CountryFragment[],
  existingCountries: TaxCountryConfigurationFragment[],
): CountryFragment[] =>
  allCountries.filter(
    dialogCountry =>
      !existingCountries?.some(
        existingCountry => existingCountry.country.code === dialogCountry.code,
      ),
  );
