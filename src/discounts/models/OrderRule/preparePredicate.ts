import {
  DiscountedObjectWhereInput,
  OrderPredicateInput,
} from "@dashboard/graphql";

import { Condition } from "../Condition";
import { createAPIWhereInput } from "../helpers";

export function prepareOrderPredicate(
  conditions: Condition[],
): OrderPredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.id) {
        return undefined;
      }

      if (!condition.id) {
        return undefined;
      }

      if (Array.isArray(condition.value) && condition.value.length === 0) {
        return undefined;
      } else if (!condition.value) {
        return undefined;
      }

      return {
        [`${condition.id}`]: createAPIWhereInput(condition),
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
      OR: ruleConditions as DiscountedObjectWhereInput["OR"],
    },
  };
}
