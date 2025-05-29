import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useNotifier from "@dashboard/hooks/useNotifier";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

const BUTTON_INDIDCATOR_TIMEOUT = 2000;

export const useClipboardCopy = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const [copyState, setCopyState] = useState<ConfirmButtonTransitionState>("default");
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .catch(() => {
        setCopyState("error");
        notify({
          status: "error",
          text: intl.formatMessage({
            defaultMessage: "Failed to copy to clipboard",
            id: "ce5Hp1",
          }),
        });
      })
      .then(() => {
        setCopyState("success");
      })
      .finally(() => {
        timeoutRef.current = window.setTimeout(() => {
          setCopyState("default");
        }, BUTTON_INDIDCATOR_TIMEOUT);
      });
  };

  return { copyToClipboard, copyState };
};
