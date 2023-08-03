import Skeleton from "@dashboard/components/Skeleton";
import { PermissionData } from "@dashboard/permissionGroups/components/PermissionGroupDetailsPage";
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { hasPermissionSelected } from "../../utils";

interface PermissionListProps {
  permissions: PermissionData[];
  selectedPermissions: string[];
  disabled?: boolean;
  onPermissionChange: (key: string, value: boolean) => void;
}

export const PermissionList = ({
  permissions,
  onPermissionChange,
  selectedPermissions,
  disabled,
}: PermissionListProps) => {
  const intl = useIntl();

  if (permissions === undefined) {
    return (
      <Box>
        <Skeleton />
      </Box>
    );
  }

  return (
    <Box>
      {permissions.map(perm => (
        <ListItem
          key={perm.code}
          disabled={disabled || perm.disabled}
          role={undefined}
          dense
          button
          onClick={() =>
            onPermissionChange(
              perm.code,
              hasPermissionSelected(selectedPermissions, perm.code),
            )
          }
        >
          <ListItemIcon>
            <Checkbox
              color="secondary"
              edge="start"
              checked={hasPermissionSelected(selectedPermissions, perm.code)}
              tabIndex={-1}
              disableRipple
              name={perm.code}
              inputProps={{ "aria-labelledby": perm.code }}
            />
          </ListItemIcon>
          <ListItemText
            id={perm.code}
            primary={perm.name.replace(/\./, "")}
            secondary={
              perm.lastSource
                ? intl.formatMessage(messages.permissionListItemDescipription)
                : perm.code
            }
          />
        </ListItem>
      ))}
    </Box>
  );
};
