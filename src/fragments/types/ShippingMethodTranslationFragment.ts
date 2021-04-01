/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodTranslationFragment
// ====================================================

export interface ShippingMethodTranslationFragment_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface ShippingMethodTranslationFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ShippingMethodTranslationFragment_translation {
  __typename: "ShippingMethodTranslation";
  id: string;
  language: ShippingMethodTranslationFragment_translation_language;
  name: string | null;
}

export interface ShippingMethodTranslationFragment {
  __typename: "ShippingMethodTranslatableContent";
  shippingMethod: ShippingMethodTranslationFragment_shippingMethod | null;
  id: string;
  name: string;
  translation: ShippingMethodTranslationFragment_translation | null;
}
