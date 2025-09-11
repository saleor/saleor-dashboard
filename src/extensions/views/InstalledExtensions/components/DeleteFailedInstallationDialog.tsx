import ActionDialog from "@dashboard/components/ActionDialog";
import { messages } from "@dashboard/extensions/messages";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui/dist/types/ConfirmButton";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface DeleteFailedInstallationDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  name?: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteFailedInstallationDialog = ({
  confirmButtonState,
  onConfirm,
  open,
  name,
  onClose,
}: DeleteFailedInstallationDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(messages.deleteFailedInstallation)}
      variant="delete"
    >
      <Box data-test-id="dialog-content">
        <FormattedMessage
          {...messages.deleteFailedInstallationContent}
          values={{
            name: name ? <strong>{name}</strong> : "",
          }}
        />
      </Box>
    </ActionDialog>
  );
};
