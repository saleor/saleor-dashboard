import { type OrderDetailsFragment, TransactionEventTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import {
  orderHasInFlightTransactionAction,
  TRANSACTION_POLL_INTERVAL,
  TRANSACTION_POLL_MAX_CYCLES,
  useOrderTransactionPolling,
} from "./useOrderTransactionPolling";

const makeOrder = (eventTypes: TransactionEventTypeEnum[] = []): OrderDetailsFragment => {
  const order = {
    transactions: [
      {
        id: "tx-0",
        events: eventTypes.map((type, index) => ({ id: `evt-${index}`, type })),
      },
    ],
  };

  return order as unknown as OrderDetailsFragment;
};

const setVisibility = (state: "visible" | "hidden") => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
};

const renderPolling = (order: OrderDetailsFragment | null) => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();
  const refetch = jest.fn().mockResolvedValue(undefined);

  const utils = renderHook(
    ({ order: currentOrder }: { order: OrderDetailsFragment | null }) =>
      useOrderTransactionPolling({ order: currentOrder, startPolling, stopPolling, refetch }),
    { initialProps: { order } },
  );

  return { ...utils, startPolling, stopPolling, refetch };
};

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
    expect(orderHasInFlightTransactionAction(makeOrder([requestType]))).toBe(true);
  });

  it("returns false once a request is resolved by success", () => {
    // Arrange / Act / Assert
    expect(
      orderHasInFlightTransactionAction(
        makeOrder([
          TransactionEventTypeEnum.CHARGE_REQUEST,
          TransactionEventTypeEnum.CHARGE_SUCCESS,
        ]),
      ),
    ).toBe(false);
  });

  it("returns false once a request is resolved by failure", () => {
    // Arrange / Act / Assert
    expect(
      orderHasInFlightTransactionAction(
        makeOrder([
          TransactionEventTypeEnum.REFUND_REQUEST,
          TransactionEventTypeEnum.REFUND_FAILURE,
        ]),
      ),
    ).toBe(false);
  });

  it("ignores authorize events (not a request action we trigger)", () => {
    // Arrange / Act / Assert
    expect(
      orderHasInFlightTransactionAction(
        makeOrder([TransactionEventTypeEnum.AUTHORIZATION_REQUEST]),
      ),
    ).toBe(false);
  });
});

describe("useOrderTransactionPolling", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setVisibility("visible");
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("does not start polling when nothing is in flight", () => {
    // Arrange / Act
    const { startPolling, result } = renderPolling(makeOrder([]));

    // Assert
    expect(startPolling).not.toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it("starts polling once when a request action is triggered", () => {
    // Arrange
    const { startPolling, rerender, result } = renderPolling(makeOrder([]));

    // Act
    act(() => rerender({ order: makeOrder([TransactionEventTypeEnum.CHARGE_REQUEST]) }));

    // Assert
    expect(startPolling).toHaveBeenCalledTimes(1);
    expect(startPolling).toHaveBeenCalledWith(TRANSACTION_POLL_INTERVAL);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling when the request resolves", () => {
    // Arrange
    const { stopPolling, rerender, result } = renderPolling(
      makeOrder([TransactionEventTypeEnum.CHARGE_REQUEST]),
    );

    // Act
    act(() =>
      rerender({
        order: makeOrder([
          TransactionEventTypeEnum.CHARGE_REQUEST,
          TransactionEventTypeEnum.CHARGE_SUCCESS,
        ]),
      }),
    );

    // Assert
    expect(stopPolling).toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it("starts a single poller when multiple action types are in flight", () => {
    // Arrange / Act
    const { startPolling, result } = renderPolling(
      makeOrder([
        TransactionEventTypeEnum.CHARGE_REQUEST,
        TransactionEventTypeEnum.REFUND_REQUEST,
        TransactionEventTypeEnum.CANCEL_REQUEST,
      ]),
    );

    // Assert
    expect(startPolling).toHaveBeenCalledTimes(1);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling after the cap is reached while still in flight", () => {
    // Arrange
    const { stopPolling, result } = renderPolling(
      makeOrder([TransactionEventTypeEnum.CHARGE_REQUEST]),
    );

    // Act
    act(() => {
      jest.advanceTimersByTime(TRANSACTION_POLL_INTERVAL * TRANSACTION_POLL_MAX_CYCLES);
    });

    // Assert
    expect(stopPolling).toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it("resumes with a fresh window when a new request starts after the cap", () => {
    // Arrange
    const { startPolling, rerender, result } = renderPolling(
      makeOrder([TransactionEventTypeEnum.CHARGE_REQUEST]),
    );

    act(() => {
      jest.advanceTimersByTime(TRANSACTION_POLL_INTERVAL * TRANSACTION_POLL_MAX_CYCLES);
    });
    expect(result.current.isPolling).toBe(false);

    // Act: previous request resolves, then a new action is triggered
    act(() =>
      rerender({
        order: makeOrder([
          TransactionEventTypeEnum.CHARGE_REQUEST,
          TransactionEventTypeEnum.CHARGE_SUCCESS,
        ]),
      }),
    );
    act(() =>
      rerender({
        order: makeOrder([
          TransactionEventTypeEnum.CHARGE_REQUEST,
          TransactionEventTypeEnum.CHARGE_SUCCESS,
          TransactionEventTypeEnum.REFUND_REQUEST,
        ]),
      }),
    );

    // Assert: polled again (initial start + restart after the new rising edge)
    expect(startPolling).toHaveBeenCalledTimes(2);
    expect(result.current.isPolling).toBe(true);
  });

  it("pauses while the tab is hidden and catches up when it becomes visible", () => {
    // Arrange
    const { startPolling, stopPolling, refetch, result } = renderPolling(
      makeOrder([TransactionEventTypeEnum.CHARGE_REQUEST]),
    );

    expect(startPolling).toHaveBeenCalledTimes(1);

    // Act: hide the tab
    setVisibility("hidden");

    // Assert: polling paused
    expect(stopPolling).toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);

    // Act: tab returns to focus while still in flight
    setVisibility("visible");

    // Assert: immediate catch-up refetch + polling resumes
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(startPolling).toHaveBeenCalledTimes(2);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling on unmount", () => {
    // Arrange
    const { stopPolling, unmount } = renderPolling(
      makeOrder([TransactionEventTypeEnum.CHARGE_REQUEST]),
    );

    // Act
    unmount();

    // Assert
    expect(stopPolling).toHaveBeenCalled();
  });
});
