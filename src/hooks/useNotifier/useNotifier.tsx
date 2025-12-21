import { INotification, INotificationCallback } from "@dashboard/components/notifications";
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";
import { toast } from "sonner";

export type UseNotifierResult = INotificationCallback;

function useNotifier(): UseNotifierResult {
  const intl = useIntl();

  const notify = (options: INotification) => {
    const duration =
      options.status === "error" ? Infinity : (options.autohide ?? DEFAULT_NOTIFICATION_SHOW_TIME);

    // Build description - use apiMessage as fallback if no text
    const description = options.text || options.apiMessage;

    const toastOptions = {
      description: description as string | undefined,
      duration,
      ...(options.actionBtn && {
        action: {
          label: options.actionBtn.label,
          onClick: options.actionBtn.action,
        },
      }),
    };

    switch (options.status) {
      case "success":
        toast.success(options.title || intl.formatMessage(commonMessages.success), toastOptions);
        break;
      case "error":
        toast.error(options.title || intl.formatMessage(commonMessages.error), toastOptions);
        break;
      case "warning":
        toast.warning(options.title || intl.formatMessage(commonMessages.warning), toastOptions);
        break;
      case "info":
      default:
        toast.info(options.title || intl.formatMessage(commonMessages.info), toastOptions);
        break;
    }
  };

  return notify;
}

export default useNotifier;
