import { OrderLineFragment } from "@dashboard/graphql";

export const toLineWithUnfulfilledQuantity = (lines: OrderLineFragment[]) =>
  lines.map(({ quantityToFulfill, ...rest }) => ({
    ...rest,
    quantityToFulfill,
    // 'OrderLineFragment.quantity' is the total ordered quantity
    // When order is unfulfilled, we should show the remaining quantity to fulfill as the quantity.
    quantity: quantityToFulfill,
  }));
