import { useFlags } from "@dashboard/hooks/useFlags";
import React from "react";

import { NewPermissionGroupDetails } from "./NewPermissionGroupDetails";
import { OldPermissionGroupDetails } from "./OldPermissionGroupDetails";

export const PermissionGroupDetails = props => {
  const { channelPermissions } = useFlags(["channelPermissions"]);

  if (channelPermissions.enabled) {
    return <NewPermissionGroupDetails {...(props as any)} />;
  } else {
    return <OldPermissionGroupDetails {...(props as any)} />;
  }
};
