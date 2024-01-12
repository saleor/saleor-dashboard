import { OrderPredicateAPI } from "@dashboard/discounts/types";
import { DecimalFilterInput } from "@dashboard/graphql";

import { Condition } from "../Condition";

export const prepareOrderConditions = (
  orderPredicate: OrderPredicateAPI,
): Condition[] => {
  if (!orderPredicate?.discountedObjectPredicate) {
    return [];
  }

  return Object.entries(orderPredicate.discountedObjectPredicate)
    .map(([key, value]) => {
      if (key === "OR") {
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

      if (key === "baseSubtotalPrice") {
        return new Condition(key, "is", (value as DecimalFilterInput).eq);
      }

      if (key === "baseTotalPrice") {
        return new Condition(
          key,
          "is",
          orderPredicate.discountedObjectPredicate.baseSubtotalPrice.eq,
        );
      }

      return new Condition(null, "is", []);
    })
    .filter(Boolean)
    .flat() as Condition[];
};
