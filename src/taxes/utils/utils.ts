import { TaxClassFragment } from "@saleor/graphql";

export const getDefaultTaxRateInCountry = (
  taxClasses: TaxClassFragment[],
  selectedCountry: TaxClassFragment["countries"][0]
) =>
  taxClasses
    .find(taxClass => taxClass.isDefault)
    .countries.find(
      country => country.countryCode === selectedCountry.countryCode
    ).rate;
