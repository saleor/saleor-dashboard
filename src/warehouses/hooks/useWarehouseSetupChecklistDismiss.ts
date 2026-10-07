import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useCallback } from "react";

const STORAGE_KEY = "warehouse-setup-checklist-dismissed-ids";

interface ChecklistDismissEntry {
  id: string;
  /** How many channels the location was in when the checklist was skipped. */
  channelCount: number;
}

const dismissedEntries = (value: unknown): ChecklistDismissEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap(item => {
    if (typeof item === "string") {
      return [{ id: item, channelCount: 0 }];
    }

    if (item && typeof item === "object" && "id" in item && typeof item.id === "string") {
      const channelCount =
        "channelCount" in item && typeof item.channelCount === "number" ? item.channelCount : 0;

      return [{ id: item.id, channelCount }];
    }

    return [];
  });
};

/**
 * The checklist stays while a required step is open: no channel, or (in the older
 * stock mode) no shipping zone. A saved skip cannot hide those. `?action=setup`
 * shows it again from the menu after the required steps are done.
 */
export const isWarehouseSetupChecklistVisible = ({
  membershipReady,
  inChannel,
  emphasized,
  shippingZoneRequired = false,
  hasShippingZone = true,
}: {
  membershipReady: boolean;
  inChannel: boolean;
  emphasized: boolean;
  /** Older stock mode: a shipping zone is also required to sell. */
  shippingZoneRequired?: boolean;
  hasShippingZone?: boolean;
}): boolean => {
  if (!membershipReady) {
    return false;
  }

  if (emphasized) {
    return true;
  }

  if (!inChannel) {
    return true;
  }

  return shippingZoneRequired && !hasShippingZone;
};

/** The setup checklist stays until it is skipped. The menu can show it again. */
export const useWarehouseSetupChecklistDismiss = (
  warehouseId: string,
): {
  isDismissed: boolean;
  dismissedAtChannelCount: number;
  dismiss: (channelCount: number) => void;
  undismiss: () => void;
} => {
  const [stored, setStored] = useLocalStorage<unknown[]>(STORAGE_KEY, []);
  const entry = dismissedEntries(stored).find(item => item.id === warehouseId);

  const dismiss = useCallback(
    (channelCount: number) => {
      setStored(current => {
        const rest = dismissedEntries(current).filter(item => item.id !== warehouseId);

        return [...rest, { id: warehouseId, channelCount }];
      });
    },
    [setStored, warehouseId],
  );

  const undismiss = useCallback(() => {
    setStored(current => dismissedEntries(current).filter(item => item.id !== warehouseId));
  }, [setStored, warehouseId]);

  return {
    isDismissed: Boolean(entry),
    dismissedAtChannelCount: entry?.channelCount ?? 0,
    dismiss,
    undismiss,
  };
};
