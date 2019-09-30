import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export interface ServiceTokenDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
}

const ServiceTokenDeleteDialog: React.FC<ServiceTokenDeleteDialogProps> = ({
  name,
  confirmButtonState,
  onClose,
  onConfirm,
  open
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      confirmButtonState={confirmButtonState}
      onConfirm={onConfirm}
      variant="delete"
      title={intl.formatMessage({
        defaultMessage: "Delete Service Account",
        description: "dialog title"
      })}
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="Are you sure you want to delete token {token}?"
          description="delete token"
          values={{
            token: <strong>{name}</strong>
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};

ServiceTokenDeleteDialog.displayName = "ServiceTokenDeleteDialog";
export default ServiceTokenDeleteDialog;
