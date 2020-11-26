/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingPriceRemoveProductFromExclude
// ====================================================

export interface ShippingPriceRemoveProductFromExclude_shippingPriceRemoveProductFromExclude_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface ShippingPriceRemoveProductFromExclude_shippingPriceRemoveProductFromExclude {
  __typename: "ShippingPriceRemoveProductFromExclude";
  errors: ShippingPriceRemoveProductFromExclude_shippingPriceRemoveProductFromExclude_errors[];
}

export interface ShippingPriceRemoveProductFromExclude {
  shippingPriceRemoveProductFromExclude: ShippingPriceRemoveProductFromExclude_shippingPriceRemoveProductFromExclude | null;
}

export interface ShippingPriceRemoveProductFromExcludeVariables {
  id: string;
  products: (string | null)[];
}
