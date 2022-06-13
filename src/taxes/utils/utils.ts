import {
  CountryWithCodeFragment,
  TaxClassFragment,
  TaxRateFragment
} from "@saleor/graphql";

export const getDefaultTaxRateInCountry = (
  taxClasses: TaxClassFragment[] | undefined,
  selectedCountry: CountryWithCodeFragment
): TaxRateFragment["rate"] | undefined =>
  taxClasses
    ?.find(taxClass => taxClass.isDefault)
    .countries.find(country => country.country.code === selectedCountry.code)
    .rate;
