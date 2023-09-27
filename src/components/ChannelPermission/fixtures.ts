import { AllocationStrategyEnum, ChannelFragment } from "@dashboard/graphql";

export const allChannels: ChannelFragment[] = [
  {
    __typename: "Channel",
    id: "Q2hhbm5lbDoy",
    isActive: true,
    name: "Channel-1",
    slug: "channel-1",
    currencyCode: "PLN",
    defaultCountry: {
      __typename: "CountryDisplay",
      code: "PL",
      country: "Poland",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
  },
  {
    __typename: "Channel",
    id: "Q2hhbm5lbDoz",
    isActive: true,
    name: "Channel-2",
    slug: "channel-2",
    currencyCode: "PLN",
    defaultCountry: {
      __typename: "CountryDisplay",
      code: "PL",
      country: "Poland",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
  },
  {
    __typename: "Channel",
    id: "Q2hhbm5lbDou",
    isActive: true,
    name: "Channel-3",
    slug: "channel-3",
    currencyCode: "PLN",
    defaultCountry: {
      __typename: "CountryDisplay",
      code: "PL",
      country: "Poland",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
  },
  {
    __typename: "Channel",
    id: "Q2hhbm5lbDox",
    isActive: true,
    name: "Channel-4",
    slug: "default-channel",
    currencyCode: "USD",
    defaultCountry: {
      __typename: "CountryDisplay",
      code: "US",
      country: "United States of America",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
  },
];
