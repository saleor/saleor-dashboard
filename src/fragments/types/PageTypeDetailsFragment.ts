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

export interface PageTypeDetailsFragment {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeDetailsFragment_metadata | null)[];
  privateMetadata: (PageTypeDetailsFragment_privateMetadata | null)[];
  attributes: (PageTypeDetailsFragment_attributes | null)[] | null;
}
