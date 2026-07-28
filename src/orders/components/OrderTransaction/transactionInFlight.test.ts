import {
  type OrderDetailsFragment,
  TransactionActionEnum,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";

import {
  orderHasInFlightTransactionAction,
  transactionActionInFlight,
} from "./transactionInFlight";

interface EventInput {
  type: TransactionEventTypeEnum;
  // Events sharing a pspReference belong to the same request/resolution group.
  // When omitted each event gets a unique reference (its own group).
  psp?: string;
}

type Transaction = OrderDetailsFragment["transactions"][number];

const makeTransaction = (events: EventInput[] = []): Transaction => {
  const transaction = {
    id: "tx-0",
    events: events.map((event, index) => ({
      id: `evt-${index}`,
      type: event.type,
      pspReference: event.psp ?? `psp-${index}`,
    })),
  };

  return transaction as unknown as Transaction;
};

const makeOrder = (events: EventInput[] = []): OrderDetailsFragment =>
  ({ transactions: [makeTransaction(events)] }) as unknown as OrderDetailsFragment;

describe("transactionActionInFlight", () => {
  it("returns true for the action whose request is unresolved", () => {
    // Arrange
    const transaction = makeTransaction([{ type: TransactionEventTypeEnum.CHARGE_REQUEST }]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CHARGE)).toBe(true);
  });

  it("returns false for a different action than the one in flight", () => {
    // Arrange
    const transaction = makeTransaction([{ type: TransactionEventTypeEnum.CHARGE_REQUEST }]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CANCEL)).toBe(false);
  });

  it("returns false once the charge request is resolved by success (same pspReference)", () => {
    // Arrange
    const transaction = makeTransaction([
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
      { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "a" },
    ]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CHARGE)).toBe(false);
  });

  it("returns false when resolved cross-action by an authorization success (same pspReference)", () => {
    // Arrange
    const transaction = makeTransaction([
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
      { type: TransactionEventTypeEnum.AUTHORIZATION_SUCCESS, psp: "a" },
    ]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CHARGE)).toBe(false);
  });

  it("returns false once the charge request is resolved by failure", () => {
    // Arrange
    const transaction = makeTransaction([
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
      { type: TransactionEventTypeEnum.CHARGE_FAILURE, psp: "a" },
    ]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CHARGE)).toBe(false);
  });

  it("returns true when one psp group is unresolved even though another is resolved", () => {
    // Arrange
    const transaction = makeTransaction([
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "resolved" },
      { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "resolved" },
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "pending" },
    ]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CHARGE)).toBe(true);
  });

  it("returns true for an unresolved cancel request", () => {
    // Arrange
    const transaction = makeTransaction([{ type: TransactionEventTypeEnum.CANCEL_REQUEST }]);

    // Act / Assert
    expect(transactionActionInFlight(transaction.events, TransactionActionEnum.CANCEL)).toBe(true);
  });
});

describe("orderHasInFlightTransactionAction", () => {
  it("returns false when no order", () => {
    // Arrange / Act / Assert
    expect(orderHasInFlightTransactionAction(null)).toBe(false);
  });

  it("returns false when there are no events", () => {
    // Arrange / Act / Assert
    expect(orderHasInFlightTransactionAction(makeOrder([]))).toBe(false);
  });

  it.each([
    ["charge", TransactionEventTypeEnum.CHARGE_REQUEST],
    ["refund", TransactionEventTypeEnum.REFUND_REQUEST],
    ["cancel", TransactionEventTypeEnum.CANCEL_REQUEST],
  ])("returns true for an unresolved %s request", (_label, requestType) => {
    // Arrange / Act / Assert
    expect(orderHasInFlightTransactionAction(makeOrder([{ type: requestType }]))).toBe(true);
  });

  it("returns false once a request is resolved by success (same pspReference)", () => {
    // Arrange / Act / Assert
    expect(
      orderHasInFlightTransactionAction(
        makeOrder([
          { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
          { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "a" },
        ]),
      ),
    ).toBe(false);
  });

  it("returns false once a request is resolved by failure (same pspReference)", () => {
    // Arrange / Act / Assert
    expect(
      orderHasInFlightTransactionAction(
        makeOrder([
          { type: TransactionEventTypeEnum.REFUND_REQUEST, psp: "a" },
          { type: TransactionEventTypeEnum.REFUND_FAILURE, psp: "a" },
        ]),
      ),
    ).toBe(false);
  });

  it("treats a charge request resolved by an AUTHORIZATION_SUCCESS as settled", () => {
    // Arrange: real-world settled transaction — one charge resolved by CHARGE_SUCCESS,
    // another charge request resolved by an AUTHORIZATION_SUCCESS under the same psp.
    const order = makeOrder([
      { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "ref-1" },
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "ref-1" },
      { type: TransactionEventTypeEnum.AUTHORIZATION_SUCCESS, psp: "ref-2" },
      { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "ref-2" },
    ]);

    // Act / Assert
    expect(orderHasInFlightTransactionAction(order)).toBe(false);
  });

  it("ignores authorize requests (not a request action we trigger)", () => {
    // Arrange / Act / Assert
    expect(
      orderHasInFlightTransactionAction(
        makeOrder([{ type: TransactionEventTypeEnum.AUTHORIZATION_REQUEST }]),
      ),
    ).toBe(false);
  });
});
