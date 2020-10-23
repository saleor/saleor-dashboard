/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageTypeDetailsFragment
// ====================================================

export interface PageTypeDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetailsFragment_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeDetailsFragment_availableAttributes_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PageTypeDetailsFragment_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeDetailsFragment_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: PageTypeDetailsFragment_availableAttributes_edges_node;
}

export interface PageTypeDetailsFragment_availableAttributes {
  __typename: "AttributeCountableConnection";
  pageInfo: PageTypeDetailsFragment_availableAttributes_pageInfo;
  edges: PageTypeDetailsFragment_availableAttributes_edges[];
}

export interface PageTypeDetailsFragment {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeDetailsFragment_metadata | null)[];
  privateMetadata: (PageTypeDetailsFragment_privateMetadata | null)[];
  attributes: (PageTypeDetailsFragment_attributes | null)[] | null;
  availableAttributes: PageTypeDetailsFragment_availableAttributes | null;
}
