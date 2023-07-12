// @ts-strict-ignore
import {
  TransactionActionEnum,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import OrderTransaction, {
  OrderTransactionProps,
} from "@dashboard/orders/components/OrderTransaction";
import React from "react";

import { prepareMoney } from "../fixtures";

const props: OrderTransactionProps = {
  onTransactionAction: () => undefined,
  transaction: {
    __typename: "TransactionItem",
    id: "VHJhbnNhY3Rpb25JdGVtOjI=",
    name: "Adyen: refund",
    pspReference: "12345",
    actions: [
      TransactionActionEnum.CHARGE,
      TransactionActionEnum.REFUND,
      TransactionActionEnum.CANCEL,
    ],
    externalUrl: "https://google.com",
    events: [
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "",
        createdAt: "2022-08-12T17:14:27.119138+00:00",
        type: TransactionEventTypeEnum.REFUND_SUCCESS,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 34.21,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "",
        createdAt: "2022-08-12T17:14:27.119138+00:00",
        type: TransactionEventTypeEnum.REFUND_REQUEST,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 34.21,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        type: TransactionEventTypeEnum.CHARGE_SUCCESS,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        type: TransactionEventTypeEnum.CHARGE_REQUEST,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDD12",
        createdAt: "2022-08-12T13:14:27.119138+00:00",
        type: TransactionEventTypeEnum.CHARGE_FAILURE,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDD12",
        createdAt: "2022-08-12T13:14:20.119138+00:00",
        type: TransactionEventTypeEnum.AUTHORIZATION_SUCCESS,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
    ],
    authorizedAmount: prepareMoney(1.21),
    authorizePendingAmount: prepareMoney(0),
    chargedAmount: prepareMoney(0),
    chargePendingAmount: prepareMoney(0),
    refundedAmount: prepareMoney(34.21),
    refundPendingAmount: prepareMoney(0),
    canceledAmount: prepareMoney(0),
    cancelPendingAmount: prepareMoney(0),
  },
};

const longAmountProps: OrderTransactionProps = {
  onTransactionAction: () => undefined,
  transaction: {
    ...props.transaction,
    authorizedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
    refundedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
    chargedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
  },
};

export default {
  title: "Orders / OrderTransaction",
};

export const Default = () => <OrderTransaction {...props} />;

export const LongAmounts = () => <OrderTransaction {...longAmountProps} />;
