import { AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";

export const getAttributeValueFields = (
  attributeValue: AttributeValueEditDialogFormData | null,
  isSwatch: boolean,
): Partial<Omit<AttributeValueEditDialogFormData, "name">> => {
  if (attributeValue?.fileUrl) {
    return {
      fileUrl: attributeValue?.fileUrl,
      contentType: attributeValue?.contentType,
    };
  }

  // Value should be only use when input type is swatch
  if (attributeValue?.value && isSwatch) {
    return { value: attributeValue?.value ?? "" };
  }

  return {};
};
