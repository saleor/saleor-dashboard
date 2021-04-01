/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CategoryTranslationFragment
// ====================================================

export interface CategoryTranslationFragment_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CategoryTranslationFragment_translation {
  __typename: "CategoryTranslation";
  id: string;
  description: any | null;
  language: CategoryTranslationFragment_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslationFragment_category {
  __typename: "Category";
  id: string;
  name: string;
  description: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslationFragment {
  __typename: "CategoryTranslatableContent";
  translation: CategoryTranslationFragment_translation | null;
  category: CategoryTranslationFragment_category | null;
}
