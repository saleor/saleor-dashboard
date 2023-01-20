import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { AppInstallation, InstalledApp } from "@dashboard/new-apps/types";
import { ListProps } from "@dashboard/types";
import { Table, TableBody, TableFooter, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";

import InstalledAppListRow from "../InstalledAppListRow";
import NotInstalledAppListRow from "../NotInstalledAppListRow";
import { useStyles } from "./styles";

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({
  appList,
  appInstallationList,
  disabled,
  settings,
  onUpdateListSettings,
}) => {
  const classes = useStyles();

  if (!appList || !appInstallationList) {
    return <Skeleton />;
  }

  return (
    <Table className={classes.table}>
      <TableBody>
        {appInstallationList?.map(({ appInstallation, logo, isExternal }) => (
          <NotInstalledAppListRow
            key={appInstallation.id}
            appInstallation={appInstallation}
            isExternal={isExternal}
            logo={logo}
          />
        ))}
        {appList.map(({ app, isExternal, logo }) => (
          <InstalledAppListRow
            key={app.id}
            app={app}
            isExternal={isExternal}
            logo={logo}
          />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext
            disabled={disabled}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default InstalledAppList;
