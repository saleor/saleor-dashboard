import { OrderPredicateInput } from "@dashboard/graphql";

import { Condition } from "../Condition";
import { createWhereInput } from "../helpers";

export function prepareOrderPredicate(
  conditions: Condition[],
): OrderPredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.type) {
        return undefined;
      }

      return {
        [`${condition.id}`]: createWhereInput(condition),
      };
    })
    .filter(Boolean);

  if (ruleConditions.length === 0) {
    return {
      discountedObjectPredicate: {},
    };
  }

  if (ruleConditions.length === 1) {
    return {
      discountedObjectPredicate: {
        ...ruleConditions[0],
      },
    };
  }

  return {
    discountedObjectPredicate: {
      OR: ruleConditions,
    },
  };
}
