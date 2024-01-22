import {
  DecimalFilterInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { Condition, ConditionType } from "./Condition";
import { Rule } from "./types";

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
    channel: data?.channels?.length
      ? { label: data?.channels[0].name, value: data?.channels[0].id }
      : null,
    rewardType: data?.rewardType ?? null,
    rewardValue: data.rewardValue ?? null,
    rewardValueType: data.rewardValueType ?? RewardValueTypeEnum.FIXED,
  };
};

export const createWhereInput = (condition: Condition) => {
  const label = condition.type;
  const value = condition.values;

  if (label === "lower") {
    return { range: { lte: value } };
  }
  if (label === "greater") {
    return { range: { gte: value } };
  }

  if (Array.isArray(value) && value.length === 2 && label === "between") {
    const [gte, lte] = value;
    return { range: { lte, gte } };
  }

  if (typeof value === "string") {
    return { eq: value };
  }

  if (Array.isArray(value)) {
    return { eq: value };
  }

  return value;
};

export function getConditionType(
  conditionValue: DecimalFilterInput,
): ConditionType {
  if (conditionValue.eq) {
    return "is";
  }

  if (conditionValue.oneOf) {
    return "in";
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
