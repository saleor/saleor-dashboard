import { type INotification } from "@dashboard/components/notifications";
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { commonMessages } from "@dashboard/intl";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { type IntlShape } from "react-intl";

export const getDefaultNotifierSuccessErrorData = (
  errors: unknown[],
  intl: IntlShape,
): INotification =>
  !errors.length
    ? {
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      }
    : {
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      };

/**
 * Errors and action toasts stay until dismissed by default (WCAG 2.2.1 / Polaris).
 * Pass explicit `autohide` when the page already owns the persistent error
 * (inline field / section callout) and the toast is only a short action ack.
 * `actionBtn` stays sticky regardless.
 * Other statuses use autohide or the shared default; Sonner pauses on hover.
 */
export const getNotificationDuration = (options: INotification): number => {
  if (options.actionBtn) {
    return Infinity;
  }

  if (options.autohide !== undefined) {
    return options.autohide;
  }

  if (options.status === "error") {
    return Infinity;
  }

  return DEFAULT_NOTIFICATION_SHOW_TIME;
};
