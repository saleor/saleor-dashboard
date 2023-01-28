import { useFlags } from "@dashboard/hooks/useFlags";
import React from "react";

import { LegacyDrawer } from "./legacy";
import { NewDrawer } from "./NewDrawer";

export const SidebarDrawer = () => {
  const { enableNewSidebar } = useFlags(["enableNewSidebar"]);

  return enableNewSidebar.enabled ? <NewDrawer /> : <LegacyDrawer />;
};
