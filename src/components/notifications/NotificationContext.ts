import { createContext, type ReactNode } from "react";

type Status = "success" | "error" | "info" | "warning";

/**
 * Transient toast payload. Prefer another channel when feedback must persist
 * next to the problem: field errors → inline; setup blockers → banner/checklist;
 * long jobs → BackgroundTasks; bulk ops → one aggregated notify, not N toasts.
 * The queue dedupes by status + title — repeat notifies replace the same toast.
 * Errors and `actionBtn` stay until dismissed by default; pass `autohide` when
 * the page already shows a persistent recovery surface (field/section error).
 */
export interface INotification {
  actionBtn?: {
    label: string;
    action: () => void;
  };
  autohide?: number;
  title?: string;
  text?: ReactNode;
  status?: Status;
  apiMessage?: string;
}

export interface INotificationContext {
  remove: (notificationId: number) => void;
  clearErrorNotifications: () => void;
}

export type INotificationCallback = (notification: INotification) => void;

export const NotificationContext = createContext<INotificationContext | null>(null);
