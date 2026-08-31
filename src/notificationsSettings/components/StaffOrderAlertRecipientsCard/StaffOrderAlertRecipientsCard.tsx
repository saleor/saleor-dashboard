import { Callout } from "@dashboard/components/Callout/Callout";
import DeletableItem from "@dashboard/components/DeletableItem/DeletableItem";
import { Placeholder } from "@dashboard/components/Placeholder/Placeholder";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { UserAvatar } from "@dashboard/components/UserAvatar/UserAvatar";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { getUserInitials } from "@dashboard/misc";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import { rippleStaffOrderAlertRecipients } from "@dashboard/notificationsSettings/ripples/staffOrderAlertRecipients";
import {
  recipientDisplayName,
  type StaffOrderAlertRecipient,
} from "@dashboard/notificationsSettings/utils/staffOrderAlertRecipients";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Bell } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import styles from "./StaffOrderAlertRecipientsCard.module.css";

interface StaffOrderAlertRecipientsCardProps {
  recipients: StaffOrderAlertRecipient[];
  loading: boolean;
  disabled: boolean;
  canManageStaff: boolean;
  staffEmailsEnabled: boolean | null;
  onAssign: () => void;
  onRemove: (id: string) => void;
}

const recipientHint = (recipient: StaffOrderAlertRecipient): ReactNode | null => {
  if (recipient.userId === null) {
    return <FormattedMessage {...notificationsMessages.orderAlertsUnlinkedHint} />;
  }

  if (recipient.isStaffActive === false) {
    return <FormattedMessage {...notificationsMessages.orderAlertsInactiveHint} />;
  }

  if (!recipient.active) {
    return <FormattedMessage {...notificationsMessages.orderAlertsMutedHint} />;
  }

  return null;
};

export const StaffOrderAlertRecipientsCard = ({
  recipients,
  loading,
  disabled,
  canManageStaff,
  staffEmailsEnabled,
  onAssign,
  onRemove,
}: StaffOrderAlertRecipientsCardProps): JSX.Element => {
  const intl = useIntl();
  const hasRecipients = recipients.length > 0;
  const assignButton = canManageStaff ? (
    <Button
      variant="secondary"
      size="small"
      type="button"
      disabled={disabled}
      onClick={onAssign}
      data-test-id="assign-order-alert-recipients"
    >
      <FormattedMessage {...notificationsMessages.orderAlertsAssign} />
    </Button>
  ) : null;

  return (
    <SettingsSection
      id={settingsHashes.notificationsOrderAlerts}
      title={intl.formatMessage(notificationsMessages.orderAlertsTitle)}
      description={intl.formatMessage(notificationsMessages.orderAlertsDescription)}
      ownership="shop"
      data-test-id="staff-order-alert-recipients-card"
      headerEnd={
        assignButton ? (
          <Box className={styles.headerEnd}>
            {assignButton}
            <Box className={styles.ripple}>
              <Ripple model={rippleStaffOrderAlertRecipients} />
            </Box>
          </Box>
        ) : (
          <Ripple model={rippleStaffOrderAlertRecipients} />
        )
      }
    >
      <Box className={styles.section}>
        {staffEmailsEnabled === false ? (
          <Box className={styles.warning}>
            <Callout
              type="warning"
              title={intl.formatMessage(notificationsMessages.orderAlertsEmailsDisabled)}
              data-test-id="staff-order-alerts-emails-disabled"
            />
          </Box>
        ) : null}

        {loading ? (
          <Box className={styles.skeletonList} aria-busy="true">
            <Skeleton __width="40%" __height="1rem" />
            <Skeleton __width="55%" __height="1rem" />
            <Skeleton __width="45%" __height="1rem" />
          </Box>
        ) : null}

        {!loading && !hasRecipients ? (
          <Box className={styles.empty}>
            <Placeholder icon={<Bell size={20} />}>
              {intl.formatMessage(notificationsMessages.orderAlertsEmptyTitle)}.{" "}
              {intl.formatMessage(notificationsMessages.orderAlertsEmptyDescription)}
              {!canManageStaff
                ? ` ${intl.formatMessage(notificationsMessages.orderAlertsAssignNeedsStaff)}`
                : ""}
            </Placeholder>
          </Box>
        ) : null}

        {!loading && hasRecipients ? (
          <>
            <Box as="ul" className={styles.list}>
              {recipients.map(recipient => (
                <RecipientRow
                  key={recipient.id}
                  recipient={recipient}
                  disabled={disabled}
                  onRemove={onRemove}
                />
              ))}
            </Box>
            {!canManageStaff ? (
              <Box className={styles.warning}>
                <Text size={2} color="default2">
                  <FormattedMessage {...notificationsMessages.orderAlertsAssignNeedsStaff} />
                </Text>
              </Box>
            ) : null}
          </>
        ) : null}
      </Box>
    </SettingsSection>
  );
};

interface RecipientRowProps {
  recipient: StaffOrderAlertRecipient;
  disabled: boolean;
  onRemove: (id: string) => void;
}

const RecipientRow = ({ recipient, disabled, onRemove }: RecipientRowProps): JSX.Element => {
  const name = recipientDisplayName(recipient);
  const hint = recipientHint(recipient);
  const href = recipient.userId ? staffMemberDetailsUrl(recipient.userId) : undefined;

  return (
    <Box as="li" className={styles.row} data-test-id="staff-order-alert-recipient-row">
      <UserAvatar
        size="small"
        initials={getUserInitials({
          email: recipient.email,
          firstName: recipient.firstName ?? "",
          lastName: recipient.lastName ?? "",
        })}
      />
      <Box className={styles.rowName}>
        {href ? (
          <Link to={href} className={styles.rowNameLink}>
            <Text size={3} fontWeight="medium">
              {name}
            </Text>
          </Link>
        ) : (
          <Text size={3} fontWeight="medium">
            {name}
          </Text>
        )}
        {name !== recipient.email ? (
          <Text size={2} color="default2">
            {recipient.email}
          </Text>
        ) : null}
        {hint ? (
          <Text size={2} color="default2">
            {hint}
          </Text>
        ) : null}
      </Box>
      <Box
        className={styles.rowDelete}
        data-test-id={`remove-order-alert-recipient-${recipient.id}`}
      >
        <DeletableItem id={recipient.id} onDelete={onRemove} disabled={disabled} />
      </Box>
    </Box>
  );
};
