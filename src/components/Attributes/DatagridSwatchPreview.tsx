import { SwatchPreview } from "@dashboard/attributes/components/SwatchPreview/SwatchPreview";

import { type AttributeSwatchData } from "./getAttributeSwatchData";

interface DatagridSwatchPreviewProps extends AttributeSwatchData {
  size?: number;
}

export const DatagridSwatchPreview = ({
  colorValue,
  fileUrl,
  size = 8,
}: DatagridSwatchPreviewProps) => (
  <SwatchPreview color={colorValue} imageUrl={fileUrl} size={size} />
);
