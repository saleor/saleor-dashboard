import {
  ProductDetails_product_productType_variantAttributes,
  ProductDetails_product_productType_variantAttributes_values
} from "@saleor/products/types/ProductDetails";

import { ProductVariantCreateFormData } from "./form";

export function getPriceAttributeValues(
  data: ProductVariantCreateFormData,
  attributes: ProductDetails_product_productType_variantAttributes[]
): ProductDetails_product_productType_variantAttributes_values[] {
  return data.price.mode === "all"
    ? null
    : data.price.attribute
    ? attributes
        .find(attribute => attribute.id === data.price.attribute)
        .values.filter(value =>
          data.attributes
            .find(attribute => attribute.id === data.price.attribute)
            .values.includes(value.slug)
        )
    : [];
}

export function getStockAttributeValues(
  data: ProductVariantCreateFormData,
  attributes: ProductDetails_product_productType_variantAttributes[]
): ProductDetails_product_productType_variantAttributes_values[] {
  return data.stock.mode === "all"
    ? null
    : data.stock.attribute
    ? attributes
        .find(attribute => attribute.id === data.stock.attribute)
        .values.filter(value =>
          data.attributes
            .find(attribute => attribute.id === data.stock.attribute)
            .values.includes(value.slug)
        )
    : [];
}
