import { ExportScope, FileTypesEnum } from "@dashboard/graphql";
import { ExportSettingsFormData } from "@dashboard/products/components/ProductExportDialog/types";

interface ExportGiftCardsInputProps {
  ids: string[] | null;
  data: ExportSettingsFormData;
}

export const getExportGiftCardsInput = ({ data, ids }: ExportGiftCardsInputProps) => {
  const { scope, fileType } = data;

  if (scope === "IDS") {
    return {
      fileType: fileType as FileTypesEnum,
      scope: scope as ExportScope,
      ids,
    };
  }

  return {
    fileType: fileType as FileTypesEnum,
    scope: scope as ExportScope,
  };
};
