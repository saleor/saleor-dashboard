import { dismissVisibleToasts } from "@dashboard/components/notifications/notificationQueue";
import { hasMultipleVisibleNotificationToastsAtom } from "@dashboard/components/notifications/notificationQueueAtoms";
import { useAtomValue } from "jotai";
import { X } from "lucide-react";
import { type ReactNode, useCallback } from "react";
import { defineMessages, useIntl } from "react-intl";

import styles from "./ToastDismissAll.module.css";

const messages = defineMessages({
  dismissAll: {
    id: "bKrF/Q",
    defaultMessage: "Dismiss",
    description: "Dismiss all currently visible toast notifications",
  },
});

export const ToastDismissAll = (): ReactNode => {
  const intl = useIntl();
  const hasMultipleVisibleToasts = useAtomValue(hasMultipleVisibleNotificationToastsAtom);

  const handleDismissVisible = useCallback(() => {
    dismissVisibleToasts();
  }, []);

  if (!hasMultipleVisibleToasts) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.pill}
      onClick={handleDismissVisible}
      aria-label={intl.formatMessage(messages.dismissAll)}
    >
      <X size={14} strokeWidth={2} aria-hidden className={styles.icon} />
      <span className={styles.label}>{intl.formatMessage(messages.dismissAll)}</span>
    </button>
  );
};
