/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodWithZipCodesFragment
// ====================================================

export interface ShippingMethodWithZipCodesFragment_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodWithZipCodesFragment {
  __typename: "ShippingMethod";
  id: string;
  postalCodeRules: (ShippingMethodWithZipCodesFragment_postalCodeRules | null)[] | null;
}
