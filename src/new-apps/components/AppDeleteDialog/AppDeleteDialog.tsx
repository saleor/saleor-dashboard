import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

export interface AppDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  type: "CUSTOM" | "EXTERNAL";
}

const AppDeleteDialog: React.FC<AppDeleteDialogProps> = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
  type,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.deleteAppTitle)}
      variant="delete"
    >
      <DialogContentText>
        {["", null].includes(name) ? (
          <FormattedMessage {...msgs.deleteApp} />
        ) : type === "EXTERNAL" ? (
          <FormattedMessage
            {...msgs.deleteNamedApp}
            values={{
              name: <strong>{getStringOrPlaceholder(name)}</strong>,
            }}
          />
        ) : (
          <FormattedMessage
            {...msgs.deleteLocalNamedApp}
            values={{
              name: <strong>{getStringOrPlaceholder(name)}</strong>,
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
AppDeleteDialog.displayName = "AppDeleteDialog";
export default AppDeleteDialog;
