import { Rule } from "@dashboard/discounts/models";
import { RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";

export const defaultFormValues: Rule = {
  id: "",
  name: "",
  description: "",
  channel: null,
  rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  rewardGifts: [],
  rewardValue: 0,
  rewardValueType: RewardValueTypeEnum.FIXED,
  conditions: [],
};
