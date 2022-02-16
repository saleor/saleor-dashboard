/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppErrorCode, PermissionEnum } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: AppErrorFragment
// ====================================================

export interface AppErrorFragment {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}
