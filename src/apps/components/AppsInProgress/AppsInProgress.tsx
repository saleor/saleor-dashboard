import {
  Card,
  CircularProgress as Progress,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import { IconButton } from "@saleor/components/IconButton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import { AppsInstallationsQuery, JobStatusEnum } from "@saleor/graphql";
import {
  DeleteIcon,
  Indicator,
  ResponsiveTable,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";

export interface AppsInProgressProps {
  appsList: AppsInstallationsQuery["appsInstallations"];
  onAppInstallRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

const AppsInProgress: React.FC<AppsInProgressProps> = ({
  appsList,
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
          id: "nIrjSR",
          defaultMessage: "Ongoing Installations",
          description: "section header",
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
                    classes.colInstallAction,
                  )}
                >
                  <Typography variant="body2" className={classes.text}>
                    <FormattedMessage
                      id="1qRwgQ"
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
                    classes.colInstallAction,
                  )}
                >
                  <Typography variant="body2" className={classes.error}>
                    <FormattedMessage
                      id="Xl0o2y"
                      defaultMessage="Problem occured during installation"
                      description="app installation error"
                    />
                    <Tooltip title={message} variant="error">
                      <TooltipMountWrapper>
                        <Indicator icon="error" />
                      </TooltipMountWrapper>
                    </Tooltip>
                  </Typography>
                  <TableButtonWrapper>
                    <Button onClick={() => onAppInstallRetry(id)}>
                      <FormattedMessage
                        id="+c/f61"
                        defaultMessage="Retry"
                        description="retry installation"
                      />
                    </Button>
                  </TableButtonWrapper>
                  <TableButtonWrapper>
                    <IconButton
                      variant="secondary"
                      color="primary"
                      onClick={() => onRemove(id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableButtonWrapper>
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
