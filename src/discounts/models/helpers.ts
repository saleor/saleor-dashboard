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
    rewardValue: data.rewardValue,
    rewardValueType: data.rewardValueType,
  };
};

export const createBaseRuleInputFromAPI = (
  data: PromotionRuleDetailsFragment,
): Omit<Rule, "toAPI" | "type" | "conditions"> => {
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

export function hasPredicateNestedConditions(
  predicate: OrderPredicateAPI | CataloguePredicateAPI,
) {
  const keys = Object.keys(predicate);

  if (keys.includes("AND") || keys.length > 2) {
    return true;
  }

  if (predicate.OR && predicate.OR?.some(checkNestedPredicate)) {
    return true;
  }

  return false;
}

function checkNestedPredicate(
  nestedPredicate: OrderPredicateAPI | CataloguePredicateAPI,
) {
  const keys = Object.keys(nestedPredicate);
  if (keys.includes("AND") || keys.includes("OR")) {
    return true;
  }

  for (const key in nestedPredicate) {
    if (typeof nestedPredicate[key] === "object") {
      return checkNestedPredicate(nestedPredicate[key]);
    }
  }

  return false;
}
