import { useApolloClient } from "@apollo/client";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { connectionMonitor as appConnectionMonitor } from "../../appConnectionMonitor";
import { type ConnectionMonitor, useConnectionState } from "../../connectionMonitor";
import { createFailedQueryRecovery } from "../../failedQueryRecovery";
import { getOutageDurationBucket } from "../../getOutageDurationBucket";
import { connectionMessages as messages } from "../../messages";
import { ConnectionBanner } from "./ConnectionBanner";

interface ConnectionStatusBannerProps {
  monitor?: ConnectionMonitor;
}

/**
 * The app's connection banner. While it is mounted it also:
 * - tells the monitor it is on screen, so failed loads don't get their own toasts;
 * - reloads the queries that failed, once Saleor answers again;
 * - records each outage in analytics.
 */
export const ConnectionStatusBanner = ({
  monitor = appConnectionMonitor,
}: ConnectionStatusBannerProps): React.ReactNode => {
  const { status, checkingNow } = useConnectionState(monitor);
  const client = useApolloClient();
  const notify = useNotifier();
  const intl = useIntl();
  const { trackEvent } = useAnalytics();
  const [recovery] = useState(createFailedQueryRecovery);

  // Effects below subscribe to the monitor, an external store; nothing here can move to a parent.
  // oxlint-disable-next-line react-you-might-not-need-an-effect/no-manage-parent
  useEffect(
    function attachToMonitor() {
      return monitor.attachBanner();
    },
    [monitor],
  );

  useEffect(
    function reloadFailedQueries() {
      // oxlint-disable-next-line react-you-might-not-need-an-effect/no-pass-live-state-to-parent
      return monitor.subscribe(event => {
        if (event.type !== "recovered") {
          return;
        }

        const keepFailing = recovery.reloadFailedQueries(client, {
          afterOutage: event.afterOutage,
        });

        // Saleor answers, but some of the page keeps failing without it, such as a query that
        // times out every time. The banner won't explain that, so say it once.
        if (keepFailing > 0) {
          notify({
            status: "error",
            title: intl.formatMessage(messages.loadFailedTitle),
            text: intl.formatMessage(messages.loadFailedDescription),
          });
        }
      });
    },
    [client, intl, monitor, notify, recovery],
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
