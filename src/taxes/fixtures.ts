import { TaxConfigurationFragment } from "@saleor/graphql";

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
