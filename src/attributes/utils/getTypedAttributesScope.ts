import { getAttributeTypeFromBuiltInPresetTab } from "@dashboard/attributes/urls";
import { type AttributeFilterInput, AttributeTypeEnum } from "@dashboard/graphql";

export const getTypedAttributesScope = (
  filters: AttributeFilterInput,
  selectedPreset: number | undefined,
): AttributeTypeEnum.PRODUCT_TYPE | AttributeTypeEnum.PAGE_TYPE | undefined => {
  if (
    filters.type === AttributeTypeEnum.PRODUCT_TYPE ||
    filters.type === AttributeTypeEnum.PAGE_TYPE
  ) {
    return filters.type;
  }

  const presetType = getAttributeTypeFromBuiltInPresetTab(selectedPreset);

  if (presetType === AttributeTypeEnum.PRODUCT_TYPE || presetType === AttributeTypeEnum.PAGE_TYPE) {
    return presetType;
  }

  return undefined;
};
