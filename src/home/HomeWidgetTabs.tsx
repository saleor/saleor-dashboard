import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { Tab } from "@dashboard/components/Tab/Tab";
import { TabContainer } from "@dashboard/components/Tab/TabContainer";
import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { InlineExtensionPreferenceControls } from "@dashboard/extensions/preferences/InlineExtensionPreferenceControls";
import { type Extension } from "@dashboard/extensions/types";
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
  const { trackEvent } = useAnalytics();
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
        {fullscreenExtensions.map(extension => {
          const isActive = activeTab.kind === "extension" && activeTab.id === extension.id;
          const logoSource = extension.app.brand?.logo.default;

          return (
            <HomeTab
              key={extension.id}
              isActive={isActive}
              changeTab={() => {
                trackEvent("home_widget_opened", {
                  extension_origin: extension.isSaleorOfficial ? "saleor" : "third_party",
                  source: "home_tab",
                  widget_kind: "fullscreen",
                });
                navigate(homeWidgetUrl(extension.id));
              }}
              testId={`home-widget-tab-${extension.id}`}
              className={clsx(styles.tab, isActive && styles.active)}
            >
              <Box display="inline-flex" flexDirection="column">
                <Box display="inline-flex" alignItems="center" gap={2}>
                  {logoSource ? (
                    <AppAvatar
                      logo={{ source: logoSource }}
                      size={5}
                      flexShrink="0"
                      className={styles.mark}
                      data-test-id={`home-widget-tab-icon-${extension.id}`}
                    />
                  ) : null}
                  <span>{extension.label}</span>
                </Box>
                <Text size={1} color="default2" className={logoSource ? styles.appName : undefined}>
                  {extension.app.name}
                </Text>
              </Box>
            </HomeTab>
          );
        })}
        {showWidgetsTab && (
          <HomeTab
            isActive={activeTab.kind === "widgets"}
            changeTab={() => {
              trackEvent("home_widget_opened", {
                source: "home_tab",
                widget_kind: "grid",
              });
              navigate(homeWidgetsUrl());
            }}
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
          <InlineExtensionPreferenceControls extension={activeExtension} surface="home" />
        </Box>
      ) : null}
    </TabContainer>
  );
};
