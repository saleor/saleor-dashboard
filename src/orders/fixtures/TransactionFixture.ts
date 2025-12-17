import {
  OrderDetailsFragment,
  TransactionActionEnum,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

export class TransactionFixture {
  static transaction = {
    __typename: "TransactionItem" as const,
    id: "transaction-id",
    pspReference: "psp-ref",
    externalUrl: "https://example.com/transaction",
    createdAt: "2023-01-01T12:00:00Z",
    name: "Transaction",
    events: [],
    actions: [],
    authorizedAmount: {
      __typename: "Money" as const,
      amount: 100,
      currency: "USD",
    },
    chargedAmount: {
      __typename: "Money" as const,
      amount: 100,
      currency: "USD",
    },
    refundedAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    canceledAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    authorizePendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    chargePendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    refundPendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    cancelPendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
  } satisfies OrderDetailsFragment["transactions"][number];

  static stripeApp = {
    __typename: "App" as const,
    id: "app-stripe",
    name: "Stripe Payment App",
    brand: null,
  };

  static adyenApp = {
    __typename: "App" as const,
    id: "app-adyen",
    name: "Adyen Payments",
    brand: null,
  };

  static stripeTransactionEvent = {
    chargeSuccess: (
      overrides: Partial<OrderDetailsFragment["transactions"][number]["events"][number]> = {},
    ) => ({
      id: "mock-event-stripe-charge-success",
      __typename: "TransactionEvent" as const,
      type: TransactionEventTypeEnum.CHARGE_SUCCESS,
      amount: { __typename: "Money" as const, amount: 100.5, currency: "USD" },
      pspReference: "ch_ABC123",
      externalUrl: "https://dashboard.stripe.com/payments/ch_ABC123",
      createdAt: "2024-12-01T10:05:00Z",
      message: "Payment captured successfully",
      reasonReference: null,
      createdBy: TransactionFixture.stripeApp,
      ...overrides,
    }),
    refundRequest: (
      overrides: Partial<OrderDetailsFragment["transactions"][number]["events"][number]> = {},
    ) => ({
      id: "mock-event-stripe-refund-request",
      __typename: "TransactionEvent" as const,
      type: TransactionEventTypeEnum.REFUND_REQUEST,
      amount: { __typename: "Money" as const, amount: 25.0, currency: "USD" },
      pspReference: "re_XYZ789",
      externalUrl: "https://dashboard.stripe.com/refunds/re_XYZ789",
      createdAt: "2024-12-02T14:30:00Z",
      message: "Customer requested partial refund",
      reasonReference: null,
      createdBy: null,
      ...overrides,
    }),
    refundSuccess: (
      overrides: Partial<OrderDetailsFragment["transactions"][number]["events"][number]> = {},
    ) => ({
      id: "mock-event-stripe-refund-success",
      __typename: "TransactionEvent" as const,
      type: TransactionEventTypeEnum.REFUND_SUCCESS,
      amount: { __typename: "Money" as const, amount: 25.0, currency: "USD" },
      pspReference: "re_XYZ789",
      externalUrl: "https://dashboard.stripe.com/refunds/re_XYZ789",
      createdAt: "2024-12-02T14:31:00Z",
      message: "Refund processed",
      reasonReference: null,
      createdBy: TransactionFixture.stripeApp,
      ...overrides,
    }),
  };

  static stripeTransaction(overrides: Partial<OrderDetailsFragment["transactions"][number]> = {}) {
    return merge(
      cloneDeep(TransactionFixture.transaction),
      {
        name: "Stripe",
        pspReference: "pi_3ABC123",
        externalUrl: "https://dashboard.stripe.com/payments/pi_3ABC123",
        createdAt: "2024-12-01T10:00:00Z",
        actions: [TransactionActionEnum.REFUND],
        chargedAmount: { __typename: "Money", amount: 100.5, currency: "USD" },
        authorizedAmount: { __typename: "Money", amount: 0, currency: "USD" },
      },
      overrides,
    );
  }

  static adyenTransactionEvent = {
    authorizationRequest: (
      overrides: Partial<OrderDetailsFragment["transactions"][number]["events"][number]> = {},
    ) => ({
      id: "mock-event-adyen-auth-req",
      __typename: "TransactionEvent" as const,
      type: TransactionEventTypeEnum.AUTHORIZATION_REQUEST,
      amount: { __typename: "Money" as const, amount: 200.0, currency: "USD" },
      pspReference: "AUTH-456-REQ",
      externalUrl: "",
      createdAt: "2024-12-03T09:00:00Z",
      message: "Authorization requested",
      reasonReference: null,
      createdBy: null,
      ...overrides,
    }),
    authorizationSuccess: (
      overrides: Partial<OrderDetailsFragment["transactions"][number]["events"][number]> = {},
    ) => ({
      id: "mock-event-adyen-auth-success",
      __typename: "TransactionEvent" as const,
      type: TransactionEventTypeEnum.AUTHORIZATION_SUCCESS,
      amount: { __typename: "Money" as const, amount: 200.0, currency: "USD" },
      pspReference: "AUTH-456-REQ",
      externalUrl: "https://ca-test.adyen.com/payments/AUTH-456-REQ",
      createdAt: "2024-12-03T09:01:00Z",
      message: "Authorization successful - 3DS verified",
      reasonReference: null,
      createdBy: TransactionFixture.adyenApp,
      ...overrides,
    }),
  };

  static adyenTransaction(overrides: Partial<OrderDetailsFragment["transactions"][number]> = {}) {
    return merge(
      cloneDeep(TransactionFixture.transaction),
      {
        name: "Adyen",
        pspReference: "ADYEN-REF-456",
        externalUrl: "https://ca-test.adyen.com/payments/ADYEN-REF-456",
        createdAt: "2024-12-03T09:00:00Z",
        actions: [TransactionActionEnum.CHARGE, TransactionActionEnum.CANCEL],
        authorizedAmount: { __typename: "Money", amount: 200.0, currency: "USD" },
        chargedAmount: { __typename: "Money", amount: 0, currency: "USD" },
        authorizePendingAmount: { __typename: "Money", amount: 0, currency: "USD" },
      },
      overrides,
    );
  }
}
