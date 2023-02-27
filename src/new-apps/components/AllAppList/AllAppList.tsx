import { AppInstallationFragment } from '@dashboard/graphql';
import { GetV2SaleorAppsResponse } from '@dashboard/new-apps/marketplace.types';
import { resolveInstallationOfMarketplaceApp } from '@dashboard/new-apps/utils';
import { Skeleton } from '@material-ui/lab';
import { Box } from '@saleor/macaw-ui/next';
import React from 'react';

import AppListCard from '../AppListCard';

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

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        mobile: 1,
        desktop: 2,
      }}
      gap={8}
      marginTop={8}
    >
      {appList.map(app => (
        <AppListCard
          key={app.name.en}
          app={app}
          appInstallation={resolveInstallationOfMarketplaceApp(app, appInstallationList)}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToGithubForkPage={navigateToGithubForkPage}
        />
      ))}
    </Box>
  );
};

export default AllAppList;
