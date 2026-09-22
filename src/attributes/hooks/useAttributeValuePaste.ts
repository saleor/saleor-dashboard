import { parsePastedAttributeValues } from "@dashboard/attributes/components/AttributeValueInlineAdd/parsePastedAttributeValues";
import { type ClipboardEvent, useCallback, useState } from "react";

interface UseAttributeValuePasteArgs {
  disabled: boolean;
  enabled: boolean;
}

export const useAttributeValuePaste = ({
  disabled,
  enabled,
}: UseAttributeValuePasteArgs): {
  clearPendingPaste: () => void;
  handlePaste: (event: ClipboardEvent<HTMLElement>) => void;
  keepAsOneName: () => string | null;
  pendingPaste: string[] | null;
} => {
  const [pendingPaste, setPendingPaste] = useState<string[] | null>(null);

  const clearPendingPaste = useCallback((): void => {
    setPendingPaste(null);
  }, []);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLElement>): void => {
      if (!enabled || disabled) {
        return;
      }

      const values = parsePastedAttributeValues(event.clipboardData.getData("text"));

      if (values.length < 2) {
        return;
      }

      event.preventDefault();
      setPendingPaste(values);
    },
    [disabled, enabled],
  );

  const keepAsOneName = useCallback((): string | null => {
    if (!pendingPaste) {
      return null;
    }

    const name = pendingPaste.join(", ");

    setPendingPaste(null);

    return name;
  }, [pendingPaste]);

  return {
    clearPendingPaste,
    handlePaste,
    keepAsOneName,
    pendingPaste,
  };
};
