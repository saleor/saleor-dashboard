import { PermissionData } from "@dashboard/permissionGroups/components/PermissionGroupDetailsPage";
import { Box, Checkbox, Skeleton, Text } from "@saleor/macaw-ui-next";
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
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      marginTop={4}
      data-test-id="permission-group-list"
    >
      {permissions.map(permission => (
        <Box
          key={permission.code}
          display="flex"
          flexDirection="column"
          gap={1}
          data-test-id="permission-group-list-item"
        >
          <Checkbox
            data-test-id={`permission-checkbox-${permission.code}`}
            disabled={disabled || permission.disabled}
            checked={hasPermissionSelected(selectedPermissions, permission.code)}
            onCheckedChange={value => {
              onPermissionChange(permission.code, !value);
            }}
            alignItems="flex-start"
          >
            <Box display="flex" flexDirection="column" __marginTop="-4px">
              <Text>{permission.name.replace(".", "")}</Text>
              <Text size={2} color="default2">
                {permission.lastSource
                  ? intl.formatMessage(messages.permissionListItemDescipription)
                  : permission.code}
              </Text>
            </Box>
          </Checkbox>
        </Box>
      ))}
    </Box>
  );
};
