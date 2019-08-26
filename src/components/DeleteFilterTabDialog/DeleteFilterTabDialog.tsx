import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "../ActionDialog";
import { ConfirmButtonTransitionState } from "../ConfirmButton";

export interface DeleteFilterTabDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  tabName: string;
  onClose: () => void;
  onSubmit: () => void;
}

const DeleteFilterTabDialog: React.FC<DeleteFilterTabDialogProps> = ({
  confirmButtonState,
  onClose,
  onSubmit,
  open,
  tabName
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onSubmit}
      title={intl.formatMessage({
        defaultMessage: "Delete Search",
        description: "custom search delete, dialog header"
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="Are you sure you want to delete {name} search tab?"
          values={{
            name: <strong>{tabName}</strong>
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
DeleteFilterTabDialog.displayName = "DeleteFilterTabDialog";
export default DeleteFilterTabDialog;
