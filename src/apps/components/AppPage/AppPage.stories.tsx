import React from "react";

import { appDetails } from "../../fixtures";
import { AppPage, AppPageProps } from "./AppPage";

const props: AppPageProps = {
  data: appDetails,
  url: appDetails.appUrl!,
  onError: () => undefined,
};

export default {
  title: "Apps / App",
};

export const Default = () => <AppPage {...props} />;

export const Settings = () => (
  <AppPage {...props} url={appDetails.configurationUrl!} />
);
