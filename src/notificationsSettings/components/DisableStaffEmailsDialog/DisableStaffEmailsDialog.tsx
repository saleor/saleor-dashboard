import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { Callout } from "@dashboard/components/Callout/Callout";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./DisableStaffEmailsDialog.module.css";

interface DisableStaffEmailsDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
}

export const DisableStaffEmailsDialog = ({
  open,
  confirmButtonState,
  onClose,
  onConfirm,
}: DisableStaffEmailsDialogProps): JSX.Element => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmButtonState={confirmButtonState}
      title={intl.formatMessage(notificationsMessages.disableEmailsTitle)}
      confirmButtonLabel={intl.formatMessage(notificationsMessages.disableEmailsConfirm)}
      backButtonText={intl.formatMessage(buttonMessages.cancel)}
      variant="delete"
      size="sm"
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Text size={3}>
          <FormattedMessage {...notificationsMessages.disableEmailsIntro} />
        </Text>
        <Callout
          type="warning"
          title={intl.formatMessage(notificationsMessages.disableEmailsWarningTitle)}
          data-test-id="disable-staff-emails-warning"
        >
          <Box as="ul" className={styles.bulletList}>
            <Box as="li">
              <FormattedMessage {...notificationsMessages.disableEmailsLoseInvites} />
            </Box>
            <Box as="li">
              <FormattedMessage {...notificationsMessages.disableEmailsLoseAlerts} />
            </Box>
            <Box as="li">
              <FormattedMessage {...notificationsMessages.disableEmailsCanReenable} />
            </Box>
          </Box>
        </Callout>
      </Box>
    </ActionDialog>
  );
};
