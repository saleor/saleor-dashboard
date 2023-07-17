import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import Skeleton from "@dashboard/components/Skeleton";
import { Activities } from "@dashboard/home/types";
import { Box, List, Text, useTheme } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { getActivityMessage } from "./activityMessages";

interface HomeActivityCardProps {
  activities: Activities;
  testId?: string;
}

export const HomeActivityCard = ({
  activities,
  testId,
}: HomeActivityCardProps) => {
  const intl = useIntl();
  const { themeValues } = useTheme();

  return (
    <DashboardCard data-test-id={testId}>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "BXkF8Z",
          defaultMessage: "Activity",
          description: "header",
        })}
      </DashboardCard.Title>
      <DashboardCard.Content>
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
                    <Text
                      variant="body"
                      size="small"
                      color="textNeutralSubdued"
                    >
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
