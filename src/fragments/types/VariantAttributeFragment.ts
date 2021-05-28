/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: VariantAttributeFragment
// ====================================================

export interface VariantAttributeFragment_values_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VariantAttributeFragment_values_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantAttributeFragment_values_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantAttributeFragment_values_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface VariantAttributeFragment_values_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: VariantAttributeFragment_values_edges_node;
}

export interface VariantAttributeFragment_values {
  __typename: "AttributeValueCountableConnection";
  pageInfo: VariantAttributeFragment_values_pageInfo;
  edges: VariantAttributeFragment_values_edges[];
}

export interface VariantAttributeFragment {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  values: VariantAttributeFragment_values | null;
}
