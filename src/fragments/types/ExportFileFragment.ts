/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ExportFileFragment
// ====================================================

export interface ExportFileFragment {
  __typename: "ExportFile";
  id: string;
  status: JobStatusEnum;
  url: string | null;
}
