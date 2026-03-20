import { type OrderPredicateAPI } from "@dashboard/discounts/types";
import { type DecimalFilterInput } from "@dashboard/graphql";

import { type Condition } from "../Condition";
import { getConditionType, getConditionValue } from "../helpers";

export const prepareOrderConditions = (
  orderPredicate: OrderPredicateAPI["discountedObjectPredicate"],
): Condition[] => {
  if (!orderPredicate) {
    return [];
  }

  if (Array.isArray(orderPredicate)) {
    return orderPredicate.flatMap(prepareOrderConditions);
  }

  return Object.entries(orderPredicate)
    .flatMap(([id, value]) => {
      if (["OR", "AND"].includes(id)) {
        return prepareOrderConditions(value as OrderPredicateAPI["discountedObjectPredicate"]);
      }

      return {
        id,
        type: getConditionType(value as DecimalFilterInput),
        value: getConditionValue(value as DecimalFilterInput),
      };
    })
    .filter(Boolean);
};
