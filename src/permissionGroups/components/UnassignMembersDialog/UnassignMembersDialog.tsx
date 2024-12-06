import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FormattedMessage, useIntl } from "react-intl";

export interface UnassignMembersDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  quantity: number;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const UnassignMembersDialog = ({
  confirmButtonState,
  quantity,
  onClose,
  onConfirm,
  open,
}: UnassignMembersDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        id: "lT5MYM",
        defaultMessage: "Unassign users",
        description: "dialog title",
      })}
      variant="delete"
    >
      <FormattedMessage
        data-test-id="unassign-members-dialog-text"
        id="XGBsoK"
        defaultMessage="Are you sure you want to unassign {counter,plural,one{this member} other{{displayQuantity} members}}?"
        description="dialog content"
        values={{
          counter: quantity,
          displayQuantity: <strong>{quantity}</strong>,
        }}
      />
    </ActionDialog>
  );
};

UnassignMembersDialog.displayName = "UnassignMembersDialog";
export default UnassignMembersDialog;
