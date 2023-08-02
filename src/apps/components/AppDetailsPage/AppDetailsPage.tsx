import { AppQuery } from "@dashboard/graphql";
import errorTracker from "@dashboard/services/errorTracking";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { AboutCard } from "./AboutCard";
import { DataPrivacyCard } from "./DataPrivacyCard";
import Header from "./Header";
import { PermissionsCard } from "./PermissionsCard";

export interface AppDetailsPageProps {
  loading: boolean;
  data: AppQuery["app"];
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  data,
  loading,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => {
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
      <AboutCard margin={6} aboutApp={data?.aboutApp} loading={loading} />
      <PermissionsCard
        appId={data.id}
        margin={6}
        permissions={data?.permissions}
        loading={loading}
      />
      <DataPrivacyCard
        margin={6}
        dataPrivacyUrl={data?.dataPrivacyUrl}
        loading={loading}
      />
    </ErrorBoundary>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
