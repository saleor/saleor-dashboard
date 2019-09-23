import { ProductVariantCreateInput } from "@saleor/types/globalTypes";
import { Attribute, ProductVariantCreateFormData } from "./form";

interface CreateVariantAttributeValueInput {
  attributeId: string;
  attributeValueId: string;
}
type CreateVariantInput = CreateVariantAttributeValueInput[];
function createVariant(
  data: ProductVariantCreateFormData,
  attributes: CreateVariantInput
): ProductVariantCreateInput {
  const priceOverride = data.price.all
    ? data.price.value
    : data.price.values.find(
        value =>
          attributes.find(
            attribute => attribute.attributeId === data.price.attribute
          ).attributeValueId === value.id
      ).value;
  const quantity = parseInt(
    data.stock.all
      ? data.stock.value
      : data.stock.values.find(
          value =>
            attributes.find(
              attribute => attribute.attributeId === data.stock.attribute
            ).attributeValueId === value.id
        ).value,
    10
  );

  return {
    attributes: attributes.map(attribute => ({
      id: attribute.attributeId,
      values: [attribute.attributeValueId]
    })),
    priceOverride,
    product: "",
    quantity
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
  const variants = createVariantFlatMatrixDimension([[]], data.attributes).map(
    variant => createVariant(data, variant)
  );

  return variants;
}
