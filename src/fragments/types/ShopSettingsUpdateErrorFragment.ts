/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShopErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShopSettingsUpdateErrorFragment
// ====================================================

export interface ShopSettingsUpdateErrorFragment {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
  message: string | null;
}
