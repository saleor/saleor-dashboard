/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleFilterInput, SaleSortingInput, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SaleList
// ====================================================

export interface SaleList_sales_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleList_sales_edges_node_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleList_sales_edges_node_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleList_sales_edges_node {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleList_sales_edges_node_channelListings[] | null;
}

export interface SaleList_sales_edges {
  __typename: "SaleCountableEdge";
  node: SaleList_sales_edges_node;
}

export interface SaleList_sales_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleList_sales {
  __typename: "SaleCountableConnection";
  edges: SaleList_sales_edges[];
  pageInfo: SaleList_sales_pageInfo;
}

export interface SaleList {
  sales: SaleList_sales | null;
}

export interface SaleListVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  filter?: SaleFilterInput | null;
  sort?: SaleSortingInput | null;
}
