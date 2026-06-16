import { inputTypeMessages } from "@dashboard/attributes/components/AttributeDetails/messages";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

const inputTypeMessageMap = {
  [AttributeInputTypeEnum.DROPDOWN]: inputTypeMessages.dropdown,
  [AttributeInputTypeEnum.MULTISELECT]: inputTypeMessages.multiselect,
  [AttributeInputTypeEnum.FILE]: inputTypeMessages.file,
  [AttributeInputTypeEnum.REFERENCE]: inputTypeMessages.references,
  [AttributeInputTypeEnum.SINGLE_REFERENCE]: inputTypeMessages.singleReference,
  [AttributeInputTypeEnum.PLAIN_TEXT]: inputTypeMessages.plainText,
  [AttributeInputTypeEnum.RICH_TEXT]: inputTypeMessages.richText,
  [AttributeInputTypeEnum.NUMERIC]: inputTypeMessages.numeric,
  [AttributeInputTypeEnum.BOOLEAN]: inputTypeMessages.boolean,
  [AttributeInputTypeEnum.DATE]: inputTypeMessages.date,
  [AttributeInputTypeEnum.DATE_TIME]: inputTypeMessages.dateTime,
  [AttributeInputTypeEnum.SWATCH]: inputTypeMessages.swatch,
} as const;

export const getAttributeInputTypeLabel = (
  intl: IntlShape,
  inputType: AttributeInputTypeEnum,
): string => intl.formatMessage(inputTypeMessageMap[inputType]);
