import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { appDetails } from "../../fixtures";
import AppPage, { AppPageProps } from "./AppPage";

const props: AppPageProps = {
  data: appDetails,
  url: appDetails.appUrl,
  navigateToAbout: () => undefined,
  onBack: () => undefined,
  onError: () => undefined
};

export default {
  title: "Views / Apps / App",
  decorators: [Decorator]
};

export const Default = () => <AppPage {...props} />;

Default.story = {
  name: "default"
};

export const Settings = () => (
  <AppPage {...props} url={appDetails.configurationUrl} />
);

Settings.story = {
  name: "settings"
};
