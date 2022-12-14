import { Skeleton } from "@material-ui/lab";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";

import AppListCard from "../AppListCard";
import { useStyles } from "./styles";

interface AppListContentProps {
  appList?: GetV2SaleorAppsResponse.SaleorApp[];
}

const AppListContent: React.FC<AppListContentProps> = ({ appList }) => {
  const classes = useStyles();

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <div className={classes.appContent}>
      <div className={classes.appListWrapper}>
        {appList.map(app => (
          <AppListCard app={app} key={app.name.en} />
        ))}
      </div>
    </div>
  );
};

export default AppListContent;
