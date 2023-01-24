import { useFlags } from "@dashboard/hooks/useFlags";
import React from "react";

import { LegacySidebar } from "./legacy";
import { NewSidebar } from "./NewSidebar";

export const Sidebar = () => {
  const { enableNewSidebar } = useFlags(["enableNewSidebar"]);

  return enableNewSidebar.enabled ? <NewSidebar /> : <LegacySidebar />;
};
