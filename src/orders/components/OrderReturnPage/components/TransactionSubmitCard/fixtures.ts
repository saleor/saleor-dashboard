import { TransactionActionEnum, TransactionEventTypeEnum } from "@dashboard/graphql";

export const singleRefundableTransaction = [
  {
    __typename: "TransactionItem" as const,
    id: "VHJhbnNhY3Rpb25JdGVtOmZjNzhhZDkwLWQ3NDgtNDdlNi04YWM4LWE0YjdiNjRlMmE1MQ==",
    pspReference: "initialize-test",
    actions: [TransactionActionEnum.REFUND],
    name: "",
    externalUrl: "",
    createdAt: "2024-01-04T13:15:22.279318+00:00",
    events: [
      {
        __typename: "TransactionEvent" as const,
        id: "VHJhbnNhY3Rpb25FdmVudDoyNDI=",
        pspReference: "initialize-test",
        amount: {
          __typename: "Money" as const,
          amount: 66,
          currency: "EUR",
        },
        type: TransactionEventTypeEnum.CHARGE_SUCCESS,
        message: "",
        createdAt: "2024-01-04T13:15:22.750209+00:00",
        reasonReference: null,
        createdBy: {
          __typename: "App" as const,
          id: "QXBwOjY1",
          name: "Dummy Payment App",
          brand: null,
        },
        externalUrl: "",
      },
      {
        __typename: "TransactionEvent" as const,
        id: "VHJhbnNhY3Rpb25FdmVudDoyNDE=",
        pspReference: "initialize-test",
        amount: {
          __typename: "Money" as const,
          amount: 66,
          currency: "EUR",
        },
        type: TransactionEventTypeEnum.CHARGE_REQUEST,
        message: "",
        reasonReference: null,
        createdAt: "2024-01-04T13:15:22.279318+00:00",
        createdBy: null,
        externalUrl: "",
      },
    ],
    authorizedAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
    chargedAmount: {
      __typename: "Money" as const,
      amount: 66,
      currency: "EUR",
    },
    refundedAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
    canceledAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
    authorizePendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
    chargePendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
    refundPendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
    cancelPendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "EUR",
    },
  },
];
