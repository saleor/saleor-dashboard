import { SW_INTERVAL } from "@saleor/config";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";
import { useServiceWorker } from "src/hooks/useServiceWorker";

import messages from "./messages";

const ServiceWorker: React.FC = () => {
  const { update, updateAvailable } = useServiceWorker(SW_INTERVAL * 1000);
  const notify = useNotifier();
  const { formatMessage } = useIntl();

  React.useEffect(() => {
    if (updateAvailable) {
      notify({
        title: formatMessage(messages.newVersionTitle),
        text: formatMessage(messages.newVersionContent),
        actionBtn: {
          label: formatMessage(messages.refresh),
          action: update,
        },
        autohide: null,
        status: "warning",
      });
    }
  }, [updateAvailable]);

  return null;
};

export default ServiceWorker;
