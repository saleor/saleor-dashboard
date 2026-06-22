import { type iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";

export type AttributeInputTypeIconSize = "xsmall" | keyof typeof iconSize;

export const attributeInputTypeIconPixelSize: Record<AttributeInputTypeIconSize, number> = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
};

export const attributeInputTypeIconStrokeWidthBySize: Record<AttributeInputTypeIconSize, number> = {
  xsmall: iconStrokeWidthBySize.small,
  small: iconStrokeWidthBySize.small,
  medium: iconStrokeWidthBySize.medium,
  large: iconStrokeWidthBySize.large,
};
