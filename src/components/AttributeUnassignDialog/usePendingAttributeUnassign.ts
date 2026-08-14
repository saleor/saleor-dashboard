import { useCallback, useRef, useState } from "react";

export function resolveAttributeIdToUnassign(
  capturedId: string | null | undefined,
  urlId: string | null | undefined,
): string | null {
  return capturedId || urlId || null;
}

/**
 * Confirm may dismiss the URL dialog (clearing `?id=`) in the same click as
 * mutate. Keep the click-time id in a ref so close cannot wipe it first.
 */
export const usePendingAttributeUnassign = (
  urlId: string | undefined,
): {
  attributeId: string | null;
  beginUnassign: (attributeId: string | undefined) => boolean;
  takeAttributeId: () => string | null;
  clear: () => void;
} => {
  const pendingIdRef = useRef<string | null>(null);
  const [capturedId, setCapturedId] = useState<string | null>(null);
  const attributeId = resolveAttributeIdToUnassign(capturedId, urlId);
  const beginUnassign = useCallback((attributeIdToCapture: string | undefined): boolean => {
    if (!attributeIdToCapture) {
      return false;
    }

    pendingIdRef.current = attributeIdToCapture;
    setCapturedId(attributeIdToCapture);

    return true;
  }, []);
  const takeAttributeId = useCallback(
    (): string | null => resolveAttributeIdToUnassign(pendingIdRef.current ?? capturedId, urlId),
    [capturedId, urlId],
  );
  const clear = useCallback((): void => {
    pendingIdRef.current = null;
    setCapturedId(null);
  }, []);

  return { attributeId, beginUnassign, takeAttributeId, clear };
};
