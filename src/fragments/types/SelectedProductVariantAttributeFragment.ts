/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SelectedProductVariantAttributeFragment
// ====================================================

export interface SelectedProductVariantAttributeFragment_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedProductVariantAttributeFragment_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedProductVariantAttributeFragment_attribute_values_file | null;
}

export interface SelectedProductVariantAttributeFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SelectedProductVariantAttributeFragment_attribute_values | null)[] | null;
}

export interface SelectedProductVariantAttributeFragment_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedProductVariantAttributeFragment_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedProductVariantAttributeFragment_values_file | null;
}

export interface SelectedProductVariantAttributeFragment {
  __typename: "SelectedAttribute";
  attribute: SelectedProductVariantAttributeFragment_attribute;
  values: (SelectedProductVariantAttributeFragment_values | null)[];
}
