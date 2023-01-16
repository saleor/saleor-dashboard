import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { appsInProgress, appsList } from "../../fixtures";
import AppsListPage, { AppsListPageProps } from "./AppsListPage";

const props: AppsListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  appsInProgressList: {
    __typename: "Query",
    appsInstallations: appsInProgress,
  },
  disabled: false,
  installedAppsList: appsList,
  onAppInProgressRemove: () => undefined,
  onAppInstallRetry: () => undefined,
  onSettingsAppOpen: () => undefined,
};

storiesOf("Apps / Apps list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <AppsListPage {...props} />)
  .add("loading", () => (
    <AppsListPage
      {...props}
      appsInProgressList={undefined}
      disabled={true}
      installedAppsList={[]}
    />
  ))
  .add("no data", () => (
    <AppsListPage
      {...props}
      appsInProgressList={undefined}
      installedAppsList={[]}
    />
  ));
