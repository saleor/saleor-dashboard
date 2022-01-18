/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShippingPriceTranslationInput, LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateShippingMethodTranslations
// ====================================================

export interface UpdateShippingMethodTranslations_shippingPriceTranslate_errors {
  __typename: "TranslationError";
  field: string | null;
  message: string | null;
}

export interface UpdateShippingMethodTranslations_shippingPriceTranslate_shippingMethod_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface UpdateShippingMethodTranslations_shippingPriceTranslate_shippingMethod_translation {
  __typename: "ShippingMethodTranslation";
  id: string;
  language: UpdateShippingMethodTranslations_shippingPriceTranslate_shippingMethod_translation_language;
  name: string | null;
  description: any | null;
}

export interface UpdateShippingMethodTranslations_shippingPriceTranslate_shippingMethod {
  __typename: "ShippingMethodType";
  id: string;
  name: string;
  description: any | null;
  translation: UpdateShippingMethodTranslations_shippingPriceTranslate_shippingMethod_translation | null;
}

export interface UpdateShippingMethodTranslations_shippingPriceTranslate {
  __typename: "ShippingPriceTranslate";
  errors: UpdateShippingMethodTranslations_shippingPriceTranslate_errors[];
  shippingMethod: UpdateShippingMethodTranslations_shippingPriceTranslate_shippingMethod | null;
}

export interface UpdateShippingMethodTranslations {
  shippingPriceTranslate: UpdateShippingMethodTranslations_shippingPriceTranslate | null;
}

export interface UpdateShippingMethodTranslationsVariables {
  id: string;
  input: ShippingPriceTranslationInput;
  language: LanguageCodeEnum;
}
