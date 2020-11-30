/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingMethodZipCodeRangeUnassign
// ====================================================

export interface ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete_shippingMethod_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete_shippingMethod_zipCodeRules | null)[] | null;
}

export interface ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete {
  __typename: "ShippingZipCodeRulesDelete";
  errors: ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete_errors[];
  shippingMethod: ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete_shippingMethod | null;
}

export interface ShippingMethodZipCodeRangeUnassign {
  shippingMethodZipCodeRulesDelete: ShippingMethodZipCodeRangeUnassign_shippingMethodZipCodeRulesDelete | null;
}

export interface ShippingMethodZipCodeRangeUnassignVariables {
  id: string;
}
