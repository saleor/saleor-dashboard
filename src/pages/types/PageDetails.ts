/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageDetails
// ====================================================

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

export interface PageDetails_page_pageType_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
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

export interface PageDetails_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  metadata: (PageDetails_page_metadata | null)[];
  privateMetadata: (PageDetails_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
  pageType: PageDetails_page_pageType;
}

export interface PageDetails {
  page: PageDetails_page | null;
}

export interface PageDetailsVariables {
  id: string;
}
