import {
  TransactionActionEnum,
  TransactionBaseItemFragment,
} from "@dashboard/graphql";

export const isRefundable = (transaction: TransactionBaseItemFragment) =>
  transaction.actions.includes(TransactionActionEnum.REFUND);
