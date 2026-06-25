import { type OrderDetailsFragment } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import {
  orderHasPendingTransaction,
  TRANSACTION_POLL_INTERVAL,
  TRANSACTION_POLL_MAX_CYCLES,
  useOrderTransactionPolling,
} from "./useOrderTransactionPolling";

const money = (amount: number) => ({ __typename: "Money", amount, currency: "USD" });

type PendingInput = Partial<Record<"authorize" | "charge" | "refund" | "cancel", number>>;

const makeOrder = (pending: PendingInput = {}): OrderDetailsFragment => {
  const order = {
    totalAuthorizePending: money(pending.authorize ?? 0),
    totalChargePending: money(pending.charge ?? 0),
    totalRefundPending: money(pending.refund ?? 0),
    totalCancelPending: money(pending.cancel ?? 0),
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

describe("orderHasPendingTransaction", () => {
  it("returns false when no order", () => {
    // Arrange / Act / Assert
    expect(orderHasPendingTransaction(null)).toBe(false);
  });

  it("returns false when all pending amounts are zero", () => {
    // Arrange / Act / Assert
    expect(orderHasPendingTransaction(makeOrder({}))).toBe(false);
  });

  it.each(["charge", "refund", "cancel"] as const)(
    "returns true when %s pending amount is positive",
    actionType => {
      // Arrange / Act / Assert
      expect(orderHasPendingTransaction(makeOrder({ [actionType]: 10 }))).toBe(true);
    },
  );

  it("ignores authorize pending (it can stay stuck and is not a request action)", () => {
    // Arrange / Act / Assert
    expect(orderHasPendingTransaction(makeOrder({ authorize: 56.78 }))).toBe(false);
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

  it("does not start polling when nothing is pending", () => {
    // Arrange / Act
    const { startPolling, result } = renderPolling(makeOrder({}));

    // Assert
    expect(startPolling).not.toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it("starts polling once when a transaction becomes pending", () => {
    // Arrange
    const { startPolling, rerender, result } = renderPolling(makeOrder({}));

    // Act
    act(() => rerender({ order: makeOrder({ charge: 50 }) }));

    // Assert
    expect(startPolling).toHaveBeenCalledTimes(1);
    expect(startPolling).toHaveBeenCalledWith(TRANSACTION_POLL_INTERVAL);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling when pending amounts clear", () => {
    // Arrange
    const { stopPolling, rerender, result } = renderPolling(makeOrder({ charge: 50 }));

    // Act
    act(() => rerender({ order: makeOrder({}) }));

    // Assert
    expect(stopPolling).toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it("starts a single poller when multiple action types are pending", () => {
    // Arrange / Act
    const { startPolling, result } = renderPolling(
      makeOrder({ charge: 50, refund: 10, cancel: 5 }),
    );

    // Assert
    expect(startPolling).toHaveBeenCalledTimes(1);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling after the cap is reached while still pending", () => {
    // Arrange
    const { stopPolling, result } = renderPolling(makeOrder({ charge: 50 }));

    // Act
    act(() => {
      jest.advanceTimersByTime(TRANSACTION_POLL_INTERVAL * TRANSACTION_POLL_MAX_CYCLES);
    });

    // Assert
    expect(stopPolling).toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it("resumes with a fresh window when a new pending episode starts after the cap", () => {
    // Arrange
    const { startPolling, rerender, result } = renderPolling(makeOrder({ charge: 50 }));

    act(() => {
      jest.advanceTimersByTime(TRANSACTION_POLL_INTERVAL * TRANSACTION_POLL_MAX_CYCLES);
    });
    expect(result.current.isPolling).toBe(false);

    // Act: episode ends, then a new action makes it pending again
    act(() => rerender({ order: makeOrder({}) }));
    act(() => rerender({ order: makeOrder({ refund: 20 }) }));

    // Assert: polled again (initial start + restart after the new rising edge)
    expect(startPolling).toHaveBeenCalledTimes(2);
    expect(result.current.isPolling).toBe(true);
  });

  it("pauses while the tab is hidden and catches up when it becomes visible", () => {
    // Arrange
    const { startPolling, stopPolling, refetch, result } = renderPolling(makeOrder({ charge: 50 }));

    expect(startPolling).toHaveBeenCalledTimes(1);

    // Act: hide the tab
    setVisibility("hidden");

    // Assert: polling paused
    expect(stopPolling).toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);

    // Act: tab returns to focus while still pending
    setVisibility("visible");

    // Assert: immediate catch-up refetch + polling resumes
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(startPolling).toHaveBeenCalledTimes(2);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling on unmount", () => {
    // Arrange
    const { stopPolling, unmount } = renderPolling(makeOrder({ charge: 50 }));

    // Act
    unmount();

    // Assert
    expect(stopPolling).toHaveBeenCalled();
  });
});
