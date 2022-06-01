import {
  TaxConfigurationFragment,
  TaxCountryConfigurationFragment
} from "@saleor/graphql";

export const taxConfigurations: TaxConfigurationFragment[] = [
  {
    __typename: "TaxConfiguration",
    id: "taxConf1",
    channel: {
      __typename: "Channel",
      id: "taxChannel1",
      name: "Channel USD"
    },
    displayGrossPrices: true,
    pricesEnteredWithTax: false,
    chargeTaxes: true,
    countries: [
      {
        __typename: "TaxConfigurationPerCountry",
        countryCode: "AF",
        chargeTaxes: false,
        displayGrossPrices: false
      },
      {
        __typename: "TaxConfigurationPerCountry",
        countryCode: "AX",
        chargeTaxes: true,
        displayGrossPrices: true
      }
    ]
  },
  {
    __typename: "TaxConfiguration",
    id: "taxConf2",
    channel: {
      __typename: "Channel",
      id: "taxChannel2",
      name: "Channel PLN"
    },
    displayGrossPrices: false,
    pricesEnteredWithTax: true,
    chargeTaxes: true,
    countries: [
      {
        __typename: "TaxConfigurationPerCountry",
        countryCode: "AL",
        chargeTaxes: true,
        displayGrossPrices: true
      },
      {
        __typename: "TaxConfigurationPerCountry",
        countryCode: "DZ",
        chargeTaxes: false,
        displayGrossPrices: false
      }
    ]
  }
];

export const taxCountryConfigurations: TaxCountryConfigurationFragment[] = [
  {
    __typename: "TaxCountryConfiguration",
    countryCode: "EE",
    taxClassCountryRates: [
      {
        __typename: "TaxClassCountryRate",
        rate: 0.31,
        taxClass: {
          __typename: "TaxClass",
          id: "taxCountryConfigurations.0.taxClassCountryRates.0.taxClass.id",
          isDefault: true,
          name: "Default tax class"
        }
      },
      {
        __typename: "TaxClassCountryRate",
        rate: 0.05,
        taxClass: {
          __typename: "TaxClass",
          id: "taxCountryConfigurations.0.taxClassCountryRates.0.taxClass.id",
          isDefault: false,
          name: "Perfume"
        }
      }
    ]
  },
  {
    __typename: "TaxCountryConfiguration",
    countryCode: "PL",
    taxClassCountryRates: [
      {
        __typename: "TaxClassCountryRate",
        rate: 0.21,
        taxClass: {
          __typename: "TaxClass",
          id: "taxCountryConfigurations.0.taxClassCountryRates.0.taxClass.id",
          name: "Default tax class",
          isDefault: true
        }
      },
      {
        __typename: "TaxClassCountryRate",
        rate: 0.05,
        taxClass: {
          __typename: "TaxClass",
          id: "taxCountryConfigurations.0.taxClassCountryRates.0.taxClass.id",
          name: "Food",
          isDefault: false
        }
      }
    ]
  }
];
