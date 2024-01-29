import { Rule } from "@dashboard/discounts/models";
import { RewardValueTypeEnum } from "@dashboard/graphql";

export const defaultFormValues: Omit<Rule, "type"> = {
  id: "",
  name: "",
  description: "",
  channel: null,
  rewardType: null,
  rewardValue: 0,
  rewardValueType: RewardValueTypeEnum.FIXED,
  conditions: [],
};
