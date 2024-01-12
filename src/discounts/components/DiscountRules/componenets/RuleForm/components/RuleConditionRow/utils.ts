import { Option } from "@saleor/macaw-ui-next";

export const getConditionNameValue = (
  conditionType: string | undefined | null,
  conditionTypes: Option[],
) => {
  if (!conditionType) {
    return null;
  }

  return conditionTypes.find(type => type.value === conditionType) || null;
};
