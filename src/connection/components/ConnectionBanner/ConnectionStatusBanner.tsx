import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { useEffect } from "react";

import { connectionMonitor as appConnectionMonitor } from "../../appConnectionMonitor";
import { type ConnectionMonitor, useConnectionState } from "../../connectionMonitor";
import { getOutageDurationBucket } from "../../getOutageDurationBucket";
import { ConnectionBanner } from "./ConnectionBanner";

interface ConnectionStatusBannerProps {
  monitor?: ConnectionMonitor;
}

/**
 * The app's connection banner. While it is mounted it also:
 * - tells the monitor it is on screen, so failed loads don't get their own toasts;
 * - records each outage in analytics.
 *
 * Failed queries are reloaded by `ConnectionRecovery`, which is mounted for the whole app.
 */
export const ConnectionStatusBanner = ({
  monitor = appConnectionMonitor,
}: ConnectionStatusBannerProps): React.ReactNode => {
  const { status, checkingNow } = useConnectionState(monitor);
  const { trackEvent } = useAnalytics();

  // Effects below subscribe to the monitor, an external store; nothing here can move to a parent.
  // oxlint-disable-next-line react-you-might-not-need-an-effect/no-manage-parent
  useEffect(
    function attachToMonitor() {
      return monitor.attachBanner();
    },
    [monitor],
  );

  useEffect(
    function trackOutages() {
      // Only outages that started while the banner was mounted, so every restored event has
      // a matching lost one.
      const tracked = new Set<number>();

      return monitor.subscribe(event => {
        if (event.type === "lost") {
          tracked.add(event.outageId);
          trackEvent("connection_lost", { cause: event.cause, http_status: event.httpStatus });
        }

        if (event.type === "restored" && tracked.delete(event.outageId)) {
          trackEvent("connection_restored", {
            cause: event.cause,
            duration: getOutageDurationBucket(event.durationMs),
            try_now_count: event.tryNowCount,
          });
        }
      });
    },
    [monitor, trackEvent],
  );

  return <ConnectionBanner status={status} checkingNow={checkingNow} onTryNow={monitor.checkNow} />;
};
