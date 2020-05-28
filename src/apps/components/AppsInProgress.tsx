import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";
import { AppInstall } from "../types/AppInstall";

export interface AppsInProgressProps {
  appsList: AppInstall;
  onInstallationRetry?: () => void;
}

const AppsInProgress: React.FC<AppsInProgressProps> = ({
  appsList,
  onInstallationRetry,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  const app = appsList.appInstall?.appInstallation;

  return (
    <div className={classes.appContainer}>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Ongoing Installations",
            description: "section header"
          })}
        />
        <CardContent className={classes.appContent}>
          <ResponsiveTable>
            <TableBody>
              {app && (
                <TableRow key={app.id} className={classes.tableRow}>
                  <TableCell className={classes.colName}>
                    <span data-tc="name">{app.appName}</span>
                  </TableCell>
                  {app.status === "PENDING" && (
                    <TableCell className={classes.colName}>
                      <Typography variant="body2">
                        <FormattedMessage
                          defaultMessage="Installing app.."
                          description="app installation"
                        />
                      </Typography>
                    </TableCell>
                  )}
                  {app.status === "FAILED" && (
                    <TableCell className={classes.colAction}>
                      <Button color="primary" onClick={onInstallationRetry}>
                        <FormattedMessage
                          defaultMessage="Retry"
                          description="retry installation"
                        />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </ResponsiveTable>
        </CardContent>
      </Card>
    </div>
  );
};

AppsInProgress.displayName = "AppsInProgress";
export default AppsInProgress;
