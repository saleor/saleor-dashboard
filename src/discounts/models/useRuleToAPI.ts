import {
  PromotionRuleInput,
  PromotionTypeEnum,
  RewardTypeEnum,
} from "@dashboard/graphql";

import { prepareCataloguePredicate } from "./CatalogRule/preparePredicate";
import { createBaseAPIInput } from "./helpers";
import { prepareOrderPredicate } from "./OrderRule/preparePredicate";
import { Rule } from "./types";

export const toAPI =
  (discountType: PromotionTypeEnum) =>
  (rule: Rule): PromotionRuleInput => {
    const base = createBaseAPIInput(rule);

    const orderPredicate =
      discountType === PromotionTypeEnum.ORDER
        ? prepareOrderPredicate(rule.conditions)
        : undefined;

    const cataloguePredicate =
      discountType === PromotionTypeEnum.CATALOGUE
        ? prepareCataloguePredicate(rule.conditions)
        : undefined;

    return {
      ...base,
      rewardType:
        discountType === PromotionTypeEnum.ORDER && !rule.rewardType
          ? RewardTypeEnum.SUBTOTAL_DISCOUNT
          : rule.rewardType,
      orderPredicate,
      cataloguePredicate,
    };
  };
