import { AppPermissionFragment } from "@saleor/graphql";
import { IconButton, PermissionsIcon, Tooltip } from "@saleor/macaw-ui";
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
    <Tooltip
      header={<FormattedMessage {...messages.appPermissions} />}
      title={
        <ul className={classes.list}>
          {permissions?.map(permission => (
            <li key={permission.code}>{permission.name}</li>
          ))}
        </ul>
      }
    >
      <IconButton variant="secondary" color="primary">
        <PermissionsIcon />
      </IconButton>
    </Tooltip>
  );
};
AppPermissions.displayName = "AppPermissions";
export default AppPermissions;
