import { AttributeTypeEnum } from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { messages } from "./messages";

export const getAttributeClassLabel = (
  attributeType: AttributeTypeEnum,
  intl: IntlShape,
): string => {
  switch (attributeType) {
    case AttributeTypeEnum.PAGE_TYPE:
      return intl.formatMessage(messages.modelAttribute);
    case AttributeTypeEnum.PRODUCT_TYPE:
      return intl.formatMessage(messages.productAttribute);
    default:
      return attributeType;
  }
};
