import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useEffect, useRef } from "react";

/**
 * Leaves a detail page for its list once the item on it has been deleted. Call it from the delete
 * mutation's `onCompleted`.
 *
 * The item's unsaved edits went with it, so the leave prompt is skipped. The list replaces the
 * current history entry, so Back skips the deleted item, unless the delete dialog was opened through
 * the URL (`?action=remove`): that leaves the item's own entry behind it.
 *
 * Apollo calls `onCompleted` even after the page has unmounted. By then the merchant is somewhere
 * else, so this does nothing rather than clear the unsaved edits of the page they're on or take them
 * away from it.
 */
export const useLeaveAfterDelete = (): ((listUrl: string) => void) => {
  const navigate = useNavigator();
  const { resetFormsState } = useExitFormDialog();
  const isMounted = useRef(false);

  useEffect(function trackWhetherPageIsOpen() {
    isMounted.current = true;

    return (): void => {
      isMounted.current = false;
    };
  }, []);

  return (listUrl: string): void => {
    if (!isMounted.current) {
      return;
    }

    resetFormsState();
    navigate(listUrl, { replace: true });
  };
};
