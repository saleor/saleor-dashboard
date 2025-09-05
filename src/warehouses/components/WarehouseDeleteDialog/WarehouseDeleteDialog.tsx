import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FormattedMessage, useIntl } from "react-intl";

export interface WarehouseDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
}

const WarehouseDeleteDialog = ({
  name,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: WarehouseDeleteDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      confirmButtonState={confirmButtonState}
      onConfirm={onConfirm}
      variant="delete"
      title={intl.formatMessage({
        id: "ny4zrH",
        defaultMessage: "Delete Warehouse",
        description: "dialog title",
      })}
    >
      <FormattedMessage
        id="DTL7sE"
        defaultMessage="Are you sure you want to delete {warehouseName}?"
        description="dialog content"
        values={{
          warehouseName: <strong>{name}</strong>,
        }}
      />
    </ActionDialog>
  );
};

WarehouseDeleteDialog.displayName = "WarehouseDeleteDialog";
export default WarehouseDeleteDialog;
