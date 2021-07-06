/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageAttributesFragment
// ====================================================

export interface PageAttributesFragment_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageAttributesFragment_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageAttributesFragment_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageAttributesFragment_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageAttributesFragment_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageAttributesFragment_attributes_attribute_choices_edges_node;
}

export interface PageAttributesFragment_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageAttributesFragment_attributes_attribute_choices_pageInfo;
  edges: PageAttributesFragment_attributes_attribute_choices_edges[];
}

export interface PageAttributesFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: PageAttributesFragment_attributes_attribute_choices | null;
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
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageAttributesFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: PageAttributesFragment_attributes_attribute;
  values: (PageAttributesFragment_attributes_values | null)[];
}

export interface PageAttributesFragment_pageType_attributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageAttributesFragment_pageType_attributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageAttributesFragment_pageType_attributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageAttributesFragment_pageType_attributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageAttributesFragment_pageType_attributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageAttributesFragment_pageType_attributes_choices_edges_node;
}

export interface PageAttributesFragment_pageType_attributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageAttributesFragment_pageType_attributes_choices_pageInfo;
  edges: PageAttributesFragment_pageType_attributes_choices_edges[];
}

export interface PageAttributesFragment_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  choices: PageAttributesFragment_pageType_attributes_choices | null;
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
