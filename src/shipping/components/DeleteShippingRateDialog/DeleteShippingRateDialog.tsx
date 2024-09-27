import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { getStringOrPlaceholder } from "@dashboard/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface DeleteShippingRateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => void;
  handleConfirm: () => void;
}

const DeleteShippingRateDialog: React.FC<DeleteShippingRateDialogProps> = ({
  confirmButtonState,
  onClose,
  handleConfirm,
  name,
  open,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={handleConfirm}
      open={open}
      title={intl.formatMessage({
        id: "nNeWAx",
        defaultMessage: "Delete Shipping Method",
        description: "dialog header",
      })}
      variant="delete"
    >
      <FormattedMessage
        id="yOaNWB"
        defaultMessage="Are you sure you want to delete {name}?"
        description="delete shipping method"
        values={{
          name: getStringOrPlaceholder(name),
        }}
      />
    </ActionDialog>
  );
};

export default DeleteShippingRateDialog;
