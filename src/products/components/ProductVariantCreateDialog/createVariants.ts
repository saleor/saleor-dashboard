import { ProductVariantCreateInput } from "@saleor/types/globalTypes";
import {
  AllOrAttribute,
  Attribute,
  ProductVariantCreateFormData
} from "./form";

interface CreateVariantAttributeValueInput {
  attributeId: string;
  attributeValueId: string;
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
    attributeValue => attribute.attributeValueId === attributeValue.id
  );

  return attributeValue.value;
}

function createVariant(
  data: ProductVariantCreateFormData,
  attributes: CreateVariantInput
): ProductVariantCreateInput {
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
      values: [attribute.attributeValueId]
    })),
    priceOverride,
    product: "",
    quantity,
    sku: ""
  };
}

function addAttributeToVariant(
  attribute: Attribute,
  variant: CreateVariantInput
): CreateVariantInput[] {
  return attribute.values.map(attributeValueId => [
    ...variant,
    {
      attributeId: attribute.id,
      attributeValueId
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
): ProductVariantCreateInput[] {
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
