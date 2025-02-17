import Link from "@dashboard/components/Link";
import { StopPropagation } from "@dashboard/components/StopPropagation";
import { AppListItemFragment } from "@dashboard/graphql";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { AlertExclamationIcon } from "../AppAlerts/AlertExclamationIcon";
import { appFailedAttemptsCheck, getLatestFailedAttemptFromWebhooks } from "./utils";

interface AppRowAlertProps {
  app: AppListItemFragment;
}

export const AppRowAlert = ({ app }: AppRowAlertProps) => {
  const hasErrors = useMemo(() => app.webhooks && appFailedAttemptsCheck(app.webhooks), [app]);
  const latestFailedAttempt = useMemo(
    () => app.webhooks && getLatestFailedAttemptFromWebhooks(app.webhooks),
    [app],
  );

  if (!hasErrors) {
    return null;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box>
          <AlertExclamationIcon />
        </Box>
      </Tooltip.Trigger>

      <Tooltip.Content align="start" side="bottom">
        <StopPropagation>
          <Box display="flex" flexDirection="row" gap={2} __color="#FFB84E">
            <Box marginTop={0.5}>
              <ExclamationIcon />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <Text fontSize={5} fontWeight="bold">
                <FormattedMessage defaultMessage="Issues found." id="/BT/kk" />
              </Text>
              <Text>
                <FormattedMessage
                  defaultMessage="Webhook errors detected. Last occurred at {date}. {viewDetails}."
                  id="FaRg9/"
                  values={{
                    date: latestFailedAttempt?.createdAt,
                    viewDetails: (
                      <Link href="#" color="secondary" underline>
                        <FormattedMessage defaultMessage="View details" id="MnpUD7" />
                      </Link>
                    ),
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
