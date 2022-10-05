import {
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
} from "@saleor/graphql";

import { ProductCreateData } from "../components/ProductCreatePage";

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
