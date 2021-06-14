/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: AttributeTranslationFragment
// ====================================================

export interface AttributeTranslationFragment_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslationFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
}

export interface AttributeTranslationFragment {
  __typename: "AttributeTranslatableContent";
  translation: AttributeTranslationFragment_translation | null;
  attribute: AttributeTranslationFragment_attribute | null;
}
