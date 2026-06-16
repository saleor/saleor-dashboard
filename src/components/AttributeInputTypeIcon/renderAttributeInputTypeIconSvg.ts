/**
 * Canvas / Datagrid only. See getAttributeInputTypeIconNode.ts — not for React UI.
 */
import { iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";

import { getAttributeInputTypeIconNode } from "./getAttributeInputTypeIconNode";
import { iconNodeToSvg } from "./iconNodeToSvg";
import { attributeInputTypeIconPixelSize, type AttributeInputTypeIconSize } from "./types";

const strokeWidthBySize: Record<AttributeInputTypeIconSize, number> = {
  xsmall: iconStrokeWidthBySize.small,
  small: iconStrokeWidthBySize.small,
  medium: iconStrokeWidthBySize.medium,
  large: iconStrokeWidthBySize.large,
};

export const renderAttributeInputTypeIconSvg = (
  inputType: AttributeInputTypeEnum,
  size: AttributeInputTypeIconSize = "xsmall",
  color = "currentColor",
): string =>
  iconNodeToSvg(
    getAttributeInputTypeIconNode(inputType),
    attributeInputTypeIconPixelSize[size],
    strokeWidthBySize[size],
    color,
  );
