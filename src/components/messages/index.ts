import { createContext } from "react";

export interface IMessage {
  actionBtn?: {
    label: string;
    action: () => void;
  };
  autohide?: number;
  expandText?: string;
  title?: string;
  text: string;
  onUndo?: () => void;
  status?: "success" | "error" | "info" | "warning";
}
export type IMessageContext = (message: IMessage) => void;
export const MessageContext = createContext<IMessageContext>(undefined);

export * from "./MessageManager";
export default MessageContext.Consumer;
