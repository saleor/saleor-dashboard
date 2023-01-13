import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

export interface AppDeactivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  thirdParty?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AppDeactivateDialog: React.FC<AppDeactivateDialogProps> = ({
  confirmButtonState,
  open,
  name,
  thirdParty = true,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

  const missingName = name === null || name === "";

  const getMainText = () => {
    if (missingName) {
      return intl.formatMessage(msgs.deactivateApp);
    }
    return intl.formatMessage(msgs.deactivateNamedApp, {
      name: <strong>{getStringOrPlaceholder(name)}</strong>,
    });
  };

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage(buttonMessages.deactivate)}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.deactivateAppTitle)}
      variant="delete"
    >
      <DialogContentText data-test-id="dialog-content">
        {getMainText()}
        {thirdParty && (
          <>
            {" "}
            <FormattedMessage {...msgs.deactivateAppBillingInfo} />
          </>
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
AppDeactivateDialog.displayName = "AppDeactivateDialog";
export default AppDeactivateDialog;
