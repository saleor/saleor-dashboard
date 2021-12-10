import {
  Card,
  CircularProgress as Progress,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import CardTitle from "@saleor/components/CardTitle";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import { Button, IconButton } from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { JobStatusEnum } from "../../../types/globalTypes";
import { useStyles } from "../../styles";
import { AppsInstallations_appsInstallations } from "../../types/AppsInstallations";

export interface AppsInProgressProps {
  appsList: AppsInstallations_appsInstallations[];
  disabled: boolean;
  onAppInstallRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

const AppsInProgress: React.FC<AppsInProgressProps> = ({
  appsList,
  disabled,
  onAppInstallRetry,
  onRemove,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Ongoing Installations",
          description: "section header"
        })}
      />
      <ResponsiveTable>
        <TableBody>
          {renderCollection(appsList, ({ status, appName, id, message }) => (
            <TableRow key={id} className={classes.tableRow}>
              <TableCell className={classes.colName}>
                <span data-tc="name">{appName}</span>
              </TableCell>
              {status === JobStatusEnum.PENDING && (
                <TableCell
                  className={classNames(
                    classes.colAction,
                    classes.colInstallAction
                  )}
                >
                  <Typography variant="body2" className={classes.text}>
                    <FormattedMessage
                      defaultMessage="Installing app..."
                      description="app installation"
                    />
                  </Typography>
                  <div className={classes.colSpinner}>
                    <Progress size={20} />
                  </div>
                </TableCell>
              )}
              {status === JobStatusEnum.FAILED && (
                <TableCell
                  className={classNames(
                    classes.colAction,
                    classes.colInstallAction
                  )}
                >
                  <Typography variant="body2" className={classes.error}>
                    <FormattedMessage
                      defaultMessage="There was a problem during installation"
                      description="app installation error"
                    />
                    <Tooltip
                      title={<Typography variant="body2">{message}</Typography>}
                      classes={{
                        tooltip: classes.customTooltip
                      }}
                    >
                      <ErrorIcon />
                    </Tooltip>
                  </Typography>
                  <Button onClick={() => onAppInstallRetry(id)}>
                    <FormattedMessage
                      defaultMessage="Retry"
                      description="retry installation"
                    />
                  </Button>
                  <IconButton
                    variant="secondary"
                    color="primary"
                    onClick={stopPropagation(() => onRemove(id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

AppsInProgress.displayName = "AppsInProgress";
export default AppsInProgress;
