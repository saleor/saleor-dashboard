import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { DialogContentText } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

export interface AppDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
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

  const isNameMissing = name === null || name === "";
  const isExternal = type === "EXTERNAL";

  const getMainText = () => {
    if (isNameMissing && isExternal) {
      return intl.formatMessage(msgs.deleteApp);
    }
    if (isNameMissing) {
      return intl.formatMessage(msgs.deleteLocalApp);
    }
    if (isExternal) {
      return intl.formatMessage(msgs.deleteNamedApp, {
        name: <strong>{getStringOrPlaceholder(name)}</strong>,
      });
    }
    return intl.formatMessage(msgs.deleteLocalNamedApp, {
      name: <strong>{getStringOrPlaceholder(name)}</strong>,
    });
  };

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.deleteAppTitle)}
      variant="delete"
    >
      <DialogContentText
        data-test-id="dialog-content"
        style={{ marginTop: "-12px" }}
      >
        <Box
          backgroundColor="warning1"
          padding={2}
          borderRadius={2}
          marginBottom={4}
          borderWidth={1}
          borderColor="warning1"
          borderStyle="solid"
        >
          <Text typeSize={2}>{intl.formatMessage(msgs.deleteAppWarning)}</Text>
        </Box>
        {getMainText()} <FormattedMessage {...msgs.deleteAppQuestion} />
      </DialogContentText>
    </ActionDialog>
  );
};
AppDeleteDialog.displayName = "AppDeleteDialog";
export default AppDeleteDialog;
