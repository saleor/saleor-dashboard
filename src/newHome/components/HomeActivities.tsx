import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import { getActivityMessage } from "@dashboard/home/components/HomeActivityCard/activityMessages";
import { Activities, HomeData } from "@dashboard/home/types";
import { renderCollection } from "@dashboard/misc";
import { Box, List, Skeleton, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface HomeActivitiesProps {
  activities: HomeData<Activities>;
}

export const HomeActivities = ({ activities }: HomeActivitiesProps) => {
  const intl = useIntl();
  const { themeValues } = useTheme();
  const title = intl.formatMessage({
    id: "BXkF8Z",
    defaultMessage: "Activity",
    description: "header",
  });

  if (activities.hasError) {
    return (
      <DashboardCard data-test-id="activity-card">
        <DashboardCard.Header>
          <DashboardCard.Title>{title}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Text color="default2">
            <FormattedMessage id="/U8FUp" defaultMessage="Couldn't load activities" />
          </Text>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  if (activities.loading) {
    return (
      <DashboardCard data-test-id="activity-card">
        <DashboardCard.Header>
          <DashboardCard.Title>{title}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content>
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
      <DashboardCard.Header>
        <DashboardCard.Title>{title}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <List>
          {renderCollection(
            activities.data,
            (activity, activityId) => (
              <List.Item
                key={activityId}
                flexDirection="column"
                alignItems="flex-start"
                cursor="auto"
                paddingY={1}
                paddingX={6}
                __marginLeft={"-" + themeValues.spacing[6]}
                __marginRight={"-" + themeValues.spacing[6]}
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
