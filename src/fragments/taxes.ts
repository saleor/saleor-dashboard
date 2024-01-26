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

export const taxConfigurationPerCountry = gql`
  fragment TaxConfigurationPerCountry on TaxConfigurationPerCountry {
    country {
      ...CountryWithCode
    }
    chargeTaxes
    taxCalculationStrategy
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
    taxCalculationStrategy
    taxAppId
    countries {
      ...TaxConfigurationPerCountry
    }
  }
`;

export const taxCountryConfigurationFragment = gql`
  fragment TaxCountryConfiguration on TaxCountryConfiguration {
    country {
      ...CountryWithCode
    }
    taxClassCountryRates {
      rate
      taxClass {
        id
        name
      }
    }
  }
`;

export const taxRateFragment = gql`
  fragment TaxRate on TaxClassCountryRate {
    country {
      ...CountryWithCode
    }
    rate
  }
`;

export const taxClassBaseFragment = gql`
  fragment TaxClassBase on TaxClass {
    id
    name
  }
`;

export const taxClassFragment = gql`
  fragment TaxClass on TaxClass {
    ...TaxClassBase
    countries {
      ...TaxRate
    }
    ...Metadata
  }
`;
