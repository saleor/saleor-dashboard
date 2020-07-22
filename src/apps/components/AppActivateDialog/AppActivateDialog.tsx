import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  onConfirm
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage({
        defaultMessage: "Activate",
        description: "button label"
      })}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Activate App",
        description: "dialog header"
      })}
      variant="default"
    >
      <DialogContentText>
        {["", null].includes(name) ? (
          <FormattedMessage
            defaultMessage="Are you sure you want to activate this app? Activating will start gathering events"
            description="activate app"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Are you sure you want to activate {name}? Activating will start gathering events."
            description="activate app"
            values={{
              name: <strong>{getStringOrPlaceholder(name)}</strong>
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
AppActivateDialog.displayName = "AppActivateDialog";
export default AppActivateDialog;
