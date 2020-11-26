/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingPriceExcludeProductsInput, ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingPriceExcludeProduct
// ====================================================

export interface ShippingPriceExcludeProduct_shippingPriceExcludeProducts_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface ShippingPriceExcludeProduct_shippingPriceExcludeProducts {
  __typename: "ShippingPriceExcludeProducts";
  errors: ShippingPriceExcludeProduct_shippingPriceExcludeProducts_errors[];
}

export interface ShippingPriceExcludeProduct {
  shippingPriceExcludeProducts: ShippingPriceExcludeProduct_shippingPriceExcludeProducts | null;
}

export interface ShippingPriceExcludeProductVariables {
  id: string;
  input: ShippingPriceExcludeProductsInput;
}
