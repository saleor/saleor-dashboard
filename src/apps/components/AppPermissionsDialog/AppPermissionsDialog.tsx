import { AppPermissionsDialogConfirmation } from "@dashboard/apps/components/AppPermissionsDialog/AppPermissionsDialogConfirmation";
import { AppPermissionsDialogPermissionPicker } from "@dashboard/apps/components/AppPermissionsDialog/AppPermissionsDialogPermissionPicker";
import { useAppPermissionsDialogState } from "@dashboard/apps/components/AppPermissionsDialog/AppPermissionsDialogState";
import { useGetAvailableAppPermissions } from "@dashboard/apps/components/AppPermissionsDialog/useGetAvailableAppPermissions";
import {
  PermissionEnum,
  useAppQuery,
  useAppUpdatePermissionsMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Box, Text } from "@saleor/macaw-ui/next";
import React, { useEffect } from "react";

export const AppPermissionsDialog: React.FC<{
  onClose: () => void;
  assignedPermissions: PermissionEnum[];
  appId: string;
}> = ({ assignedPermissions, onClose, appId }) => {
  const { availablePermissions } = useGetAvailableAppPermissions();

  const {
    updateSelected,
    onConfirmSelection,
    state,
    onBackFromConfirmation,
    selectedPermissions,
    onMutationError,
    onApprove,
  } = useAppPermissionsDialogState(assignedPermissions);

  const { refetch } = useAppQuery({ variables: { id: appId }, skip: true });

  const notify = useNotifier();

  const [mutate] = useAppUpdatePermissionsMutation({
    onError(err) {
      onMutationError(err.message);
    },
    onCompleted(data) {
      if (data.appUpdate?.errors.length) {
        // todo translate
        onMutationError(data.appUpdate?.errors[0].message ?? "Fail");

        return;
      }

      refetch().then(onClose);

      // todo translate
      notify({
        status: "success",
        title: "Success",
        autohide: 1000,
        text: "Updated app permissions",
      });
    },
  });

  useEffect(() => {
    if (state.type === "saving") {
      mutate({
        variables: {
          permissions: state.selected,
          id: appId,
        },
      });
    }
  }, [state.type, appId]);

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
          <AppPermissionsDialogConfirmation
            addedPermissions={state.addedPermissions}
            removedPermissions={state.removedPermissions}
            onApprove={onApprove}
            onBack={onBackFromConfirmation}
          />
        );

      // todo what loading should I use
      case "saving":
        return <Skeleton />;
      case "error":
        return (
          <Box padding={4}>
            <Text as={"p"} color={"textCriticalDefault"}>
              {state.error}
            </Text>
          </Box>
        );
    }
  };

  /**
   * TODO
   * - extract i18n
   * - extract and test
   */
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={"sm"}>
      <DialogTitle disableTypography>Edit permissions</DialogTitle>
      <DialogContent>
        <Box display={"grid"} gridAutoFlow={"row"}>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};
