import CardSpacer from "@dashboard/components/CardSpacer";
import { AppQuery } from "@dashboard/graphql";
import React from "react";

import AboutCard from "./AboutCard";
import DataPrivacyCard from "./DataPrivacyCard";
import Header from "./Header";
import PermissionsCard from "./PermissionsCard";

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
      <AboutCard aboutApp={data?.aboutApp} loading={loading} />
      <CardSpacer />
      <PermissionsCard permissions={data?.permissions} loading={loading} />
      <CardSpacer />
      <DataPrivacyCard
        dataPrivacyUrl={data?.dataPrivacyUrl}
        loading={loading}
      />
      <CardSpacer />
    </>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
export default AppDetailsPage;
