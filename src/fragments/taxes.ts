import { gql } from "@apollo/client";

export const taxedMoneyFragment = gql`
  fragment TaxedMoney on TaxedMoney {
    net {
      ...Money
    }
    gross {
      ...Money
    }
  }
`;
export const countryFragment = gql`
  fragment Country on CountryDisplay {
    country
    code
  }
`;
export const countryWithTaxesFragment = gql`
  fragment CountryWithTaxes on CountryDisplay {
    ...Country
    vat {
      standardRate
      reducedRates {
        rateType
        rate
      }
    }
  }
`;
export const shopTaxesFragment = gql`
  fragment ShopTaxes on Shop {
    chargeTaxesOnShipping
    includeTaxesInPrices
    displayGrossPrices
  }
`;
export const taxTypeFragment = gql`
  fragment TaxType on TaxType {
    description
    taxCode
  }
`;

export const taxConfigurationPerCountry = gql`
  fragment TaxConfigurationPerCountry on TaxConfigurationPerCountry {
    countryCode
    chargeTaxes
    displayGrossPrices
  }
`;

export const taxConfiguration = gql`
  fragment TaxConfiguration on TaxConfiguration {
    id
    channel {
      id
      name
    }
    displayGrossPrices
    pricesEnteredWithTax
    chargeTaxes
    countries {
      ...TaxConfigurationPerCountry
    }
  }
`;

export const taxCountryConfigurationFragment = gql`
  fragment TaxCountryConfiguration on TaxCountryConfiguration {
    countryCode
    taxClassCountryRates {
      rate
      taxClass {
        id
        name
        isDefault
      }
    }
  }
`;
