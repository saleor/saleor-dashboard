import { CheckoutAndOrderPredicateInput } from "@dashboard/graphql";

import { OrderCondition } from "./OrderCondition";

export function prepareOrderPredicate(
  conditions: OrderCondition[],
): CheckoutAndOrderPredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.type) {
        return undefined;
      }

      return {
        [`${condition.name}`]: condition.values,
      };
    })
    .filter(Boolean) as CheckoutAndOrderPredicateInput[];

  if (ruleConditions.length === 0) {
    return {};
  }

  if (ruleConditions.length === 1) {
    return {
      discountedObjectPredicate: {
        ...ruleConditions[0],
      },
    };
  }

  return {
    OR: ruleConditions,
  };
}
