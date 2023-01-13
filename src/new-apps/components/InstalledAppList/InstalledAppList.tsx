import { Table, TableBody, TableFooter, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import { InstalledApp } from "@saleor/new-apps/types";
import { ListProps } from "@saleor/types";
import React from "react";

import InstalledAppListRow from "../InstalledAppListRow";
import { useStyles } from "./styles";

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({
  appList,
  disabled,
  settings,
  onUpdateListSettings,
}) => {
  const classes = useStyles();

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <Table className={classes.table}>
      <TableBody>
        {appList.map(({ app, isExternal }) => (
          <InstalledAppListRow key={app.id} app={app} isExternal={isExternal} />
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
