import { AppPermissionFragment } from "@dashboard/graphql";
import { Box, InfoIcon, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface AppPermissionsProps {
  permissions?: AppPermissionFragment[] | null;
}

export const AppPermissions: React.FC<AppPermissionsProps> = ({
  permissions,
}) => {
  const classes = useStyles();

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
        <ul className={classes.list}>
          {permissions?.length ? (
            permissions?.map(permission => (
              <li key={permission.code}>{permission.name}</li>
            ))
          ) : (
            <li>
              <FormattedMessage {...messages.noPermissions} />
            </li>
          )}
        </ul>
      </Tooltip.Content>
    </Tooltip>
  );
};
AppPermissions.displayName = "AppPermissions";
export default AppPermissions;
