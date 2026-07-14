import { type OrderDetailsFragment } from "@dashboard/graphql";
import { orderHasInFlightTransactionAction } from "@dashboard/orders/components/OrderTransaction/transactionInFlight";
import { useCallback, useEffect, useRef, useState } from "react";

/** How often the order is refetched while a transaction action is in flight. */
export const TRANSACTION_POLL_INTERVAL = 5000;

/**
 * Hard cap on a single "pending episode" so an app that never responds does not
 * make us poll forever. Counted in cycles (not wall-clock) so time spent with the
 * tab hidden — when polling is paused — does not burn the budget.
 * 24 cycles * 5s = 120s ≈ 2 minutes.
 */
export const TRANSACTION_POLL_MAX_CYCLES = 24;

interface UseOrderTransactionPollingParams {
  order: OrderDetailsFragment | null | undefined;
  startPolling: (interval: number) => void;
  stopPolling: () => void;
  refetch: () => Promise<unknown>;
}

/**
 * Keeps the order detail page in sync with async, webhook-driven transaction
 * actions (request charge / refund / cancel) that resolve on the server some time
 * after the user triggers them.
 *
 * State-driven: polling is on exactly while the loaded order has an unresolved
 * request event and the tab is visible, up to a per-episode cap. There is no
 * click-started timer — firing a transaction mutation refetches the order, the new
 * REQUEST event flips polling on, and a SUCCESS/FAILURE event flips it off. It
 * therefore also resumes automatically after a page reload.
 */
export const useOrderTransactionPolling = ({
  order,
  startPolling,
  stopPolling,
  refetch,
}: UseOrderTransactionPollingParams): { isPolling: boolean } => {
  const hasPending = orderHasInFlightTransactionAction(order);
  const [isPolling, setIsPolling] = useState(false);

  // Number of poll cycles consumed in the current pending episode.
  const cyclesRef = useRef(0);
  // Bookkeeping interval used solely to count cycles and enforce the cap;
  // Apollo's startPolling does the actual fetching.
  const counterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // True once the cap is hit for the current episode — stays suppressed until the
  // order goes quiet (rising edge) again.
  const capReachedRef = useRef(false);
  // Tracks the previous pending state to detect the rising edge of a new episode.
  const prevHasPendingRef = useRef(false);

  // Keep latest values in refs so the visibility listener (registered once) and
  // memoized callbacks never read stale closures.
  const hasPendingRef = useRef(hasPending);

  hasPendingRef.current = hasPending;

  const startPollingRef = useRef(startPolling);
  const stopPollingRef = useRef(stopPolling);
  const refetchRef = useRef(refetch);

  startPollingRef.current = startPolling;
  stopPollingRef.current = stopPolling;
  refetchRef.current = refetch;

  const stopCounting = useCallback(() => {
    if (counterIntervalRef.current) {
      clearInterval(counterIntervalRef.current);
      counterIntervalRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    stopPollingRef.current();
    stopCounting();
    setIsPolling(false);
  }, [stopCounting]);

  const resume = useCallback(() => {
    // Idempotent: don't restart the cadence if we're already counting.
    if (counterIntervalRef.current) {
      return;
    }

    startPollingRef.current(TRANSACTION_POLL_INTERVAL);
    setIsPolling(true);
    counterIntervalRef.current = setInterval(() => {
      cyclesRef.current += 1;

      if (cyclesRef.current >= TRANSACTION_POLL_MAX_CYCLES) {
        capReachedRef.current = true;
        pause();
      }
    }, TRANSACTION_POLL_INTERVAL);
  }, [pause]);

  // React to in-flight state changes. Runs only when `hasPending` flips value.
  useEffect(() => {
    const wasPending = prevHasPendingRef.current;

    prevHasPendingRef.current = hasPending;

    if (hasPending && !wasPending) {
      // Rising edge: a fresh pending episode, reset the cap budget.
      cyclesRef.current = 0;
      capReachedRef.current = false;
    }

    if (!hasPending) {
      pause();

      return;
    }

    if (capReachedRef.current) {
      return;
    }

    if (typeof document === "undefined" || document.visibilityState === "visible") {
      resume();
    }
  }, [hasPending, pause, resume]);

  // Pause while the tab is hidden; catch up immediately when it returns.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopPollingRef.current();
        stopCounting();
        setIsPolling(false);

        return;
      }

      if (hasPendingRef.current && !capReachedRef.current) {
        refetchRef.current();
        resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [resume, stopCounting]);

  // Ensure no interval or polling leaks past unmount.
  useEffect(
    () => () => {
      stopPollingRef.current();
      stopCounting();
    },
    [stopCounting],
  );

  return { isPolling };
};
