/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UnassignPageAttribute
// ====================================================

export interface UnassignPageAttribute_pageAttributeUnassign_errors {
  __typename: "PageError";
  field: string | null;
  message: string | null;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes_edges_node;
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes {
  __typename: "AttributeCountableConnection";
  pageInfo: UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes_pageInfo;
  edges: UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes_edges[];
}

export interface UnassignPageAttribute_pageAttributeUnassign_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (UnassignPageAttribute_pageAttributeUnassign_pageType_metadata | null)[];
  privateMetadata: (UnassignPageAttribute_pageAttributeUnassign_pageType_privateMetadata | null)[];
  attributes: (UnassignPageAttribute_pageAttributeUnassign_pageType_attributes | null)[] | null;
  availableAttributes: UnassignPageAttribute_pageAttributeUnassign_pageType_availableAttributes | null;
}

export interface UnassignPageAttribute_pageAttributeUnassign {
  __typename: "PageAttributeUnassign";
  errors: UnassignPageAttribute_pageAttributeUnassign_errors[];
  pageType: UnassignPageAttribute_pageAttributeUnassign_pageType | null;
}

export interface UnassignPageAttribute {
  pageAttributeUnassign: UnassignPageAttribute_pageAttributeUnassign | null;
}

export interface UnassignPageAttributeVariables {
  id: string;
  ids: string[];
}
