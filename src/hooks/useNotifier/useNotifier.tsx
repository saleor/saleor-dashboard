import {
  type INotification,
  type INotificationCallback,
} from "@dashboard/components/notifications";
import { enqueueToast } from "@dashboard/components/notifications/notificationQueue";
import { commonMessages } from "@dashboard/intl";
import { useCallback } from "react";
import { useIntl } from "react-intl";

import { getNotificationDuration } from "./utils";

export type UseNotifierResult = INotificationCallback;

function useNotifier(): UseNotifierResult {
  const intl = useIntl();

  const notify = useCallback(
    (options: INotification) => {
      const duration = getNotificationDuration(options);

      // Build description - use apiMessage as fallback if no text
      const description = options.text || options.apiMessage;

      // Determine title with fallback to localized default
      const getDefaultTitle = () => {
        switch (options.status) {
          case "success":
            return intl.formatMessage(commonMessages.success);
          case "error":
            return intl.formatMessage(commonMessages.error);
          case "warning":
            return intl.formatMessage(commonMessages.warning);
          case "info":
          default:
            return intl.formatMessage(commonMessages.info);
        }
      };

      const title = options.title || getDefaultTitle();
      const type = options.status || "info";

      // Queue mounts at most MAX_VISIBLE_TOASTS; overflow waits until a visible
      // toast is dismissed. Toast owns auto-dismiss + progress.
      enqueueToast({
        type,
        title,
        description,
        duration,
        action: options.actionBtn
          ? {
              label: options.actionBtn.label,
              onClick: options.actionBtn.action,
            }
          : undefined,
      });
    },
    [intl],
  );

  return notify;
}

export { useNotifier };
