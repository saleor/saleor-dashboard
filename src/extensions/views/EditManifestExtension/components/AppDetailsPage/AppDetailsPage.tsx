import { type AppQuery, AppTypeEnum } from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { defineMessages, FormattedMessage } from "react-intl";

import { AppWebhooksDisplay } from "../AppWebhooksDisplay/AppWebhooksDisplay";
import { AboutCard } from "./AboutCard";
import { DataPrivacyCard } from "./DataPrivacyCard";
import { Header } from "./Header";
import { PermissionsCard } from "./PermissionsCard";

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
  loading: boolean;
  data: AppQuery["app"];
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

export const AppDetailsPage = ({
  data,
  loading,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}: AppDetailsPageProps) => {
  if (!data) {
    return null;
  }

  return (
    <ErrorBoundary
      onError={errorTracker.captureException}
      fallbackRender={() => (
        <Box padding={4}>
          <Text>Error, please refresh the page</Text>
        </Box>
      )}
    >
      <Header
        data={data}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />
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
      <Box
        data-test-id="app-details-section"
        display="grid"
        gridTemplateColumns={{ desktop: 2, tablet: 2, mobile: 1 }}
      >
        <Box borderColor="default1" borderRightStyle={"solid"} borderRightWidth={1}>
          <AboutCard
            padding={6}
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            aboutApp={data?.aboutApp}
            loading={loading}
          />
          <PermissionsCard
            appId={data.id}
            padding={6}
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            permissions={data?.permissions}
            loading={loading}
          />
          <DataPrivacyCard
            padding={6}
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            dataPrivacyUrl={data?.dataPrivacyUrl}
            loading={loading}
          />
        </Box>
        <AppWebhooksDisplay padding={6} appId={data.id} />
      </Box>
    </ErrorBoundary>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
