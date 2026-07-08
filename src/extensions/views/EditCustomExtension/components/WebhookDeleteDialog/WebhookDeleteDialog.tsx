import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface WebhookDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const WebhookDeleteDialog = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}: WebhookDeleteDialogProps) => {
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            !name ? (
              <FormattedMessage
                id="hS+ZjH"
                defaultMessage="Are you sure you want to delete this webhook?"
                description="delete webhook"
              />
            ) : (
              <FormattedMessage
                id="o5KXAN"
                defaultMessage="Are you sure you want to delete {name}?"
                description="delete webhook"
                values={{
                  name: <strong>{name}</strong>,
                }}
              />
            )
          }
        >
          <FormattedMessage
            id="X90ElB"
            defaultMessage="Delete Webhook"
            description="dialog header"
          />
        </DashboardModal.Header>

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

WebhookDeleteDialog.displayName = "WebhookDeleteDialog";
