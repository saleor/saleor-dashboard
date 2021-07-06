/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: VariantAttributeFragment
// ====================================================

export interface VariantAttributeFragment_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VariantAttributeFragment_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantAttributeFragment_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantAttributeFragment_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface VariantAttributeFragment_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: VariantAttributeFragment_choices_edges_node;
}

export interface VariantAttributeFragment_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: VariantAttributeFragment_choices_pageInfo;
  edges: VariantAttributeFragment_choices_edges[];
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
  choices: VariantAttributeFragment_choices | null;
}
