import { AppPermissionsDialog } from "@dashboard/apps/components/AppPermissionsDialog";
import { ButtonWithTooltip } from "@dashboard/components/ButtonWithTooltip";
import Skeleton from "@dashboard/components/Skeleton";
import { PermissionEnum } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { Box, BoxProps, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

type PermissionsCardProps = {
  permissions: Array<{
    name: string;
    code: PermissionEnum;
  }> | null;
  loading: boolean;
  appId: string; // todo wrap with App Context
} & BoxProps;

export const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissions,
  loading,
  appId,
  ...boxProps
}) => {
  const [editPermissionDialogOpen, setEditPermissionDialogOpen] =
    useState(false);
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const editPermissionsButton = (
    <ButtonWithTooltip
      tooltip={
        !hasManagedAppsPermission
          ? intl.formatMessage(buttonMessages.noPermission)
          : undefined
      }
      variant="secondary"
      disabled={!hasManagedAppsPermission}
      onClick={() => setEditPermissionDialogOpen(true)}
    >
      {intl.formatMessage(messages.editPermissionsButton)}
    </ButtonWithTooltip>
  );

  const renderContent = () => {
    if (loading) {
      return <Skeleton />;
    }

    if (permissions && permissions.length === 0) {
      return (
        <>
          <Text marginBottom={4} as={"p"}>
            {intl.formatMessage(messages.appNoPermissions)}
          </Text>
          {editPermissionsButton}
        </>
      );
    }

    if (permissions && permissions.length > 0) {
      return (
        <>
          <Text as={"p"} marginBottom={4}>
            <FormattedMessage {...messages.appPermissionsDescription} />
          </Text>
          <Box as={"ul"}>
            {permissions?.map(perm => (
              <Box as={"li"} paddingX={4} paddingY={2} key={perm.code}>
                <Text>{perm.name}</Text>
              </Box>
            ))}
          </Box>
          {editPermissionsButton}
        </>
      );
    }

    throw new Error('Leaking "if" statement, should never happen');
  };

  return (
    <>
      {editPermissionDialogOpen && (
        <AppPermissionsDialog
          appId={appId}
          onClose={() => setEditPermissionDialogOpen(false)}
          assignedPermissions={permissions?.map(p => p.code) ?? []}
        />
      )}
      <Box {...boxProps}>
        <Text size={5} fontWeight="bold" marginBottom={4} as={"h2"}>
          {intl.formatMessage(messages.appPermissionsTitle)}
        </Text>
        <Box>{renderContent()}</Box>
      </Box>
    </>
  );
};
