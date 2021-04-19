/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InitialProductFilterCategories
// ====================================================

export interface InitialProductFilterCategories_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
}

export interface InitialProductFilterCategories_categories_edges {
  __typename: "CategoryCountableEdge";
  node: InitialProductFilterCategories_categories_edges_node;
}

export interface InitialProductFilterCategories_categories {
  __typename: "CategoryCountableConnection";
  edges: InitialProductFilterCategories_categories_edges[];
}

export interface InitialProductFilterCategories {
  categories: InitialProductFilterCategories_categories | null;
}

export interface InitialProductFilterCategoriesVariables {
  categories?: string[] | null;
}
