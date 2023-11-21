import { FetchResult } from "@apollo/client";
import {
  Condition,
  ConditionType,
  DiscoutFormData,
  Rule,
} from "@dashboard/discounts/types";
import {
  CataloguePredicateInput,
  PromotionCreateMutation,
  PromotionCreateMutationVariables,
  PromotionRuleInput,
} from "@dashboard/graphql";
import { getMutationErrors, joinDateTime } from "@dashboard/misc";

export const createHandler = (
  create: (
    varaibles: PromotionCreateMutationVariables,
  ) => Promise<FetchResult<PromotionCreateMutation>>,
) => {
  return async (data: DiscoutFormData) => {
    const response = await create({
      input: {
        name: data.name,
        description: JSON.parse(data.description),
        endDate: data.dates.hasEndDate
          ? joinDateTime(data.dates.endDate, data.dates.endTime)
          : null,
        startDate: joinDateTime(data.dates.startDate, data.dates.startTime),
        rules: data.rules.map(toAPIRule),
      },
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }
  };
};

export function toAPIRule(rule: Rule): PromotionRuleInput {
  return {
    name: rule.name,
    description: JSON.parse(rule.description),
    channels: rule.channels.map(channel => channel.value),
    rewardValue: rule.rewardValue,
    rewardValueType: rule.rewardValueType,
    cataloguePredicate: {
      OR: rule.conditions.map(toAPIPredicates),
    },
  };
}

function toAPIPredicates(condition: Condition): CataloguePredicateInput {
  return {
    [getPredicateType(condition.type)]: {
      ids: condition.values.map(val => val.value),
    },
  };
}

function getPredicateType(type: ConditionType) {
  return `${type}Predicate`;
}
