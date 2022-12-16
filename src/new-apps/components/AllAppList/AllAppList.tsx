import { Skeleton } from "@material-ui/lab";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";

import AppListCard from "../AppListCard";
import { useStyles } from "./styles";

interface AllAppListProps {
  appList?: GetV2SaleorAppsResponse.SaleorApp[];
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToVercelDeploymentPage?: (vercelDeploymentUrl: string) => void;
}

const AllAppList: React.FC<AllAppListProps> = ({
  appList,
  navigateToAppInstallPage,
  navigateToVercelDeploymentPage,
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
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToVercelDeploymentPage={navigateToVercelDeploymentPage}
        />
      ))}
    </div>
  );
};

export default AllAppList;
