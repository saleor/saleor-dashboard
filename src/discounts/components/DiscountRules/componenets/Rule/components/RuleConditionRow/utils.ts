import { Option } from "@saleor/macaw-ui-next";

export const getConditionTypeValue = (
  conditionType: string | undefined,
  conditionTypes: Option[],
) => {
  if (!conditionType) {
    return undefined;
  }

  return conditionTypes.find(type => type.value === conditionType) || undefined;
};
