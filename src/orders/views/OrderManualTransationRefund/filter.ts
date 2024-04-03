import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";

export const filterRefundTransactions = (
  transactions: TransactionItemFragment[],
) => {
  return transactions.filter(transaction =>
    transaction.actions.includes(TransactionActionEnum.REFUND),
  );
};
