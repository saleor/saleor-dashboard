import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
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
    appsInstallations: appsInProgress
  },
  customAppsList,
  disabled: false,
  installedAppsList: appsList,
  loadingAppsInProgress: false,
  navigateToCustomApp: () => undefined,
  navigateToCustomAppCreate: () => undefined,
  onAppInProgressRemove: () => undefined,
  onAppInstallRetry: () => undefined,
  onCustomAppRemove: () => undefined,
  onInstalledAppRemove: () => undefined,
  onNextPage: () => undefined,
  onPreviousPage: () => undefined,
  onRowClick: () => undefined,
  onRowAboutClick: () => undefined
};

export default {
  title: "Views / Apps / Apps list",
  decorators: [Decorator]
};

export const Default = () => <AppsListPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <AppsListPage
    {...props}
    appsInProgressList={undefined}
    disabled={true}
    loadingAppsInProgress={true}
    installedAppsList={undefined}
    customAppsList={undefined}
  />
);

Loading.story = {
  name: "loading"
};

export const NoData = () => (
  <AppsListPage
    {...props}
    appsInProgressList={undefined}
    installedAppsList={[]}
    customAppsList={[]}
  />
);

NoData.story = {
  name: "no data"
};
