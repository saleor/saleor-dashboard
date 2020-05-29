import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import CardTitle from "@saleor/components/CardTitle";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppsInstallations_appsInstallations } from "../../types/AppsInstallations";
import AppsSkeleton from "../AppsSkeleton";
import CardContainer from "../CardContainer";

export interface AppsInProgressProps {
  appsList: AppsInstallations_appsInstallations[];
  disabled: boolean;
  onAppInstallRetry: (id: string) => void;
}

const AppsInProgress: React.FC<AppsInProgressProps> = ({
  appsList,
  disabled,
  onAppInstallRetry,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <CardContainer
      header={
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Ongoing Installations",
            description: "section header"
          })}
        />
      }
    >
      <TableBody>
        {disabled ? (
          <AppsSkeleton />
        ) : (
          appsList.map(({ status, appName, id }) => (
            <TableRow key={id} className={classes.tableRow}>
              <TableCell className={classes.colName}>
                <span data-tc="name">{appName}</span>
              </TableCell>
              {status === "PENDING" && (
                <>
                  <TableCell
                    className={classNames(classes.colAction, classes.colName)}
                  >
                    <Typography variant="body2" className={classes.text}>
                      <FormattedMessage
                        defaultMessage="Installing app.."
                        description="app installation"
                      />
                    </Typography>
                  </TableCell>
                  <TableCell
                    className={classNames(
                      classes.colAction,
                      classes.retryBtnCol
                    )}
                  />
                </>
              )}
              {status === "FAILED" && (
                <>
                  <TableCell
                    className={classNames(classes.colAction, classes.colName)}
                  >
                    <Typography variant="body2" className={classes.error}>
                      <FormattedMessage
                        defaultMessage="There was a problem during installation"
                        description="app installation error"
                      />
                      <ErrorIcon />
                    </Typography>
                  </TableCell>
                  <TableCell
                    className={classNames(
                      classes.colAction,
                      classes.retryBtnCol
                    )}
                  >
                    <Button
                      color="primary"
                      onClick={() => onAppInstallRetry(id)}
                    >
                      <FormattedMessage
                        defaultMessage="Retry"
                        description="retry installation"
                      />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </CardContainer>
  );
};

AppsInProgress.displayName = "AppsInProgress";
export default AppsInProgress;
