import { AppQuery } from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ErrorBoundary } from "react-error-boundary";

import { AppWebhooksDisplay } from "../AppWebhooksDisplay/AppWebhooksDisplay";
import { AboutCard } from "./AboutCard";
import { DataPrivacyCard } from "./DataPrivacyCard";
import { Header } from "./Header";
import { PermissionsCard } from "./PermissionsCard";

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
