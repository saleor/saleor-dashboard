/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageDetails
// ====================================================

export interface PageDetails_page_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageDetails_page_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetails_page_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetails_page_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageDetails_page_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageDetails_page_attributes_attribute_choices_edges_node;
}

export interface PageDetails_page_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageDetails_page_attributes_attribute_choices_pageInfo;
  edges: PageDetails_page_attributes_attribute_choices_edges[];
}

export interface PageDetails_page_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: PageDetails_page_attributes_attribute_choices | null;
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
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageDetails_page_attributes {
  __typename: "SelectedAttribute";
  attribute: PageDetails_page_attributes_attribute;
  values: (PageDetails_page_attributes_values | null)[];
}

export interface PageDetails_page_pageType_attributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageDetails_page_pageType_attributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetails_page_pageType_attributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetails_page_pageType_attributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageDetails_page_pageType_attributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageDetails_page_pageType_attributes_choices_edges_node;
}

export interface PageDetails_page_pageType_attributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageDetails_page_pageType_attributes_choices_pageInfo;
  edges: PageDetails_page_pageType_attributes_choices_edges[];
}

export interface PageDetails_page_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  choices: PageDetails_page_pageType_attributes_choices | null;
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
  content: any | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageDetails {
  page: PageDetails_page | null;
}

export interface PageDetailsVariables {
  id: string;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
