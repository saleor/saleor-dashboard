import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodWithPostalCodesFragmentFragment
} from "@saleor/graphql";

export interface PostalCodesState {
  codesToDelete?: string[];
  havePostalCodesChanged?: boolean;
  inclusionType?: PostalCodeRuleInclusionTypeEnum;
  originalCodes?: ShippingMethodWithPostalCodesFragmentFragment["postalCodeRules"];
  postalCodeRules?: ShippingMethodWithPostalCodesFragmentFragment["postalCodeRules"];
}

function postalCodesReducer(
  prevState: PostalCodesState,
  newState: PostalCodesState
) {
  return { ...prevState, ...newState };
}

export default postalCodesReducer;
