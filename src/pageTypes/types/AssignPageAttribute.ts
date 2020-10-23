/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AssignPageAttribute
// ====================================================

export interface AssignPageAttribute_pageAttributeAssign_errors {
  __typename: "PageError";
  field: string | null;
  message: string | null;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes_edges_node;
}

export interface AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes {
  __typename: "AttributeCountableConnection";
  pageInfo: AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes_pageInfo;
  edges: AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes_edges[];
}

export interface AssignPageAttribute_pageAttributeAssign_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (AssignPageAttribute_pageAttributeAssign_pageType_metadata | null)[];
  privateMetadata: (AssignPageAttribute_pageAttributeAssign_pageType_privateMetadata | null)[];
  attributes: (AssignPageAttribute_pageAttributeAssign_pageType_attributes | null)[] | null;
  availableAttributes: AssignPageAttribute_pageAttributeAssign_pageType_availableAttributes | null;
}

export interface AssignPageAttribute_pageAttributeAssign {
  __typename: "PageAttributeAssign";
  errors: AssignPageAttribute_pageAttributeAssign_errors[];
  pageType: AssignPageAttribute_pageAttributeAssign_pageType | null;
}

export interface AssignPageAttribute {
  pageAttributeAssign: AssignPageAttribute_pageAttributeAssign | null;
}

export interface AssignPageAttributeVariables {
  id: string;
  ids: string[];
}
