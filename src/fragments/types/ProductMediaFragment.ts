/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductMediaType } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ProductMediaFragment
// ====================================================

export interface ProductMediaFragment {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}
