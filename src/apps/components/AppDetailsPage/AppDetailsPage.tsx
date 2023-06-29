import { AppQuery } from "@dashboard/graphql";
import React from "react";

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
    <>
      <Header
        data={data}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />
      <AboutCard margin={6} aboutApp={data?.aboutApp} loading={loading} />
      <PermissionsCard
        margin={6}
        permissions={data?.permissions}
        loading={loading}
      />
      <DataPrivacyCard
        margin={6}
        dataPrivacyUrl={data?.dataPrivacyUrl}
        loading={loading}
      />
    </>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
