import { AppInstallationFragment } from "@dashboard/graphql";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { resolveInstallationOfMarketplaceApp } from "@dashboard/new-apps/utils";
import { Skeleton } from "@material-ui/lab";
import React from "react";

import AppListCard from "../AppListCard";
import { useStyles } from "./styles";

interface AllAppListProps {
  appList?: GetV2SaleorAppsResponse.SaleorApp[];
  appInstallationList?: AppInstallationFragment[];
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToGithubForkPage?: (githubForkUrl: string) => void;
}

const AllAppList: React.FC<AllAppListProps> = ({
  appList,
  appInstallationList,
  navigateToAppInstallPage,
  navigateToGithubForkPage,
}) => {
  const classes = useStyles();

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <div className={classes.appListWrapper}>
      {appList.map(app => (
        <AppListCard
          key={app.name.en}
          app={app}
          appInstallation={resolveInstallationOfMarketplaceApp(
            app,
            appInstallationList,
          )}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToGithubForkPage={navigateToGithubForkPage}
        />
      ))}
    </div>
  );
};

export default AllAppList;
