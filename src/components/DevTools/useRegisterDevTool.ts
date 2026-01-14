import { useEffect } from "react";

import { DevToolPanel, useDevTools } from "./DevToolsProvider";

/**
 * Hook to register a dev tool panel. Automatically unregisters on unmount.
 *
 * @example
 * useRegisterDevTool({
 *   id: "notifications",
 *   label: "Notifications",
 *   component: NotificationsDebugPanel,
 * });
 */
export const useRegisterDevTool = (panel: DevToolPanel) => {
  const { register } = useDevTools();

  useEffect(() => {
    const unregister = register(panel);

    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.id]);
};
