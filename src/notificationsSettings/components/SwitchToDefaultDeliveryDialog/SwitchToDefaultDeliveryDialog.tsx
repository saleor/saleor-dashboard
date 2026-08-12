import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { Callout } from "@dashboard/components/Callout/Callout";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Download } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./SwitchToDefaultDeliveryDialog.module.css";

interface SwitchToDefaultDeliveryDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  /** When true (Cloud), saving Default also resets subjects/bodies — show those bullets. */
  resetNotificationCopy: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDownloadBackup: () => void;
}

export const SwitchToDefaultDeliveryDialog = ({
  open,
  confirmButtonState,
  resetNotificationCopy,
  onClose,
  onConfirm,
  onDownloadBackup,
}: SwitchToDefaultDeliveryDialogProps): JSX.Element => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmButtonState={confirmButtonState}
      title={intl.formatMessage(notificationsMessages.switchToDefaultTitle)}
      confirmButtonLabel={intl.formatMessage(notificationsMessages.switchToDefaultConfirm)}
      backButtonText={intl.formatMessage(buttonMessages.cancel)}
      variant="delete"
      size="sm"
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Text size={3}>
          <FormattedMessage {...notificationsMessages.switchToDefaultIntro} />
        </Text>
        <Callout
          type="warning"
          title={intl.formatMessage(notificationsMessages.switchToDefaultWarningTitle)}
          data-test-id="switch-to-default-warning"
        >
          <Box as="ul" className={styles.bulletList}>
            <Box as="li">
              <FormattedMessage {...notificationsMessages.switchToDefaultLoseSmtp} />
            </Box>
            {resetNotificationCopy ? (
              <>
                <Box as="li">
                  <FormattedMessage {...notificationsMessages.switchToDefaultLoseSubjects} />
                </Box>
                <Box as="li">
                  <FormattedMessage {...notificationsMessages.switchToDefaultLoseBodies} />
                </Box>
                <Box as="li">
                  <FormattedMessage {...notificationsMessages.switchToDefaultLoseOff} />
                </Box>
              </>
            ) : null}
          </Box>
        </Callout>
        {resetNotificationCopy ? (
          <Callout
            type="info"
            title={intl.formatMessage(notificationsMessages.switchToDefaultDownloadTitle)}
            data-test-id="switch-to-default-download"
          >
            <Box className={styles.downloadBody}>
              <Text size={3} color="default2">
                <FormattedMessage {...notificationsMessages.switchToDefaultDownloadHint} />
              </Text>
              <Button
                type="button"
                variant="secondary"
                onClick={onDownloadBackup}
                data-test-id="download-staff-email-templates"
              >
                <Download size={16} />
                <FormattedMessage {...notificationsMessages.switchToDefaultDownload} />
              </Button>
            </Box>
          </Callout>
        ) : null}
      </Box>
    </ActionDialog>
  );
};
