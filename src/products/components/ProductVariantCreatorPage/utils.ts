import {
  AttributeValueFragment,
  ProductVariantAttributesFragment,
  SearchAttributeValuesQuery
} from "@saleor/graphql";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { RelayToFlat } from "@saleor/types";

import { AttributeValue, ProductVariantCreateFormData } from "./form";

export function getPriceAttributeValues(
  data: ProductVariantCreateFormData,
  attributes: ProductVariantAttributesFragment["productType"]["variantAttributes"]
): AttributeValueFragment[] {
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
  attributes: ProductVariantAttributesFragment["productType"]["variantAttributes"]
): AttributeValueFragment[] {
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
  attributeValues: RelayToFlat<
    SearchAttributeValuesQuery["attribute"]["choices"]
  >,
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
