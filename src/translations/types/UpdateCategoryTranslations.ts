/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TranslationInput, LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateCategoryTranslations
// ====================================================

export interface UpdateCategoryTranslations_categoryTranslate_errors {
  __typename: "TranslationError";
  field: string | null;
  message: string | null;
}

export interface UpdateCategoryTranslations_categoryTranslate_category_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface UpdateCategoryTranslations_categoryTranslate_category_translation {
  __typename: "CategoryTranslation";
  id: string;
  description: any | null;
  language: UpdateCategoryTranslations_categoryTranslate_category_translation_language;
  name: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface UpdateCategoryTranslations_categoryTranslate_category {
  __typename: "Category";
  id: string;
  name: string;
  description: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
  translation: UpdateCategoryTranslations_categoryTranslate_category_translation | null;
}

export interface UpdateCategoryTranslations_categoryTranslate {
  __typename: "CategoryTranslate";
  errors: UpdateCategoryTranslations_categoryTranslate_errors[];
  category: UpdateCategoryTranslations_categoryTranslate_category | null;
}

export interface UpdateCategoryTranslations {
  categoryTranslate: UpdateCategoryTranslations_categoryTranslate | null;
}

export interface UpdateCategoryTranslationsVariables {
  id: string;
  input: TranslationInput;
  language: LanguageCodeEnum;
}
