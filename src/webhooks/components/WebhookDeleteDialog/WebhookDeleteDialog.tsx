import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface WebhookDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
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
      <DialogContentText>
        {["", null].includes(name) ? (
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
              name: <strong>{getStringOrPlaceholder(name)}</strong>,
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
WebhookDeleteDialog.displayName = "WebhookDeleteDialog";
export default WebhookDeleteDialog;
