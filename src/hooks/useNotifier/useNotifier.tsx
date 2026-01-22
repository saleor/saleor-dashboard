import { INotification, INotificationCallback } from "@dashboard/components/notifications";
import { Toast } from "@dashboard/components/notifications/Toast";
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { commonMessages } from "@dashboard/intl";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";

export type UseNotifierResult = INotificationCallback;

function useNotifier(): UseNotifierResult {
  const intl = useIntl();

  const notify = useCallback(
    (options: INotification) => {
      const duration =
        options.status === "error"
          ? Infinity
          : (options.autohide ?? DEFAULT_NOTIFICATION_SHOW_TIME);

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

      toast.custom(
        id => (
          <Toast
            id={id}
            type={type}
            title={title}
            description={description}
            action={
              options.actionBtn
                ? {
                    label: options.actionBtn.label,
                    onClick: options.actionBtn.action,
                  }
                : undefined
            }
          />
        ),
        {
          duration,
        },
      );
    },
    [intl],
  );

  return notify;
}

export { useNotifier };
