// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import Skeleton from "@dashboard/components/Skeleton";
import { AppQuery } from "@dashboard/graphql";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";
import { useStyles } from "./styles";

interface PermissionsCardProps {
  permissions?: AppQuery["app"]["permissions"];
  loading: boolean;
}

const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissions,
  loading,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.appPermissionsTitle)} />
      <CardContent>
        {!loading ? (
          <>
            <Typography>
              <FormattedMessage {...messages.appPermissionsDescription} />
            </Typography>
            {!!permissions?.length && (
              <ul className={classes.permissionsContainer}>
                {permissions?.map(perm => (
                  <li key={perm.code}>{perm.name}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </CardContent>
    </Card>
  );
};
export default PermissionsCard;
