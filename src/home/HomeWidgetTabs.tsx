import { Tab } from "@dashboard/components/Tab/Tab";
import { TabContainer } from "@dashboard/components/Tab/TabContainer";
import { InlineExtensionPreferenceControls } from "@dashboard/extensions/preferences/InlineExtensionPreferenceControls";
import { type Extension } from "@dashboard/extensions/types";
import { SaleorLogo } from "@dashboard/extensions/views/InstallCustomExtension/components/InstallSectionData/InstallExtensionManifestData/SaleorLogo";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, sprinkles, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Blocks } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

import styles from "./HomeWidgetTabs.module.css";
import { homeWidgetsUrl, homeWidgetUrl } from "./urls";

const HomeTab = Tab<string>("home-widget-tab");

const messages = defineMessages({
  widgetsTab: {
    id: "qkaF5G",
    defaultMessage: "Widgets",
    description: "Label of the home page tab grouping non-fullscreen widget extensions",
  },
});

export type HomeActiveTab = { kind: "extension"; id: string } | { kind: "widgets" };

interface HomeWidgetTabsProps {
  fullscreenExtensions: Extension[];
  showWidgetsTab: boolean;
  activeTab: HomeActiveTab;
}

export const HomeWidgetTabs = ({
  fullscreenExtensions,
  showWidgetsTab,
  activeTab,
}: HomeWidgetTabsProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  // Fullscreen extensions have no card header, so the tab row is where their
  // name lives — hang the pin/hide controls off it, acting on the open tab.
  const activeExtension =
    activeTab.kind === "extension"
      ? fullscreenExtensions.find(extension => extension.id === activeTab.id)
      : undefined;

  // paddingX on TabContainer (not a parent) so border-bottom stays edge-to-edge
  return (
    <TabContainer className={clsx(sprinkles({ paddingX: 6, paddingTop: 3 }), styles.container)}>
      <Box className={styles.tabs}>
        {fullscreenExtensions.map(extension => (
          <HomeTab
            key={extension.id}
            isActive={activeTab.kind === "extension" && activeTab.id === extension.id}
            changeTab={() => navigate(homeWidgetUrl(extension.id))}
            testId={`home-widget-tab-${extension.id}`}
            className={styles.tab}
          >
            <Box display="inline-flex" alignItems="center" gap={2}>
              <Box
                __width={extension.isSaleorOfficial ? 20 : 0}
                __height={20}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                data-test-id={
                  extension.isSaleorOfficial ? `saleor-app-badge-${extension.id}` : undefined
                }
              >
                {extension.isSaleorOfficial && <SaleorLogo />}
              </Box>
              <Box display="inline-flex" flexDirection="column">
                <span>{extension.label}</span>
                <Text size={1} color="default2">
                  {extension.app.name}
                </Text>
              </Box>
            </Box>
          </HomeTab>
        ))}
        {showWidgetsTab && (
          <HomeTab
            isActive={activeTab.kind === "widgets"}
            changeTab={() => navigate(homeWidgetsUrl())}
            testId="home-widgets-tab"
            className={styles.tab}
          >
            <Box display="inline-flex" alignItems="center" gap={2}>
              <Box
                __width={20}
                __height={20}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
              >
                <Blocks size={16} />
              </Box>
              <Box display="inline-flex" flexDirection="column">
                <span>{intl.formatMessage(messages.widgetsTab)}</span>
              </Box>
            </Box>
          </HomeTab>
        )}
      </Box>
      {activeExtension ? (
        <Box className={styles.actions} data-test-id="home-widget-tab-actions">
          <InlineExtensionPreferenceControls extension={activeExtension} />
        </Box>
      ) : null}
    </TabContainer>
  );
};
