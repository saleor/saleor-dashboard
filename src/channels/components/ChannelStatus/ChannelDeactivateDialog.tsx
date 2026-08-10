import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./dialogMessages";

interface ChannelDeactivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  channelName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ChannelDeactivateDialog = ({
  confirmButtonState,
  open,
  channelName,
  onClose,
  onConfirm,
}: ChannelDeactivateDialogProps): ReactNode => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";

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
              <FormattedMessage
                {...messages.deactivateDescription}
                values={{ name: <strong>{channelName}</strong> }}
              />
            </Box>
          }
        >
          <FormattedMessage {...messages.deactivateTitle} />
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
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
