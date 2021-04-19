/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InitialProductFilterProductTypes
// ====================================================

export interface InitialProductFilterProductTypes_productTypes_edges_node {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface InitialProductFilterProductTypes_productTypes_edges {
  __typename: "ProductTypeCountableEdge";
  node: InitialProductFilterProductTypes_productTypes_edges_node;
}

export interface InitialProductFilterProductTypes_productTypes {
  __typename: "ProductTypeCountableConnection";
  edges: InitialProductFilterProductTypes_productTypes_edges[];
}

export interface InitialProductFilterProductTypes {
  productTypes: InitialProductFilterProductTypes_productTypes | null;
}

export interface InitialProductFilterProductTypesVariables {
  productTypes?: string[] | null;
}
