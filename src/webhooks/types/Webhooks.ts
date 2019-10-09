/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Webhooks
// ====================================================

export interface Webhooks_webhooks_edges_node_events {
  __typename: "WebhookEvent";
  eventType: string | null;
}

export interface Webhooks_webhooks_edges_node_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface Webhooks_webhooks_edges_node {
  __typename: "Webhook";
  id: string;
  name: string | null;
  events: (Webhooks_webhooks_edges_node_events | null)[] | null;
  isActive: boolean;
  secretKey: string | null;
  targetUrl: string;
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
}
