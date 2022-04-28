import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { installApp } from "../../fixtures";
import AppInstallPage, { AppInstallPageProps } from "./AppInstallPage";

const props: AppInstallPageProps = {
  data: installApp,
  loading: false,
  navigateToAppsList: () => undefined,
  onSubmit: () => undefined
};

export default {
  title: "Views / Apps / Install App",
  decorators: [Decorator]
};

export const Default = () => <AppInstallPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <AppInstallPage {...props} loading={true} />;

Loading.story = {
  name: "loading"
};
