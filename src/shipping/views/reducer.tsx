import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodWithPostalCodesFragment,
} from "@saleor/graphql";

export interface PostalCodesState {
  codesToDelete?: string[];
  havePostalCodesChanged?: boolean;
  inclusionType?: PostalCodeRuleInclusionTypeEnum;
  originalCodes?: ShippingMethodWithPostalCodesFragment["postalCodeRules"];
  postalCodeRules?: ShippingMethodWithPostalCodesFragment["postalCodeRules"];
}

function postalCodesReducer(
  prevState: PostalCodesState,
  newState: PostalCodesState,
) {
  return { ...prevState, ...newState };
}

export default postalCodesReducer;
