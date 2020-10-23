/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageTypeUpdateInput, PageErrorCode, AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageTypeUpdate
// ====================================================

export interface PageTypeUpdate_pageTypeUpdate_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes_edges_node;
}

export interface PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes {
  __typename: "AttributeCountableConnection";
  pageInfo: PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes_pageInfo;
  edges: PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes_edges[];
}

export interface PageTypeUpdate_pageTypeUpdate_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeUpdate_pageTypeUpdate_pageType_metadata | null)[];
  privateMetadata: (PageTypeUpdate_pageTypeUpdate_pageType_privateMetadata | null)[];
  attributes: (PageTypeUpdate_pageTypeUpdate_pageType_attributes | null)[] | null;
  availableAttributes: PageTypeUpdate_pageTypeUpdate_pageType_availableAttributes | null;
}

export interface PageTypeUpdate_pageTypeUpdate {
  __typename: "PageTypeUpdate";
  errors: PageTypeUpdate_pageTypeUpdate_errors[];
  pageType: PageTypeUpdate_pageTypeUpdate_pageType | null;
}

export interface PageTypeUpdate {
  pageTypeUpdate: PageTypeUpdate_pageTypeUpdate | null;
}

export interface PageTypeUpdateVariables {
  id: string;
  input: PageTypeUpdateInput;
}
