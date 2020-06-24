import { IMessage } from "@saleor/components/messages";
import { useAlert } from "react-alert";

export type UseNotifierResult = (options: IMessage) => void;
function useNotifier(): UseNotifierResult {
  const alert = useAlert();
  const notify = (options: IMessage) => {
    alert.show(options, options.autohide && { timeout: options.autohide });
  };
  return notify;
}
export default useNotifier;
