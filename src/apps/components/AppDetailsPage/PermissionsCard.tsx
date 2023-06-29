import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Skeleton from "@dashboard/components/Skeleton";
import { PermissionEnum } from "@dashboard/graphql";
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  List,
  Text,
} from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

type PermissionsCardProps = {
  permissions: Array<{
    name: string;
    code: PermissionEnum;
  }> | null;
  loading: boolean;
} & BoxProps;

const EditPermissionsDialog: React.FC<{
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: (newPermissions: PermissionEnum[]) => void;
  assignedPermissions: PermissionEnum[];
}> = ({
  confirmButtonState,
  assignedPermissions,
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedPermissions, setSelectedPermissions] =
    useState(assignedPermissions);

  /**
   * TODO
   * - iterate over API instead enum
   * - render list of labels
   * - add mutation
   * - extract i18n
   * - extract and test
   */
  return (
    <ActionDialog
      confirmButtonLabel={"Save"}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(selectedPermissions)}
      title={"Edit permissions"}
      variant="default"
      backButtonText={"Close"}
    >
      <Text as={"p"}>Manually change permission for the app.</Text>
      <Text as={"p"} color={"textCriticalDefault"} marginBottom={6}>
        Be careful - App can break!
      </Text>
      <form
        onChange={e => {
          const formdata = new FormData(e.currentTarget);

          // @ts-ignore - todo why TS doesnt get it?
          const values = Array.from(formdata.keys()) as PermissionEnum[];

          setSelectedPermissions(values);
        }}
      >
        <List>
          {Object.values(PermissionEnum)
            .sort()
            .filter(perm => perm !== "MANAGE_APPS")
            .map(perm => {
              const isAssigned = Boolean(
                selectedPermissions.find(p => p === perm),
              );

              return (
                <List.Item
                  key={perm}
                  paddingY={1}
                  paddingX={2}
                  display={"flex"}
                  alignItems={"center"}
                  as={"label"}
                  backgroundColor={
                    isAssigned ? "decorativeSurfaceSubdued3" : undefined
                  }
                >
                  <Checkbox
                    name={perm}
                    defaultChecked={isAssigned}
                    marginRight={4}
                  />
                  <Text variant={isAssigned ? "bodyStrong" : "body"}>
                    {perm}
                  </Text>
                </List.Item>
              );
            })}
        </List>
      </form>
    </ActionDialog>
  );
};

export const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissions,
  loading,
  ...boxProps
}) => {
  const [editPermissionDialogOpen, setEditPermissionDialogOpen] =
    useState(false);
  const intl = useIntl();

  const editPermissionsButton = (
    <Button
      variant={"secondary"}
      onClick={() => setEditPermissionDialogOpen(true)}
    >
      Edit permissions
    </Button>
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
        <EditPermissionsDialog
          onClose={() => setEditPermissionDialogOpen(false)}
          open={true}
          confirmButtonState={"default"}
          onConfirm={() => setEditPermissionDialogOpen(false)}
          assignedPermissions={permissions?.map(p => p.code) ?? []}
        />
      )}
      <Box {...boxProps}>
        <Text variant={"heading"} marginBottom={4} as={"h2"}>
          {intl.formatMessage(messages.appPermissionsTitle)}
        </Text>
        <Box>{renderContent()}</Box>
      </Box>
    </>
  );
};
