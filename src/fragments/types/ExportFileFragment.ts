/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { JobStatusEnum } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ExportFileFragment
// ====================================================

export interface ExportFileFragment {
  __typename: "ExportFile";
  id: string;
  status: JobStatusEnum;
  url: string | null;
}
