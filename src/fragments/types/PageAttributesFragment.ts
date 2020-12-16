/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageAttributesFragment
// ====================================================

export interface PageAttributesFragment_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageAttributesFragment_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageAttributesFragment_attributes_attribute_values_file | null;
}

export interface PageAttributesFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageAttributesFragment_attributes_attribute_values | null)[] | null;
}

export interface PageAttributesFragment_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageAttributesFragment_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageAttributesFragment_attributes_values_file | null;
}

export interface PageAttributesFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: PageAttributesFragment_attributes_attribute;
  values: (PageAttributesFragment_attributes_values | null)[];
}

export interface PageAttributesFragment_pageType_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageAttributesFragment_pageType_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageAttributesFragment_pageType_attributes_values_file | null;
}

export interface PageAttributesFragment_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageAttributesFragment_pageType_attributes_values | null)[] | null;
}

export interface PageAttributesFragment_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (PageAttributesFragment_pageType_attributes | null)[] | null;
}

export interface PageAttributesFragment {
  __typename: "Page";
  attributes: PageAttributesFragment_attributes[];
  pageType: PageAttributesFragment_pageType;
}
