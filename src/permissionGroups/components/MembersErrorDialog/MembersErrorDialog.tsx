import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FormattedMessage, useIntl } from "react-intl";

export interface MembersErrorDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const MembersErrorDialog = ({
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: MembersErrorDialogProps) => {
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
      variant="info"
    >
      <FormattedMessage
        id="H/o4Ex"
        defaultMessage="You are not able to modify this group members. Solve this problem to continue with request."
        description="dialog content"
      />
    </ActionDialog>
  );
};

MembersErrorDialog.displayName = "MembersErrorDialog";
export default MembersErrorDialog;
