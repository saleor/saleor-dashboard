import {
  TransactionActionEnum,
  TransactionBaseItemFragment,
} from "@dashboard/graphql";

export const isTransactionRefundable = (
  transaction: TransactionBaseItemFragment,
) => transaction.actions.includes(TransactionActionEnum.REFUND);
