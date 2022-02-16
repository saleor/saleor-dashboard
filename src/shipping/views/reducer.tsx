import { ShippingMethodWithPostalCodesFragmentFragment } from "@saleor/graphql";
import { PostalCodeRuleInclusionTypeEnum } from "@saleor/types/globalTypes";

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
