/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProductTagList
// ====================================================

export interface ProductTagList_productTags_edges_node_tag {
  __typename: "Tag";
  id: string;
  name: string;
  slug: string;
  created: any;
  modified: any | null;
}

export interface ProductTagList_productTags_edges_node_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductTagList_productTags_edges_node_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductTagList_productTags_edges_node_product {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductTagList_productTags_edges_node_product_thumbnail | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  productType: ProductTagList_productTags_edges_node_product_productType;
}

export interface ProductTagList_productTags_edges_node {
  __typename: "ProductTag";
  id: string;
  tag: ProductTagList_productTags_edges_node_tag;
  product: ProductTagList_productTags_edges_node_product;
  created: any;
  modified: any | null;
}

export interface ProductTagList_productTags_edges {
  __typename: "ProductTagCountableEdge";
  node: ProductTagList_productTags_edges_node;
}

export interface ProductTagList_productTags_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductTagList_productTags {
  __typename: "ProductTagCountableConnection";
  edges: ProductTagList_productTags_edges[];
  pageInfo: ProductTagList_productTags_pageInfo;
}

export interface ProductTagList {
  productTags: ProductTagList_productTags | null;
}

export interface ProductTagListVariables {
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
  product?: string | null;
}
