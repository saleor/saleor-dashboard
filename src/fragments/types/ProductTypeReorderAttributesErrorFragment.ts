/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductTypeReorderAttributesErrorFragment
// ====================================================

export interface ProductTypeReorderAttributesErrorFragment {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
}
