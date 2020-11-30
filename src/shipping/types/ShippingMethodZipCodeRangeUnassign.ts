/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingMethodZipCodeRangeUnassign
// ====================================================

export interface ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeDelete_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeDelete {
  __typename: "ShippingZipCodeDelete";
  errors: ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeDelete_errors[];
}

export interface ShippingMethodZipCodeRangeUnassign {
  shippingMethodZipCodeDelete: ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeDelete | null;
}

export interface ShippingMethodZipCodeRangeUnassignVariables {
  id: string;
}
