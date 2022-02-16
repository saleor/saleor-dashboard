/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PluginErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: PluginErrorFragment
// ====================================================

export interface PluginErrorFragment {
  __typename: "PluginError";
  code: PluginErrorCode;
  field: string | null;
  message: string | null;
}
