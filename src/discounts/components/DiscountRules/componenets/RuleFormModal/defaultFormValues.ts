import { Rule } from "@dashboard/discounts/models";
import { PromotionTypeEnum, RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";

const defaultFormValues: Rule = {
  id: "",
  name: "",
  description: "",
  channel: null,
  rewardType: null,
  rewardGifts: [],
  rewardValue: 0,
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
