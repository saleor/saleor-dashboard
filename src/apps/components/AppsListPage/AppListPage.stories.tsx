import { AppListContext } from "@saleor/apps/context";
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

import { appsInProgress, appsList, customAppsList } from "../../fixtures";
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
  customAppsList,
  disabled: false,
  installedAppsList: appsList,
  getCustomAppHref: () => "",
  onAppInProgressRemove: () => undefined,
  onAppInstallRetry: () => undefined,
  onCustomAppRemove: () => undefined,
  onInstalledAppRemove: () => undefined,
};

storiesOf("Views / Apps / Apps list", module)
  .addDecorator(Decorator)
  .addDecorator(story => (
    <AppListContext.Provider
      value={{ activateApp: () => undefined, deactivateApp: () => undefined }}
    >
      {story()}
    </AppListContext.Provider>
  ))
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <AppsListPage {...props} />)
  .add("loading", () => (
    <AppsListPage
      {...props}
      appsInProgressList={undefined}
      disabled={true}
      installedAppsList={undefined}
      customAppsList={undefined}
    />
  ))
  .add("no data", () => (
    <AppsListPage
      {...props}
      appsInProgressList={undefined}
      installedAppsList={[]}
      customAppsList={[]}
    />
  ));
