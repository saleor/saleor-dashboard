import { ShippingZone_shippingZone_shippingMethods_postalCodeRules } from "@saleor/shipping/types/ShippingZone";
import { PostalCodeRuleInclusionTypeEnum } from "@saleor/types/globalTypes";

export interface PostalCodesState {
  codesToDelete: string[];
  havePostalCodesChanged: boolean;
  inclusionType: PostalCodeRuleInclusionTypeEnum;
  originalCodes: ShippingZone_shippingZone_shippingMethods_postalCodeRules[];
  postalCodeRules: ShippingZone_shippingZone_shippingMethods_postalCodeRules[];
}

function setPostalCodes(
  state: PostalCodesState,
  newStateProps: any
): PostalCodesState {
  return {
    ...state,
    ...newStateProps
  };
}

function postalCodesReducer(prevState: PostalCodesState, newProps: any) {
  if (newProps?.updateStateProps) {
    return setPostalCodes(prevState, newProps.updateStateProps);
  }
  return prevState;
}

export default postalCodesReducer;
