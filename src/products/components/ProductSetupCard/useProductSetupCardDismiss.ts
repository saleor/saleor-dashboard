import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useCallback } from "react";

const STORAGE_KEY = "product-setup-card-dismissed-ids";

/**
 * The setup checklist stays visible while sell blockers remain, until the
 * merchant dismisses it for that product. Dismiss can be cleared via
 * {@link undismiss} (cogs → Show setup checklist).
 */
export const useProductSetupCardDismiss = (productId: string) => {
  const [dismissedIds, setDismissedIds] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const isDismissed = dismissedIds.includes(productId);

  const dismiss = useCallback(() => {
    setDismissedIds(current => (current.includes(productId) ? current : [...current, productId]));
  }, [productId, setDismissedIds]);

  const undismiss = useCallback(() => {
    setDismissedIds(current => current.filter(id => id !== productId));
  }, [productId, setDismissedIds]);

  return { isDismissed, dismiss, undismiss };
};
