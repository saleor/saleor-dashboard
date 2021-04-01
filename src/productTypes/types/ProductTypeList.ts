/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductTypeFilterInput, ProductTypeSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductTypeList
// ====================================================

export interface ProductTypeList_productTypes_edges_node_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductTypeList_productTypes_edges_node {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: ProductTypeList_productTypes_edges_node_taxType | null;
}

export interface ProductTypeList_productTypes_edges {
  __typename: "ProductTypeCountableEdge";
  node: ProductTypeList_productTypes_edges_node;
}

export interface ProductTypeList_productTypes_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductTypeList_productTypes {
  __typename: "ProductTypeCountableConnection";
  edges: ProductTypeList_productTypes_edges[];
  pageInfo: ProductTypeList_productTypes_pageInfo;
}

export interface ProductTypeList {
  productTypes: ProductTypeList_productTypes | null;
}

export interface ProductTypeListVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  filter?: ProductTypeFilterInput | null;
  sort?: ProductTypeSortingInput | null;
}
