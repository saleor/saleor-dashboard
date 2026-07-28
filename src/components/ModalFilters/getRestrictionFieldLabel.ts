import { type IntlShape } from "react-intl";

import { leftOperatorsMessages } from "../ConditionalFilter/intl";
import { messages as modelTypeMessages } from "../ModelType/messages";

const restrictionFieldMessages = {
  productType: leftOperatorsMessages.ProductType,
  pageTypes: modelTypeMessages.modelTypeLabel,
} as const;

type RestrictionField = keyof typeof restrictionFieldMessages;

export const getRestrictionFieldLabel = (
  field: string,
  formatMessage: IntlShape["formatMessage"],
  fallbackLabel: string,
): string => {
  const message = restrictionFieldMessages[field as RestrictionField];

  return message ? formatMessage(message) : fallbackLabel;
};
