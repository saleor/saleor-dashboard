import CardTitle from "@dashboard/components/CardTitle";
import { DateTime } from "@dashboard/components/Date";
import { Hr } from "@dashboard/components/Hr";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import Skeleton from "@dashboard/components/Skeleton";
import { CustomerDetailsQuery, PermissionEnum } from "@dashboard/graphql";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    label: {
      marginBottom: theme.spacing(1),
    },
    value: {
      fontSize: 24,
    },
  }),
  { name: "CustomerStats" },
);

export interface CustomerStatsProps {
  customer: CustomerDetailsQuery["user"];
}

const CustomerStats: React.FC<CustomerStatsProps> = props => {
  const { customer } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "e7Nyu7",
          defaultMessage: "Customer History",
          description: "section header",
        })}
      />
      <CardContent>
        <Typography className={classes.label} variant="caption">
          <FormattedMessage id="FNAZoh" defaultMessage="Last login" />
        </Typography>
        {customer ? (
          <Typography variant="h6" className={classes.value}>
            {customer.lastLogin === null ? (
              "-"
            ) : (
              <DateTime date={customer.lastLogin} plain />
            )}
          </Typography>
        ) : (
          <Skeleton />
        )}
      </CardContent>
      <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
        <Hr />
        <CardContent>
          <Typography className={classes.label} variant="caption">
            <FormattedMessage id="HMD+ib" defaultMessage="Last order" />
          </Typography>
          {customer && customer.lastPlacedOrder ? (
            <Typography variant="h6" className={classes.value}>
              {customer.lastPlacedOrder.edges.length === 0 ? (
                "-"
              ) : (
                <DateTime
                  date={customer.lastPlacedOrder.edges[0].node.created}
                  plain
                />
              )}
            </Typography>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </RequirePermissions>
    </Card>
  );
};
CustomerStats.displayName = "CustomerStats";
export default CustomerStats;
