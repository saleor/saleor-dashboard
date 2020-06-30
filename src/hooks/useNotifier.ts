import { IMessage } from "@saleor/components/messages";
import { IMessageContext, MessageContext } from "@saleor/components/messages";
import { useContext, useMemo } from "react";

export type UseNotifierResult = IMessageContext;

function useNotifier(): UseNotifierResult {
  const notificationContext = useContext(MessageContext);
  const notification = useMemo(() => notificationContext.current, [
    notificationContext
  ]);

  const notify = (options: IMessage) => {
    notification.show(
      options,
      options.autohide && { timeout: options.autohide }
    );
  };
  return notify;
}
export default useNotifier;
