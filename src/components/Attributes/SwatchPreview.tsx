import { Box } from "@saleor/macaw-ui-next";

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

interface SwatchPreviewProps extends AttributeSwatchData {
  size?: 8;
}

export const SwatchPreview = ({ colorValue, fileUrl, size = 8 }: SwatchPreviewProps) => {
  const isFile = Boolean(fileUrl);

  return (
    <Box
      width={size}
      height={size}
      borderRadius={2}
      marginRight={2}
      style={{
        ...(isFile
          ? {
              backgroundImage: `url(${fileUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: colorValue ?? undefined }),
      }}
    />
  );
};
