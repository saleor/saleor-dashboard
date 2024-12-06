import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface UnassignDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  idsLength: number;
  closeModal: () => void;
  onConfirm: () => void;
}

export const UnassignDialog = ({
  closeModal,
  confirmButtonState,
  idsLength,
  onConfirm,
  open,
}: UnassignDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      title={intl.formatMessage({
        id: "Gfbp36",
        defaultMessage: "Unassign Products From Shipping",
        description: "dialog header",
      })}
      confirmButtonState={confirmButtonState}
      onClose={closeModal}
      onConfirm={onConfirm}
      confirmButtonLabel={intl.formatMessage({
        id: "p/Fd7s",
        defaultMessage: "Unassign and save",
        description: "unassign products from shipping rate and save, button",
      })}
    >
      <FormattedMessage
        id="AHK0K9"
        defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
        description="dialog content"
        values={{
          counter: idsLength,
          displayQuantity: <strong>{idsLength}</strong>,
        }}
      />
    </ActionDialog>
  );
};

export default UnassignDialog;
