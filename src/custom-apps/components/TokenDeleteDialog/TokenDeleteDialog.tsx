import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FormattedMessage, useIntl } from "react-intl";

export interface TokenDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
}

const TokenDeleteDialog = ({
  name,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: TokenDeleteDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      confirmButtonState={confirmButtonState}
      onConfirm={onConfirm}
      variant="delete"
      title={intl.formatMessage({
        id: "quV5zH",
        defaultMessage: "Delete Token",
        description: "dialog title",
      })}
    >
      <FormattedMessage
        id="2VSP8C"
        defaultMessage="Are you sure you want to delete token {token}?"
        description="delete token"
        values={{
          token: <strong>{name}</strong>,
        }}
      />
    </ActionDialog>
  );
};

TokenDeleteDialog.displayName = "TokenDeleteDialog";
export default TokenDeleteDialog;
