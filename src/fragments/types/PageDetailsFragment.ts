/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageDetailsFragment
// ====================================================

export interface PageDetailsFragment_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageDetailsFragment_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetailsFragment_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetailsFragment_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageDetailsFragment_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageDetailsFragment_attributes_attribute_choices_edges_node;
}

export interface PageDetailsFragment_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageDetailsFragment_attributes_attribute_choices_pageInfo;
  edges: PageDetailsFragment_attributes_attribute_choices_edges[];
}

export interface PageDetailsFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: PageDetailsFragment_attributes_attribute_choices | null;
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
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageDetailsFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: PageDetailsFragment_attributes_attribute;
  values: (PageDetailsFragment_attributes_values | null)[];
}

export interface PageDetailsFragment_pageType_attributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageDetailsFragment_pageType_attributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageDetailsFragment_pageType_attributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageDetailsFragment_pageType_attributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageDetailsFragment_pageType_attributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageDetailsFragment_pageType_attributes_choices_edges_node;
}

export interface PageDetailsFragment_pageType_attributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageDetailsFragment_pageType_attributes_choices_pageInfo;
  edges: PageDetailsFragment_pageType_attributes_choices_edges[];
}

export interface PageDetailsFragment_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  choices: PageDetailsFragment_pageType_attributes_choices | null;
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
  content: any | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}
