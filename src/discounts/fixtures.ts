import placeholderImage from "@assets/images/placeholder60x60.png";

import {
  DiscountValueTypeEnum,
  SaleType,
  VoucherTypeEnum
} from "../types/globalTypes";
import { SaleDetails_sale } from "./types/SaleDetails";
import { SaleList_sales_edges_node } from "./types/SaleList";
import { VoucherDetails_voucher } from "./types/VoucherDetails";
import { VoucherList_vouchers_edges_node } from "./types/VoucherList";

export const saleList: SaleList_sales_edges_node[] = [
  {
    __typename: "Sale" as "Sale",
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "1"
      }
    ],
    endDate: null,
    id: "U2FsZTo0",
    name: "Happy front day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType
  },
  {
    __typename: "Sale" as "Sale",
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "2"
      }
    ],
    endDate: null,
    id: "U2FsZTo1",
    name: "Happy minute day!",
    startDate: "2019-01-03",
    type: "FIXED" as SaleType
  },
  {
    __typename: "Sale" as "Sale",
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "3"
      }
    ],
    endDate: null,
    id: "U2FsZTox",
    name: "Happy class day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType
  },
  {
    __typename: "Sale" as "Sale",
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "4"
      }
    ],
    endDate: null,
    id: "U2FsZToy",
    name: "Happy human day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType
  },
  {
    __typename: "Sale" as "Sale",
    channelListings: [
      {
        __typename: "SaleChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "5"
      }
    ],
    endDate: null,
    id: "U2FsZToz",
    name: "Happy year day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType
  }
];

export const voucherList: VoucherList_vouchers_edges_node[] = [
  {
    __typename: "Voucher" as "Voucher",
    channelListings: [
      {
        __typename: "VoucherChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "1",
        minSpent: {
          __typename: "Money",
          amount: 1,
          currency: "USD"
        }
      }
    ],
    code: "FREE2019",
    countries: [
      {
        __typename: "CountryDisplay",
        code: "DE",
        country: "Germany"
      }
    ],
    discountValueType: "PERCENTAGE" as DiscountValueTypeEnum,
    endDate: null,
    id: "Vm91Y2hlcjox",
    minCheckoutItemsQuantity: null,
    startDate: "2019-01-03",
    usageLimit: null
  },
  {
    __typename: "Voucher" as "Voucher",
    channelListings: [
      {
        __typename: "VoucherChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        currency: "USD",
        discountValue: 1,
        id: "1",
        minSpent: {
          __typename: "Money",
          amount: 1,
          currency: "USD"
        }
      }
    ],
    code: "FREE2020",
    countries: [],
    discountValueType: "FIXED" as DiscountValueTypeEnum,
    endDate: null,
    id: "Vm91Y2hlcjoy",
    minCheckoutItemsQuantity: 0,
    startDate: "2019-01-03",
    usageLimit: 150
  }
];

export const sale: SaleDetails_sale = {
  __typename: "Sale",
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
            totalCount: 18
          }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null
    },
    totalCount: 2
  },
  channelListings: [
    {
      __typename: "SaleChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "123",
        name: "Channel1"
      },
      currency: "USD",
      discountValue: 1,
      id: "1"
    }
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
            totalCount: 110
          }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null
    },
    totalCount: 4
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
                name: "Channel1"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true
            }
          ],
          id: "UHJvZHVjdDo3MQ==",
          name: "Orange Juice",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice"
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage
          }
        }
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
                name: "Channel1"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true
            }
          ],
          id: "UHJvZHVjdDo3Mw==",
          name: "Carrot Juice",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice"
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage
          }
        }
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
                name: "Channel1"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true
            }
          ],
          id: "UHJvZHVjdDo3OQ==",
          name: "Bean Juice",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice"
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage
          }
        }
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
                name: "Channel1"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true
            }
          ],
          id: "UHJvZHVjdDoxMTU=",
          name: "Black Hoodie",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)"
          },
          thumbnail: {
            __typename: "Image",
            url: placeholderImage
          }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA="
    },
    totalCount: 4
  },
  startDate: "2019-01-03",
  type: "PERCENTAGE" as SaleType
};

export const voucherDetails: VoucherDetails_voucher = {
  __typename: "Voucher",
  applyOncePerCustomer: false,
  applyOncePerOrder: false,
  categories: {
    __typename: "CategoryCountableConnection",
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA="
    },
    totalCount: 0
  },
  channelListings: [
    {
      __typename: "VoucherChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "123",
        name: "Channel1"
      },
      currency: "USD",
      discountValue: 1,
      id: "1",
      minSpent: {
        __typename: "Money",
        amount: 1,
        currency: "USD"
      }
    }
  ],
  code: "DISCOUNT",
  collections: {
    __typename: "CollectionCountableConnection",
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjM=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA="
    },
    totalCount: 0
  },
  countries: [
    {
      __typename: "CountryDisplay",
      code: "DE",
      country: "Germany"
    }
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
      startCursor: "YXJyYXljb25uZWN0aW9uOjA="
    },
    totalCount: 0
  },
  startDate: "2018-11-27",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  usageLimit: null,
  used: 0
};
