import { AttributeInputTypeEnum } from "@dashboard/graphql";
import {
  AlignLeft,
  Calendar,
  CalendarClock,
  FileUp,
  Hash,
  Link2,
  List,
  ListChecks,
  type LucideIcon,
  Palette,
  Ruler,
  ToggleLeft,
  Type,
} from "lucide-react";

export interface AttributeIconOptions {
  /** Numeric attributes with a measurement unit use a ruler icon instead of the default hash. */
  hasUnit?: boolean;
}

/**
 * React UI: Lucide icons for AttributeInputTypeIcon / AttributeInputTypeLabel.
 *
 * Canvas / Datagrid cannot use these components — see getAttributeInputTypeIconNode.ts
 * and AttributeInputTypeCell.tsx instead.
 */
export const attributeInputTypeIcons: Record<AttributeInputTypeEnum, LucideIcon> = {
  [AttributeInputTypeEnum.DROPDOWN]: List,
  [AttributeInputTypeEnum.MULTISELECT]: ListChecks,
  [AttributeInputTypeEnum.FILE]: FileUp,
  [AttributeInputTypeEnum.REFERENCE]: Link2,
  [AttributeInputTypeEnum.SINGLE_REFERENCE]: Link2,
  [AttributeInputTypeEnum.PLAIN_TEXT]: AlignLeft,
  [AttributeInputTypeEnum.RICH_TEXT]: Type,
  [AttributeInputTypeEnum.NUMERIC]: Hash,
  [AttributeInputTypeEnum.BOOLEAN]: ToggleLeft,
  [AttributeInputTypeEnum.DATE]: Calendar,
  [AttributeInputTypeEnum.DATE_TIME]: CalendarClock,
  [AttributeInputTypeEnum.SWATCH]: Palette,
};

export const getAttributeInputTypeIcon = (
  inputType: AttributeInputTypeEnum,
  options?: AttributeIconOptions,
): LucideIcon => {
  if (inputType === AttributeInputTypeEnum.NUMERIC && options?.hasUnit) {
    return Ruler;
  }

  return attributeInputTypeIcons[inputType];
};
