import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import {
  ProductDetails_product_productType_variantAttributes,
  ProductDetails_product_productType_variantAttributes_choices_edges_node
} from "@saleor/products/types/ProductDetails";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";

import { AttributeValue, ProductVariantCreateFormData } from "./form";

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

export const getBySlug = (slugToCompare: string) => (obj: { slug: string }) =>
  obj.slug === slugToCompare;

export const getBooleanAttributeValue = (
  attributeName: string,
  attributeValue: boolean
): AttributeValue<Partial<AttributeValueFragment>> => ({
  slug: attributeValue.toString(),
  value: {
    boolean: attributeValue,
    name: `${attributeName}: ${attributeValue ? "Yes" : "No"}`
  }
});

export const getBasicAttributeValue = (
  attributeId: string,
  attributeValue: string,
  attributeValues: SearchAttributeValues_attribute_choices_edges_node[],
  data: ProductVariantCreateFormData
): AttributeValue<Partial<AttributeValueFragment>> => {
  const dataAttribute = data.attributes.find(getById(attributeId));

  return {
    slug: attributeValue,
    value:
      dataAttribute?.values.find(getBySlug(attributeValue))?.value ||
      attributeValues.find(getBySlug(attributeValue))
  };
};
