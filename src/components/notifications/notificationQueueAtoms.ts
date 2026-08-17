import { atom } from "jotai";

import { notificationQueueStateAtom } from "./notificationQueue";

/** Show the dismiss-visible control only when a single × isn’t enough. */
export const hasMultipleVisibleNotificationToastsAtom = atom(
  get => get(notificationQueueStateAtom).active.length > 1,
);
