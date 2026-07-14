import { attributeListUrlWithAttributeType } from "@dashboard/attributes/urls";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { type GetFilterTabsOutput } from "@dashboard/utils/filters";
import { defineMessages, type IntlShape } from "react-intl";

const messages = defineMessages({
  productAttributes: {
    id: "OjNTfe",
    defaultMessage: "Product attributes",
    description: "built-in attribute list filter preset",
  },
  modelAttributes: {
    id: "v17EX7",
    defaultMessage: "Model attributes",
    description: "built-in attribute list filter preset",
  },
});

const getAttributeTypeFilterPresetQuery = (attributeType: AttributeTypeEnum): string => {
  const url = attributeListUrlWithAttributeType(attributeType);
  const queryIndex = url.indexOf("?");

  return queryIndex === -1 ? "" : url.slice(queryIndex + 1);
};

export const getBuiltInAttributeFilterPresets = (intl: IntlShape): GetFilterTabsOutput<string> => [
  {
    name: intl.formatMessage(messages.productAttributes),
    data: getAttributeTypeFilterPresetQuery(AttributeTypeEnum.PRODUCT_TYPE),
  },
  {
    name: intl.formatMessage(messages.modelAttributes),
    data: getAttributeTypeFilterPresetQuery(AttributeTypeEnum.PAGE_TYPE),
  },
];
