import { useStaffInvite } from "@dashboard/staff/hooks/useStaffInvite";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

import { StaffAddMemberDialog } from "../StaffAddMemberDialog/StaffAddMemberDialog";

interface StaffInviteContextValue {
  openInvite: () => void;
}

const StaffInviteContext = createContext<StaffInviteContextValue | null>(null);

export const useStaffInviteDialog = (): StaffInviteContextValue => {
  const context = useContext(StaffInviteContext);

  if (!context) {
    throw new Error("useStaffInviteDialog must be used within StaffInviteProvider");
  }

  return context;
};

const StaffInviteDialog = ({ onClose }: { onClose: () => void }) => {
  const {
    addStaffMemberData,
    availablePermissionGroups,
    fetchMorePermissionGroups,
    handleStaffMemberAdd,
    searchPermissionGroups,
  } = useStaffInvite({ onSuccess: onClose });

  return (
    <StaffAddMemberDialog
      availablePermissionGroups={availablePermissionGroups}
      confirmButtonState={addStaffMemberData.status}
      initialSearch=""
      disabled={addStaffMemberData.loading}
      errors={addStaffMemberData.data?.staffCreate?.errors || []}
      open
      onClose={onClose}
      onConfirm={handleStaffMemberAdd}
      fetchMorePermissionGroups={fetchMorePermissionGroups}
      onSearchChange={searchPermissionGroups}
    />
  );
};

export const StaffInviteProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const openInvite = useCallback(() => setOpen(true), []);
  const closeInvite = useCallback(() => setOpen(false), []);

  return (
    <StaffInviteContext.Provider value={{ openInvite }}>
      {children}
      {open ? <StaffInviteDialog onClose={closeInvite} /> : null}
    </StaffInviteContext.Provider>
  );
};
