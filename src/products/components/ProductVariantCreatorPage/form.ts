import { ChannelPriceData } from "@saleor/channels/utils";
import {
  AttributeValueFragment,
  ProductVariantAttributesFragment,
  ProductVariantBulkCreateInput,
  WarehouseFragment,
} from "@saleor/graphql";

export interface ChannelPrice {
  channelId: string;
  price: string;
}

export interface AttributeValue<T> {
  slug: string;
  value: T;
}
export type VariantCreatorPricesAndSkuMode = "all" | "attribute" | "skip";
export interface Price {
  mode: VariantCreatorPricesAndSkuMode;
  attribute: string;
  channels: ChannelPrice[];
  values: Array<AttributeValue<ChannelPrice[]>>;
}
export interface Stock {
  mode: VariantCreatorPricesAndSkuMode;
  attribute: string;
  value: number[];
  values: Array<AttributeValue<number[]>>;
}
export interface Attribute {
  id: string;
  valueRequired: boolean;
  values: Array<AttributeValue<Partial<AttributeValueFragment>>>;
}
export interface ProductVariantCreateFormData {
  attributes: Attribute[];
  price: Price;
  stock: Stock;
  variants: ProductVariantBulkCreateInput[];
  warehouses: string[];
}

export const createInitialForm = (
  attributes: ProductVariantAttributesFragment["productType"]["variantAttributes"],
  channels: ChannelPriceData[],
  warehouses: WarehouseFragment[],
): ProductVariantCreateFormData => {
  const channelListings =
    channels?.map(channel => ({
      channelId: channel.id,
      price: channel.price?.toString() || "",
    })) || [];
  return {
    attributes: attributes.map(attribute => ({
      id: attribute.id,
      valueRequired: attribute.valueRequired,
      values: [],
    })),
    price: {
      attribute: undefined,
      channels: channelListings,
      mode: "all",
      values: [],
    },
    stock: {
      attribute: undefined,
      mode: "all",
      value: warehouses.length === 1 ? [0] : [],
      values: [],
    },
    variants: [],
    warehouses: warehouses.length === 1 ? [warehouses[0].id] : [],
  };
};
