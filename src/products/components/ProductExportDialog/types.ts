import { ExportScope, FileTypesEnum } from "@saleor/types/globalTypes";

export interface ExportSettingsInput {
  scope: ExportScope;
  fileType: FileTypesEnum;
}

export interface ExportSettingsFormData {
  fileType: FileTypesEnum;
  scope: ExportScope;
}

export const exportSettingsInitialFormData = {
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.ALL
};

export const exportSettingsInitialFormDataWithIds = {
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.IDS
};
