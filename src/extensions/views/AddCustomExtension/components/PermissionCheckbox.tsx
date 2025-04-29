import { HookFormCheckbox } from "@dashboard/components/HookFormCheckbox";
import { messages } from "@dashboard/extensions/messages";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { Control } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { CustomExtensionFormData } from "../AddCustomExtension";

export const PermissionCheckbox = ({
  permissionCode,
  permissionName,
  control,
  userPermissionSet,
}: {
  permissionCode: PermissionEnum;
  permissionName: string;
  control: Control<CustomExtensionFormData>;
  userPermissionSet: Set<PermissionEnum>;
}) => {
  const isDisabled = !userPermissionSet.has(permissionCode);

  const checkbox = (
    <HookFormCheckbox
      name={`permissions.${permissionCode}`}
      control={control}
      alignItems="flex-start"
      disabled={isDisabled}
    >
      <Box display="flex" flexDirection="column" __marginTop="-4px">
        <Text>{permissionName}</Text>
        <Text size={2} color="default2">
          {permissionCode}
        </Text>
      </Box>
    </HookFormCheckbox>
  );

  if (isDisabled) {
    return (
      <Tooltip>
        <Tooltip.Trigger>{checkbox}</Tooltip.Trigger>
        <Tooltip.Content side="left">
          <Tooltip.Arrow />
          <FormattedMessage {...messages.permissionDisabledTooltip} />
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return <Box>{checkbox}</Box>;
};
