import { OrderPredicateAPI } from "@dashboard/discounts/types";

import { Condition } from "../Condition";

export const prepareOrderConditions = (
  orderPredicate: OrderPredicateAPI,
  _: Record<string, string>,
): Condition[] => {
  const orderConditions = [];

  if (orderPredicate.discountedObjectPredicate?.baseSubtotalPrice) {
    orderConditions.push(
      new Condition(
        "baseSubtotalPrice",
        "is",
        orderPredicate.discountedObjectPredicate.baseSubtotalPrice.eq,
      ),
    );
  }

  return orderConditions;
};
