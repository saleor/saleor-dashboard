import { Option } from "@saleor/macaw-ui-next";

export const getConditionTypeValue = (
  conditionType: string | undefined | null,
  conditionTypes: Option[],
) => {
  if (!conditionType) {
    return null;
  }

  return conditionTypes.find(type => type.value === conditionType) || null;
};
