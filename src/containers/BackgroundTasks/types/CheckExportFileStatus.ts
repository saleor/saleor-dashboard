/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: CheckExportFileStatus
// ====================================================

export interface CheckExportFileStatus_exportFile {
  __typename: "ExportFile";
  id: string;
  status: JobStatusEnum;
}

export interface CheckExportFileStatus {
  exportFile: CheckExportFileStatus_exportFile | null;
}

export interface CheckExportFileStatusVariables {
  id: string;
}
