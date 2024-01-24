import { OrderPredicateAPI } from "@dashboard/discounts/types";
import { DecimalFilterInput } from "@dashboard/graphql";

import { Condition } from "../Condition";
import { getConditionType, getConditionValue } from "../helpers";

export const prepareOrderConditions = (
  orderPredicate: OrderPredicateAPI,
): Condition[] => {
  if (!orderPredicate) {
    return [];
  }

  return Object.entries(orderPredicate)
    .map(([id, value]) => {
      if (id === "OR") {
        return prepareOrderConditions(
          (value as any[]).reduce(
            (acc: OrderPredicateAPI, val: Record<string, unknown>) => {
              acc = { ...acc, ...val };
              return acc;
            },
            {} as OrderPredicateAPI,
          ),
        );
      }

      return new Condition(
        id,
        getConditionType(value as DecimalFilterInput),
        getConditionValue(value as DecimalFilterInput),
      );
    })
    .filter(Boolean)
    .flat() as Condition[];
};
