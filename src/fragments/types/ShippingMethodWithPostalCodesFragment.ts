/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodWithPostalCodesFragment
// ====================================================

export interface ShippingMethodWithPostalCodesFragment_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodWithPostalCodesFragment {
  __typename: "ShippingMethod";
  id: string;
  postalCodeRules: (ShippingMethodWithPostalCodesFragment_postalCodeRules | null)[] | null;
}
