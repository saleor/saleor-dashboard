import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";
import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";

export interface AttributeValue<T> {
  slug: string;
  value: T;
}
export interface AllOrAttribute<T> {
  all: boolean;
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
    all: true,
    attribute: undefined,
    value: price || "",
    values: []
  },
  stock: {
    all: true,
    attribute: undefined,
    value: warehouses.length === 1 ? [0] : [],
    values: []
  },
  variants: [],
  warehouses: warehouses.length === 1 ? [warehouses[0].id] : []
});
