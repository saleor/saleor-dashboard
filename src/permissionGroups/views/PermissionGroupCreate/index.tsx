import { useFlags } from "@dashboard/hooks/useFlags";
import React from "react";

import { NewPermissionGroupCreateView } from "./NewPermissionCreate";
import { OldPermissionGroupCreateView } from "./OldPermissionGroupCreate";

export const PermissionGroupCreate = props => {
  const { channelPermissions } = useFlags(["channelPermissions"]);

  if (channelPermissions.enabled) {
    return <NewPermissionGroupCreateView {...(props as any)} />;
  } else {
    return <OldPermissionGroupCreateView {...(props as any)} />;
  }
};
