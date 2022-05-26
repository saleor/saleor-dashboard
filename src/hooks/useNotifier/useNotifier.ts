import {
  IMessage,
  IMessageContext,
  MessageContext,
} from "@saleor/components/messages";
import { useContext } from "react";

export type UseNotifierResult = IMessageContext;

function useNotifier(): UseNotifierResult {
  const notificationContext = useContext(MessageContext);

  const notify = (options: IMessage) => {
    const timeout = options.status === "error" ? null : options.autohide;
    notificationContext.show(options, timeout);
  };
  return notify;
}
export default useNotifier;
