/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductCreateInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductCreate
// ====================================================

export interface ProductCreate_productCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface ProductCreate_productCreate_product {
  __typename: "Product";
  id: string;
}

export interface ProductCreate_productCreate {
  __typename: "ProductCreate";
  errors: ProductCreate_productCreate_errors[];
  product: ProductCreate_productCreate_product | null;
}

export interface ProductCreate {
  productCreate: ProductCreate_productCreate | null;
}

export interface ProductCreateVariables {
  input: ProductCreateInput;
}
