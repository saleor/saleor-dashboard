/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TranslationInput, LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProductTranslations
// ====================================================

export interface UpdateProductTranslations_productTranslate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface UpdateProductTranslations_productTranslate_product_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface UpdateProductTranslations_productTranslate_product_translation {
  __typename: "ProductTranslation";
  id: string;
  description: any | null;
  language: UpdateProductTranslations_productTranslate_product_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface UpdateProductTranslations_productTranslate_product {
  __typename: "Product";
  id: string;
  name: string;
  description: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
  translation: UpdateProductTranslations_productTranslate_product_translation | null;
}

export interface UpdateProductTranslations_productTranslate {
  __typename: "ProductTranslate";
  errors: UpdateProductTranslations_productTranslate_errors[];
  product: UpdateProductTranslations_productTranslate_product | null;
}

export interface UpdateProductTranslations {
  productTranslate: UpdateProductTranslations_productTranslate | null;
}

export interface UpdateProductTranslationsVariables {
  id: string;
  input: TranslationInput;
  language: LanguageCodeEnum;
}
