import { GetV2SaleorAppsResponse } from "@dashboard/apps/marketplace.types";
import {
  groupIntoPairs,
  resolveInstallationOfMarketplaceApp,
} from "@dashboard/apps/utils";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Skeleton } from "@material-ui/lab";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import AppListCard from "../AppListCard";

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
  if (!appList) {
    return <Skeleton />;
  }

  const appsPairs = groupIntoPairs(appList);

  return (
    <Box display="flex" flexDirection="column" gap={8} marginTop={8}>
      {appsPairs.map(appPair => (
        <AppListCard
          key={appPair[0].name.en}
          appPair={appPair}
          appInstallation={resolveInstallationOfMarketplaceApp(
            appPair[0],
            appInstallationList,
          )}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToGithubForkPage={navigateToGithubForkPage}
        />
      ))}
    </Box>
  );
};

export default AllAppList;
