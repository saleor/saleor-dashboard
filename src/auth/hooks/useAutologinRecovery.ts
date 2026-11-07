import { useCallback, useEffect, useRef, useState } from "react";

import { retryAutologin } from "../initAuth";

/** How often to try the stored session again while Saleor can't be reached. */
const RECOVERY_INTERVAL_MS = 30_000;

/**
 * Tries the stored session again when the merchant asks, when the browser comes back online and
 * every 30 seconds, while the "can't reach Saleor" screen is shown.
 */
export const useAutologinRecovery = (): { retrying: boolean; retry: () => void } => {
  const [retrying, setRetrying] = useState(false);
  const inFlight = useRef(false);

  const retry = useCallback((): void => {
    if (inFlight.current) {
      return;
    }

    inFlight.current = true;
    setRetrying(true);
    void retryAutologin().finally(() => {
      inFlight.current = false;
      setRetrying(false);
    });
  }, []);

  useEffect(
    function retryWhileUnreachable() {
      const interval = setInterval(retry, RECOVERY_INTERVAL_MS);

      window.addEventListener("online", retry);

      return (): void => {
        clearInterval(interval);
        window.removeEventListener("online", retry);
      };
    },
    [retry],
  );

  return { retrying, retry };
};
