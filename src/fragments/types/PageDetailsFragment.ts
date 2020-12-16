/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageDetailsFragment
// ====================================================

export interface PageDetailsFragment_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetailsFragment_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetailsFragment_attributes_attribute_values_file | null;
}

export interface PageDetailsFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageDetailsFragment_attributes_attribute_values | null)[] | null;
}

export interface PageDetailsFragment_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetailsFragment_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetailsFragment_attributes_values_file | null;
}

export interface PageDetailsFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: PageDetailsFragment_attributes_attribute;
  values: (PageDetailsFragment_attributes_values | null)[];
}

export interface PageDetailsFragment_pageType_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetailsFragment_pageType_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetailsFragment_pageType_attributes_values_file | null;
}

export interface PageDetailsFragment_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageDetailsFragment_pageType_attributes_values | null)[] | null;
}

export interface PageDetailsFragment_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (PageDetailsFragment_pageType_attributes | null)[] | null;
}

export interface PageDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageDetailsFragment {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  attributes: PageDetailsFragment_attributes[];
  pageType: PageDetailsFragment_pageType;
  metadata: (PageDetailsFragment_metadata | null)[];
  privateMetadata: (PageDetailsFragment_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}
