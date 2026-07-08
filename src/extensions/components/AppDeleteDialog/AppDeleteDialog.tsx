import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

interface AppDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  onClose: () => void;
  onConfirm: () => void;
  type: "CUSTOM" | "EXTERNAL";
}

export const AppDeleteDialog = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
  type,
}: AppDeleteDialogProps) => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";
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

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.ContextHeader>
          <FormattedMessage {...msgs.deleteAppTitle} />
        </DashboardModal.ContextHeader>

        <DashboardModal.Body fill>
          <DashboardModal.Inset>
            <Box data-test-id="dialog-content">
              <Box
                backgroundColor="warning1"
                padding={2}
                borderRadius={2}
                marginBottom={4}
                borderWidth={1}
                borderColor="warning1"
                borderStyle="solid"
              >
                <Text size={2} color="warning1">
                  {intl.formatMessage(msgs.deleteAppWarning)}
                </Text>
              </Box>
              {getMainText()} <FormattedMessage {...msgs.deleteAppQuestion} />
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AppDeleteDialog.displayName = "AppDeleteDialog";
