import { ExportScope } from "@saleor/graphql";
import { ExportSettingsFormData } from "@saleor/products/components/ProductExportDialog/types";

interface ExportGiftCardsInputProps {
  ids: string[] | null;
  data: ExportSettingsFormData;
}

export const getExportGiftCardsInput = ({
  data,
  ids,
}: ExportGiftCardsInputProps) => {
  const { scope, fileType } = data;

  if (scope === ExportScope.IDS) {
    return {
      fileType,
      scope,
      ids,
    };
  }

  return {
    fileType,
    scope,
  };
};
