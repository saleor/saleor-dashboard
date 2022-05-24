import { TaxConfigurationFragment } from "@saleor/graphql";

export const taxConfigurations: TaxConfigurationFragment[] = [
  {
    __typename: "TaxConfiguration",
    id: "taxConfigurations.edges.0.node.id",
    channel: {
      __typename: "Channel",
      id: "taxConfigurations.edges.0.node.channel.id",
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
    id: "taxConfigurations.edges.1.node.id",
    channel: {
      __typename: "Channel",
      id: "taxConfigurations.edges.1.node.channel.id",
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
