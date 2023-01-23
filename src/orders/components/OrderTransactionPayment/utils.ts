import {
  OrderAction,
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionActionEnum,
  TransactionEventActionTypeEnum,
  TransactionEventFragment,
  TransactionEventStatus,
  TransactionKind,
} from "@dashboard/graphql";

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

const mapPaymentKindToTransactionType = (
  kind: TransactionKind,
): [TransactionEventActionTypeEnum, TransactionEventStatus] | [null, null] => {
  switch (kind) {
    case TransactionKind.REFUND:
      return [
        TransactionEventActionTypeEnum.REFUND,
        TransactionEventStatus.SUCCESS,
      ];
    case TransactionKind.REFUND_ONGOING:
      return [
        TransactionEventActionTypeEnum.REFUND,
        TransactionEventStatus.PENDING,
      ];
    case TransactionKind.CANCEL:
      return [
        TransactionEventActionTypeEnum.CANCEL,
        TransactionEventStatus.PENDING,
      ];
    case TransactionKind.VOID:
      return [
        TransactionEventActionTypeEnum.CANCEL,
        TransactionEventStatus.SUCCESS,
      ];
    case TransactionKind.AUTH:
      return [
        TransactionEventActionTypeEnum.AUTHORIZE,
        TransactionEventStatus.SUCCESS,
      ];
    case TransactionKind.CAPTURE:
      return [
        TransactionEventActionTypeEnum.CHARGE,
        TransactionEventStatus.SUCCESS,
      ];
    case TransactionKind.PENDING:
      return [
        TransactionEventActionTypeEnum.CHARGE,
        TransactionEventStatus.PENDING,
      ];
    default:
      return [null, null];
  }
};

export const mapPaymentToTransactionEvents = (
  payment: OrderPaymentFragment,
): TransactionEventFragment[] => {
  const transactions = payment.transactions ?? [];

  if (transactions.length === 0) {
    return [
      {
        id: "",
        pspReference: undefined,
        type: TransactionEventActionTypeEnum.AUTHORIZE,
        name: undefined,
        status: TransactionEventStatus.PENDING,
        createdAt: payment.modified ?? new Date(),
        amount: null,
        __typename: "TransactionEvent" as const,
      },
    ];
  }

  return transactions
    .map(({ id, isSuccess, kind, created, token }) => {
      const [mappedType, mappedStatus] = mapPaymentKindToTransactionType(kind);

      return {
        id,
        pspReference: token,
        type: mappedType,
        name: kind,
        status: !isSuccess ? TransactionEventStatus.FAILURE : mappedStatus,
        createdAt: created,
        amount: null,
        __typename: "TransactionEvent" as const,
      };
    })
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
