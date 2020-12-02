import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface UnassignDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  idsLength: number;
  closeModal: () => void;
  onConfirm: () => void;
}

export const UnassignDialog: React.FC<UnassignDialogProps> = ({
  closeModal,
  confirmButtonState,
  idsLength,
  onConfirm,
  open
}) => {
  const intl = useIntl();
  return (
    <ActionDialog
      open={open}
      title={intl.formatMessage({
        defaultMessage: "Unassign Products From Shipping",
        description: "dialog header"
      })}
      confirmButtonState={confirmButtonState}
      onClose={closeModal}
      onConfirm={onConfirm}
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
          description="dialog content"
          values={{
            counter: idsLength,
            displayQuantity: <strong>{idsLength}</strong>
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};

export default UnassignDialog;
