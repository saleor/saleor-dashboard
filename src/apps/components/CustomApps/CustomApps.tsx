import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppsList_apps_edges } from "../../types/AppsList";
import ActiveText from "../ActiveText";
import AppsSkeleton from "../AppsSkeleton";
import CardContainer from "../CardContainer";

export interface CustomAppsProps {
  appsList: AppsList_apps_edges[];
  disabled: boolean;
  onCustomAppCreate?: () => void;
  onRemove: (id: string) => void;
}

const CustomApps: React.FC<CustomAppsProps> = ({
  appsList = [],
  disabled,
  onRemove,
  onCustomAppCreate
}) => {
  const classes = useStyles({});

  const createBtnProps = !!onCustomAppCreate
    ? {
        action: (
          <Button color="primary" onClick={onCustomAppCreate}>
            <FormattedMessage
              defaultMessage="Create App"
              description="create app button"
            />
          </Button>
        )
      }
    : {};

  return (
    <CardContainer
      header={
        <>
          <CardHeader
            className={classes.title}
            {...createBtnProps}
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
        {disabled ? (
          <AppsSkeleton />
        ) : !!appsList.length ? (
          appsList.map(({ node: { id, name, isActive } }) => (
            <TableRow key={id} className={classes.tableRow}>
              <TableCell className={classes.colName}>
                <span data-tc="name">{name}</span>
                <ActiveText isActive={isActive} />
              </TableCell>
              <TableCell className={classes.colAction}>
                <IconButton color="primary" onClick={() => onRemove(id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
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
        )}
      </TableBody>
    </CardContainer>
  );
};

CustomApps.displayName = "CustomApps";
export default CustomApps;
