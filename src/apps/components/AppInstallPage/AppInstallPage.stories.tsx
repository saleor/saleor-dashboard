import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { installApp } from "../../fixtures";
import AppInstallPage, { AppInstallPageProps } from "./AppInstallPage";

const props: AppInstallPageProps = {
  data: installApp,
  loading: false,
  navigateToAppsList: () => undefined,
  onSubmit: () => undefined
};

storiesOf("Views / Apps / Install App", module)
  .addDecorator(Decorator)
  .add("default", () => <AppInstallPage {...props} />)
  .add("loading", () => <AppInstallPage {...props} loading={true} />);
