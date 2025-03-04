import { AppPaths } from "@dashboard/apps/urls";
import EventTime from "@dashboard/components/EventTime";
import Link from "@dashboard/components/Link";
import { StopPropagation } from "@dashboard/components/StopPropagation";
import { AppListItemFragment } from "@dashboard/graphql";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { AlertExclamationIcon } from "../AppAlerts/AlertExclamationIcon";
import { getLatestFailedAttemptFromWebhooks } from "./utils";

interface AppRowWebhookIssueAlertProps {
  app: AppListItemFragment;
}

export const AppRowWebhookIssueAlert = ({ app }: AppRowWebhookIssueAlertProps) => {
  const latestFailedAttempt = useMemo(
    () => app.webhooks && getLatestFailedAttemptFromWebhooks(app.webhooks),
    [app],
  );

  if (!latestFailedAttempt) {
    return null;
  }

  const detailsLink = AppPaths.resolveAppDetailsPath(app.id);

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box data-test-id="app-warning-dot">
          <AlertExclamationIcon />
        </Box>
      </Tooltip.Trigger>

      <Tooltip.Content align="end" side="bottom">
        <StopPropagation>
          <Box display="flex" flexDirection="row" gap={2} __color="#FFB84E">
            <Box marginTop={0.5}>
              <ExclamationIcon />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <Text fontSize={5} fontWeight="bold">
                <FormattedMessage defaultMessage="Issues found" id="t9sWqJ" />
              </Text>
              <Text>
                <FormattedMessage
                  defaultMessage="Webhook errors detected. Last occurred {break}at {date}. {viewDetails}."
                  id="Btr1DU"
                  values={{
                    date: <EventTime date={latestFailedAttempt.createdAt} />,
                    viewDetails: (
                      <Link href={detailsLink} color="secondary" underline>
                        <FormattedMessage defaultMessage="View details" id="MnpUD7" />
                      </Link>
                    ),
                    break: <br />,
                  }}
                />
              </Text>
            </Box>
          </Box>
        </StopPropagation>
      </Tooltip.Content>
    </Tooltip>
  );
};
