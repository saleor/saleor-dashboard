import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { FormattedMessage, useIntl } from "react-intl";

export interface DeleteShippingRateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => void;
  handleConfirm: () => void;
}

export const DeleteShippingRateDialog = ({
  confirmButtonState,
  onClose,
  handleConfirm,
  name,
  open,
}: DeleteShippingRateDialogProps) => {
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
