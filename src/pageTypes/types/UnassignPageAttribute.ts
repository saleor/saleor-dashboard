/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageErrorCode, AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UnassignPageAttribute
// ====================================================

export interface UnassignPageAttribute_pageAttributeUnassign_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
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

export interface UnassignPageAttribute_pageAttributeUnassign_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (UnassignPageAttribute_pageAttributeUnassign_pageType_metadata | null)[];
  privateMetadata: (UnassignPageAttribute_pageAttributeUnassign_pageType_privateMetadata | null)[];
  attributes: (UnassignPageAttribute_pageAttributeUnassign_pageType_attributes | null)[] | null;
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
