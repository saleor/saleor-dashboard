import {
  ProductDetails_product_productType_variantAttributes,
  ProductDetails_product_productType_variantAttributes_choices_edges_node
} from "@saleor/products/types/ProductDetails";

import { ProductVariantCreateFormData } from "./form";

export function getPriceAttributeValues(
  data: ProductVariantCreateFormData,
  attributes: ProductDetails_product_productType_variantAttributes[]
): ProductDetails_product_productType_variantAttributes_choices_edges_node[] {
  return data.price.mode === "all"
    ? null
    : data.price.attribute
    ? attributes
        .find(attribute => attribute.id === data.price.attribute)
        .choices.edges.filter(value =>
          data.attributes
            .find(attribute => attribute.id === data.price.attribute)
            .values.some(
              attributeValue => attributeValue.slug === value.node.slug
            )
        )
        .map(value => value.node)
    : [];
}

export function getStockAttributeValues(
  data: ProductVariantCreateFormData,
  attributes: ProductDetails_product_productType_variantAttributes[]
): ProductDetails_product_productType_variantAttributes_choices_edges_node[] {
  return data.stock.mode === "all"
    ? null
    : data.stock.attribute
    ? attributes
        .find(attribute => attribute.id === data.stock.attribute)
        .choices.edges.filter(value =>
          data.attributes
            .find(attribute => attribute.id === data.stock.attribute)
            .values.some(
              attributeValue => attributeValue.slug === value.node.slug
            )
        )
        .map(value => value.node)
    : [];
}
