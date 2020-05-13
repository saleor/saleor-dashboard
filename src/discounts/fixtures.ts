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
    endDate: null,
    id: "U2FsZTo0",
    name: "Happy front day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
    value: 40
  },
  {
    __typename: "Sale" as "Sale",
    endDate: null,
    id: "U2FsZTo1",
    name: "Happy minute day!",
    startDate: "2019-01-03",
    type: "FIXED" as SaleType,
    value: 30
  },
  {
    __typename: "Sale" as "Sale",
    endDate: null,
    id: "U2FsZTox",
    name: "Happy class day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
    value: 10
  },
  {
    __typename: "Sale" as "Sale",
    endDate: null,
    id: "U2FsZToy",
    name: "Happy human day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
    value: 20
  },
  {
    __typename: "Sale" as "Sale",
    endDate: null,
    id: "U2FsZToz",
    name: "Happy year day!",
    startDate: "2019-01-03",
    type: "PERCENTAGE" as SaleType,
    value: 10
  }
];

export const voucherList: VoucherList_vouchers_edges_node[] = [
  {
    __typename: "Voucher" as "Voucher",
    code: "FREE2019",
    countries: [
      {
        __typename: "CountryDisplay",
        code: "DE",
        country: "Germany"
      }
    ],
    discountValue: 100,
    discountValueType: "PERCENTAGE" as DiscountValueTypeEnum,
    endDate: null,
    id: "Vm91Y2hlcjox",
    minCheckoutItemsQuantity: null,
    minSpent: null,
    startDate: "2019-01-03",
    usageLimit: null
  },
  {
    __typename: "Voucher" as "Voucher",
    code: "FREE2020",
    countries: [],
    discountValue: 25,
    discountValueType: "FIXED" as DiscountValueTypeEnum,
    endDate: null,
    id: "Vm91Y2hlcjoy",
    minCheckoutItemsQuantity: 0,
    minSpent: {
      __typename: "Money" as "Money",
      amount: 200,
      currency: "USD"
    },
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
          id: "UHJvZHVjdDo3MQ==",
          isPublished: true,
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
          id: "UHJvZHVjdDo3Mw==",
          isPublished: true,
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
          id: "UHJvZHVjdDo3OQ==",
          isPublished: true,
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
          id: "UHJvZHVjdDoxMTU=",
          isPublished: true,
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
  type: "PERCENTAGE" as SaleType,
  value: 30
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
  discountValue: 25,
  discountValueType: DiscountValueTypeEnum.FIXED,
  endDate: null,
  id: "Vm91Y2hlcjoy",
  minCheckoutItemsQuantity: 0,
  minSpent: {
    __typename: "Money",
    amount: 200,
    currency: "USD"
  },
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
