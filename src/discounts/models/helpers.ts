import {
  DecimalFilterInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { CataloguePredicateAPI, OrderPredicateAPI } from "../types";
import { Condition, ConditionType, isTuple } from "./Condition";
import { Rule } from "./Rule";

export const createBaseAPIInput = (data: Rule): PromotionRuleInput => {
  return {
    name: data.name,
    description: data.description ? JSON.parse(data.description) : null,
    channels: data?.channel ? [data.channel.value] : [],
    rewardType: data.rewardType,
    rewardValue: data.rewardValue,
    rewardValueType: data.rewardValueType,
  };
};

export const createBaseRuleInputFromAPI = (
  data: PromotionRuleDetailsFragment,
  giftsLabels: Record<string, string>,
): Omit<Rule, "conditions"> => {
  return {
    id: data.id,
    name: data.name ?? "",
    description: data.description ? JSON.stringify(data.description) : "",
    // For now Dashboard supports only one channel per rule
    // due to API product variant filtering limitations
    // TODO: Add support for multiple channels
    channel: data?.channels?.length
      ? { label: data?.channels[0].name, value: data?.channels[0].id }
      : null,
    rewardType: data?.rewardType ?? null,
    rewardValue: data.rewardValue ?? null,
    rewardGifts:
      data.giftIds?.map(id => ({
        value: id,
        label: giftsLabels[id],
      })) ?? [],
    rewardValueType: data.rewardValueType ?? RewardValueTypeEnum.FIXED,
  };
};

export const createAPIWhereInput = (condition: Condition) => {
  const label = condition.type;
  const value = condition.value;

  if (label === "lower") {
    return { range: { lte: value } };
  }
  if (label === "greater") {
    return { range: { gte: value } };
  }

  if (isTuple(value) && label === "between") {
    const [gte, lte] = value;
    return { range: { lte, gte } };
  }

  return { eq: value };
};

export function getConditionType(
  conditionValue: DecimalFilterInput,
): ConditionType {
  if (conditionValue.eq) {
    return "is";
  }

  if (conditionValue.range) {
    if (conditionValue.range.lte && conditionValue.range.gte) {
      return "between";
    }

    if (conditionValue.range.lte) {
      return "lower";
    }

    if (conditionValue.range.gte) {
      return "greater";
    }
  }

  return "is";
}

export function getConditionValue(conditionValue: DecimalFilterInput) {
  if (conditionValue.eq) {
    return conditionValue.eq;
  }

  if (conditionValue.oneOf) {
    return conditionValue.oneOf;
  }

  if (conditionValue.range) {
    if (conditionValue.range.lte && conditionValue.range.gte) {
      return [conditionValue.range.gte, conditionValue.range.lte];
    }

    if (conditionValue.range.lte) {
      return conditionValue.range.lte;
    }

    if (conditionValue.range.gte) {
      return conditionValue.range.gte;
    }
  }

  return conditionValue.eq;
}

const ALLOW_KEYS = ["ids", "eq", "oneOf", "range"];

export function hasPredicateNestedConditions(
  predicate: OrderPredicateAPI | CataloguePredicateAPI,
): boolean {
  const keys = Object.keys(predicate);
  if (keys.includes("AND") || keys.length > 2) {
    return true;
  }

  if (keys.length === 1 && keys[0] !== "OR") {
    const innerKeys = Object.keys(
      predicate[keys[0] as keyof typeof predicate] ?? {},
    );
    return innerKeys.every(key => !ALLOW_KEYS.includes(key));
  }

  if (predicate.OR && predicate.OR?.some(checkDeeplyNestedPredicate)) {
    return true;
  }

  if ("discountedObjectPredicate" in predicate) {
    return hasPredicateNestedConditions(predicate.discountedObjectPredicate);
  }

  return false;
}

function checkDeeplyNestedPredicate(
  nestedPredicate: OrderPredicateAPI | CataloguePredicateAPI,
): boolean {
  const keys = Object.keys(nestedPredicate);
  if (keys.includes("AND") || keys.includes("OR")) {
    return true;
  }

  type keyType = keyof typeof nestedPredicate;

  for (const key in nestedPredicate) {
    if (ALLOW_KEYS.includes(key)) {
      continue;
    }

    const innerKeys = Object.keys(nestedPredicate[key as keyType] ?? {});
    const hasNotAllowedKeys = innerKeys.every(key => !ALLOW_KEYS.includes(key));

    if (hasNotAllowedKeys) {
      return true;
    }

    if (typeof nestedPredicate[key as keyType] === "object") {
      return checkDeeplyNestedPredicate(
        nestedPredicate[key as keyType] as
          | OrderPredicateAPI
          | CataloguePredicateAPI,
      );
    }
  }
  return false;
}
