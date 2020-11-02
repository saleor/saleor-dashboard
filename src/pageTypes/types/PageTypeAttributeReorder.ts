/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ReorderInput, PageErrorCode, AttributeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageTypeAttributeReorder
// ====================================================

export interface PageTypeAttributeReorder_pageTypeReorderAttributes_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
}

export interface PageTypeAttributeReorder_pageTypeReorderAttributes_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeAttributeReorder_pageTypeReorderAttributes_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeAttributeReorder_pageTypeReorderAttributes_pageType_attributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface PageTypeAttributeReorder_pageTypeReorderAttributes_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeAttributeReorder_pageTypeReorderAttributes_pageType_metadata | null)[];
  privateMetadata: (PageTypeAttributeReorder_pageTypeReorderAttributes_pageType_privateMetadata | null)[];
  attributes: (PageTypeAttributeReorder_pageTypeReorderAttributes_pageType_attributes | null)[] | null;
}

export interface PageTypeAttributeReorder_pageTypeReorderAttributes {
  __typename: "PageTypeReorderAttributes";
  errors: PageTypeAttributeReorder_pageTypeReorderAttributes_errors[];
  pageType: PageTypeAttributeReorder_pageTypeReorderAttributes_pageType | null;
}

export interface PageTypeAttributeReorder {
  pageTypeReorderAttributes: PageTypeAttributeReorder_pageTypeReorderAttributes | null;
}

export interface PageTypeAttributeReorderVariables {
  move: ReorderInput;
  pageTypeId: string;
}
