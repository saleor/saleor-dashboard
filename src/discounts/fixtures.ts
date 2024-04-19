import placeholderImage from "@assets/images/placeholder60x60.png";
import { channelsList } from "@dashboard/channels/fixtures";
import {
  DiscountValueTypeEnum,
  PromotionDetailsFragment,
  PromotionFragment,
  PromotionTypeEnum,
  RewardTypeEnum,
  RewardValueTypeEnum,
  SaleDetailsFragment,
  SaleFragment,
  SaleType,
  VoucherDetailsFragment,
  VoucherFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";

export const saleList: SaleFragment[] = [
  {
    __typename: "Sale" as const,
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "1",
      },
    ],
    endDate: null,
    id: "U2FsZTo0",
    name: "Happy front day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
  },
  {
    __typename: "Sale" as const,
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "2",
      },
    ],
    endDate: null,
    id: "U2FsZTo1",
    name: "Happy minute day!",
    startDate: "2019-01-03",
    type: "FIXED" as SaleType,
  },
  {
    __typename: "Sale" as const,
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "3",
      },
    ],
    endDate: null,
    id: "U2FsZTox",
    name: "Happy class day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
  },
  {
    __typename: "Sale" as const,
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "4",
      },
    ],
    endDate: null,
    id: "U2FsZToy",
    name: "Happy human day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
  },
  {
    __typename: "Sale" as const,
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "5",
      },
    ],
    endDate: null,
    id: "U2FsZToz",
    name: "Happy year day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
  },
];

export const voucherList: VoucherFragment[] = [
  {
    __typename: "Voucher" as const,
    name: "Free shipping",
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "VoucherChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "1",
        minSpent: {
          __typename: "Money",
          amount: 1,
          currency: "USD",
        },
      },
    ],
    countries: [
      {
        __typename: "CountryDisplay",
        code: "DE",
        country: "Germany",
      },
    ],
    type: "ENTIRE_ORDER" as VoucherTypeEnum,
    discountValueType: "PERCENTAGE" as DiscountValueTypeEnum,
    endDate: null,
    id: "Vm91Y2hlcjox",
    minCheckoutItemsQuantity: null,
    startDate: "2019-01-03",
    usageLimit: null,
  },
  {
    __typename: "Voucher" as const,
    name: "Free 2019",
    metadata: [],
    privateMetadata: [],
    channelListings: [
      {
        __typename: "VoucherChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
        },
        currency: "USD",
        discountValue: 1,
        id: "1",
        minSpent: {
          __typename: "Money",
          amount: 1,
          currency: "USD",
        },
      },
    ],
    countries: [],
    type: "ENTIRE_ORDER" as VoucherTypeEnum,
    discountValueType: "FIXED" as DiscountValueTypeEnum,
    endDate: null,
    id: "Vm91Y2hlcjoy",
    minCheckoutItemsQuantity: 0,
    startDate: "2019-01-03",
    usageLimit: 150,
  },
];

export const sale: SaleDetailsFragment = {
  __typename: "Sale",
  metadata: [],
  privateMetadata: [],
  categoriesCount: {
    __typename: "CategoryCountableConnection",
    totalCount: 2,
  },
  collectionsCount: {
    __typename: "CollectionCountableConnection",
    totalCount: 4,
  },
  productsCount: {
    __typename: "ProductCountableConnection",
    totalCount: 4,
  },
  variantsCount: {
    __typename: "ProductVariantCountableConnection",
    totalCount: 3,
  },
  categories: {
    __typename: "CategoryCountableConnection",
    edges: [
      {
        __typename: "CategoryCountableEdge",
        node: {
          __typename: "Category",
          id: "U2FsZTo1=",
          name: "Apparel",
          products: {
            __typename: "ProductCountableConnection",
            totalCount: 18,
          },
        },
      },
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
    },
  },
  channelListings: [
    {
      __typename: "SaleChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "123",
        name: "Channel1",
      },
      currency: "USD",
      discountValue: 1,
      id: "1",
    },
  ],
  collections: {
    __typename: "CollectionCountableConnection",
    edges: [
      {
        __typename: "CollectionCountableEdge",
        node: {
          __typename: "Collection",
          id: "U2FsZBo4=",
          name: "Winter Collection",
          products: {
            __typename: "ProductCountableConnection",
            totalCount: 110,
          },
        },
      },
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
    },
  },
  endDate: null,
  id: "U2FsZTo1",
  name: "Happy minute day!",
  products: {
    __typename: "ProductCountableConnection",
    edges: [
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
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
              publicationDate: "2020-07-14",
              visibleInListings: true,
            },
          ],
          id: "UHJvZHVjdDo3MQ==",
          name: "Orange Juice",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage,
          },
        },
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
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
              publicationDate: "2020-07-14",
              visibleInListings: true,
            },
          ],
          id: "UHJvZHVjdDo3Mw==",
          name: "Carrot Juice",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage,
          },
        },
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
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
              publicationDate: "2020-07-14",
              visibleInListings: true,
            },
          ],
          id: "UHJvZHVjdDo3OQ==",
          name: "Bean Juice",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage,
          },
        },
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
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
              publicationDate: "2020-07-14",
              visibleInListings: true,
            },
          ],
          id: "UHJvZHVjdDoxMTU=",
          name: "Black Hoodie",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage,
          },
        },
      },
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA=",
    },
  },
  variants: {
    edges: [
      {
        node: {
          id: "UHJvZHVjdFZhcmlhbnQ6MzE0",
          name: "XL",
          product: {
            id: "UHJvZHVjdDoxMTg=",
            name: "White Hoodie",
            thumbnail: {
              url: placeholderImage,
              __typename: "Image",
            },
            productType: {
              id: "UHJvZHVjdFR5cGU6MTQ=",
              name: "Top (clothing)",
              __typename: "ProductType",
            },
            channelListings: [
              {
                isPublished: true,
                publicationDate: "2020-01-01",
                isAvailableForPurchase: true,
                availableForPurchase: "2020-08-31",
                visibleInListings: true,
                channel: {
                  id: "Q2hhbm5lbDox",
                  name: "Channel-USD",
                  currencyCode: "USD",
                  __typename: "Channel",
                },
                __typename: "ProductChannelListing",
              },
            ],
            __typename: "Product",
          },
          __typename: "ProductVariant",
        },
        __typename: "ProductVariantCountableEdge",
      },
      {
        node: {
          id: "UHJvZHVjdFZhcmlhbnQ6Mjc4",
          name: "L",
          product: {
            id: "UHJvZHVjdDoxMTE=",
            name: "T-shirt",
            thumbnail: {
              url: placeholderImage,
              __typename: "Image",
            },
            productType: {
              id: "UHJvZHVjdFR5cGU6MTQ=",
              name: "Top (clothing)",
              __typename: "ProductType",
            },
            channelListings: [
              {
                isPublished: true,
                publicationDate: "2020-01-01",
                isAvailableForPurchase: true,
                availableForPurchase: "2020-08-31",
                visibleInListings: true,
                channel: {
                  id: "Q2hhbm5lbDox",
                  name: "Channel-USD",
                  currencyCode: "USD",
                  __typename: "Channel",
                },
                __typename: "ProductChannelListing",
              },
            ],
            __typename: "Product",
          },
          __typename: "ProductVariant",
        },
        __typename: "ProductVariantCountableEdge",
      },
      {
        node: {
          id: "UHJvZHVjdFZhcmlhbnQ6MjUz",
          name: "L",
          product: {
            id: "UHJvZHVjdDo4OQ==",
            name: "Code Division T-shirt",
            thumbnail: {
              url: placeholderImage,
              __typename: "Image",
            },
            productType: {
              id: "UHJvZHVjdFR5cGU6MTQ=",
              name: "Top (clothing)",
              __typename: "ProductType",
            },
            channelListings: [
              {
                isPublished: true,
                publicationDate: "2020-01-01",
                isAvailableForPurchase: true,
                availableForPurchase: "2020-08-31",
                visibleInListings: true,
                channel: {
                  id: "Q2hhbm5lbDox",
                  name: "Channel-USD",
                  currencyCode: "USD",
                  __typename: "Channel",
                },
                __typename: "ProductChannelListing",
              },
              {
                isPublished: true,
                publicationDate: "2020-01-01",
                isAvailableForPurchase: true,
                availableForPurchase: "2020-08-31",
                visibleInListings: true,
                channel: {
                  id: "Q2hhbm5lbDoy",
                  name: "Channel-PLN",
                  currencyCode: "PLN",
                  __typename: "Channel",
                },
                __typename: "ProductChannelListing",
              },
            ],
            __typename: "Product",
          },
          __typename: "ProductVariant",
        },
        __typename: "ProductVariantCountableEdge",
      },
    ],
    pageInfo: {
      endCursor: "W251bGwsICIxMTgyMjM1OTEiXQ==",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "W251bGwsICIxMDQwNDk0NiJd",
      __typename: "PageInfo",
    },
    __typename: "ProductVariantCountableConnection",
  },
  startDate: "2019-01-03",
  type: "PERCENTAGE" as SaleType,
};

export const voucherDetails: VoucherDetailsFragment = {
  __typename: "Voucher",
  name: "VFree2020",
  metadata: [],
  privateMetadata: [],
  applyOncePerCustomer: false,
  applyOncePerOrder: false,
  singleUse: false,
  onlyForStaff: false,
  categoriesCount: {
    __typename: "CategoryCountableConnection",
    totalCount: 0,
  },
  collectionsCount: {
    __typename: "CollectionCountableConnection",
    totalCount: 0,
  },
  productsCount: {
    __typename: "ProductCountableConnection",
    totalCount: 0,
  },
  categories: {
    __typename: "CategoryCountableConnection",
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA=",
    },
  },
  channelListings: [
    {
      __typename: "VoucherChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "123",
        name: "Channel1",
      },
      currency: "USD",
      discountValue: 1,
      id: "1",
      minSpent: {
        __typename: "Money",
        amount: 1,
        currency: "USD",
      },
    },
  ],
  collections: {
    __typename: "CollectionCountableConnection",
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA=",
    },
  },
  countries: [
    {
      __typename: "CountryDisplay",
      code: "DE",
      country: "Germany",
    },
  ],
  discountValueType: DiscountValueTypeEnum.FIXED,
  endDate: null,
  id: "Vm91Y2hlcjoy",
  minCheckoutItemsQuantity: 0,
  products: {
    __typename: "ProductCountableConnection",
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA=",
    },
  },
  startDate: "2018-11-27",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  usageLimit: null,
  used: 0,
};

export const discount: PromotionDetailsFragment = {
  __typename: "Promotion",
  id: "1",
  name: "Discunt 1",
  description: {},
  startDate: "2019-01-03",
  endDate: null,
  type: PromotionTypeEnum.CATALOGUE,
  rules: [
    {
      __typename: "PromotionRule",
      id: "1",
      channels: [channelsList[0]],
      description:
        '{"time":1700126384046,"blocks":[{"id":"Sj7p30CLFo","type":"header","data":{"text":"Example title","level":1}}],"version":"2.24.3"}',
      name: "Rule 1",
      rewardValue: "33",
      rewardValueType: RewardValueTypeEnum.FIXED,
      rewardType: null,
      orderPredicate: {},
      giftIds: [],
      cataloguePredicate: {
        OR: [
          {
            productPredicate: {
              ids: ["UHJvZHVjdDo3OQ==", "UHJvZHVjdDoxMTU="],
            },
          },
          {
            variantPredicate: {
              ids: ["UHJvZHVjdFZhcmlhbnQ6OTg3", "UHJvZHVjdFZhcmlhbnQ6MjE1"],
            },
          },
        ],
      },
    },
  ],
};

export const orderDiscount: PromotionDetailsFragment = {
  __typename: "Promotion",
  id: "1",
  name: "Discunt 1",
  description: {},
  startDate: "2019-01-03",
  endDate: null,
  type: PromotionTypeEnum.ORDER,
  rules: [
    {
      __typename: "PromotionRule",
      id: "1",
      channels: [channelsList[0]],
      description:
        '{"time":1700126384046,"blocks":[{"id":"Sj7p30CLFo","type":"header","data":{"text":"Example title","level":1}}],"version":"2.24.3"}',
      name: "Rule 1",
      rewardValue: "33",
      rewardValueType: RewardValueTypeEnum.FIXED,
      rewardType: RewardTypeEnum.GIFT,
      giftIds: ["UHJvZHVjdFZhcmlhbnQ6MTkz", "UHJvZHVjdFZhcmlhbnQ6Mjk5", "UHJvZHVjdFZhcmlhbnQ6MjA2"],
      orderPredicate: {
        discountedObjectPredicate: {
          baseSubtotalPrice: {
            range: {
              gte: "100",
              lte: "200",
            },
          },
        },
      },
      cataloguePredicate: {},
    },
  ],
};

export const discountList: PromotionFragment[] = [
  {
    __typename: "Promotion",
    metadata: [],
    privateMetadata: [],
    type: PromotionTypeEnum.CATALOGUE,
    id: "UHJvbW90aW9uOjNlYWM1OGMyLWU1OTEtNDI3OS05YzIwLWU3OTA0ZjhkYjhiZg==",
    name: "Promo 1",
    startDate: "2023-12-13T12:33:18.550840+00:00",
    endDate: null,
  },
  {
    __typename: "Promotion",
    metadata: [],
    privateMetadata: [],
    type: PromotionTypeEnum.CATALOGUE,
    id: "UHJvbW90aW9uOmM2NjgzOGUxLTViZGQtNDJiZC04YzIyLTQ0YzlmYTYxNGM5OA==",
    name: "Promo 2",
    startDate: "2024-01-08T23:00:00+00:00",
    endDate: "2024-02-12T23:00:00+00:00",
  },
  {
    __typename: "Promotion",
    metadata: [],
    privateMetadata: [],
    type: PromotionTypeEnum.ORDER,
    id: "UHJvbW90aW9uOmQyMmQ3NDUyLTAzNDYtNDJiYS1iMmY4LTEzMjJlNDg4ZDIzZA==",
    name: "Promo 3",
    startDate: "2023-12-13T12:32:13.272371+00:00",
    endDate: null,
  },
  {
    __typename: "Promotion",
    metadata: [],
    privateMetadata: [],
    id: "UHJvbW90aW9uOjk3ZDcxNDJjLWMyZjMtNDE5ZC1iNGM1LTUzNjBjNTNjYWM3Zg==",
    type: PromotionTypeEnum.CATALOGUE,
    name: "Promo 4",
    startDate: "2023-12-13T15:18:22.922335+00:00",
    endDate: null,
  },
  {
    __typename: "Promotion",
    metadata: [],
    privateMetadata: [],
    type: PromotionTypeEnum.CATALOGUE,
    id: "UHJvbW90aW9uOjI2YzUzNmQ5LTNmNzctNDExYy1hYjRkLWNiMzgzMDJmYWExNw==",
    name: "Promo 5",
    startDate: "2023-12-31T23:00:00+00:00",
    endDate: null,
  },
];
