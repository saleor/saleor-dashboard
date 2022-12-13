import { Skeleton } from "@material-ui/lab";
import { SaleorMarketplaceApp } from "@saleor/new-apps/types";
import React from "react";

import AppListCard from "../AppListCard";
import { useStyles } from "./styles";

interface AppListContentProps {
  appList?: SaleorMarketplaceApp[];
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
          <AppListCard app={app} key={app.name} />
        ))}
      </div>
    </div>
  );
};

export default AppListContent;
