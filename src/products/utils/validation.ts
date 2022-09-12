import {
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
} from "@saleor/graphql";

import { ProductCreateData } from "../components/ProductCreatePage";

export const validatePrice = (price: string) =>
  price === "" || parseInt(price, 10) < 0;

export const validateCostPrice = (price: string) =>
  price !== "" && parseInt(price, 10) < 0;

export const validateProductCreateData = (data: ProductCreateData) => {
  let errors: ProductErrorWithAttributesFragment[] = [];

  if (!data.productType) {
    errors = [
      ...errors,
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "productType",
        message: null,
        attributes: [],
      },
    ];
  }

  if (!data.name) {
    errors = [
      ...errors,
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "name",
        message: null,
        attributes: [],
      },
    ];
  }

  return errors;
};
