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

function getAttributeValuePriceOrStock<T>(
  attributes: CreateVariantInput,
  priceOrStock: AllOrAttribute<T>
): T {
  const attribute = attributes.find(
    attribute => attribute.attributeId === priceOrStock.attribute
  );

  const attributeValue = priceOrStock.values.find(
    attributeValue => attribute.attributeValueSlug === attributeValue.slug
  );

  return attributeValue.value;
}

function getValueFromMode<T>(
  attributes: CreateVariantInput,
  priceOrStock: AllOrAttribute<T>,
  skipValue: T
): T {
  switch (priceOrStock.mode) {
    case "all":
      return priceOrStock.value;
    case "attribute":
      return getAttributeValuePriceOrStock(attributes, priceOrStock);
    case "skip":
      return skipValue;
  }
}

function createVariant(
  data: ProductVariantCreateFormData,
  attributes: CreateVariantInput
): ProductVariantBulkCreateInput {
  const price = getValueFromMode(attributes, data.price, "0");
  const stocks = getValueFromMode(
    attributes,
    data.stock,
    data.warehouses.map(() => 0)
  );

  return {
    attributes: attributes.map(attribute => ({
      id: attribute.attributeId,
      values: [attribute.attributeValueSlug]
    })),
    price,
    sku: "",
    stocks: stocks.map((quantity, stockIndex) => ({
      quantity,
      warehouse: data.warehouses[stockIndex]
    }))
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
    (data.price.mode === "attribute" && !data.price.attribute) ||
    (data.stock.mode === "attribute" && !data.stock.attribute)
  ) {
    return [];
  }
  const variants = createVariantFlatMatrixDimension(
    [[]],
    data.attributes
  ).map(variant => createVariant(data, variant));

  return variants;
}
