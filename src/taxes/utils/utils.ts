import {
  CountryWithCodeFragment,
  TaxClassFragment,
  TaxRateFragment
} from "@saleor/graphql";

export const getDefaultTaxRateInCountry = (
  taxClasses: TaxClassFragment[],
  selectedCountry: CountryWithCodeFragment
): TaxRateFragment["rate"] =>
  taxClasses
    .find(taxClass => taxClass.isDefault)
    .countries.find(country => country.country.code === selectedCountry.code)
    .rate;
