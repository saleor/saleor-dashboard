/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SelectedVariantAttributeFragment
// ====================================================

export interface SelectedVariantAttributeFragment_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedVariantAttributeFragment_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedVariantAttributeFragment_attribute_values_file | null;
}

export interface SelectedVariantAttributeFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SelectedVariantAttributeFragment_attribute_values | null)[] | null;
}

export interface SelectedVariantAttributeFragment_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedVariantAttributeFragment_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedVariantAttributeFragment_values_file | null;
}

export interface SelectedVariantAttributeFragment {
  __typename: "SelectedAttribute";
  attribute: SelectedVariantAttributeFragment_attribute;
  values: (SelectedVariantAttributeFragment_values | null)[];
}
