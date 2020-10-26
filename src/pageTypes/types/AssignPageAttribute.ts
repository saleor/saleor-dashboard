/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageErrorCode, AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AssignPageAttribute
// ====================================================

export interface AssignPageAttribute_pageAttributeAssign_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
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

export interface AssignPageAttribute_pageAttributeAssign_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (AssignPageAttribute_pageAttributeAssign_pageType_metadata | null)[];
  privateMetadata: (AssignPageAttribute_pageAttributeAssign_pageType_privateMetadata | null)[];
  attributes: (AssignPageAttribute_pageAttributeAssign_pageType_attributes | null)[] | null;
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
