import {
  TransactionActionEnum,
  TransactionEventFragment,
  TransactionEventTypeEnum,
  TransactionItemFragment,
} from "@dashboard/graphql/transactions";
import {
  FakeTransaction,
  TransactionFakeEvent,
  TransactionMappingResult,
} from "@dashboard/orders/types";
import { MessageDescriptor } from "react-intl";

import { transactionActionMessages } from "./messages";

// Fix when Prettier gets updated to v2.x
// type TransactionActionUnion = Exclude<`${TransactionActionEnum}`, "REFUND">;
type TransactionActionUnion = TransactionActionEnum;

export const mapActionToMessage: Record<
  TransactionActionUnion,
  MessageDescriptor
> = {
  VOID: transactionActionMessages.void,
  CHARGE: transactionActionMessages.capture,
  CANCEL: transactionActionMessages.cancel,
  REFUND: null,
};

const typeMap: Record<TransactionEventTypeEnum, TransactionMappingResult> = {
  CHARGE_BACK: {
    type: "CHARGEBACK",
    status: null,
  },
  REFUND_REVERSE: {
    type: "REFUND_REVERSED",
    status: null,
  },
  AUTHORIZATION_ADJUSTMENT: {
    type: "AUTHORIZATION_ADJUSTMENT",
    status: null,
  },

  // Authorization
  AUTHORIZATION_FAILURE: {
    type: "AUTHORIZATION",
    status: "FAILED",
  },
  AUTHORIZATION_REQUEST: {
    type: "AUTHORIZATION",
    status: "REQUEST",
  },
  AUTHORIZATION_SUCCESS: {
    type: "AUTHORIZATION",
    status: "SUCCESS",
  },

  // Charge
  CHARGE_FAILURE: {
    type: "CHARGE",
    status: "FAILED",
  },
  CHARGE_REQUEST: {
    type: "CHARGE",
    status: "REQUEST",
  },
  CHARGE_SUCCESS: {
    type: "CHARGE",
    status: "SUCCESS",
  },

  // Cancel (previously void)
  CANCEL_FAILURE: {
    type: "CANCEL",
    status: "FAILED",
  },
  CANCEL_REQUEST: {
    type: "CANCEL",
    status: "REQUEST",
  },
  CANCEL_SUCCESS: {
    type: "CANCEL",
    status: "SUCCESS",
  },

  // Refunds
  REFUND_FAILURE: {
    type: "REFUND",
    status: "FAILED",
  },
  REFUND_REQUEST: {
    type: "REFUND",
    status: "REQUEST",
  },
  REFUND_SUCCESS: {
    type: "REFUND",
    status: "SUCCESS",
  },
};

export const mapTransactionEvent = (
  event: TransactionEventFragment | TransactionFakeEvent | undefined,
): TransactionMappingResult => {
  if (!event) {
    return {
      type: null,
      status: null,
    };
  }

  if (event.__typename === "TransactionFakeEvent") {
    return event.mappedResult;
  }

  const mappedResult = typeMap[event.type];
  if (mappedResult) {
    return mappedResult;
  }

  return {
    type: null,
    status: null,
  };
};

export const getTransactionEvents = (
  transaction: TransactionItemFragment | FakeTransaction,
  fakeEvents: TransactionFakeEvent[] | undefined,
) => {
  if (transaction.__typename === "FakeTransaction") {
    return fakeEvents;
  }
  return transaction.events;
};
