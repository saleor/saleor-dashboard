import { ExportScope, FileTypesEnum } from "@dashboard/graphql";

export interface ExportSettingsInput {
  scope: ExportScope;
  fileType: FileTypesEnum;
}

export interface ExportSettingsFormData {
  fileType: FileTypesEnum;
  scope: ExportScope;
}

export const exportSettingsInitialFormData: ExportSettingsFormData = {
  fileType: "CSV" as FileTypesEnum,
  scope: "ALL" as ExportScope,
};

export const exportSettingsInitialFormDataWithIds: ExportSettingsFormData = {
  fileType: "CSV" as FileTypesEnum,
  scope: "IDS" as ExportScope,
};
