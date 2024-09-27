import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface WebhookDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const WebhookDeleteDialog: React.FC<WebhookDeleteDialogProps> = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        id: "X90ElB",
        defaultMessage: "Delete Webhook",
        description: "dialog header",
      })}
      variant="delete"
    >
      {!name ? (
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
      )}
    </ActionDialog>
  );
};

WebhookDeleteDialog.displayName = "WebhookDeleteDialog";
export default WebhookDeleteDialog;
