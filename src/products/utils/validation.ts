import {
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";

import { ProductCreateData } from "../components/ProductCreatePage";
import { ProductVariantCreateData } from "../components/ProductVariantCreatePage/form";
import { ProductVariantUpdateSubmitData } from "../components/ProductVariantPage/form";

export const validatePrice = (price: string) =>
  price === "" || parseInt(price, 10) < 0;

export const validateCostPrice = (price: string) =>
  price !== "" && parseInt(price, 10) < 0;

const createEmptyRequiredError = (
  field: string,
): ProductErrorWithAttributesFragment => ({
  __typename: "ProductError",
  code: ProductErrorCode.REQUIRED,
  field,
  message: null,
  attributes: [],
});

export const validateProductCreateData = (data: ProductCreateData) => {
  let errors: ProductErrorWithAttributesFragment[] = [];

  if (!data.productType) {
    errors = [...errors, createEmptyRequiredError("productType")];
  }

  if (!data.name) {
    errors = [...errors, createEmptyRequiredError("name")];
  }

  return errors;
};

export const validateVariantData = (
  data: ProductVariantCreateData | ProductVariantUpdateSubmitData,
): ProductErrorWithAttributesFragment[] =>
  !data.variantName ? [createEmptyRequiredError("variantName")] : [];
