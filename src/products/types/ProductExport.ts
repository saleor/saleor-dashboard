/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ExportProductsInput, JobStatusEnum, ExportErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductExport
// ====================================================

export interface ProductExport_exportProducts_exportFile {
  __typename: "ExportFile";
  id: string;
  status: JobStatusEnum;
  url: string | null;
}

export interface ProductExport_exportProducts_errors {
  __typename: "ExportError";
  code: ExportErrorCode;
  field: string | null;
}

export interface ProductExport_exportProducts {
  __typename: "ExportProducts";
  exportFile: ProductExport_exportProducts_exportFile | null;
  errors: ProductExport_exportProducts_errors[];
}

export interface ProductExport {
  exportProducts: ProductExport_exportProducts | null;
}

export interface ProductExportVariables {
  input: ExportProductsInput;
}
