/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookFilterInput, WebhookSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Webhooks
// ====================================================

export interface Webhooks_webhooks_edges_node_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface Webhooks_webhooks_edges_node {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  serviceAccount: Webhooks_webhooks_edges_node_serviceAccount;
}

export interface Webhooks_webhooks_edges {
  __typename: "WebhookCountableEdge";
  node: Webhooks_webhooks_edges_node;
}

export interface Webhooks_webhooks_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Webhooks_webhooks {
  __typename: "WebhookCountableConnection";
  edges: Webhooks_webhooks_edges[];
  pageInfo: Webhooks_webhooks_pageInfo;
}

export interface Webhooks {
  webhooks: Webhooks_webhooks | null;
}

export interface WebhooksVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: WebhookFilterInput | null;
  sort?: WebhookSortingInput | null;
}
