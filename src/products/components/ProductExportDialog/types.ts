import { ExportScope, FileTypesEnum } from "@dashboard/graphql";

export interface ExportSettingsInput {
  scope: ExportScope;
  fileType: FileTypesEnum;
}

export interface ExportSettingsFormData {
  fileType: FileTypesEnum;
  scope: ExportScope;
}

export const exportSettingsInitialFormData = {
  fileType: "CSV",
  scope: "ALL",
};

export const exportSettingsInitialFormDataWithIds = {
  fileType: "CSV",
  scope: "IDS",
};
