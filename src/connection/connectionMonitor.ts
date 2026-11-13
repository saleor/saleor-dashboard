import { makeVar, type ReactiveVar, useReactiveVar } from "@apollo/client";

import { type ConnectionFailure } from "./connectionErrors";

/**
 * - `online`: requests are getting answers. Nothing is shown.
 * - `suspect`: a request failed and a check is about to confirm it. Nothing is shown yet, so a
 *   single dropped request doesn't flash a banner.
 * - `offline`: the browser has no network connection.
 * - `unreachable`: the browser is online, but Saleor doesn't answer.
 * - `restored`: Saleor answered again after an outage. Shown briefly, then `online`.
 */
export type ConnectionStatus = "online" | "suspect" | "offline" | "unreachable" | "restored";

export interface ConnectionState {
  status: ConnectionStatus;
  /** A check the merchant asked for with "Try now" is running. */
  checkingNow: boolean;
}

type OutageCause = "offline" | "unreachable";

export type ConnectionEvent =
  /** The banner opened. `cause` is what it said first. */
  | { type: "lost"; outageId: number; cause: OutageCause; httpStatus: number }
  /** Saleor answered after an outage. `cause` is what the banner said last. */
  | {
      type: "restored";
      outageId: number;
      cause: OutageCause;
      durationMs: number;
      tryNowCount: number;
    }
  /**
   * Saleor answers again: after an outage (`afterOutage`), or after a failed request whose
   * confirming check got an answer.
   */
  | { type: "recovered"; afterOutage: boolean };

export type ConnectionCheckResult = { ok: true } | { ok: false; failure: ConnectionFailure };

interface Timers<Handle> {
  set: (callback: () => void, ms: number) => Handle;
  clear: (handle: Handle) => void;
}

export interface ConnectionMonitorDeps<Handle> {
  check: () => Promise<ConnectionCheckResult>;
  isBrowserOnline: () => boolean;
  isPageVisible: () => boolean;
  now: () => number;
  random: () => number;
  timers: Timers<Handle>;
  /** Reports an error thrown by a listener without stopping the monitor or its caller. */
  reportError: (error: unknown) => void;
}

export interface ConnectionMonitor {
  stateVar: ReactiveVar<ConnectionState>;
  /** A request to Saleor got no answer (see `getConnectionFailure`). */
  reportFailure: (failure: ConnectionFailure) => void;
  /** A request to Saleor got an answer, whatever the answer was. */
  reportSuccess: () => void;
  browserWentOffline: () => void;
  browserCameOnline: () => void;
  pageBecameVisible: () => void;
  /** "Try now": checks right away and starts the schedule again. */
  checkNow: () => void;
  subscribe: (listener: (event: ConnectionEvent) => void) => () => void;
  /**
   * The banner is on screen to explain outages, so failed loads don't need their own toasts.
   * Returns a function that detaches it.
   */
  attachBanner: () => () => void;
  isBannerAttached: () => boolean;
}

/** A failure is confirmed by one check this long after it, before anything is shown. */
const CONFIRM_DELAY_MS = 1_000;
/** Switching Wi-Fi networks briefly reports offline; wait this long before saying so. */
const OFFLINE_GRACE_MS = 2_000;
/**
 * The browser says it's back online before its network is ready (DHCP, DNS). A check at once
 * would fail and switch the banner to "Can't reach Saleor", so it waits a moment.
 */
const ONLINE_SETTLE_MS = 1_500;
/** Delays between checks during an outage; the last one repeats. */
const CHECK_DELAYS_MS = [2_000, 4_000, 8_000, 16_000, 30_000];
/** Each delay varies by up to this share either way, so dashboards don't reconnect in lockstep. */
const CHECK_JITTER = 0.2;
const MAX_RETRY_AFTER_MS = 120_000;
/** How long "Connected again" stays. */
const RESTORED_VISIBLE_MS = 3_000;

export const isOutage = (status: ConnectionStatus): status is OutageCause =>
  status === "offline" || status === "unreachable";

export function createConnectionMonitor<Handle>(
  deps: ConnectionMonitorDeps<Handle>,
): ConnectionMonitor {
  const stateVar = makeVar<ConnectionState>({ status: "online", checkingNow: false });
  const listeners = new Set<(event: ConnectionEvent) => void>();

  let attempt = 0;
  let checkTimer: Handle | null = null;
  let offlineTimer: Handle | null = null;
  let restoredTimer: Handle | null = null;
  let checkInFlight = false;
  // A check came due while another was still running.
  let checkPending = false;
  // Moves on whenever Saleor answers. A check started before then answers an older question,
  // so its result no longer decides anything.
  let generation = 0;
  let checkWhenVisible = false;
  let lastFailure: ConnectionFailure | null = null;
  let outageCount = 0;
  let outage: { id: number; startedAt: number; tryNowCount: number } | null = null;
  let attachedBanners = 0;

  const status = (): ConnectionStatus => stateVar().status;

  const setState = (patch: Partial<ConnectionState>): void => {
    const current = stateVar();
    const next = { ...current, ...patch };

    if (next.status !== current.status || next.checkingNow !== current.checkingNow) {
      stateVar(next);
    }
  };

  // Listeners run inside request handling; one that throws must not fail the request or leave
  // the monitor half-way through a change.
  const emit = (event: ConnectionEvent): void => {
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        deps.reportError(error);
      }
    });
  };

  const clearTimer = (handle: Handle | null): null => {
    if (handle !== null) {
      deps.timers.clear(handle);
    }

    return null;
  };

  const outageStatus = (): OutageCause => (deps.isBrowserOnline() ? "unreachable" : "offline");

  const scheduleCheck = (delayMs: number): void => {
    checkTimer = clearTimer(checkTimer);
    checkTimer = deps.timers.set(() => {
      checkTimer = null;
      void runCheck({ manual: false });
    }, delayMs);
  };

  const scheduleNextCheck = (): void => {
    const base = CHECK_DELAYS_MS[Math.min(attempt, CHECK_DELAYS_MS.length - 1)];
    const jittered = Math.round(base * (1 - CHECK_JITTER + deps.random() * 2 * CHECK_JITTER));
    const retryAfter = Math.min(lastFailure?.retryAfterMs ?? 0, MAX_RETRY_AFTER_MS);

    attempt += 1;
    scheduleCheck(Math.max(jittered, retryAfter));
  };

  const recover = (): void => {
    const current = status();

    generation += 1;
    checkTimer = clearTimer(checkTimer);
    offlineTimer = clearTimer(offlineTimer);
    attempt = 0;
    lastFailure = null;

    if (!isOutage(current) || !outage) {
      setState({ status: "online", checkingNow: false });
      emit({ type: "recovered", afterOutage: false });

      return;
    }

    const ended = outage;

    outage = null;
    restoredTimer = clearTimer(restoredTimer);
    restoredTimer = deps.timers.set(() => {
      restoredTimer = null;

      if (status() === "restored") {
        setState({ status: "online" });
      }
    }, RESTORED_VISIBLE_MS);
    setState({ status: "restored", checkingNow: false });
    emit({
      type: "restored",
      outageId: ended.id,
      cause: current,
      durationMs: deps.now() - ended.startedAt,
      tryNowCount: ended.tryNowCount,
    });
    emit({ type: "recovered", afterOutage: true });
  };

  const startOutage = (): void => {
    const cause = outageStatus();

    restoredTimer = clearTimer(restoredTimer);
    offlineTimer = clearTimer(offlineTimer);
    attempt = 0;
    outageCount += 1;
    outage = { id: outageCount, startedAt: deps.now(), tryNowCount: 0 };
    setState({ status: cause });
    scheduleNextCheck();
    emit({
      type: "lost",
      outageId: outage.id,
      cause,
      httpStatus: lastFailure?.httpStatus ?? 0,
    });
  };

  // "Try now" pressed while a scheduled check was already running: that check's answer stands,
  // and the schedule starts again after it, as if the merchant's check had run.
  let manualCheckJoined = false;

  async function runCheck({ manual }: { manual: boolean }): Promise<void> {
    if (checkInFlight) {
      checkPending = true;

      return;
    }

    // Hidden tabs don't need to know yet; check once the merchant comes back.
    if (!manual && !deps.isPageVisible()) {
      checkWhenVisible = true;

      return;
    }

    checkInFlight = true;
    checkPending = false;
    checkWhenVisible = false;

    const startedIn = generation;

    if (manual) {
      setState({ checkingNow: true });
    }

    let result: ConnectionCheckResult;

    // Also catches a check that throws before it returns a promise, which would otherwise leave
    // `checkInFlight` set and stop all checks.
    try {
      result = await deps.check();
    } catch {
      result = { ok: false, failure: { httpStatus: 0, retryAfterMs: null } };
    }

    checkInFlight = false;

    if (manualCheckJoined) {
      manualCheckJoined = false;
      attempt = 0;
    }

    setState({ checkingNow: false });

    // Saleor answered while this check ran. If a request failed after that, the check that came
    // due for it runs now instead of this out-of-date result deciding.
    if (generation !== startedIn) {
      if (checkPending) {
        checkPending = false;
        void runCheck({ manual: false });
      }

      return;
    }

    checkPending = false;

    // A request may have settled the outcome while the check was running.
    const current = status();

    if (current === "online" || current === "restored") {
      return;
    }

    if (result.ok === true) {
      recover();

      return;
    }

    lastFailure = result.failure;

    if (current === "suspect") {
      startOutage();

      return;
    }

    setState({ status: outageStatus() });
    scheduleNextCheck();
  }

  const reportFailure: ConnectionMonitor["reportFailure"] = failure => {
    lastFailure = failure;

    if (status() === "online" || status() === "restored") {
      restoredTimer = clearTimer(restoredTimer);
      setState({ status: "suspect" });
      scheduleCheck(CONFIRM_DELAY_MS);
    }
  };

  const reportSuccess: ConnectionMonitor["reportSuccess"] = () => {
    if (status() === "suspect" || isOutage(status())) {
      recover();
    }
  };

  const browserWentOffline: ConnectionMonitor["browserWentOffline"] = () => {
    if (isOutage(status())) {
      setState({ status: "offline" });

      return;
    }

    offlineTimer = clearTimer(offlineTimer);
    offlineTimer = deps.timers.set(() => {
      offlineTimer = null;

      if (!deps.isBrowserOnline() && !isOutage(status())) {
        checkTimer = clearTimer(checkTimer);
        lastFailure = { httpStatus: 0, retryAfterMs: null };
        startOutage();
      }
    }, OFFLINE_GRACE_MS);
  };

  const checkFromStart = (): void => {
    attempt = 0;
    checkTimer = clearTimer(checkTimer);
    void runCheck({ manual: false });
  };

  const browserCameOnline: ConnectionMonitor["browserCameOnline"] = () => {
    offlineTimer = clearTimer(offlineTimer);

    if (isOutage(status())) {
      attempt = 0;
      scheduleCheck(ONLINE_SETTLE_MS);
    }
  };

  const pageBecameVisible: ConnectionMonitor["pageBecameVisible"] = () => {
    if (checkWhenVisible || isOutage(status())) {
      checkFromStart();
    }
  };

  const checkNow: ConnectionMonitor["checkNow"] = () => {
    if (!isOutage(status()) || stateVar().checkingNow) {
      return;
    }

    if (outage) {
      outage.tryNowCount += 1;
    }

    if (checkInFlight) {
      manualCheckJoined = true;
      setState({ checkingNow: true });

      return;
    }

    attempt = 0;
    checkTimer = clearTimer(checkTimer);
    void runCheck({ manual: true });
  };

  const subscribe: ConnectionMonitor["subscribe"] = listener => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const attachBanner: ConnectionMonitor["attachBanner"] = () => {
    attachedBanners += 1;

    return () => {
      attachedBanners -= 1;
    };
  };

  return {
    stateVar,
    reportFailure,
    reportSuccess,
    browserWentOffline,
    browserCameOnline,
    pageBecameVisible,
    checkNow,
    subscribe,
    attachBanner,
    isBannerAttached: () => attachedBanners > 0,
  };
}

export const useConnectionState = (monitor: ConnectionMonitor): ConnectionState =>
  useReactiveVar(monitor.stateVar);
