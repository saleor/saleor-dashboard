/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InitialProductFilterData
// ====================================================

export interface InitialProductFilterData_attributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface InitialProductFilterData_attributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (InitialProductFilterData_attributes_edges_node_values | null)[] | null;
}

export interface InitialProductFilterData_attributes_edges {
  __typename: "AttributeCountableEdge";
  node: InitialProductFilterData_attributes_edges_node;
}

export interface InitialProductFilterData_attributes {
  __typename: "AttributeCountableConnection";
  edges: InitialProductFilterData_attributes_edges[];
}

export interface InitialProductFilterData_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
}

export interface InitialProductFilterData_categories_edges {
  __typename: "CategoryCountableEdge";
  node: InitialProductFilterData_categories_edges_node;
}

export interface InitialProductFilterData_categories {
  __typename: "CategoryCountableConnection";
  edges: InitialProductFilterData_categories_edges[];
}

export interface InitialProductFilterData_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface InitialProductFilterData_collections_edges {
  __typename: "CollectionCountableEdge";
  node: InitialProductFilterData_collections_edges_node;
}

export interface InitialProductFilterData_collections {
  __typename: "CollectionCountableConnection";
  edges: InitialProductFilterData_collections_edges[];
}

export interface InitialProductFilterData_productTypes_edges_node {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface InitialProductFilterData_productTypes_edges {
  __typename: "ProductTypeCountableEdge";
  node: InitialProductFilterData_productTypes_edges_node;
}

export interface InitialProductFilterData_productTypes {
  __typename: "ProductTypeCountableConnection";
  edges: InitialProductFilterData_productTypes_edges[];
}

export interface InitialProductFilterData {
  attributes: InitialProductFilterData_attributes | null;
  categories: InitialProductFilterData_categories | null;
  collections: InitialProductFilterData_collections | null;
  productTypes: InitialProductFilterData_productTypes | null;
}

export interface InitialProductFilterDataVariables {
  categories?: string[] | null;
  collections?: string[] | null;
  productTypes?: string[] | null;
}
