import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";

export interface AttributeValue {
  slug: string;
  value: string;
}
export interface AllOrAttribute {
  all: boolean;
  attribute: string;
  value: string;
  values: AttributeValue[];
}
export interface Attribute {
  id: string;
  values: string[];
}
export interface ProductVariantCreateFormData {
  attributes: Attribute[];
  price: AllOrAttribute;
  stock: AllOrAttribute;
  variants: ProductVariantBulkCreateInput[];
}

export const createInitialForm = (
  attributes: ProductDetails_product_productType_variantAttributes[],
  price: string
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
    value: "",
    values: []
  },
  variants: []
});
