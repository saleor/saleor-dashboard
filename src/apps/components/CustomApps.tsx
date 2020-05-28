import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";
import { AppsList_apps_edges } from "../types/AppsList";

export interface CustomAppsProps {
  appsList: AppsList_apps_edges[];
  onCustomAppCreate: () => void;
}

const CustomApps: React.FC<CustomAppsProps> = ({
  appsList = [],
  onCustomAppCreate
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.appContainer}>
      <Card className={classes.appContainer}>
        <CardHeader
          action={
            <Button color="primary" onClick={onCustomAppCreate}>
              Create App
            </Button>
          }
          title={intl.formatMessage(commonMessages.customApps)}
        />
        <CardContent className={classes.appContent}>
          <ResponsiveTable>
            <TableBody>
              {appsList.map(({ node: { id, name, isActive } }) => (
                <TableRow key={id} className={classes.tableRow}>
                  <TableCell className={classes.colName}>
                    <span data-tc="name">{name}</span>
                    <Typography data-tc="isActive" variant="caption">
                      {isActive ? (
                        <FormattedMessage
                          defaultMessage="active"
                          description="account status"
                        />
                      ) : (
                        <FormattedMessage
                          defaultMessage="inactive"
                          description="account status"
                        />
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        </CardContent>
      </Card>
    </div>
  );
};

CustomApps.displayName = "CustomApps";
export default CustomApps;
