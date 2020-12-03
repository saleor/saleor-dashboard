/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageDetails
// ====================================================

export interface PageDetails_page_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetails_page_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetails_page_attributes_attribute_values_file | null;
}

export interface PageDetails_page_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageDetails_page_attributes_attribute_values | null)[] | null;
}

export interface PageDetails_page_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetails_page_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetails_page_attributes_values_file | null;
}

export interface PageDetails_page_attributes {
  __typename: "SelectedAttribute";
  attribute: PageDetails_page_attributes_attribute;
  values: (PageDetails_page_attributes_values | null)[];
}

export interface PageDetails_page_pageType_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetails_page_pageType_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetails_page_pageType_attributes_values_file | null;
}

export interface PageDetails_page_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageDetails_page_pageType_attributes_values | null)[] | null;
}

export interface PageDetails_page_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (PageDetails_page_pageType_attributes | null)[] | null;
}

export interface PageDetails_page_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageDetails_page_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageDetails_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  attributes: PageDetails_page_attributes[];
  pageType: PageDetails_page_pageType;
  metadata: (PageDetails_page_metadata | null)[];
  privateMetadata: (PageDetails_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageDetails {
  page: PageDetails_page | null;
}

export interface PageDetailsVariables {
  id: string;
}
