/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, PageErrorCode, AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageUpdate
// ====================================================

export interface PageUpdate_pageUpdate_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface PageUpdate_pageUpdate_page_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageUpdate_pageUpdate_page_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageUpdate_pageUpdate_page_attributes_attribute_values_file | null;
}

export interface PageUpdate_pageUpdate_page_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageUpdate_pageUpdate_page_attributes_attribute_values | null)[] | null;
}

export interface PageUpdate_pageUpdate_page_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageUpdate_pageUpdate_page_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageUpdate_pageUpdate_page_attributes_values_file | null;
}

export interface PageUpdate_pageUpdate_page_attributes {
  __typename: "SelectedAttribute";
  attribute: PageUpdate_pageUpdate_page_attributes_attribute;
  values: (PageUpdate_pageUpdate_page_attributes_values | null)[];
}

export interface PageUpdate_pageUpdate_page_pageType_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageUpdate_pageUpdate_page_pageType_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageUpdate_pageUpdate_page_pageType_attributes_values_file | null;
}

export interface PageUpdate_pageUpdate_page_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageUpdate_pageUpdate_page_pageType_attributes_values | null)[] | null;
}

export interface PageUpdate_pageUpdate_page_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (PageUpdate_pageUpdate_page_pageType_attributes | null)[] | null;
}

export interface PageUpdate_pageUpdate_page_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageUpdate_pageUpdate_page_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageUpdate_pageUpdate_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  attributes: PageUpdate_pageUpdate_page_attributes[];
  pageType: PageUpdate_pageUpdate_page_pageType;
  metadata: (PageUpdate_pageUpdate_page_metadata | null)[];
  privateMetadata: (PageUpdate_pageUpdate_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageUpdate_pageUpdate {
  __typename: "PageUpdate";
  errors: PageUpdate_pageUpdate_errors[];
  page: PageUpdate_pageUpdate_page | null;
}

export interface PageUpdate {
  pageUpdate: PageUpdate_pageUpdate | null;
}

export interface PageUpdateVariables {
  id: string;
  input: PageInput;
}
