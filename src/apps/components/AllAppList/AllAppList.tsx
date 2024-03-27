import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Skeleton } from "@material-ui/lab";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React from "react";

import AppListRow from "../AppListRow";

interface AllAppListProps {
  appList?: AppstoreApi.SaleorApp[];
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
  const { themeValues } = useTheme();

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <Box
      display="grid"
      __gridTemplateColumns="repeat(2, 1fr)"
      __gap={`${themeValues.spacing[8]} ${themeValues.spacing[5]}`}
      padding={5}
      marginTop={5}
    >
      {appList.map(app => (
        <AppListRow
          key={app.name.en}
          app={app}
          appInstallationList={appInstallationList}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToGithubForkPage={navigateToGithubForkPage}
        />
      ))}
    </Box>
  );
};

export default AllAppList;
