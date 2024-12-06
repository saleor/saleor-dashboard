import { AppPermissionFragment } from "@dashboard/graphql";
import { Box, InfoIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

export const AppAdditionalInfo = ({
  permissions,
  created,
}: {
  permissions?: AppPermissionFragment[] | null;
  created: string | null;
}) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box display="flex" placeItems="center">
          <InfoIcon color="default2" size="large" />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <Tooltip.ContentHeading>
          <FormattedMessage {...messages.appPermissions} />
        </Tooltip.ContentHeading>
        <Box as="ul" marginTop={0}>
          {permissions?.length ? (
            permissions?.map(permission => (
              <Box as="li" key={permission.code}>
                {permission.name}
              </Box>
            ))
          ) : (
            <Box as="li">
              <FormattedMessage {...messages.noPermissions} />
            </Box>
          )}
        </Box>
        {created && (
          <>
            <Tooltip.ContentHeading>
              <FormattedMessage {...messages.createdAt} />
            </Tooltip.ContentHeading>
            <Text size={2}>{moment(created).format("YYYY-MM-DD HH:mm")}</Text>
          </>
        )}
      </Tooltip.Content>
    </Tooltip>
  );
};
