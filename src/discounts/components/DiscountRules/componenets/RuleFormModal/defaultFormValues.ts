import { type Rule } from "@dashboard/discounts/models/Rule";
import { PromotionTypeEnum, RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";

const defaultFormValues: Rule = {
  id: "",
  name: "",
  description: "",
  channel: null,
  rewardType: null,
  rewardGifts: [],
  // Empty, not 0: the reward input shows a 0 as typed text.
  rewardValue: null,
  rewardValueType: RewardValueTypeEnum.FIXED,
  conditions: [],
};

export const getDefaultValue = (discountType: PromotionTypeEnum): Rule => {
  if (discountType === PromotionTypeEnum.CATALOGUE) {
    return defaultFormValues;
  }

  return {
    ...defaultFormValues,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  };
};
