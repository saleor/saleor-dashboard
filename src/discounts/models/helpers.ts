import { isTuple } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { Condition } from "./Condition";
import { BaseRule, Rule } from "./types";

export const createBaseAPIInput = (data: Rule): PromotionRuleInput => {
  return {
    name: data.name,
    description: data.description ? JSON.parse(data.description) : null,
    channels: data?.channel ? [data.channel.value] : [],
    rewardType: getRewardType(data),
    rewardValue: data.rewardValue,
    rewardValueType: data.rewardValueType,
  };
};

export const createBaseRuleInputFromAPI = (
  data: PromotionRuleDetailsFragment,
): Omit<BaseRule, "toAPI" | "type" | "conditions"> => {
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

  if (
    Array.isArray(value) &&
    isTuple(value.map(option => option.value)) &&
    label === "between"
  ) {
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

function getRewardType(rule: Rule): RewardTypeEnum | null {
  if (rule.type === "order" && !rule.rewardType) {
    return RewardTypeEnum.SUBTOTAL_DISCOUNT;
  }
  return rule.rewardType;
}
