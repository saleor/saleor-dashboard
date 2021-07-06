import { ChannelPriceData } from "@saleor/channels/utils";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";

import { createVariants } from "./createVariants";
import {
  createInitialForm,
  Price,
  ProductVariantCreateFormData,
  Stock
} from "./form";

export const channels: ChannelPriceData[] = [
  { currency: "USD", id: "channel-1", name: "Channel1", price: "1" },
  { currency: "USD", id: "channel-2", name: "Channel2", price: "2" },
  { currency: "USD", id: "channel-3", name: "Channel3", price: "3" }
];

export const attributes = [
  {
    id: "attr-1",
    values: Array(9)
      .fill(0)
      .map((_, index) => ({
        slug: `val-1-${index + 1}`,
        value: {
          __typename: "AttributeValue" as "AttributeValue",
          id: `val-1-${index + 1}`,
          name: `val-1-${index + 1}`,
          slug: `val-1-${index + 1}`,
          file: null,
          reference: null,
          richText: null,
          boolean: null
        }
      }))
  },
  {
    id: "attr-2",
    values: Array(6)
      .fill(0)
      .map((_, index) => ({
        slug: `val-2-${index + 1}`,
        value: {
          __typename: "AttributeValue" as "AttributeValue",
          id: `val-2-${index + 1}`,
          name: `val-2-${index + 1}`,
          slug: `val-2-${index + 1}`,
          file: null,
          reference: null,
          richText: null,
          boolean: null
        }
      }))
  },
  {
    id: "attr-3",
    values: Array(4)
      .fill(0)
      .map((_, index) => ({
        slug: `val-3-${index + 1}`,
        value: {
          __typename: "AttributeValue" as "AttributeValue",
          id: `val-3-${index + 1}`,
          name: `val-3-${index + 1}`,
          slug: `val-3-${index + 1}`,
          file: null,
          reference: null,
          richText: null,
          boolean: null
        }
      }))
  },
  {
    id: "attr-4",
    values: Array(11)
      .fill(0)
      .map((_, index) => ({
        slug: `val-4-${index + 1}`,
        value: {
          __typename: "AttributeValue" as "AttributeValue",
          id: `val-4-${index + 1}`,
          name: `val-4-${index + 1}`,
          slug: `val-4-${index + 1}`,
          file: null,
          reference: null,
          richText: null,
          boolean: null
        }
      }))
  }
];

export const warehouses: WarehouseFragment[] = [
  {
    __typename: "Warehouse",
    id: "wh-1",
    name: "Warehouse 1"
  },
  {
    __typename: "Warehouse",
    id: "wh-2",
    name: "Warehouse 2"
  },
  {
    __typename: "Warehouse",
    id: "wh-3",
    name: "Warehouse 3"
  },
  {
    __typename: "Warehouse",
    id: "wh-4",
    name: "Warehouse 4"
  }
];

export const secondStep: ProductVariantCreateFormData = {
  ...createInitialForm([], channels, warehouses),
  attributes: [
    {
      id: attributes[0].id,
      values: []
    },
    {
      id: attributes[1].id,
      values: []
    },
    {
      id: attributes[3].id,
      values: []
    }
  ]
};

export const thirdStep: ProductVariantCreateFormData = {
  ...secondStep,
  attributes: [
    {
      id: attributes[0].id,
      values: [0, 6].map(index => attributes[0].values[index])
    },
    {
      id: attributes[1].id,
      values: [1, 3].map(index => attributes[1].values[index])
    },
    {
      id: attributes[3].id,
      values: [0, 4].map(index => attributes[3].values[index])
    }
  ],
  stock: {
    ...secondStep.stock,
    value: warehouses.map(() => 0)
  },
  warehouses: warehouses.map(warehouse => warehouse.id)
};

const price: Price = {
  attribute: thirdStep.attributes[1].id,
  channels: [
    { channelId: channels[0].id, price: "0" },
    { channelId: channels[1].id, price: "2" },
    { channelId: channels[2].id, price: "2" }
  ],
  mode: "attribute",
  values: [
    {
      slug: thirdStep.attributes[1].values[0].slug,
      value: [
        { channelId: channels[0].id, price: "0" },
        { channelId: channels[1].id, price: "2" },
        { channelId: channels[2].id, price: "2" }
      ]
    },
    {
      slug: thirdStep.attributes[1].values[1].slug,
      value: [
        { channelId: channels[0].id, price: "0" },
        { channelId: channels[1].id, price: "2" },
        { channelId: channels[2].id, price: "2" }
      ]
    }
  ]
};
const stock: Stock = {
  attribute: thirdStep.attributes[2].id,
  mode: "attribute",
  value: [],
  values: [
    {
      slug: thirdStep.attributes[2].values[0].slug,
      value: [50, 20, 45, 75]
    },
    {
      slug: thirdStep.attributes[2].values[1].slug,
      value: [80, 50, 85, 105]
    }
  ]
};
export const fourthStep: ProductVariantCreateFormData = {
  ...thirdStep,
  price,
  stock,
  variants: createVariants({
    ...thirdStep,
    price,
    stock
  })
};
