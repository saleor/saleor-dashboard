import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useCallback } from "react";

const STORAGE_KEY = "product-type-pdp-schematic-dismissed";

/**
 * The PDP schematic is the same mapping on every product type — not a
 * per-entity checklist. Dismiss hides it for all product types until
 * restored via cogs → Show product page legend.
 */
export const useProductTypePdpSchematicDismiss = (): {
  isDismissed: boolean;
  dismiss: () => void;
  undismiss: () => void;
} => {
  const [isDismissed, setDismissed] = useLocalStorage<boolean>(STORAGE_KEY, false);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, [setDismissed]);

  const undismiss = useCallback(() => {
    setDismissed(false);
  }, [setDismissed]);

  return { isDismissed, dismiss, undismiss };
};
