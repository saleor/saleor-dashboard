/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchOrderVariant
// ====================================================

export interface SearchOrderVariant_search_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted {
  __typename: "TaxedMoney";
  net: SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted_net;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing {
  __typename: "VariantPricingInfo";
  priceUndiscounted: SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted | null;
}

export interface SearchOrderVariant_search_edges_node_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  pricing: SearchOrderVariant_search_edges_node_variants_pricing | null;
}

export interface SearchOrderVariant_search_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: SearchOrderVariant_search_edges_node_thumbnail | null;
  variants: (SearchOrderVariant_search_edges_node_variants | null)[] | null;
}

export interface SearchOrderVariant_search_edges {
  __typename: "ProductCountableEdge";
  node: SearchOrderVariant_search_edges_node;
}

export interface SearchOrderVariant_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchOrderVariant_search {
  __typename: "ProductCountableConnection";
  edges: SearchOrderVariant_search_edges[];
  pageInfo: SearchOrderVariant_search_pageInfo;
}

export interface SearchOrderVariant {
  search: SearchOrderVariant_search | null;
}

export interface SearchOrderVariantVariables {
  first: number;
  query: string;
  after?: string | null;
}
