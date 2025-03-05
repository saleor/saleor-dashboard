import { AppPaths } from "@dashboard/apps/urls";
import Link from "@dashboard/components/Link";
import { AppListItemFragment } from "@dashboard/graphql";
import { DisabledIcon } from "@dashboard/icons/Disabled";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface AppRowDisabledAlertProps {
  app: AppListItemFragment;
}

export const AppRowDisabledAlert = ({ app }: AppRowDisabledAlertProps) => {
  if (app.isActive) {
    return null;
  }

  const detailsLink = AppPaths.resolveAppDetailsPath(app.id);

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box color="default2" __transform="scale(0.8)">
          <DisabledIcon />
        </Box>
      </Tooltip.Trigger>

      <Tooltip.Content align="end" side="bottom">
        <Box display="flex" flexDirection="row" gap={2} color="default2">
          <Box __transform="scale(0.8)" __marginTop="-3px">
            <DisabledIcon />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Text fontSize={5} fontWeight="bold">
              <FormattedMessage defaultMessage="App disabled" id="HwHSeY" />
            </Text>
            <Text>
              <FormattedMessage
                defaultMessage="Activate the app from the settings. {viewDetails}."
                id="oCrEdS"
                values={{
                  viewDetails: (
                    <Link href={detailsLink} color="secondary" underline>
                      <FormattedMessage defaultMessage="View details" id="MnpUD7" />
                    </Link>
                  ),
                }}
              />
            </Text>
          </Box>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
