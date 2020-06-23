import { createContext } from "react";

export interface IMessage {
  action?: () => void;
  autohide?: number;
  title?: string;
  text: string;
  onUndo?: () => void;
  status?: "success" | "error" | "info" | "warning";
}
export type IMessageContext = (message: IMessage) => void;
export const MessageContext = createContext<IMessageContext>(undefined);

export * from "./MessageManager";
export default MessageContext.Consumer;
