import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";

import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";

export interface AttributeValue<T> {
  slug: string;
  value: T;
}
export type VariantCreatorPricesAndSkuMode = "all" | "attribute" | "skip";
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
  channelListings: any[];
  price: AllOrAttribute<string>;
  stock: AllOrAttribute<number[]>;
  variants: ProductVariantBulkCreateInput[];
  warehouses: string[];
}

export const createInitialForm = (
  attributes: ProductDetails_product_productType_variantAttributes[],
  channels: any[],
  warehouses: WarehouseFragment[]
): ProductVariantCreateFormData => ({
  attributes: attributes.map(attribute => ({
    id: attribute.id,
    values: []
  })),
  channelListings: channels,
  price: {
    attribute: undefined,
    mode: "all",
    value: channels[0].price || "",
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
});
