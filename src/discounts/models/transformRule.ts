import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
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
import { Rule } from "./Rule";

export const mapAPIRuleToForm = (
  type: PromotionTypeEnum | null | undefined,
  rule: PromotionRuleDetailsFragment,
  labelMap: Record<string, string>,
): Rule => {
  const baseRuleData = createBaseRuleInputFromAPI(rule);

  if (!type) {
    return {
      ...baseRuleData,
      conditions: [],
      hasPredicateNestedConditions: false,
    };
  }

  if (type === PromotionTypeEnum.CATALOGUE) {
    const catalogueConditions = prepareCatalogueRuleConditions(
      rule.cataloguePredicate,
      labelMap,
    );

    return {
      ...baseRuleData,
      conditions: catalogueConditions,
      hasPredicateNestedConditions: hasPredicateNestedConditions(
        rule.cataloguePredicate,
      ),
    };
  }

  if (type === PromotionTypeEnum.ORDER) {
    const orderconditions = prepareOrderConditions(
      rule.orderPredicate?.discountedObjectPredicate ?? {},
    );

    return {
      ...baseRuleData,
      conditions: orderconditions,
      hasPredicateNestedConditions: hasPredicateNestedConditions(
        rule.orderPredicate.discountedObjectPredicate,
      ),
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

    if (!discountType) {
      return base;
    }

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
