import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { commonMessages } from "@saleor/intl";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppsList_apps_edges } from "../../types/AppsList";
import ActiveText from "../ActiveText";
import AppsSkeleton from "../AppsSkeleton";
import CardContainer from "../CardContainer";

export interface CustomAppsProps {
  appsList: AppsList_apps_edges[];
  onCustomAppCreate?: () => void;
  onRemove: (id: string) => void;
}

const CustomApps: React.FC<CustomAppsProps> = ({
  appsList,
  onRemove,
  onCustomAppCreate
}) => {
  const classes = useStyles({});

  return (
    <CardContainer
      header={
        <>
          <CardHeader
            className={classes.title}
            action={
              !!onCustomAppCreate && (
                <Button color="primary" onClick={onCustomAppCreate}>
                  <FormattedMessage
                    defaultMessage="Create App"
                    description="create app button"
                  />
                </Button>
              )
            }
            title={
              <Typography
                className={classes.title}
                variant="h5"
                component="span"
              >
                <FormattedMessage {...commonMessages.customApps} />
              </Typography>
            }
          />
          <hr className={classes.hr} />
        </>
      }
    >
      <TableBody>
        {renderCollection(
          appsList,
          (app, index) =>
            app ? (
              <TableRow key={app.node.id} className={classes.tableRow}>
                <TableCell className={classes.colName}>
                  <span data-tc="name">{app.node.name}</span>
                  <ActiveText isActive={app.node.isActive} />
                </TableCell>
                <TableCell className={classes.colAction}>
                  <IconButton
                    color="primary"
                    onClick={() => onRemove(app.node.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : (
              <AppsSkeleton key={index} />
            ),
          () => (
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.colName}>
                <Typography className={classes.text} variant="body2">
                  <FormattedMessage
                    defaultMessage="Your custom created apps will be shown here."
                    description="custom apps content"
                  />
                </Typography>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </CardContainer>
  );
};

CustomApps.displayName = "CustomApps";
export default CustomApps;
