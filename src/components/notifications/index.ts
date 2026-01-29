import { createContext } from "react";

type Status = "success" | "error" | "info" | "warning";

export interface INotification {
  actionBtn?: {
    label: string;
    action: () => void;
  };
  autohide?: number;
  title?: string;
  text?: React.ReactNode;
  status?: Status;
  apiMessage?: string;
}

export interface INotificationContext {
  remove: (notificationId: number) => void;
  clearErrorNotifications: () => void;
}

export type INotificationCallback = (notification: INotification) => void;
export const NotificationContext = createContext<INotificationContext | null>(null);

export { NotificationProvider } from "./NotificationProvider";
export type { ToastProps } from "./Toast";
export { Toast } from "./Toast";
