import { Tab, TabContainer } from "@dashboard/components/Tab";
import { type Extension } from "@dashboard/extensions/types";
import { SaleorLogo } from "@dashboard/extensions/views/InstallCustomExtension/components/InstallSectionData/InstallExtensionManifestData/SaleorLogo";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Blocks } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

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

  return (
    <TabContainer>
      {fullscreenExtensions.map(extension => (
        <HomeTab
          key={extension.id}
          isActive={activeTab.kind === "extension" && activeTab.id === extension.id}
          changeTab={() => navigate(homeWidgetUrl(extension.id))}
          testId={`home-widget-tab-${extension.id}`}
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
    </TabContainer>
  );
};
