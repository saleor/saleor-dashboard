/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: InitialProductFilterAttributes
// ====================================================

export interface InitialProductFilterAttributes_attributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  boolean: boolean | null;
}

export interface InitialProductFilterAttributes_attributes_edges_node {
  __typename: "Attribute";
  id: string;
  inputType: AttributeInputTypeEnum | null;
  name: string | null;
  slug: string | null;
  values: (InitialProductFilterAttributes_attributes_edges_node_values | null)[] | null;
}

export interface InitialProductFilterAttributes_attributes_edges {
  __typename: "AttributeCountableEdge";
  node: InitialProductFilterAttributes_attributes_edges_node;
}

export interface InitialProductFilterAttributes_attributes {
  __typename: "AttributeCountableConnection";
  edges: InitialProductFilterAttributes_attributes_edges[];
}

export interface InitialProductFilterAttributes {
  attributes: InitialProductFilterAttributes_attributes | null;
}
