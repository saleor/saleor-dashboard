// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { isDebugStaffEmail } from "./debugStaffEmail";
import { useNewPasswordPageInvite } from "./useNewPasswordPageInvite";

export type DevPanelTab = "ui-preview" | "real-session";

export interface UseDevPermissionPanelResult {
  open: boolean;
  pageInvite: ReturnType<typeof useNewPasswordPageInvite>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTab: Dispatch<SetStateAction<DevPanelTab>>;
  tab: DevPanelTab;
}

export const useDevPermissionPanel = (): UseDevPermissionPanelResult => {
  const pageInvite = useNewPasswordPageInvite();
  const shouldAutoOpen = pageInvite !== null && isDebugStaffEmail(pageInvite.email);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const [manualTab, setManualTab] = useState<DevPanelTab | null>(null);

  const defaultTab: DevPanelTab = shouldAutoOpen ? "real-session" : "ui-preview";
  const open = manualOpen ?? shouldAutoOpen;
  const tab = manualTab ?? defaultTab;

  const setOpen = useCallback<Dispatch<SetStateAction<boolean>>>(
    value => {
      setManualOpen(previous => {
        const current = previous ?? shouldAutoOpen;

        return typeof value === "function" ? value(current) : value;
      });
    },
    [shouldAutoOpen],
  );

  const setTab = useCallback<Dispatch<SetStateAction<DevPanelTab>>>(
    value => {
      setManualTab(previous => {
        const current = previous ?? defaultTab;

        return typeof value === "function" ? value(current) : value;
      });
    },
    [defaultTab],
  );

  return {
    open,
    pageInvite,
    setOpen,
    setTab,
    tab,
  };
};
