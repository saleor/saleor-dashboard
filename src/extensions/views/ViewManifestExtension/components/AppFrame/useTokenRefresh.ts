import jwt_decode from "jwt-decode";
import { useEffect, useMemo, useRef } from "react";

interface AppToken {
  exp?: number;
  iat?: number;
}

/** How long before the token expires we ask for a new one. */
const TIME_BEFORE_REFRESH = 30 * 1000;

/**
 * Floor for a scheduled refresh.
 *
 * The timeout re-arms itself, so a token that is already inside its refresh
 * window would otherwise schedule `setTimeout(…, 0)` and spin: refetch, re-arm,
 * refetch, pinning the main thread. With a floor the worst case degrades to a
 * retry every 30s, which is a sane recovery cadence for a token the server
 * keeps handing back stale.
 */
const MIN_REFRESH_DELAY = 30 * 1000;

const decodeToken = (token?: string): AppToken | null => {
  if (!token) {
    return null;
  }

  try {
    return jwt_decode<AppToken>(token);
  } catch (e) {
    console.warn(e);

    return null;
  }
};

/**
 * Keeps an app's JWT fresh while its iframe stays mounted.
 *
 * Scheduling is driven by the token's absolute `exp`, not by its total lifetime
 * (`exp - iat`): a token handed to us mid-life, or one that aged while the
 * machine slept, has far less time left than a full lifetime. Because Chrome
 * suspends timers on a sleeping/background tab, the timeout alone is not enough
 * to recover promptly, so returning to the tab also triggers a catch-up.
 */
export const useTokenRefresh = (token?: string, refetch?: () => void) => {
  // Memoized so an undecodable token is parsed - and warned about - once rather
  // than on every render of the frame.
  const expiresAt = useMemo(() => decodeToken(token)?.exp, [token]);
  const canRefetch = !!refetch;

  const refetchRef = useRef(refetch);

  refetchRef.current = refetch;

  useEffect(() => {
    if (!expiresAt || !canRefetch) {
      return;
    }

    const refreshAt = expiresAt * 1000 - TIME_BEFORE_REFRESH;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(
        () => {
          refetchRef.current?.();
          schedule();
        },
        Math.max(refreshAt - Date.now(), MIN_REFRESH_DELAY),
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" || Date.now() < refreshAt) {
        return;
      }

      // The timer was throttled while the tab was hidden and the token is now
      // due (or past due) — refresh immediately instead of waiting it out.
      refetchRef.current?.();
      schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [expiresAt, canRefetch]);
};
