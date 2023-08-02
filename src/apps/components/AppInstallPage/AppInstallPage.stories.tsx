import React from "react";

import { installApp } from "../../fixtures";
import AppInstallPage, { AppInstallPageProps } from "./AppInstallPage";

const props: AppInstallPageProps = {
  data: installApp,
  loading: false,
  navigateToAppsList: () => undefined,
  onSubmit: () => Promise.resolve([]),
};

export default {
  title: "Apps / Install App",
};

export const Default = () => <AppInstallPage {...props} />;

export const Loading = () => <AppInstallPage {...props} loading={true} />;
