import { GetV2SaleorAppsResponse } from "@dashboard/apps/marketplace.types";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Skeleton } from "@material-ui/lab";
import { Box } from "@saleor/macaw-ui/next";
import chunk from "lodash/chunk";
import React from "react";

import AppListRow from "../AppListRow";

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
  const appsPairs = React.useMemo(() => chunk(appList, 2), [appList]);

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <Box display="flex" flexDirection="column" gap={8} marginTop={8}>
      {appsPairs.map(appPair => (
        <AppListRow
          key={appPair[0].name.en}
          appPair={appPair}
          appInstallationList={appInstallationList}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToGithubForkPage={navigateToGithubForkPage}
        />
      ))}
    </Box>
  );
};

export default AllAppList;
