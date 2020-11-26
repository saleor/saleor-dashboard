/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingZipCodeCreateInput, ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingMethodZipCodeRangeAssign
// ====================================================

export interface ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeCreate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeCreate {
  __typename: "ShippingZipCodeCreate";
  errors: ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeCreate_errors[];
}

export interface ShippingMethodZipCodeRangeAssign {
  shippingMethodZipCodeCreate: ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeCreate | null;
}

export interface ShippingMethodZipCodeRangeAssignVariables {
  input: ShippingZipCodeCreateInput;
}
