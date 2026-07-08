import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

interface AppDeactivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  thirdParty?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AppDeactivateDialog = ({
  confirmButtonState,
  open,
  name,
  thirdParty = true,
  onClose,
  onConfirm,
}: AppDeactivateDialogProps) => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";
  const isNameMissing = name === null || name?.trim() === "";
  const getMainText = () => {
    if (isNameMissing) {
      return intl.formatMessage(msgs.deactivateApp);
    }

    return intl.formatMessage(msgs.deactivateNamedApp, {
      name: <strong>{getStringOrPlaceholder(name)}</strong>,
    });
  };

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <Box data-test-id="dialog-content">
              {getMainText()}
              {thirdParty && (
                <>
                  {" "}
                  <FormattedMessage {...msgs.deactivateAppBillingInfo} />
                </>
              )}
            </Box>
          }
        >
          <FormattedMessage {...msgs.deactivateAppTitle} />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.deactivate} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AppDeactivateDialog.displayName = "AppDeactivateDialog";
