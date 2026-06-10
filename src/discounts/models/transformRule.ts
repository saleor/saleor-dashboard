import { type CataloguePredicateAPI, type OrderPredicateAPI } from "@dashboard/discounts/types";
import {
  type PromotionRuleDetailsFragment,
  type PromotionRuleInput,
  PromotionTypeEnum,
  RewardTypeEnum,
} from "@dashboard/graphql";

import { prepareCatalogueRuleConditions } from "./CatalogRule/prepareConditions";
import { prepareCataloguePredicate } from "./CatalogRule/preparePredicate";
import {
  createBaseAPIInput,
  createBaseRuleInputFromAPI,
  hasPredicateNestedConditions,
} from "./helpers";
import { prepareOrderConditions } from "./OrderRule/prepareConditions";
import { prepareOrderPredicate } from "./OrderRule/preparePredicate";
import { type Rule } from "./Rule";

export const mapAPIRuleToForm = (
  type: PromotionTypeEnum | null | undefined,
  rule: PromotionRuleDetailsFragment,
  labelMaps: {
    conditionsValues: Record<string, string>;
    gifts: Record<string, string>;
  },
): Rule => {
  const baseRuleData = createBaseRuleInputFromAPI(rule, labelMaps.gifts);

  if (!type) {
    return {
      ...baseRuleData,
      conditions: [],
      hasPredicateNestedConditions: false,
    };
  }

  if (type === PromotionTypeEnum.CATALOGUE) {
    /**
     * TODO: Saleor stores predicate as JSON, which for Dashboard is "unknown".
     * We need to create a Zod schema that will parse it to known shape. If parsing fails, Sentry should be triggered.
     * Currently code implicitly casts, which should be ok, but is not entirely safe
     */
    const predicate = rule.cataloguePredicate as CataloguePredicateAPI;

    const catalogueConditions = prepareCatalogueRuleConditions(
      predicate,
      labelMaps.conditionsValues,
    );

    return {
      ...baseRuleData,
      conditions: catalogueConditions,
      hasPredicateNestedConditions: hasPredicateNestedConditions(predicate),
    };
  }

  if (type === PromotionTypeEnum.ORDER) {
    /**
     * TODO: Saleor stores predicate as JSON, which for Dashboard is "unknown".
     * We need to create a Zod schema that will parse it to known shape. If parsing fails, Sentry should be triggered.
     * Currently code implicitly casts, which should be ok, but is not entirely safe
     */
    const predicate = rule.orderPredicate as OrderPredicateAPI;

    const orderconditions = prepareOrderConditions(predicate?.discountedObjectPredicate ?? {});

    return {
      ...baseRuleData,
      conditions: orderconditions,
      hasPredicateNestedConditions: hasPredicateNestedConditions(predicate),
    };
  }

  return {
    ...baseRuleData,
    conditions: [],
  };
};

export const toAPI =
  (discountType: PromotionTypeEnum | null | undefined) =>
  (rule: Rule): PromotionRuleInput => {
    const base = createBaseAPIInput(rule);
    const rewardData = getRewardProperties(rule, discountType);

    if (!discountType) {
      return base;
    }

    const orderPredicate =
      discountType === PromotionTypeEnum.ORDER && !rule.hasPredicateNestedConditions
        ? prepareOrderPredicate(rule.conditions)
        : undefined;
    const cataloguePredicate =
      discountType === PromotionTypeEnum.CATALOGUE && !rule.hasPredicateNestedConditions
        ? prepareCataloguePredicate(rule.conditions)
        : undefined;

    return {
      ...base,
      ...rewardData,
      orderPredicate,
      cataloguePredicate,
    };
  };

function getRewardProperties(rule: Rule, discountType: PromotionTypeEnum | null | undefined) {
  const isOrderDiscount = discountType === PromotionTypeEnum.ORDER;

  if (isOrderDiscount) {
    return getOrderReward(rule);
  }

  return {
    rewardValue: rule.rewardValue,
    rewardValueType: rule.rewardValueType,
    rewardType: undefined,
    gifts: undefined,
  };
}

function getOrderReward(rule: Rule) {
  const isGiftReward = rule.rewardType === RewardTypeEnum.GIFT;

  if (isGiftReward) {
    return {
      rewardValue: null,
      rewardValueType: null,
      rewardType: rule.rewardType,
      gifts: rule.rewardGifts.map(({ value }) => value),
    };
  }

  return {
    rewardValue: rule.rewardValue,
    rewardType: rule.rewardType,
    rewardValueType: rule.rewardValueType,
    gifts: undefined,
  };
}
