import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { useCallback } from "react";

import { useSidebarCollapse } from "./SidebarContext";

type SidebarCollapseToggleSource = "button" | "shortcut";

export const useSidebarCollapseToggle = (): ((source: SidebarCollapseToggleSource) => void) => {
  const { isCollapsed, setCollapsed, knowsCollapseShortcut, setKnowsCollapseShortcut } =
    useSidebarCollapse();
  const { trackEvent } = useAnalytics();

  return useCallback(
    (source: SidebarCollapseToggleSource) => {
      const nextCollapsed = !isCollapsed;

      setCollapsed(nextCollapsed);

      if (source === "shortcut" && !knowsCollapseShortcut) {
        setKnowsCollapseShortcut(true);
      }

      trackEvent("sidebar_collapse_toggled", {
        source,
        state: nextCollapsed ? "collapsed" : "expanded",
      });
    },
    [isCollapsed, setCollapsed, knowsCollapseShortcut, setKnowsCollapseShortcut, trackEvent],
  );
};
