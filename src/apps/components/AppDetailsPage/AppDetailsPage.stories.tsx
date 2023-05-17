import React from "react";

import { appDetails } from "../../fixtures";
import AppDetailsPage, { AppDetailsPageProps } from "./AppDetailsPage";

const props: AppDetailsPageProps = {
  data: appDetails,
  loading: false,
  navigateToApp: () => undefined,
  onAppActivateOpen: () => undefined,
  onAppDeactivateOpen: () => undefined,
  onAppDeleteOpen: () => undefined,
};

export default {
  title: "Apps / App details",
};

export const Default = () => <AppDetailsPage {...props} />;

export const Loading = () => <AppDetailsPage {...props} loading={true} />;
