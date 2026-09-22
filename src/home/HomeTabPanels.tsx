import { type Extension } from "@dashboard/extensions/types";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";

import styles from "./HomeTabPanels.module.css";
import { HomeWidgetsGrid } from "./HomeWidgetsGrid";
import { type HomeActiveTab, HomeWidgetTabs } from "./HomeWidgetTabs";
import { HomeWidgetView } from "./HomeWidgetView";

interface HomeTabPanelsProps {
  fullscreen: Extension[];
  widgets: Extension[];
  activeTab: HomeActiveTab;
  showWidgetsTab: boolean;
}

const panelClassName = (isActive: boolean, extra?: string): string =>
  [styles.panel, isActive ? styles.panelActive : styles.panelHidden, extra]
    .filter(Boolean)
    .join(" ");

/**
 * Keep visited Home iframes mounted (hidden) so switching Pulse ↔ Onboarding
 * does not reboot the app. First visit still loads; later visits are instant.
 */
export const HomeTabPanels = ({
  fullscreen,
  widgets,
  activeTab,
  showWidgetsTab,
}: HomeTabPanelsProps) => {
  const activeExtensionId = activeTab.kind === "extension" ? activeTab.id : null;
  const [seenExtensionIds, setSeenExtensionIds] = useState<string[]>(() =>
    activeExtensionId ? [activeExtensionId] : [],
  );
  const [seenWidgets, setSeenWidgets] = useState(activeTab.kind === "widgets");

  const mountedExtensionIds =
    activeExtensionId && !seenExtensionIds.includes(activeExtensionId)
      ? [...seenExtensionIds, activeExtensionId]
      : seenExtensionIds;
  const widgetsVisited = seenWidgets || activeTab.kind === "widgets";

  if (mountedExtensionIds !== seenExtensionIds) {
    setSeenExtensionIds(mountedExtensionIds);
  }

  if (widgetsVisited && !seenWidgets) {
    setSeenWidgets(true);
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <HomeWidgetTabs
        fullscreenExtensions={fullscreen}
        showWidgetsTab={showWidgetsTab}
        activeTab={activeTab}
      />
      <Box className={styles.panels}>
        {fullscreen
          .filter(extension => mountedExtensionIds.includes(extension.id))
          .map(extension => {
            const isActive = activeTab.kind === "extension" && activeTab.id === extension.id;

            return (
              <Box
                key={extension.id}
                className={panelClassName(isActive)}
                aria-hidden={!isActive}
                data-test-id={`home-widget-panel-${extension.id}`}
                data-active={isActive ? "true" : "false"}
              >
                <HomeWidgetView extension={extension} />
              </Box>
            );
          })}
        {widgetsVisited && widgets.length > 0 ? (
          <Box
            className={panelClassName(activeTab.kind === "widgets", styles.widgetsPanel)}
            aria-hidden={activeTab.kind !== "widgets"}
            data-test-id="home-widgets-grid-panel"
          >
            <HomeWidgetsGrid extensions={widgets} />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
