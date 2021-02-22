import {
    PostalCodeRuleInclusionTypeEnum
} from "@saleor/types/globalTypes";

export enum postalCodesReducerActionType {
    setCodesToDelete,
    setInclusionType,
    setOriginalCodes
}

export interface PostalCodesState {
    codesToDelete: string[],
    havePostalCodesChanged: boolean,
    inclusionType: PostalCodeRuleInclusionTypeEnum,
    originalCodes: any[],
    postalCodeRules: any[]
}

function setCodesToDelete(
    state: PostalCodesState,
    codesToDelete: string[]
): PostalCodesState {
    return {
        ...state,
        codesToDelete,
        havePostalCodesChanged: true
    };
}

function setInclusionType(
    state: PostalCodesState,
    inclusion: PostalCodeRuleInclusionTypeEnum
): PostalCodesState {
    return {
        ...state,
        havePostalCodesChanged: true,
        inclusionType: inclusion
    };
}

function setOriginalCodes(
    state: PostalCodesState,
    codes: any
): PostalCodesState {
    return {
        ...state,
        originalCodes: codes,
        postalCodeRules: codes
    };
}

function postalCodesReducer(
    prevState: PostalCodesState,
    action: any
) {
    switch (action.type) {
        case postalCodesReducerActionType.setCodesToDelete:
            return setCodesToDelete(prevState, action.codes);
        case postalCodesReducerActionType.setInclusionType:
            return setInclusionType(prevState, action.inclusion);
        case postalCodesReducerActionType.setOriginalCodes:
            return setOriginalCodes(prevState, action.codes);
        default:
            return prevState;
    }
}

export default postalCodesReducer;
