import {
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionEventFragment,
  TransactionStatus,
} from "@saleor/graphql";

type Money = OrderPaymentFragment["total"];

export const getTransactionAmount = (
  money: Money | null,
  fallbackCurrency: string,
): Money => {
  if (!money) {
    return {
      currency: fallbackCurrency,
      amount: 0,
      __typename: "Money",
    };
  }

  return money;
};

export const findMethodName = (
  gatewayId: string,
  allMethods: PaymentGatewayFragment[],
): string =>
  allMethods.find(method => method.id === gatewayId)?.name ?? gatewayId;

export const mapTransactionsToEvents = (
  transactions: OrderPaymentFragment["transactions"],
): TransactionEventFragment[] =>
  transactions
    .map(({ id, isSuccess, kind, created, token }) => ({
      id,
      reference: token,
      name: kind,
      status: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.FAILURE,
      createdAt: created,
      __typename: "TransactionEvent" as const,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
