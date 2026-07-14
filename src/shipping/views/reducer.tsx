import {
  type PostalCodeRuleInclusionTypeEnum,
  type ShippingMethodWithPostalCodesFragment,
} from "@dashboard/graphql";

interface PostalCodesState {
  codesToDelete?: string[];
  inclusionType?: PostalCodeRuleInclusionTypeEnum;
  originalCodes?: ShippingMethodWithPostalCodesFragment["postalCodeRules"];
  postalCodeRules?: ShippingMethodWithPostalCodesFragment["postalCodeRules"];
}

function postalCodesReducer(prevState: PostalCodesState, newState: PostalCodesState) {
  return { ...prevState, ...newState };
}

export default postalCodesReducer;
