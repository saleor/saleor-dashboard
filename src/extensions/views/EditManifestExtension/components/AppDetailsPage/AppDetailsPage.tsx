import { type AppManageTab } from "@dashboard/extensions/urls";
import { type AppQuery, AppTypeEnum } from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { type AppManageTabItem, AppManageTabs } from "../AppManageTabs/AppManageTabs";
import { AppWebhooksDisplay } from "../AppWebhooksDisplay/AppWebhooksDisplay";
import { AppActionsMenu } from "./AppActionsMenu";
import { Header } from "./Header";
import { InstalledAppDetails } from "./InstalledAppDetails";
import messages from "./messages";

const noConfigurationScreenMessages = defineMessages({
  title: {
    defaultMessage: "App does not include a configuration screen",
    id: "kVZfHj",
  },
  description: {
    defaultMessage:
      "This app contributes only background functionality (webhooks) or UI extensions. There is no configuration page to open from the dashboard.",
    id: "1wcKdb",
  },
});

interface AppDetailsPageProps {
  data: AppQuery["app"];
  activeTab: AppManageTab | undefined;
  onTabChange: (tab: AppManageTab) => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

export const AppDetailsPage = ({
  data,
  activeTab,
  onTabChange,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}: AppDetailsPageProps) => {
  const intl = useIntl();

  if (!data) {
    return null;
  }

  const tabs: Array<AppManageTabItem<AppManageTab>> = [
    { id: "details", label: intl.formatMessage(messages.tabDetails) },
    { id: "deliveries", label: intl.formatMessage(messages.tabWebhookDeliveries) },
  ];
  const currentTab = tabs.find(tab => tab.id === activeTab)?.id ?? "details";

  return (
    <ErrorBoundary
      onError={errorTracker.captureException}
      fallbackRender={() => (
        <Box padding={4}>
          <Text>
            <FormattedMessage id="5e7WuW" defaultMessage="Error, please refresh the page" />
          </Text>
        </Box>
      )}
    >
      <Header data={data} />
      {data.type === AppTypeEnum.THIRDPARTY && !data.appUrl && (
        <Box
          data-test-id="no-configuration-screen-info"
          display="flex"
          alignItems="flex-start"
          backgroundColor="info1"
          padding={4}
          gap={2}
          borderRadius={3}
          marginX={6}
          marginY={4}
        >
          <Box flexShrink="0" marginTop={1}>
            <Info size={20} />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text size={3} fontWeight="medium">
              <FormattedMessage {...noConfigurationScreenMessages.title} />
            </Text>
            <Text size={3}>
              <FormattedMessage {...noConfigurationScreenMessages.description} />
            </Text>
          </Box>
        </Box>
      )}
      <AppManageTabs
        tabs={tabs}
        activeId={currentTab}
        onChange={onTabChange}
        ariaLabel={intl.formatMessage(messages.tabsAriaLabel)}
        actions={
          <AppActionsMenu
            isActive={!!data.isActive}
            onAppActivateOpen={onAppActivateOpen}
            onAppDeactivateOpen={onAppDeactivateOpen}
            onAppDeleteOpen={onAppDeleteOpen}
          />
        }
      />
      {currentTab === "details" && (
        <Box data-test-id="app-details-section">
          <InstalledAppDetails app={data} />
        </Box>
      )}
      {currentTab === "deliveries" && <AppWebhooksDisplay padding={6} appId={data.id} />}
    </ErrorBoundary>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
