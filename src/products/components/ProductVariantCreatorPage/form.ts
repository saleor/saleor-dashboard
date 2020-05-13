import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";

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
  price: AllOrAttribute<string>;
  stock: AllOrAttribute<number[]>;
  variants: ProductVariantBulkCreateInput[];
  warehouses: string[];
}

export const createInitialForm = (
  attributes: ProductDetails_product_productType_variantAttributes[],
  price: string,
  warehouses: WarehouseFragment[]
): ProductVariantCreateFormData => ({
  attributes: attributes.map(attribute => ({
    id: attribute.id,
    values: []
  })),
  price: {
    attribute: undefined,
    mode: "all",
    value: price || "",
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
