/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CategoryTranslationUpdateFragment
// ====================================================

export interface CategoryTranslationUpdateFragment_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CategoryTranslationUpdateFragment_translation {
  __typename: "CategoryTranslation";
  id: string;
  descriptionJson: any;
  language: CategoryTranslationUpdateFragment_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslationUpdateFragment {
  __typename: "Category";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  translation: CategoryTranslationUpdateFragment_translation | null;
}
