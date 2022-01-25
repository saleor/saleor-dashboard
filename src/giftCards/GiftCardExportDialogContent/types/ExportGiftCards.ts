/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ExportGiftCardsInput, ExportErrorCode } from "../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ExportGiftCards
// ====================================================

export interface ExportGiftCards_exportGiftCards_errors {
  __typename: "ExportError";
  code: ExportErrorCode;
  field: string | null;
}

export interface ExportGiftCards_exportGiftCards_exportFile {
  __typename: "ExportFile";
  id: string;
}

export interface ExportGiftCards_exportGiftCards {
  __typename: "ExportGiftCards";
  errors: ExportGiftCards_exportGiftCards_errors[];
  exportFile: ExportGiftCards_exportGiftCards_exportFile | null;
}

export interface ExportGiftCards {
  exportGiftCards: ExportGiftCards_exportGiftCards | null;
}

export interface ExportGiftCardsVariables {
  input: ExportGiftCardsInput;
}
