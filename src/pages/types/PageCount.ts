/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PageFilterInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageCount
// ====================================================

export interface PageCount_pages {
  __typename: "PageCountableConnection";
  totalCount: number | null;
}

export interface PageCount {
  pages: PageCount_pages | null;
}

export interface PageCountVariables {
  filter?: PageFilterInput | null;
}
