import { Option } from "@saleor/macaw-ui-next";

export const getConditionTypeValue = (
  conditionType: string,
  conditionTypes: Option[],
) => {
  return conditionTypes.find(type => type.value === conditionType);
};
