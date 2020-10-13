/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionTranslationUpdateFragment
// ====================================================

export interface CollectionTranslationUpdateFragment_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CollectionTranslationUpdateFragment_translation {
  __typename: "CollectionTranslation";
  id: string;
  descriptionJson: any;
  language: CollectionTranslationUpdateFragment_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionTranslationUpdateFragment {
  __typename: "Collection";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  translation: CollectionTranslationUpdateFragment_translation | null;
}
