/**
 * Canvas / Datagrid only. See getAttributeInputTypeIconNode.ts — not for React UI.
 */
import { type AttributeInputTypeEnum } from "@dashboard/graphql";

import { type AttributeIconOptions } from "./getAttributeInputTypeIcon";
import { getAttributeInputTypeIconNode } from "./getAttributeInputTypeIconNode";
import { iconNodeToSvg } from "./iconNodeToSvg";
import {
  attributeInputTypeIconPixelSize,
  type AttributeInputTypeIconSize,
  attributeInputTypeIconStrokeWidthBySize,
} from "./types";

export const renderAttributeInputTypeIconSvg = (
  inputType: AttributeInputTypeEnum,
  size: AttributeInputTypeIconSize = "xsmall",
  color = "currentColor",
  options?: AttributeIconOptions,
): string =>
  iconNodeToSvg(
    getAttributeInputTypeIconNode(inputType, options),
    attributeInputTypeIconPixelSize[size],
    attributeInputTypeIconStrokeWidthBySize[size],
    color,
  );
