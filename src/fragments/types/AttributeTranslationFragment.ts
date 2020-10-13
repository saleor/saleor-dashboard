/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AttributeTranslationFragment
// ====================================================

export interface AttributeTranslationFragment_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslationFragment_attribute_values_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslationFragment_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  translation: AttributeTranslationFragment_attribute_values_translation | null;
}

export interface AttributeTranslationFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (AttributeTranslationFragment_attribute_values | null)[] | null;
}

export interface AttributeTranslationFragment {
  __typename: "AttributeTranslatableContent";
  translation: AttributeTranslationFragment_translation | null;
  attribute: AttributeTranslationFragment_attribute | null;
}
