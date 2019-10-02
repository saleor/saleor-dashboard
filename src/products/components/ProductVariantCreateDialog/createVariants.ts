import { ProductVariantBulkCreateInput } from "@saleor/types/globalTypes";
import {
  AllOrAttribute,
  Attribute,
  ProductVariantCreateFormData
} from "./form";

interface CreateVariantAttributeValueInput {
  attributeId: string;
  attributeValueSlug: string;
}
type CreateVariantInput = CreateVariantAttributeValueInput[];

function getAttributeValuePriceOrStock(
  attributes: CreateVariantInput,
  priceOrStock: AllOrAttribute
): string {
  const attribute = attributes.find(
    attribute => attribute.attributeId === priceOrStock.attribute
  );

  const attributeValue = priceOrStock.values.find(
    attributeValue => attribute.attributeValueSlug === attributeValue.slug
  );

  return attributeValue.value;
}

function createVariant(
  data: ProductVariantCreateFormData,
  attributes: CreateVariantInput
): ProductVariantBulkCreateInput {
  const priceOverride = data.price.all
    ? data.price.value
    : getAttributeValuePriceOrStock(attributes, data.price);
  const quantity = parseInt(
    data.stock.all
      ? data.stock.value
      : getAttributeValuePriceOrStock(attributes, data.stock),
    10
  );

  return {
    attributes: attributes.map(attribute => ({
      id: attribute.attributeId,
      values: [attribute.attributeValueSlug]
    })),
    priceOverride,
    quantity,
    sku: ""
  };
}

function addAttributeToVariant(
  attribute: Attribute,
  variant: CreateVariantInput
): CreateVariantInput[] {
  return attribute.values.map(attributeValueSlug => [
    ...variant,
    {
      attributeId: attribute.id,
      attributeValueSlug
    }
  ]);
}
function addVariantAttributeInput(
  data: CreateVariantInput[],
  attribute: Attribute
): CreateVariantInput[] {
  const variants = data
    .map(variant => addAttributeToVariant(attribute, variant))
    .reduce((acc, variantInput) => [...acc, ...variantInput]);

  return variants;
}

export function createVariantFlatMatrixDimension(
  variants: CreateVariantInput[],
  attributes: Attribute[]
): CreateVariantInput[] {
  if (attributes.length > 0) {
    return createVariantFlatMatrixDimension(
      addVariantAttributeInput(variants, attributes[0]),
      attributes.slice(1)
    );
  } else {
    return variants;
  }
}

export function createVariants(
  data: ProductVariantCreateFormData
): ProductVariantBulkCreateInput[] {
  if (
    (!data.price.all && !data.price.attribute) ||
    (!data.stock.all && !data.stock.attribute)
  ) {
    return [];
  }
  const variants = createVariantFlatMatrixDimension([[]], data.attributes).map(
    variant => createVariant(data, variant)
  );

  return variants;
}
