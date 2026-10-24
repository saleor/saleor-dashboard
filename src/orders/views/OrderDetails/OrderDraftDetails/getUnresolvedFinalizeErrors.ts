import {
  type OrderDetailsFragment,
  OrderErrorCode,
  type OrderErrorFragment,
} from "@dashboard/graphql";

type DraftOrder = Pick<
  OrderDetailsFragment,
  "billingAddress" | "shippingAddress" | "shippingMethod"
>;

/**
 * `draftOrderComplete` reports what was missing at the moment Finalize was clicked.
 * Apollo keeps that result around until the mutation runs again, so the errors would
 * otherwise stay on screen after the user has already filled the missing data in.
 */
const isResolved = (error: OrderErrorFragment, order: DraftOrder): boolean => {
  switch (error.code) {
    case OrderErrorCode.BILLING_ADDRESS_NOT_SET:
      return !!order.billingAddress;
    case OrderErrorCode.ORDER_NO_SHIPPING_ADDRESS:
      return !!order.shippingAddress;
    case OrderErrorCode.SHIPPING_METHOD_REQUIRED:
      return !!order.shippingMethod;
    default:
      return false;
  }
};

export const getUnresolvedFinalizeErrors = (
  errors: OrderErrorFragment[],
  order: DraftOrder | null | undefined,
): OrderErrorFragment[] => {
  if (!order) {
    return errors;
  }

  return errors.filter(error => !isResolved(error, order));
};
