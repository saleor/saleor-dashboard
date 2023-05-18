import { installedAppsList } from "@dashboard/apps/fixtures";
import React from "react";

import AppListPage, { AppListPageProps } from "./AppListPage";

const props: AppListPageProps = {
  disabled: false,
  installedApps: installedAppsList,
};

export default {
  title: "Apps / New Apps / App List",
};

export const Default = () => <AppListPage {...props} />;

export const Empty = () => (
  <AppListPage
    {...props}
    installedApps={[]}
    installableMarketplaceApps={[]}
    comingSoonMarketplaceApps={[]}
  />
);
