/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductFilterInput, ProductOrder } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductList
// ====================================================

export interface ProductList_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductList_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductList_products_edges_node_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductList_products_edges_node_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductList_products_edges_node_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductList_products_edges_node_channelListing_channel;
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: ProductList_products_edges_node_channelListing_discountedPrice | null;
}

export interface ProductList_products_edges_node_attributes_attribute {
  __typename: "Attribute";
  id: string;
}

export interface ProductList_products_edges_node_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
}

export interface ProductList_products_edges_node_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductList_products_edges_node_attributes_attribute;
  values: (ProductList_products_edges_node_attributes_values | null)[];
}

export interface ProductList_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductList_products_edges_node_thumbnail | null;
  productType: ProductList_products_edges_node_productType;
  channelListing: ProductList_products_edges_node_channelListing[] | null;
  attributes: ProductList_products_edges_node_attributes[];
}

export interface ProductList_products_edges {
  __typename: "ProductCountableEdge";
  node: ProductList_products_edges_node;
}

export interface ProductList_products_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ProductList_products {
  __typename: "ProductCountableConnection";
  edges: ProductList_products_edges[];
  pageInfo: ProductList_products_pageInfo;
}

export interface ProductList {
  products: ProductList_products | null;
}

export interface ProductListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: ProductFilterInput | null;
  sort?: ProductOrder | null;
}
