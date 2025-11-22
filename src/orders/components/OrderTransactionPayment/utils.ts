// @ts-strict-ignore
import {
  OrderAction,
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionActionEnum,
  TransactionKind,
} from "@dashboard/graphql";
import {
  TransactionEventStatus,
  TransactionFakeEvent,
  TransactionMappingResult,
} from "@dashboard/orders/types";

type Money = OrderPaymentFragment["total"];

export const getTransactionAmount = (money: Money | null, fallbackCurrency: string): Money => {
  if (!money) {
    return {
      currency: fallbackCurrency,
      amount: 0,
      __typename: "Money",
    };
  }

  return money;
};

export const findMethodName = (gatewayId: string, allMethods: PaymentGatewayFragment[]): string =>
  allMethods.find(method => method.id === gatewayId)?.name ?? gatewayId;

const mapPaymentKindToTransaction = (
  kind: TransactionKind,
  isSuccess: boolean,
): TransactionMappingResult => {
  const status: TransactionEventStatus = isSuccess ? "SUCCESS" : "FAILED";

  switch (kind) {
    case "REFUND":
      return {
        type: "REFUND",
        status,
      };
    case "REFUND_ONGOING":
      return {
        type: "REFUND",
        status: "PENDING",
      };
    case "CANCEL":
      return {
        type: "CANCEL",
        status,
      };
    case "VOID":
      return {
        type: "CANCEL",
        status,
      };
    case "AUTH":
      return {
        type: "AUTHORIZATION",
        status,
      };
    case "CAPTURE":
      return {
        type: "CHARGE",
        status,
      };
    case "PENDING":
      return {
        type: "CHARGE",
        status: "PENDING",
      };
    default:
      return {
        type: null,
        status: null,
      };
  }
};

export const mapPaymentToTransactionEvents = (
  payment: OrderPaymentFragment,
): TransactionFakeEvent[] => {
  const transactions = payment.transactions ?? [];

  if (transactions.length === 0) {
    return [
      {
        id: "",
        pspReference: undefined,
        mappedResult: {
          type: "AUTHORIZATION",
          status: "REQUEST",
        },
        createdBy: null,
        externalUrl: null,
        message: null,
        reasonReference: null,
        createdAt: payment.modified ?? new Date(),
        amount: null,
        __typename: "TransactionFakeEvent" as const,
      },
    ];
  }

  return transactions
    .map(({ id, isSuccess, kind, created, token }) => {
      const mappedResult = mapPaymentKindToTransaction(kind, isSuccess);

      return {
        id,
        pspReference: token,
        message: kind,
        mappedResult,
        createdBy: null,
        reasonReference: null,
        externalUrl: null,
        createdAt: created,
        amount: null,
        __typename: "TransactionFakeEvent" as const,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const mapOrderActionsToTransactionActions = (
  orderActions: OrderAction[],
): TransactionActionEnum[] =>
  orderActions
    .map(action => {
      switch (action) {
        case "VOID":
          return "CANCEL";
        case "CAPTURE":
          return "CHARGE";
        case "REFUND":
          return "REFUND";
        default:
          return null;
      }
    })
    .filter(mappedAction => mappedAction !== null);
