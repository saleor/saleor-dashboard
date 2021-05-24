/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum, AttributeEntityTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: AttributeDetails
// ====================================================

export interface AttributeDetails_attribute_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeDetails_attribute_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeDetails_attribute_values_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeDetails_attribute_values_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeDetails_attribute_values_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeDetails_attribute_values_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface AttributeDetails_attribute_values_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeDetails_attribute_values_edges_node;
}

export interface AttributeDetails_attribute_values {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeDetails_attribute_values_pageInfo;
  edges: AttributeDetails_attribute_values_edges[];
}

export interface AttributeDetails_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  unit: MeasurementUnitsEnum | null;
  metadata: (AttributeDetails_attribute_metadata | null)[];
  privateMetadata: (AttributeDetails_attribute_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  storefrontSearchPosition: number;
  valueRequired: boolean;
  values: AttributeDetails_attribute_values | null;
}

export interface AttributeDetails {
  attribute: AttributeDetails_attribute | null;
}

export interface AttributeDetailsVariables {
  id: string;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
