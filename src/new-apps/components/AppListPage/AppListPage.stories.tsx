import { installedAppsList } from "@saleor/new-apps/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import AppListPage, { AppListPageProps } from "./AppListPage";

const props: AppListPageProps = {
  disabled: false,
  installedApps: installedAppsList,
};

storiesOf("Views / New Apps / App List", module)
  .addDecorator(Decorator)
  .add("default", () => <AppListPage {...props} />)
  .add("empty", () => (
    <AppListPage
      {...props}
      installedApps={[]}
      installableMarketplaceApps={[]}
      comingSoonMarketplaceApps={[]}
    />
  ));
