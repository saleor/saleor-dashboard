import { AppInstallation, InstalledApp } from '@dashboard/new-apps/types';
import { ListProps } from '@dashboard/types';
import { Skeleton } from '@material-ui/lab';
import { List } from '@saleor/macaw-ui/next';
import React from 'react';

import InstalledAppListRow from '../InstalledAppListRow';
import NotInstalledAppListRow from '../NotInstalledAppListRow';

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({ appList, appInstallationList }) => {
  if (!appList || !appInstallationList) {
    return <Skeleton />;
  }

  return (
    <List>
      {appInstallationList?.map(({ appInstallation, logo, isExternal }) => (
        <NotInstalledAppListRow
          key={appInstallation.id}
          appInstallation={appInstallation}
          isExternal={isExternal}
          logo={logo}
        />
      ))}
      {appList.map(({ app, isExternal, logo }) => (
        <InstalledAppListRow key={app.id} app={app} isExternal={isExternal} logo={logo} />
      ))}
    </List>
  );
};

export default InstalledAppList;
