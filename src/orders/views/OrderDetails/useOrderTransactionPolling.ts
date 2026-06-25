import { type OrderDetailsFragment, TransactionEventTypeEnum } from "@dashboard/graphql";
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

// Verbose, intentional logging so polling state transitions can be traced in the
// browser console while debugging this feature.
const log = (message: string, data?: Record<string, unknown>) => {
  // eslint-disable-next-line no-console
  console.log(`[OrderTransactionPolling] ${message}`, data ?? "");
};

const REQUEST_EVENT_TYPES: TransactionEventTypeEnum[] = [
  TransactionEventTypeEnum.CHARGE_REQUEST,
  TransactionEventTypeEnum.REFUND_REQUEST,
  TransactionEventTypeEnum.CANCEL_REQUEST,
];

const isRequestEvent = (type: TransactionEventTypeEnum | null): boolean =>
  !!type && REQUEST_EVENT_TYPES.includes(type);

/**
 * Any SUCCESS/FAILURE event resolves the request sharing its pspReference — even
 * across action types. A CHARGE_REQUEST can legitimately be resolved by an
 * AUTHORIZATION_SUCCESS, so we must not look only for a same-action resolution.
 */
const isResolutionEvent = (type: TransactionEventTypeEnum | null): boolean =>
  !!type && (String(type).endsWith("_SUCCESS") || String(type).endsWith("_FAILURE"));

type TransactionEvents = OrderDetailsFragment["transactions"][number]["events"];
type TransactionEvent = TransactionEvents[number];

const getUnresolvedRequestRefs = (events: TransactionEvents): string[] => {
  const byPspReference = new Map<string, TransactionEvent[]>();

  events.forEach(event => {
    const key = event.pspReference ?? "";
    const group = byPspReference.get(key);

    if (group) {
      group.push(event);
    } else {
      byPspReference.set(key, [event]);
    }
  });

  const unresolved: string[] = [];

  byPspReference.forEach((group, pspReference) => {
    const hasRequest = group.some(event => isRequestEvent(event.type));
    const hasResolution = group.some(event => isResolutionEvent(event.type));

    if (hasRequest && !hasResolution) {
      unresolved.push(pspReference || "(no psp reference)");
    }
  });

  return unresolved;
};

/**
 * pspReferences of charge/refund/cancel requests that have not yet been resolved by
 * a SUCCESS/FAILURE event. Empty array means nothing is in flight.
 *
 * We key off events rather than the pending *amount* fields: Saleor Core creates the
 * REQUEST event synchronously but only folds it into the pending amount once the app
 * responds (include_in_calculations), so right after the user triggers an action the
 * pending amount is still 0 — the event is the only signal available immediately.
 *
 * Resolution is matched per pspReference (not by counting event types), because a
 * request can be resolved by a different action's success event, and an order can
 * carry unrelated successes from earlier operations.
 *
 * Authorize requests are excluded: authorization is not an action we trigger here.
 */
export const getOrderInFlightTransactionRefs = (
  order: Pick<OrderDetailsFragment, "transactions"> | null | undefined,
): string[] =>
  (order?.transactions ?? []).flatMap(transaction =>
    getUnresolvedRequestRefs(transaction.events ?? []),
  );

export const orderHasInFlightTransactionAction = (
  order: Pick<OrderDetailsFragment, "transactions"> | null | undefined,
): boolean => getOrderInFlightTransactionRefs(order).length > 0;

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
  const inFlightRefs = getOrderInFlightTransactionRefs(order);
  const hasPending = inFlightRefs.length > 0;
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
  const inFlightRefsRef = useRef(inFlightRefs);
  const isPollingRef = useRef(isPolling);

  hasPendingRef.current = hasPending;
  inFlightRefsRef.current = inFlightRefs;
  isPollingRef.current = isPolling;

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

  const pause = useCallback(
    (reason: string) => {
      if (counterIntervalRef.current || isPollingRef.current) {
        log(`stop polling — ${reason}`);
      }

      stopPollingRef.current();
      stopCounting();
      setIsPolling(false);
    },
    [stopCounting],
  );

  const resume = useCallback(
    (reason: string) => {
      // Idempotent: don't restart the cadence if we're already counting.
      if (counterIntervalRef.current) {
        return;
      }

      log(`start polling — ${reason}`, {
        intervalMs: TRANSACTION_POLL_INTERVAL,
        cyclesUsed: cyclesRef.current,
        unresolvedRefs: inFlightRefsRef.current,
      });

      startPollingRef.current(TRANSACTION_POLL_INTERVAL);
      setIsPolling(true);
      counterIntervalRef.current = setInterval(() => {
        cyclesRef.current += 1;

        log(`poll cycle ${cyclesRef.current}/${TRANSACTION_POLL_MAX_CYCLES}`, {
          unresolvedRefs: inFlightRefsRef.current,
        });

        if (cyclesRef.current >= TRANSACTION_POLL_MAX_CYCLES) {
          capReachedRef.current = true;
          pause(`reached ${TRANSACTION_POLL_MAX_CYCLES}-cycle cap while still in flight`);
        }
      }, TRANSACTION_POLL_INTERVAL);
    },
    [pause],
  );

  // React to in-flight state changes. Runs only when `hasPending` flips value.
  useEffect(() => {
    const wasPending = prevHasPendingRef.current;

    prevHasPendingRef.current = hasPending;

    if (hasPending && !wasPending) {
      // Rising edge: a fresh pending episode, reset the cap budget.
      log("in-flight episode started (rising edge) — resetting cap budget", {
        unresolvedRefs: inFlightRefsRef.current,
      });
      cyclesRef.current = 0;
      capReachedRef.current = false;
    }

    if (!hasPending) {
      if (wasPending) {
        log("all transaction requests resolved — no longer in flight");
      }

      pause("no in-flight transaction requests");

      return;
    }

    if (capReachedRef.current) {
      log("still in flight but cap already reached this episode — not resuming");

      return;
    }

    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      log("in flight but tab is hidden — waiting for focus to start polling");

      return;
    }

    resume("in-flight transaction request detected");
  }, [hasPending, pause, resume]);

  // Pause while the tab is hidden; catch up immediately when it returns.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (counterIntervalRef.current) {
          log("tab hidden — pausing polling (cap budget preserved)");
        }

        stopPollingRef.current();
        stopCounting();
        setIsPolling(false);

        return;
      }

      if (hasPendingRef.current && !capReachedRef.current) {
        log("tab visible again while in flight — refetching to catch up, then resuming");
        refetchRef.current();
        resume("tab regained focus while in flight");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [resume, stopCounting]);

  // Ensure no interval or polling leaks past unmount.
  useEffect(
    () => () => {
      log("unmounting — stopping polling");
      stopPollingRef.current();
      stopCounting();
    },
    [stopCounting],
  );

  return { isPolling };
};
