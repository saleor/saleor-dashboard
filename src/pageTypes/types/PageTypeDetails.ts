/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageTypeDetails
// ====================================================

export interface PageTypeDetails_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetails_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetails_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeDetails_pageType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PageTypeDetails_pageType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeDetails_pageType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: PageTypeDetails_pageType_availableAttributes_edges_node;
}

export interface PageTypeDetails_pageType_availableAttributes {
  __typename: "AttributeCountableConnection";
  pageInfo: PageTypeDetails_pageType_availableAttributes_pageInfo;
  edges: PageTypeDetails_pageType_availableAttributes_edges[];
}

export interface PageTypeDetails_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeDetails_pageType_metadata | null)[];
  privateMetadata: (PageTypeDetails_pageType_privateMetadata | null)[];
  attributes: (PageTypeDetails_pageType_attributes | null)[] | null;
  availableAttributes: PageTypeDetails_pageType_availableAttributes | null;
}

export interface PageTypeDetails {
  pageType: PageTypeDetails_pageType | null;
}

export interface PageTypeDetailsVariables {
  id: string;
}
