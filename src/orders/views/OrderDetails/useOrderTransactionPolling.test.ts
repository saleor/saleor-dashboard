import { type OrderDetailsFragment, TransactionEventTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import {
  TRANSACTION_POLL_INTERVAL,
  TRANSACTION_POLL_MAX_CYCLES,
  useOrderTransactionPolling,
} from "./useOrderTransactionPolling";

interface EventInput {
  type: TransactionEventTypeEnum;
  // Events sharing a pspReference belong to the same request/resolution group.
  // When omitted each event gets a unique reference (its own group).
  psp?: string;
}

const makeOrder = (events: EventInput[] = []): OrderDetailsFragment => {
  const order = {
    transactions: [
      {
        id: "tx-0",
        events: events.map((event, index) => ({
          id: `evt-${index}`,
          type: event.type,
          pspReference: event.psp ?? `psp-${index}`,
        })),
      },
    ],
  };

  return order as unknown as OrderDetailsFragment;
};

const chargeRequest = (psp?: string): EventInput => ({
  type: TransactionEventTypeEnum.CHARGE_REQUEST,
  psp,
});

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
    act(() => rerender({ order: makeOrder([chargeRequest()]) }));

    // Assert
    expect(startPolling).toHaveBeenCalledTimes(1);
    expect(startPolling).toHaveBeenCalledWith(TRANSACTION_POLL_INTERVAL);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling when the request resolves", () => {
    // Arrange
    const { stopPolling, rerender, result } = renderPolling(makeOrder([chargeRequest("a")]));

    // Act
    act(() =>
      rerender({
        order: makeOrder([
          { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
          { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "a" },
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
        { type: TransactionEventTypeEnum.CHARGE_REQUEST },
        { type: TransactionEventTypeEnum.REFUND_REQUEST },
        { type: TransactionEventTypeEnum.CANCEL_REQUEST },
      ]),
    );

    // Assert
    expect(startPolling).toHaveBeenCalledTimes(1);
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling after the cap is reached while still in flight", () => {
    // Arrange
    const { stopPolling, result } = renderPolling(makeOrder([chargeRequest()]));

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
    const { startPolling, rerender, result } = renderPolling(makeOrder([chargeRequest("a")]));

    act(() => {
      jest.advanceTimersByTime(TRANSACTION_POLL_INTERVAL * TRANSACTION_POLL_MAX_CYCLES);
    });
    expect(result.current.isPolling).toBe(false);

    // Act: previous request resolves, then a new action is triggered
    act(() =>
      rerender({
        order: makeOrder([
          { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
          { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "a" },
        ]),
      }),
    );
    act(() =>
      rerender({
        order: makeOrder([
          { type: TransactionEventTypeEnum.CHARGE_REQUEST, psp: "a" },
          { type: TransactionEventTypeEnum.CHARGE_SUCCESS, psp: "a" },
          { type: TransactionEventTypeEnum.REFUND_REQUEST, psp: "b" },
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
      makeOrder([chargeRequest()]),
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
    const { stopPolling, unmount } = renderPolling(makeOrder([chargeRequest()]));

    // Act
    unmount();

    // Assert
    expect(stopPolling).toHaveBeenCalled();
  });
});
