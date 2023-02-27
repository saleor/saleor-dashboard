import { DialogContentText } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "../ActionDialog";

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
  tabName,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onSubmit}
      title={intl.formatMessage({
        id: "7NfoiJ",
        defaultMessage: "Delete Search",
        description: "custom search delete, dialog header",
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          id="UaYJJ8"
          defaultMessage="Are you sure you want to delete {name} search tab?"
          values={{
            name: <strong>{tabName}</strong>,
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
DeleteFilterTabDialog.displayName = "DeleteFilterTabDialog";
export default DeleteFilterTabDialog;
