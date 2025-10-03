import { DashboardModal } from "@dashboard/components/Modal";
import { getCustomAppErrorMessage } from "@dashboard/extensions/utils";
import { useGetAvailableAppPermissions } from "@dashboard/extensions/views/EditManifestExtension/hooks/useGetAvailableAppPermissions";
import { PermissionEnum, useAppQuery, useAppUpdatePermissionsMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import { AppPermissionsDialogConfirmation } from "./AppPermissionsDialogConfirmation";
import { AppPermissionsDialogPermissionPicker } from "./AppPermissionsDialogPermissionPicker";
import { useAppPermissionsDialogState } from "./AppPermissionsDialogState";
import { AppPermissionsDialogMessages } from "./messages";

const messages = AppPermissionsDialogMessages.dialogRoot;

interface AppPermissionsDialogProps {
  onClose: () => void;
  assignedPermissions: PermissionEnum[];
  appId: string;
}

export const AppPermissionsDialog = ({
  assignedPermissions,
  onClose,
  appId,
}: AppPermissionsDialogProps) => {
  const { availablePermissions } = useGetAvailableAppPermissions();
  const intl = useIntl();
  const {
    updateSelected,
    onConfirmSelection,
    state,
    onBackFromConfirmation,
    selectedPermissions,
    onMutationError,
    onApprove,
  } = useAppPermissionsDialogState(assignedPermissions);
  const { refetch } = useAppQuery({
    variables: { id: appId, hasManagedAppsPermission: true },
    skip: true,
  });
  const notify = useNotifier();
  const [mutate] = useAppUpdatePermissionsMutation({
    onError(err) {
      onMutationError(err.message);
    },
    onCompleted(data) {
      if (data.appUpdate?.errors.length) {
        const error = data.appUpdate?.errors[0];

        onMutationError(
          getCustomAppErrorMessage(error, intl) ?? intl.formatMessage(messages.fallbackErrorText),
        );

        return;
      }

      refetch().then(onClose);
      notify({
        status: "success",
        title: intl.formatMessage(messages.successNotificationTitle),
        autohide: 1000,
        text: intl.formatMessage(messages.successNotificationBody),
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

      case "saving":
        return <Skeleton />;
      case "error":
        return (
          <Box padding={4}>
            <Text as={"p"} color="critical1">
              {state.error}
            </Text>
          </Box>
        );
    }
  };

  return (
    <DashboardModal open={true} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>{intl.formatMessage(messages.heading)}</DashboardModal.Header>
        <Box display={"grid"} gridAutoFlow={"row"}>
          <Text as={"p"}>{intl.formatMessage(messages.info)}</Text>
          <Box
            borderRadius={2}
            marginBottom={6}
            marginTop={4}
            padding={4}
            backgroundColor="critical1Focused"
          >
            <Text marginBottom={2} as={"p"} color="warning1" size={4} fontWeight="bold">
              {intl.formatMessage(messages.warningHeading)}
            </Text>
            <Text as={"p"}>{intl.formatMessage(messages.warningParagraph1)}</Text>
            <Text as={"p"}>{intl.formatMessage(messages.warningParagraph2)}</Text>
          </Box>
          {renderDialogContent()}
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
