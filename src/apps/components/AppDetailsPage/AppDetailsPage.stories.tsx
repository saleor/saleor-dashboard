import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { appDetails } from "../../fixtures";
import AppDetailsPage, { AppDetailsPageProps } from "./AppDetailsPage";

const props: AppDetailsPageProps = {
  data: appDetails,
  loading: false,
  navigateToApp: () => undefined,
  navigateToAppSettings: () => undefined,
  onAppActivateOpen: () => undefined,
  onAppDeactivateOpen: () => undefined,
  onBack: () => undefined
};

export default {
  title: "Views / Apps / App details",
  decorators: [Decorator]
};

export const Default = () => <AppDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <AppDetailsPage {...props} loading={true} />;

Loading.story = {
  name: "loading"
};
