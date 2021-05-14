/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum, AttributeEntityTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: AttributeDetailsFragment
// ====================================================

export interface AttributeDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeDetailsFragment_values_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeDetailsFragment_values_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeDetailsFragment_values_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeDetailsFragment_values_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface AttributeDetailsFragment_values_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeDetailsFragment_values_edges_node;
}

export interface AttributeDetailsFragment_values {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeDetailsFragment_values_pageInfo;
  edges: AttributeDetailsFragment_values_edges[];
}

export interface AttributeDetailsFragment {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  unit: MeasurementUnitsEnum | null;
  metadata: (AttributeDetailsFragment_metadata | null)[];
  privateMetadata: (AttributeDetailsFragment_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  storefrontSearchPosition: number;
  valueRequired: boolean;
  values: AttributeDetailsFragment_values | null;
}
