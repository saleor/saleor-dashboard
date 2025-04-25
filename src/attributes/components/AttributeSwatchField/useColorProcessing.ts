import { AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";

export const useColorProcessing = ({
  set,
}: {
  set: (data: Partial<AttributeValueEditDialogFormData>) => void;
}) => {
  const handleColorChange = (hex: string) =>
    set({ value: hex, fileUrl: undefined, contentType: undefined });

  return { handleColorChange };
};
