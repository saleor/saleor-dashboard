import { useFlags } from "@dashboard/hooks/useFlags";
import React from "react";

import { LegacyDrawer } from "./legacy";

export const SidebarDrawer = () => {
  const { enableNewSidebar } = useFlags(["enableNewSidebar"]);

  return enableNewSidebar.enabled ? null : <LegacyDrawer />;
};
