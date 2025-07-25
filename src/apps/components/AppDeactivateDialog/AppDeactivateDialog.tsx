import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

/** @deprecated use component from extensions/ */
export interface AppDeactivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  thirdParty?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** @deprecated use component from extensions/ */
const AppDeactivateDialog: React.FC<AppDeactivateDialogProps> = ({
  confirmButtonState,
  open,
  name,
  thirdParty = true,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();
  const isNameMissing = name === null || name === "";
  const getMainText = () => {
    if (isNameMissing) {
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
      <Box data-test-id="dialog-content">
        {getMainText()}
        {thirdParty && (
          <>
            {" "}
            <FormattedMessage {...msgs.deactivateAppBillingInfo} />
          </>
        )}
      </Box>
    </ActionDialog>
  );
};

AppDeactivateDialog.displayName = "AppDeactivateDialog";
export default AppDeactivateDialog;
