/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageCreateInput, PageErrorCode, AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageCreate
// ====================================================

export interface PageCreate_pageCreate_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
  attributes: string[] | null;
  message: string | null;
}

export interface PageCreate_pageCreate_page_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageCreate_pageCreate_page_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageCreate_pageCreate_page_attributes_attribute_values_file | null;
}

export interface PageCreate_pageCreate_page_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageCreate_pageCreate_page_attributes_attribute_values | null)[] | null;
}

export interface PageCreate_pageCreate_page_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageCreate_pageCreate_page_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageCreate_pageCreate_page_attributes_values_file | null;
}

export interface PageCreate_pageCreate_page_attributes {
  __typename: "SelectedAttribute";
  attribute: PageCreate_pageCreate_page_attributes_attribute;
  values: (PageCreate_pageCreate_page_attributes_values | null)[];
}

export interface PageCreate_pageCreate_page_pageType_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageCreate_pageCreate_page_pageType_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageCreate_pageCreate_page_pageType_attributes_values_file | null;
}

export interface PageCreate_pageCreate_page_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (PageCreate_pageCreate_page_pageType_attributes_values | null)[] | null;
}

export interface PageCreate_pageCreate_page_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (PageCreate_pageCreate_page_pageType_attributes | null)[] | null;
}

export interface PageCreate_pageCreate_page_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageCreate_pageCreate_page_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageCreate_pageCreate_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  attributes: PageCreate_pageCreate_page_attributes[];
  pageType: PageCreate_pageCreate_page_pageType;
  metadata: (PageCreate_pageCreate_page_metadata | null)[];
  privateMetadata: (PageCreate_pageCreate_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageCreate_pageCreate {
  __typename: "PageCreate";
  errors: PageCreate_pageCreate_errors[];
  page: PageCreate_pageCreate_page | null;
}

export interface PageCreate {
  pageCreate: PageCreate_pageCreate | null;
}

export interface PageCreateVariables {
  input: PageCreateInput;
}
