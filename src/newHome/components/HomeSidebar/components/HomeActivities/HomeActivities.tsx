import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import { getActivityMessage } from "@dashboard/home/components/HomeActivityCard/activityMessages";
import { renderCollection } from "@dashboard/misc";
import { useHomeSidebarContext } from "@dashboard/newHome/components/HomeSidebar/context/homeSidebarContext";
import { Box, List, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useHomeActivities } from "./useHomeActivities";

export const HomeActivities = () => {
  const intl = useIntl();
  const { hasPermissionToManageOrders } = useHomeSidebarContext();
  const { activities, loading, hasError } = useHomeActivities();

  const title = intl.formatMessage({
    id: "BXkF8Z",
    defaultMessage: "Activity",
    description: "header",
  });

  if (!hasPermissionToManageOrders || !activities) {
    return null;
  }

  if (hasError) {
    return (
      <DashboardCard data-test-id="activity-card">
        <DashboardCard.Header paddingX={3}>
          <DashboardCard.Title>{title}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content paddingX={3}>
          <Text color="default2">
            <FormattedMessage id="/U8FUp" defaultMessage="Couldn't load activities" />
          </Text>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  if (loading) {
    return (
      <DashboardCard data-test-id="activity-card">
        <DashboardCard.Header paddingX={3}>
          <DashboardCard.Title>{title}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content paddingX={3}>
          <Box display="flex" flexDirection="column" gap={5}>
            <Skeleton height={3} />
            <Skeleton __width="80%" height={3} />
            <Skeleton height={3} />
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard data-test-id="activity-card">
      <DashboardCard.Header paddingX={3}>
        <DashboardCard.Title>{title}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content paddingX={3}>
        <List>
          {renderCollection(
            activities,
            (activity, activityId) => (
              <List.Item
                key={activityId}
                flexDirection="column"
                alignItems="flex-start"
                cursor="auto"
                paddingY={1}
                marginBottom={3}
              >
                {activity ? (
                  <>
                    <Text size={3}>{getActivityMessage(activity, intl)}</Text>
                    <Text size={3} color="default2">
                      <DateTime date={activity.date} plain />
                    </Text>
                  </>
                ) : (
                  <Box paddingY={4}>
                    <Skeleton />
                  </Box>
                )}
              </List.Item>
            ),
            () => (
              <Box paddingY={4}>
                <Text size={3}>
                  <FormattedMessage id="wWTUrM" defaultMessage="No activities found" />
                </Text>
              </Box>
            ),
          )}
        </List>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
