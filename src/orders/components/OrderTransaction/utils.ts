import {
  TransactionActionEnum,
  TransactionEventFragment,
} from "@saleor/graphql";
import {
  TransactionFakeEvent,
  TransactionMappingResult,
} from "@saleor/orders/types";
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

export const mapTransactionEvent = (
  event: TransactionEventFragment | TransactionFakeEvent,
): TransactionMappingResult => {
  if (event.__typename === "TransactionFakeEvent") {
    return event.mappedResult;
  }

  switch (event.type) {
    case "CHARGE_BACK": {
      return {
        type: "CHARGEBACK",
        status: null,
      };
    }
    case "REFUND_REVERSE": {
      return {
        type: "REFUND_REVERSED",
        status: null,
      };
    }
    case "AUTHORIZATION_ADJUSTMENT": {
      return {
        type: "AUTHORIZATION_ADJUSTMENT",
        status: null,
      };
    }

    case "AUTHORIZATION_FAILURE": {
      return {
        type: "AUTHORIZATION",
        status: "FAILED",
      };
    }
    case "AUTHORIZATION_REQUEST": {
      return {
        type: "AUTHORIZATION",
        status: "REQUEST",
      };
    }
    case "AUTHORIZATION_SUCCESS": {
      return {
        type: "AUTHORIZATION",
        status: "SUCCESS",
      };
    }

    case "CHARGE_FAILURE": {
      return {
        type: "CHARGE",
        status: "FAILED",
      };
    }
    case "CHARGE_REQUEST": {
      return {
        type: "CHARGE",
        status: "REQUEST",
      };
    }
    case "CHARGE_SUCCESS": {
      return {
        type: "CHARGE",
        status: "SUCCESS",
      };
    }

    case "CANCEL_FAILURE": {
      return {
        type: "CANCEL",
        status: "FAILED",
      };
    }
    case "CANCEL_REQUEST": {
      return {
        type: "CANCEL",
        status: "REQUEST",
      };
    }
    case "CANCEL_SUCCESS": {
      return {
        type: "CANCEL",
        status: "SUCCESS",
      };
    }

    case "REFUND_FAILURE": {
      return {
        type: "REFUND",
        status: "FAILED",
      };
    }
    case "REFUND_REQUEST": {
      return {
        type: "REFUND",
        status: "REQUEST",
      };
    }
    case "REFUND_SUCCESS": {
      return {
        type: "REFUND",
        status: "SUCCESS",
      };
    }
  }
};
