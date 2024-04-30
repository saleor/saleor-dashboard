import { TransactionActionEnum, TransactionBaseItemFragment } from "@dashboard/graphql";

export const filterRefundTransactions = (transactions: TransactionBaseItemFragment[]) => {
  return transactions.filter(transaction =>
    transaction.actions.includes(TransactionActionEnum.REFUND),
  );
};
