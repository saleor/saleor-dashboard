/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductSetAvailabilityForPurchase
// ====================================================

export interface ProductSetAvailabilityForPurchase_productSetAvailabilityForPurchase_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
}

export interface ProductSetAvailabilityForPurchase_productSetAvailabilityForPurchase {
  __typename: "ProductSetAvailabilityForPurchase";
  errors: ProductSetAvailabilityForPurchase_productSetAvailabilityForPurchase_errors[];
}

export interface ProductSetAvailabilityForPurchase {
  productSetAvailabilityForPurchase: ProductSetAvailabilityForPurchase_productSetAvailabilityForPurchase | null;
}

export interface ProductSetAvailabilityForPurchaseVariables {
  isAvailable: boolean;
  productId: string;
  startDate?: any | null;
}
