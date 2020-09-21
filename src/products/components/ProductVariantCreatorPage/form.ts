import { ChannelPriceData } from "@saleor/channels/utils";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";

import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";

export interface AttributeValue<T> {
  slug: string;
  value: T;
}
export type VariantCreatorPricesAndSkuMode = "all" | "attribute" | "skip";
export interface Price<T> {
  mode: VariantCreatorPricesAndSkuMode;
  attribute: string;
  channels: T;
  values: Array<AttributeValue<T>>;
}

export interface AllOrAttribute<T> {
  mode: VariantCreatorPricesAndSkuMode;
  attribute: string;
  value: T;
  values: Array<AttributeValue<T>>;
}
export interface Attribute {
  id: string;
  values: string[];
}
export interface ProductVariantCreateFormData {
  attributes: Attribute[];
  price: Price<Array<{ channelId: string; price: string }>>;
  stock: AllOrAttribute<number[]>;
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
      price: channel.price.toString()
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
