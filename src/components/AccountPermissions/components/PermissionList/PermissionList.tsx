import { PermissionData } from "@dashboard/permissionGroups/components/PermissionGroupDetailsPage";
import { Box, Checkbox, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { hasPermissionSelected } from "../../utils";
import styles from "./PermissionList.module.css";

interface PermissionListProps {
  permissions: PermissionData[];
  selectedPermissions: string[];
  disabled?: boolean;
  onPermissionChange: (key: string, value: boolean) => void;
  disabledPermissionTooltip: string | undefined;
}

/** Utility to render a string with <wbr /> after each underscore, for proper line breaks
 * in permission codes (e.g. MANAGE_ORDERS will break into MANAGE_ <new line>ORDERS */
function renderWithWbrAfterUnderscore(str: string) {
  return str
    .split("_")
    .flatMap((part, idx, arr) => (idx < arr.length - 1 ? [part, "_", <wbr key={idx} />] : [part]));
}

function getPermissionColumns(permissions: PermissionData[]) {
  if (permissions.length > 1) {
    const mid = Math.ceil(permissions.length / 2);

    return [permissions.slice(0, mid), permissions.slice(mid)];
  }

  return [permissions];
}

export const PermissionList = ({
  permissions,
  onPermissionChange,
  selectedPermissions,
  disabled,
  disabledPermissionTooltip,
}: PermissionListProps) => {
  const intl = useIntl();

  if (permissions === undefined) {
    return (
      <Box>
        <Skeleton />
      </Box>
    );
  }

  // Split permissions into two columns (displayed only on wide screens via grid)
  const columns = getPermissionColumns(permissions);

  return (
    <Box
      className={styles.grid}
      display="grid"
      gap={6}
      marginTop={4}
      data-test-id="permission-group-list"
    >
      {columns.map((col, colIdx) => (
        <Box key={colIdx} display="flex" flexDirection="column" gap={3}>
          {col.map(permission => (
            <Box
              key={permission.code}
              display="flex"
              flexDirection="column"
              gap={1}
              data-test-id="permission-group-list-item"
            >
              <Tooltip open={disabled && disabledPermissionTooltip ? undefined : false}>
                <Tooltip.Trigger>
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
                      <Text wordBreak="break-word">{permission.name.replace(".", "")}</Text>
                      <Text size={2} color="default2" wordBreak="break-word">
                        {permission.lastSource
                          ? intl.formatMessage(messages.permissionListItemDescription)
                          : renderWithWbrAfterUnderscore(permission.code)}
                      </Text>
                    </Box>
                  </Checkbox>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Tooltip.Arrow></Tooltip.Arrow>
                  {disabledPermissionTooltip}
                </Tooltip.Content>
              </Tooltip>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
