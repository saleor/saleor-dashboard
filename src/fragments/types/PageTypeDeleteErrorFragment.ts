/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PageErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageTypeDeleteErrorFragment
// ====================================================

export interface PageTypeDeleteErrorFragment {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
  message: string | null;
}
