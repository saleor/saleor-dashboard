import { buttonMessages } from "@dashboard/intl";
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
      backButtonText={intl.formatMessage(buttonMessages.cancel)}
      onClose={onClose}
      onConfirm={onSubmit}
      title={intl.formatMessage({
        id: "xy66ru",
        defaultMessage: "Delete preset",
        description: "custom preset delete, dialog header",
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          id="U5CH0u"
          defaultMessage="Are you sure you want to delete {name} preset?"
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
