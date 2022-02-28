/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TranslationErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: CollectionTranslateErrorFragment
// ====================================================

export interface CollectionTranslateErrorFragment {
  __typename: "TranslationError";
  code: TranslationErrorCode;
  field: string | null;
  message: string | null;
}
