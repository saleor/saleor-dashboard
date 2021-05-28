/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SelectedVariantAttributeFragment
// ====================================================

export interface SelectedVariantAttributeFragment_attribute_values_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SelectedVariantAttributeFragment_attribute_values_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedVariantAttributeFragment_attribute_values_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedVariantAttributeFragment_attribute_values_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface SelectedVariantAttributeFragment_attribute_values_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: SelectedVariantAttributeFragment_attribute_values_edges_node;
}

export interface SelectedVariantAttributeFragment_attribute_values {
  __typename: "AttributeValueCountableConnection";
  pageInfo: SelectedVariantAttributeFragment_attribute_values_pageInfo;
  edges: SelectedVariantAttributeFragment_attribute_values_edges[];
}

export interface SelectedVariantAttributeFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  values: SelectedVariantAttributeFragment_attribute_values | null;
}

export interface SelectedVariantAttributeFragment_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedVariantAttributeFragment_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedVariantAttributeFragment_values_file | null;
  reference: string | null;
  richText: any | null;
}

export interface SelectedVariantAttributeFragment {
  __typename: "SelectedAttribute";
  attribute: SelectedVariantAttributeFragment_attribute;
  values: (SelectedVariantAttributeFragment_values | null)[];
}
