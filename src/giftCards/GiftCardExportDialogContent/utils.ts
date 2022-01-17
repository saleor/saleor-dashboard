import { ExportSettingsFormData } from "@saleor/products/components/ProductExportDialog/types";
import { ExportScope } from "@saleor/types/globalTypes";

interface ExportGiftCardsInputProps {
  ids: string[] | null;
  data: ExportSettingsFormData;
}

export const getExportGiftCardsInput = ({
  data,
  ids
}: ExportGiftCardsInputProps) => {
  const { scope, fileType } = data;

  if (scope === ExportScope.IDS) {
    return {
      fileType,
      scope,
      ids
    };
  }

  return {
    fileType,
    scope
  };
};
