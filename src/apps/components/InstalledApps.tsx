import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";
import { AppsList_apps_edges } from "../types/AppsList";

export interface InstalledAppsProps {
  appsList: AppsList_apps_edges[];
  onRemove: (id: string) => void;
}

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList = [],
  onRemove,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <div className={classes.appContainer}>
      <Card className={classes.appContainer}>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Installed Apps",
            description: "section header"
          })}
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
                  <TableCell className={classes.colAction}>
                    <Button color="primary">
                      <FormattedMessage
                        defaultMessage="About"
                        description="about app"
                      />
                    </Button>
                    <IconButton color="primary" onClick={() => onRemove(id)}>
                      <DeleteIcon />
                    </IconButton>
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

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
