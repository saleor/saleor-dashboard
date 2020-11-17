import { ChannelPriceData } from "@saleor/channels/utils";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";

import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";

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
  values: string[];
}
export interface ProductVariantCreateFormData {
  attributes: Attribute[];
  price: Price;
  stock: Stock;
  variants: ProductVariantBulkCreateInput[];
  warehouses: string[];
}

export const createInitialForm = (
  attributes: ProductDetails_product_productType_variantAttributes[],
  channels: ChannelPriceData[],
  warehouses: WarehouseFragment[]
): ProductVariantCreateFormData => {
  const channelListings =
    channels?.map(channel => ({
      channelId: channel.id,
      price: channel.price?.toString() || ""
    })) || [];
  return {
    attributes: attributes.map(attribute => ({
      id: attribute.id,
      values: []
    })),
    price: {
      attribute: undefined,
      channels: channelListings,
      mode: "all",
      values: []
    },
    stock: {
      attribute: undefined,
      mode: "all",
      value: warehouses.length === 1 ? [0] : [],
      values: []
    },
    variants: [],
    warehouses: warehouses.length === 1 ? [warehouses[0].id] : []
  };
};
