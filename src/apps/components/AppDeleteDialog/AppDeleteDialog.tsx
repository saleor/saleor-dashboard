import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  type
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Delete App",
        description: "dialog header"
      })}
      variant="delete"
    >
      <DialogContentText>
        {["", null].includes(name) ? (
          <FormattedMessage
            defaultMessage="Are you sure you want to delete this app?"
            description="delete app"
          />
        ) : type === "EXTERNAL" ? (
          <FormattedMessage
            defaultMessage="Deleting {name}, you will remove installation of the app. If you are paying for app subscription, remember to unsubscribe from the app in Saleor Marketplace. Are you sure you want to delete the app?"
            description="delete app"
            values={{
              name: <strong>{getStringOrPlaceholder(name)}</strong>
            }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="Deleting {name}, you will delete all the data and webhooks regarding this app. Are you sure you want to do that?"
            description="delete custom app"
            values={{
              name: <strong>{getStringOrPlaceholder(name)}</strong>
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
AppDeleteDialog.displayName = "AppDeleteDialog";
export default AppDeleteDialog;
