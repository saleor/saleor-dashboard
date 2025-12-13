import { createContext } from "react";

type Status = "success" | "error" | "info" | "warning";

export interface IMessage {
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
  show: (message: IMessage, timeout?: number | null) => void;
  remove: (notificationId: number) => void;
  clearErrorNotifications: () => void;
}

export type IMessageContext = (message: IMessage) => void;
export const MessageContext = createContext<INotificationContext | null>(null);

export * from "./MessageManagerProvider";
export { default } from "./MessageManagerProvider";
