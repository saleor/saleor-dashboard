import { Table, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import IconButtonTableCell from "@saleor/components/IconButtonTableCell";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AppListItemFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { MoreIcon, Pill } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface InstalledAppListProps {
  appList?: AppListItemFragment[];
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({ appList }) => {
  const intl = useIntl();
  const classes = useStyles();

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <Table className={classes.table}>
      {appList.map(app => (
        <TableRow key={app.id}>
          <TableCellAvatar thumbnail={undefined} className={classes.logo}>
            <div className={classes.mainContent}>
              <Typography variant="body1" className={classes.name}>
                {app.name}
              </Typography>
              <Typography variant="body1" className={classes.version}>
                {`v${app.version}`}
              </Typography>
              <Pill
                color="warning"
                label={intl.formatMessage(messages.externalApp)}
              />
            </div>
          </TableCellAvatar>
          <IconButtonTableCell onClick={() => undefined}>
            <FormattedMessage {...commonMessages.settings} />
          </IconButtonTableCell>
          <IconButtonTableCell onClick={() => undefined}>
            <MoreIcon />
          </IconButtonTableCell>
        </TableRow>
      ))}
    </Table>
  );
};

export default InstalledAppList;
