import { ConditionType } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";

export const getConditionTypeValue = (
  conditionType: ConditionType | undefined | null,
  conditionTypes: Option[],
) => {
  if (!conditionType) {
    return null;
  }

  return conditionTypes.find(type => type.value === conditionType) || null;
};
