import { AppPermissionsDialogPermissionPicker } from "@dashboard/apps/components/AppPermissionsDialog/AppPermissionsDialogPermissionPicker";
import { useAppPermissionsDialogState } from "@dashboard/apps/components/AppPermissionsDialog/AppPermissionsDialogState";
import { useGetAvailableAppPermissions } from "@dashboard/apps/components/AppPermissionsDialog/useGetAvailableAppPermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const AppPermissionsDialog: React.FC<{
  onClose: () => void;
  assignedPermissions: PermissionEnum[];
}> = ({ assignedPermissions, onClose }) => {
  const { availablePermissions, mapCodesToNames } =
    useGetAvailableAppPermissions();

  const {
    updateSelected,
    onConfirmSelection,
    state,
    onBackFromConfirmation,
    selectedPermissions,
  } = useAppPermissionsDialogState(assignedPermissions);

  const renderDialogContent = () => {
    switch (state.type) {
      case "pick-permissions":
        return (
          <AppPermissionsDialogPermissionPicker
            onClose={onClose}
            onChange={updateSelected}
            onSubmit={onConfirmSelection}
            allPermissions={availablePermissions}
            selected={selectedPermissions}
          />
        );
      case "confirm-permissions":
        return (
          <Box>
            <Text marginBottom={2} as={"p"}>
              You are going to
            </Text>
            {state.hasRemoved && (
              <Box marginBottom={4}>
                <Text variant={"bodyStrong"}>
                  Remove following permissions:
                </Text>
                {mapCodesToNames(state.removedPermissions).map(perm => (
                  <Text as={"p"} key={perm}>
                    {perm}
                  </Text>
                ))}
              </Box>
            )}
            {state.hasAdded && (
              <Box>
                <Text variant={"bodyStrong"}>Add following permissions:</Text>
                {mapCodesToNames(state.addedPermissions).map(perm => (
                  <Text as={"p"} key={perm}>
                    {perm}
                  </Text>
                ))}
              </Box>
            )}
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              gap={2}
              marginTop={6}
            >
              <Button
                variant={"tertiary"}
                onClick={() => {
                  onBackFromConfirmation();
                }}
              >
                Go back
              </Button>
              <Button>I know what I'm doing - confirm</Button>
            </Box>
          </Box>
        );
      case "saving":
        return <div>Loading</div>;
      case "error":
        return <div>error</div>;
    }
  };

  /**
   * TODO
   * - add mutation
   * - extract i18n
   * - extract and test
   */
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={"sm"}>
      <DialogTitle disableTypography>Edit permissions</DialogTitle>
      <DialogContent>
        <Text as={"p"}>Manually change permission for the app.</Text>
        <Box
          borderRadius={2}
          marginBottom={6}
          marginTop={4}
          padding={4}
          backgroundColor={"surfaceCriticalSubdued"}
        >
          <Text
            marginBottom={2}
            as={"p"}
            color={"textCriticalDefault"}
            variant={"bodyStrong"}
          >
            Warning
          </Text>
          <Text as={"p"}>
            Adding permission allows app to have more access to your data.
          </Text>
          <Text as={"p"}>Removing permissions may cause app to break.</Text>
        </Box>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};
