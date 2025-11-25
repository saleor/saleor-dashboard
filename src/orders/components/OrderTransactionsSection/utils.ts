// @ts-strict-ignore
import { OrderDetailsFragment } from "@dashboard/graphql";

/** Returns paymetns from order that were used to pay for the order */
export function getFilteredPayments(order: OrderDetailsFragment) {
  if (order?.payments) {
    return order.payments.filter(payment => payment.isActive || payment.transactions.length > 0);
  }

  return [];
}
