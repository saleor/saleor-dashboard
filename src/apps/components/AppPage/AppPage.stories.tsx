import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { appDetails } from "../../fixtures";
import { AppPage, AppPageProps } from "./AppPage";

const props: AppPageProps = {
  data: appDetails,
  url: appDetails.appUrl!,
  onError: () => undefined,
};

storiesOf("Apps / App", module)
  .addDecorator(Decorator)
  .add("default", () => <AppPage {...props} />)
  .add("settings", () => (
    <AppPage {...props} url={appDetails.configurationUrl!} />
  ));
