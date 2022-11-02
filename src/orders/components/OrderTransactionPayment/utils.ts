import {
  OrderAction,
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionActionEnum,
  TransactionEventFragment,
  TransactionEventStatus,
  TransactionKind,
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
  payment: OrderPaymentFragment,
): TransactionEventFragment[] => {
  const transactions = payment.transactions ?? [];

  if (transactions.length === 0) {
    return [
      {
        id: "",
        reference: undefined,
        name: TransactionKind.PENDING,
        status: TransactionEventStatus.PENDING,
        createdAt: payment.modified ?? new Date(),
        __typename: "TransactionEvent" as const,
      },
    ];
  }

  return transactions
    .map(({ id, isSuccess, kind, created, token }) => ({
      id,
      reference: token,
      name: kind,
      status:
        kind === TransactionKind.PENDING
          ? TransactionEventStatus.PENDING
          : isSuccess
          ? TransactionEventStatus.SUCCESS
          : TransactionEventStatus.FAILURE,
      createdAt: created,
      __typename: "TransactionEvent" as const,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const mapOrderActionsToTransactionActions = (
  orderActions: OrderAction[],
): TransactionActionEnum[] =>
  orderActions
    .map(action => {
      switch (action) {
        case OrderAction.VOID:
          return TransactionActionEnum.VOID;
        case OrderAction.CAPTURE:
          return TransactionActionEnum.CHARGE;
        case OrderAction.REFUND:
          return TransactionActionEnum.REFUND;
        default:
          return null;
      }
    })
    .filter(mappedAction => mappedAction !== null);
