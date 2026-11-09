import { useApolloClient } from "@apollo/client";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { connectionMonitor as appConnectionMonitor } from "../../appConnectionMonitor";
import { type ConnectionMonitor } from "../../connectionMonitor";
import { createFailedQueryRecovery } from "../../failedQueryRecovery";
import { connectionMessages as messages } from "../../messages";

interface ConnectionRecoveryProps {
  monitor?: ConnectionMonitor;
}

/**
 * Reloads the queries that failed because Saleor couldn't be reached, once it answers again.
 * Mounted for the whole app, not only with the banner: a query that fails before the app's
 * layout shows, such as the channels the dashboard waits for after sign-in, needs it too.
 */
export const ConnectionRecovery = ({
  monitor = appConnectionMonitor,
}: ConnectionRecoveryProps): null => {
  const client = useApolloClient();
  const notify = useNotifier();
  const intl = useIntl();
  const [recovery] = useState(createFailedQueryRecovery);

  useEffect(
    function reloadFailedQueries() {
      // Subscribes to the monitor, an external store; there's no parent state to lift.
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

  return null;
};
