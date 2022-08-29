import {
  AllocationStrategyEnum,
  ChannelDetailsFragment,
  ChannelErrorCode,
  ChannelErrorFragment,
  ProductFragment,
} from "@saleor/graphql";
import { Money } from "@saleor/sdk/dist/apollo/types";

export const channelCreateErrors: ChannelErrorFragment[] = [
  {
    __typename: "ChannelError",
    code: ChannelErrorCode.UNIQUE,
    field: "slug",
    message: "Channel with this Slug already exists.",
  },
];

export const channelsList: ChannelDetailsFragment[] = [
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbm5lcDoy",
    isActive: true,
    name: "Test",
    slug: "test",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbm7lbDoy213",
    isActive: true,
    name: "Channel",
    slug: "channel",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbn5lbDoytr",
    isActive: true,
    name: "Channel test",
    slug: "channeltest",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbm5lbDo5bot",
    isActive: true,
    name: "Channel USD",
    slug: "channel-usd",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbm7lbDoyr0tr",
    isActive: true,
    name: "Channel",
    slug: "channel2",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbn5lbDoyya",
    isActive: true,
    name: "Channel test",
    slug: "channeltest4",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    hasOrders: false,
    id: "Q2hhbm5lbDo5w0z",
    isActive: true,
    name: "Channel USD",
    slug: "channel-usd1",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
  },
];

export const channel: ChannelDetailsFragment = {
  __typename: "Channel",
  currencyCode: "zl",
  hasOrders: false,
  id: "Q2hhbm5lbDov78",
  isActive: true,
  name: "Test",
  slug: "test",
  defaultCountry: {
    code: "PL",
    country: "Poland",
    __typename: "CountryDisplay",
  },
  stockSettings: {
    __typename: "StockSettings",
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
  },
  warehouses: [
    {
      __typename: "Warehouse",
      id: "WH1",
      name: "Warehouse 1",
    },
    {
      __typename: "Warehouse",
      id: "WH2",
      name: "Warehouse 2",
    },
  ],
};

type ProductChannelsWithPricing = ProductFragment["channelListings"][0] & {
  pricing: {
    priceRange: {
      start: {
        net: Money;
      };
      stop: {
        net: Money;
      };
    };
  };
};

export const productChannels: ProductChannelsWithPricing[] = [
  {
    __typename: "ProductChannelListing",
    availableForPurchase: null,
    channel: {
      __typename: "Channel",
      currencyCode: "USD",
      id: "123",
      name: "Channel1",
    },
    isAvailableForPurchase: false,
    isPublished: true,
    pricing: {
      priceRange: {
        start: {
          net: {
            amount: 1.2,
            currency: "USD",
          },
        },
        stop: {
          net: {
            amount: 3.5,
            currency: "USD",
          },
        },
      },
    },
    publicationDate: "2020-07-14",
    visibleInListings: true,
  },
  {
    __typename: "ProductChannelListing",
    availableForPurchase: null,
    channel: {
      __typename: "Channel",
      currencyCode: "USD",
      id: "124",
      name: "Channel2",
    },
    isAvailableForPurchase: false,
    isPublished: false,
    pricing: {
      priceRange: {
        start: {
          net: {
            amount: 2.2,
            currency: "USD",
          },
        },
        stop: {
          net: {
            amount: 7.1,
            currency: "USD",
          },
        },
      },
    },
    publicationDate: "2020-07-30",
    visibleInListings: true,
  },
  {
    __typename: "ProductChannelListing",
    availableForPurchase: null,
    channel: {
      __typename: "Channel",
      currencyCode: "USD",
      id: "125",
      name: "Channel3",
    },
    isAvailableForPurchase: false,
    isPublished: false,
    pricing: {
      priceRange: {
        start: {
          net: {
            amount: 30.1,
            currency: "USD",
          },
        },
        stop: {
          net: {
            amount: 44.9,
            currency: "USD",
          },
        },
      },
    },
    publicationDate: null,
    visibleInListings: true,
  },
];

export const productPriceChannels = [
  {
    costPrice: "5",
    id: "123",
    name: "Channel1",
    sellingPrice: "10",
  },
  {
    costPrice: "15",
    id: "124",
    name: "Channel2",
    sellingPrice: "20",
  },
  {
    costPrice: "15",
    id: "125",
    name: "Channel3",
    sellingPrice: "100",
  },
];
