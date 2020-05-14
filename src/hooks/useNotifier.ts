import { IMessageContext, MessageContext } from "@saleor/components/messages";
import { useContext } from "react";

export type UseNotifierResult = IMessageContext;
function useNotifier(): UseNotifierResult {
  const notify = useContext(MessageContext);
  return notify;
}
export default useNotifier;
