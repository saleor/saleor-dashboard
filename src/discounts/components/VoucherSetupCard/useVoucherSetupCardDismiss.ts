import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useCallback } from "react";

const STORAGE_KEY = "voucher-setup-card-dismissed-ids";

/**
 * The setup checklist stays visible while redeem blockers remain, until the
 * merchant dismisses it for that voucher. Dismiss can be cleared via
 * {@link undismiss} (cogs → Show setup checklist).
 */
export const useVoucherSetupCardDismiss = (voucherId: string) => {
  const [dismissedIds, setDismissedIds] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const isDismissed = dismissedIds.includes(voucherId);

  const dismiss = useCallback(() => {
    setDismissedIds(current => (current.includes(voucherId) ? current : [...current, voucherId]));
  }, [setDismissedIds, voucherId]);

  const undismiss = useCallback(() => {
    setDismissedIds(current => current.filter(id => id !== voucherId));
  }, [setDismissedIds, voucherId]);

  return { isDismissed, dismiss, undismiss };
};
