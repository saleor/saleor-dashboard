import { TransactionItemFragment } from "@dashboard/graphql";
import { IMoney } from "@dashboard/utils/intl";

export const getTransactionMoneyAmount = ({
  refundedAmount,
  refundPendingAmount,
  authorizePendingAmount,
  cancelPendingAmount,
  chargePendingAmount,
  canceledAmount,
  chargedAmount,
  authorizedAmount,
}: TransactionItemFragment): IMoney | null => {
  if (cancelPendingAmount.amount > 0) {
    return cancelPendingAmount;
  }

  if (canceledAmount.amount > 0) {
    return canceledAmount;
  }

  if (refundPendingAmount.amount > 0) {
    return refundPendingAmount;
  }

  if (refundedAmount.amount > 0) {
    return refundedAmount;
  }

  if (chargePendingAmount.amount > 0) {
    return chargePendingAmount;
  }

  if (chargedAmount.amount > 0) {
    return chargedAmount;
  }

  if (authorizePendingAmount.amount > 0) {
    return authorizePendingAmount;
  }

  if (authorizedAmount.amount > 0) {
    return authorizedAmount;
  }

  return null;
};
