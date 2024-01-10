import { OrderPredicateAPI } from "@dashboard/discounts/types";

import { OrderCondition } from "./OrderCondition";

export const prepareOrderConditions = (
  orderPredicate: OrderPredicateAPI,
  ruleConditionsOptionsDetailsMap: Record<string, string>,
): OrderCondition[] => {
  if (orderPredicate.discountedObjectPredicate?.subtotalPrice) {
    return [
      new OrderCondition(
        "subtotalPrice",
        "is",
        orderPredicate.discountedObjectPredicate.subtotalPrice.eq,
      ),
    ];
  }
};
