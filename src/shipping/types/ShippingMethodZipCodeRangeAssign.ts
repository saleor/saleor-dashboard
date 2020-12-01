/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingZipCodeRulesCreateInput, ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingMethodZipCodeRangeAssign
// ====================================================

export interface ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate_shippingMethod_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate_shippingMethod_zipCodeRules | null)[] | null;
}

export interface ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate {
  __typename: "ShippingZipCodeRulesCreate";
  errors: ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate_errors[];
  shippingMethod: ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate_shippingMethod | null;
}

export interface ShippingMethodZipCodeRangeAssign {
  shippingMethodZipCodeRulesCreate: ShippingMethodZipCodeRangeAssign_shippingMethodZipCodeRulesCreate | null;
}

export interface ShippingMethodZipCodeRangeAssignVariables {
  id: string;
  input: ShippingZipCodeRulesCreateInput;
}
