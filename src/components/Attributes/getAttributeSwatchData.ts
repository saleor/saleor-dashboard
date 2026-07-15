export interface AttributeSwatchData {
  colorValue?: string | null;
  fileUrl?: string | null;
}

interface AttributeValueWithSwatch {
  file?: { url?: string } | null;
  value?: string | null;
}

export const getAttributeSwatchData = (
  attributeValue: AttributeValueWithSwatch | null | undefined,
): AttributeSwatchData | undefined => {
  if (!attributeValue) {
    return undefined;
  }

  const fileUrl = attributeValue.file?.url;
  const colorValue = attributeValue.value;

  if (!fileUrl && !colorValue) {
    return undefined;
  }

  return { colorValue, fileUrl };
};
