import { OrderPredicateAPI } from "@dashboard/discounts/types";

import { Condition } from "../Condition";

export const prepareOrderConditions = (
  orderPredicate: OrderPredicateAPI,
  _: Record<string, string>,
): Condition[] => {
  const orderConditions = [];

  if (orderPredicate.discountedObjectPredicate?.subtotalPrice) {
    orderConditions.push(
      new Condition(
        "subtotal",
        "is",
        orderPredicate.discountedObjectPredicate.subtotalPrice.eq,
      ),
    );
  }

  return orderConditions;
};
