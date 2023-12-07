import { Condition, DiscoutFormData, Rule } from "@dashboard/discounts/types";
import { RewardValueTypeEnum } from "@dashboard/graphql";

export const initialFormValues: DiscoutFormData = {
  name: "",
  description: "",
  dates: {
    endDate: "",
    endTime: "",
    hasEndDate: false,
    startDate: "",
    startTime: "",
  },
  rules: [],
};

export const intialConditionValues: Condition = {
  type: null,
  condition: "is",
  values: [],
};

export const initialRuleValues: Rule = {
  channel: null,
  description: "",
  name: "",
  rewardValue: null,
  conditions: [{ ...intialConditionValues }],
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
};
