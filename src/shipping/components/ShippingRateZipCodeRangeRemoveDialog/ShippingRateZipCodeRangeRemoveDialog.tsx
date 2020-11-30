import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { DialogProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingRateZipCodeRangeRemoveDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onConfirm: () => void;
}

const ShippingRateZipCodeRangeRemoveDialog: React.FC<ShippingRateZipCodeRangeRemoveDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onConfirm
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Remove ZIP-codes from Shipping Rate",
        description: "header"
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage defaultMessage="Are you sure you want to remove this ZIP-code rule?" />
      </DialogContentText>
    </ActionDialog>
  );
};

ShippingRateZipCodeRangeRemoveDialog.displayName =
  "ShippingRateZipCodeRangeRemoveDialog";
export default ShippingRateZipCodeRangeRemoveDialog;
