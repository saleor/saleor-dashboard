import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import { Activities, HomeData } from "@dashboard/home/types";
import { Box, List, Skeleton, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { getActivityMessage } from "./activityMessages";

interface HomeActivityCardProps {
  activities: HomeData<Activities>;
  testId?: string;
}

export const HomeActivityCard = ({
  activities,
  testId,
}: HomeActivityCardProps) => {
  const intl = useIntl();
  const { themeValues } = useTheme();
  const title = intl.formatMessage({
    id: "BXkF8Z",
    defaultMessage: "Activity",
    description: "header",
  });

  if (activities.hasError) {
    return (
      <DashboardCard data-test-id={testId}>
        <DashboardCard.Title>{title}</DashboardCard.Title>
        <DashboardCard.Content>
          <Text color="default2">
            <FormattedMessage
              id="/U8FUp"
              defaultMessage="Couldn't load activities"
            />
          </Text>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  if (activities.loading) {
    return (
      <DashboardCard data-test-id={testId}>
        <DashboardCard.Title>{title}</DashboardCard.Title>
        <DashboardCard.Content>
          <Box display="flex" flexDirection="column" gap={5}>
            <Skeleton />
            <Skeleton __width="80%" />
            <Skeleton />
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard data-test-id={testId}>
      <DashboardCard.Title>{title}</DashboardCard.Title>
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
                    <Text variant="body" size="small">
                      {getActivityMessage(activity, intl)}
                    </Text>
                    <Text variant="body" size="small" color="default2">
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
                <Text variant="body" size="small">
                  <FormattedMessage
                    id="wWTUrM"
                    defaultMessage="No activities found"
                  />
                </Text>
              </Box>
            ),
          )}
        </List>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
