/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CategoryDetails
// ====================================================

export interface CategoryDetails_category_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryDetails_category_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryDetails_category_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CategoryDetails_category_parent {
  __typename: "Category";
  id: string;
}

export interface CategoryDetails_category_children_edges_node_children {
  __typename: "CategoryCountableConnection";
  totalCount: number | null;
}

export interface CategoryDetails_category_children_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface CategoryDetails_category_children_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  children: CategoryDetails_category_children_edges_node_children | null;
  products: CategoryDetails_category_children_edges_node_products | null;
}

export interface CategoryDetails_category_children_edges {
  __typename: "CategoryCountableEdge";
  node: CategoryDetails_category_children_edges_node;
}

export interface CategoryDetails_category_children_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CategoryDetails_category_children {
  __typename: "CategoryCountableConnection";
  edges: CategoryDetails_category_children_edges[];
  pageInfo: CategoryDetails_category_children_pageInfo;
}

export interface CategoryDetails_category_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CategoryDetails_category_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CategoryDetails_category_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_start_gross;
}

export interface CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_stop_gross;
}

export interface CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_start | null;
  stop: CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted_stop | null;
}

export interface CategoryDetails_category_products_edges_node_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: CategoryDetails_category_products_edges_node_pricing_priceRangeUndiscounted | null;
}

export interface CategoryDetails_category_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  isAvailable: boolean | null;
  thumbnail: CategoryDetails_category_products_edges_node_thumbnail | null;
  productType: CategoryDetails_category_products_edges_node_productType;
  pricing: CategoryDetails_category_products_edges_node_pricing | null;
}

export interface CategoryDetails_category_products_edges {
  __typename: "ProductCountableEdge";
  cursor: string;
  node: CategoryDetails_category_products_edges_node;
}

export interface CategoryDetails_category_products {
  __typename: "ProductCountableConnection";
  pageInfo: CategoryDetails_category_products_pageInfo;
  edges: CategoryDetails_category_products_edges[];
}

export interface CategoryDetails_category {
  __typename: "Category";
  id: string;
  metadata: (CategoryDetails_category_metadata | null)[];
  privateMetadata: (CategoryDetails_category_privateMetadata | null)[];
  backgroundImage: CategoryDetails_category_backgroundImage | null;
  name: string;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  parent: CategoryDetails_category_parent | null;
  children: CategoryDetails_category_children | null;
  products: CategoryDetails_category_products | null;
}

export interface CategoryDetails {
  category: CategoryDetails_category | null;
}

export interface CategoryDetailsVariables {
  id: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
