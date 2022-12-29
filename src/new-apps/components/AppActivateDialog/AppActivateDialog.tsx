import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

export interface AppActivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AppActivateDialog: React.FC<AppActivateDialogProps> = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

  const missingName = ["", null].includes(name);

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage(buttonMessages.activate)}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.activateAppTitle)}
      variant="default"
    >
      <DialogContentText data-test-id="dialog-content">
        {missingName ? (
          <FormattedMessage {...msgs.activateApp} />
        ) : (
          <FormattedMessage
            {...msgs.activateNamedApp}
            values={{
              name: <strong>{getStringOrPlaceholder(name)}</strong>,
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
AppActivateDialog.displayName = "AppActivateDialog";
export default AppActivateDialog;
