/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: SearchProductTypes
// ====================================================

export interface SearchProductTypes_productTypes_edges_node_productAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SearchProductTypes_productTypes_edges_node_productAttributes {
  __typename: "Attribute";
  id: string;
  inputType: AttributeInputTypeEnum | null;
  slug: string | null;
  name: string | null;
  valueRequired: boolean;
  values: (SearchProductTypes_productTypes_edges_node_productAttributes_values | null)[] | null;
}

export interface SearchProductTypes_productTypes_edges_node {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  productAttributes: (SearchProductTypes_productTypes_edges_node_productAttributes | null)[] | null;
}

export interface SearchProductTypes_productTypes_edges {
  __typename: "ProductTypeCountableEdge";
  node: SearchProductTypes_productTypes_edges_node;
}

export interface SearchProductTypes_productTypes {
  __typename: "ProductTypeCountableConnection";
  edges: SearchProductTypes_productTypes_edges[];
}

export interface SearchProductTypes {
  productTypes: SearchProductTypes_productTypes | null;
}

export interface SearchProductTypesVariables {
  after?: string | null;
  first: number;
  query: string;
}
