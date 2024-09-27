import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { CustomerDetailsQuery, PermissionEnum } from "@dashboard/graphql";
import { Divider, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface CustomerStatsProps {
  customer: CustomerDetailsQuery["user"];
}

const CustomerStats: React.FC<CustomerStatsProps> = props => {
  const { customer } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "e7Nyu7",
            defaultMessage: "Customer History",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content display="flex" flexDirection="column">
        <Text size={2}>
          <FormattedMessage id="FNAZoh" defaultMessage="Last login" />
        </Text>
        {customer ? (
          <Text>
            {customer.lastLogin === null ? "-" : <DateTime date={customer.lastLogin} plain />}
          </Text>
        ) : (
          <Skeleton />
        )}
      </DashboardCard.Content>
      <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
        <Divider />
        <DashboardCard.Content display="flex" flexDirection="column">
          <Text size={2}>
            <FormattedMessage id="HMD+ib" defaultMessage="Last order" />
          </Text>
          {customer && customer.lastPlacedOrder ? (
            <Text>
              {customer.lastPlacedOrder.edges.length === 0 ? (
                "-"
              ) : (
                <DateTime date={customer.lastPlacedOrder.edges[0].node.created} plain />
              )}
            </Text>
          ) : (
            <Skeleton />
          )}
        </DashboardCard.Content>
      </RequirePermissions>
    </DashboardCard>
  );
};

CustomerStats.displayName = "CustomerStats";
export default CustomerStats;
