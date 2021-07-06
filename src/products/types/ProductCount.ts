/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductFilterInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductCount
// ====================================================

export interface ProductCount_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface ProductCount {
  products: ProductCount_products | null;
}

export interface ProductCountVariables {
  filter?: ProductFilterInput | null;
  channel?: string | null;
}
