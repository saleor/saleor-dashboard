/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShippingMethodWithZipCodesFragment
// ====================================================

export interface ShippingMethodWithZipCodesFragment_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodWithZipCodesFragment {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (ShippingMethodWithZipCodesFragment_zipCodeRules | null)[] | null;
}
