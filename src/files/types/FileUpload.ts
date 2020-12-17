/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UploadErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: FileUpload
// ====================================================

export interface FileUpload_fileUpload_uploadedFile {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface FileUpload_fileUpload_uploadErrors {
  __typename: "UploadError";
  code: UploadErrorCode;
  field: string | null;
}

export interface FileUpload_fileUpload {
  __typename: "FileUpload";
  uploadedFile: FileUpload_fileUpload_uploadedFile | null;
  uploadErrors: FileUpload_fileUpload_uploadErrors[];
}

export interface FileUpload {
  fileUpload: FileUpload_fileUpload | null;
}

export interface FileUploadVariables {
  file: any;
}
