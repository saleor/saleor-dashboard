/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantPreorderDeactivate
// ====================================================

export interface ProductVariantPreorderDeactivate_productVariantPreorderDeactivate_productVariant_preorder {
  __typename: "PreorderData";
  globalThreshold: number | null;
  globalSoldUnits: number;
  endDate: any | null;
}

export interface ProductVariantPreorderDeactivate_productVariantPreorderDeactivate_productVariant {
  __typename: "ProductVariant";
  id: string;
  preorder: ProductVariantPreorderDeactivate_productVariantPreorderDeactivate_productVariant_preorder | null;
}

export interface ProductVariantPreorderDeactivate_productVariantPreorderDeactivate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantPreorderDeactivate_productVariantPreorderDeactivate {
  __typename: "ProductVariantPreorderDeactivate";
  productVariant: ProductVariantPreorderDeactivate_productVariantPreorderDeactivate_productVariant | null;
  errors: ProductVariantPreorderDeactivate_productVariantPreorderDeactivate_errors[];
}

export interface ProductVariantPreorderDeactivate {
  productVariantPreorderDeactivate: ProductVariantPreorderDeactivate_productVariantPreorderDeactivate | null;
}

export interface ProductVariantPreorderDeactivateVariables {
  id: string;
}
