/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NameTranslationInput, LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProductVariantTranslations
// ====================================================

export interface UpdateProductVariantTranslations_productVariantTranslate_errors {
  __typename: "TranslationError";
  field: string | null;
  message: string | null;
}

export interface UpdateProductVariantTranslations_productVariantTranslate_productVariant_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface UpdateProductVariantTranslations_productVariantTranslate_productVariant_translation {
  __typename: "ProductVariantTranslation";
  id: string;
  name: string;
  language: UpdateProductVariantTranslations_productVariantTranslate_productVariant_translation_language;
}

export interface UpdateProductVariantTranslations_productVariantTranslate_productVariant {
  __typename: "ProductVariant";
  id: string;
  name: string;
  translation: UpdateProductVariantTranslations_productVariantTranslate_productVariant_translation | null;
}

export interface UpdateProductVariantTranslations_productVariantTranslate {
  __typename: "ProductVariantTranslate";
  errors: UpdateProductVariantTranslations_productVariantTranslate_errors[];
  productVariant: UpdateProductVariantTranslations_productVariantTranslate_productVariant | null;
}

export interface UpdateProductVariantTranslations {
  productVariantTranslate: UpdateProductVariantTranslations_productVariantTranslate | null;
}

export interface UpdateProductVariantTranslationsVariables {
  id: string;
  input: NameTranslationInput;
  language: LanguageCodeEnum;
}
