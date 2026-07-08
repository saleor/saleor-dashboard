import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { PermissionGroupErrorCode, type PermissionGroupErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface PermissionDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  error?: PermissionGroupErrorFragment;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const PermissionGroupDeleteDialog = ({
  confirmButtonState,
  error,
  name,
  onClose,
  onConfirm,
  open,
}: PermissionDeleteDialogProps) => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";

  let errorMessage;

  if (error?.code === PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION) {
    errorMessage = intl.formatMessage({
      id: "O22NIZ",
      defaultMessage: "Cant's delete group which is out of your permission scope",
      description: "deletion error message",
    });
  } else if (error) {
    errorMessage = getPermissionGroupErrorMessage(error, intl);
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.ContextHeader>
          <FormattedMessage
            id="L6+p8a"
            defaultMessage="Delete permission group"
            description="dialog title"
          />
        </DashboardModal.ContextHeader>

        <DashboardModal.Body fill>
          <DashboardModal.Inset>
            <Box data-testid="permission-group-delete-dialog-text">
              <FormattedMessage
                id="sR0urA"
                defaultMessage="Are you sure you want to delete {name}?"
                description="dialog content"
                values={{
                  name: <strong>{name}</strong>,
                }}
              />
            </Box>
            {!!errorMessage && <Text color="critical1">{errorMessage}</Text>}
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

PermissionGroupDeleteDialog.displayName = "PermissionGroupDeleteDialog";
