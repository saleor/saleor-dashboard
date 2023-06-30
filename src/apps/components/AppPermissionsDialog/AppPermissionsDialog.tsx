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
  const permissions = useGetAvailableAppPermissions();

  const { updateSelected, onConfirmSelection, stateType, selectedPermissions } =
    useAppPermissionsDialogState(assignedPermissions);

  const renderDialogContent = () => {
    switch (stateType) {
      case "pick-permissions":
        return (
          <AppPermissionsDialogPermissionPicker
            onClose={onClose}
            onChange={updateSelected}
            onSubmit={onConfirmSelection}
            allPermissions={permissions}
            selected={selectedPermissions}
          />
        );
      case "confirm-permissions":
        return (
          <Box>
            <Text variant={"bodyStrong"}>You are going to:</Text>
            <Box>
              <Text>Remove following permissions:</Text>
              <Text>TODO</Text>
            </Box>
            <Box>
              <Text>Add following permissions:</Text>
              <Text>TODO</Text>
            </Box>
            <Box display={"flex"} justifyContent={"flex-end"} gap={2}>
              <Button variant={"tertiary"}>Go back</Button>
              <Button>Confirm</Button>
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
        <Text as={"p"} color={"textCriticalDefault"} marginBottom={6}>
          Be careful - App can break!
        </Text>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};
