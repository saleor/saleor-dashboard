import { TopNavDestinationIcon } from "@dashboard/components/AppLayout/TopNav/destinationIcons";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsLinkCard } from "@dashboard/components/Settings/SettingsLinkCard";
import { SettingsLinkRow } from "@dashboard/components/Settings/SettingsLinkRow";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { DeprecatedExtensionBadge } from "@dashboard/extensions/views/InstalledExtensions/components/DeprecatedExtensionBadge/DeprecatedExtensionBadge";
import { sectionNames } from "@dashboard/intl";
import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  SMTP_APP_IDENTIFIER,
} from "@dashboard/notificationsSettings/constants";
import { useLegacySmtpAppHref } from "@dashboard/notificationsSettings/hooks/useLegacySmtpAppHref";
import {
  notificationsCustomerEmailsAppPath,
  notificationsStaffEmailsPath,
} from "@dashboard/notificationsSettings/urls";
import { FormattedMessage, useIntl } from "react-intl";

import { notificationsMessages } from "../../messages";
import { OfficialAppAvatar } from "../OfficialAppAvatar/OfficialAppAvatar";

export const NotificationsHubPage = (): React.ReactNode => {
  const intl = useIntl();
  const legacySmtpHref = useLegacySmtpAppHref();

  return (
    <SettingsHubLayout
      title={intl.formatMessage(notificationsMessages.hubTitle)}
      backHref={configurationMenuUrl}
      backHrefIcon={<TopNavDestinationIcon.configuration />}
      backHrefTitle={intl.formatMessage(sectionNames.configuration)}
    >
      <SettingsPageContent
        description={<FormattedMessage {...notificationsMessages.hubDescription} />}
      >
        <SettingsLinkCard
          id={settingsHashes.notificationsStaff}
          data-test-id="notifications-staff-link"
          title={intl.formatMessage(notificationsMessages.staffEmailsTitle)}
          description={intl.formatMessage(notificationsMessages.staffEmailsDescription)}
          to={notificationsStaffEmailsPath}
          ownership="shop"
        />
        {legacySmtpHref ? (
          <SettingsSection
            id={settingsHashes.notificationsCustomer}
            data-test-id="notifications-customer-emails"
            title={intl.formatMessage(notificationsMessages.customerEmailsTitle)}
            description={intl.formatMessage(notificationsMessages.customerEmailsSmtpDescription)}
            ownership="channel"
          >
            <SettingsLinkRow
              data-test-id="notifications-customer-smtp-link"
              title={intl.formatMessage(notificationsMessages.customerEmailsEntryTitle)}
              description={intl.formatMessage(notificationsMessages.customerEmailsEntryDescription)}
              to={notificationsCustomerEmailsAppPath}
              icon={<OfficialAppAvatar identifier={CUSTOMER_EMAILS_APP_IDENTIFIER} />}
            />
            <SettingsLinkRow
              data-test-id="notifications-legacy-smtp-link"
              title={intl.formatMessage(notificationsMessages.legacySmtpTitle)}
              description={intl.formatMessage(notificationsMessages.legacySmtpDescription)}
              to={legacySmtpHref}
              icon={<OfficialAppAvatar identifier={SMTP_APP_IDENTIFIER} />}
              badge={<DeprecatedExtensionBadge />}
            />
          </SettingsSection>
        ) : (
          <SettingsLinkCard
            id={settingsHashes.notificationsCustomer}
            data-test-id="notifications-customer-smtp-link"
            title={intl.formatMessage(notificationsMessages.customerEmailsTitle)}
            description={intl.formatMessage(notificationsMessages.customerEmailsEntryDescription)}
            to={notificationsCustomerEmailsAppPath}
            ownership="channel"
            icon={<OfficialAppAvatar identifier={CUSTOMER_EMAILS_APP_IDENTIFIER} />}
          />
        )}
      </SettingsPageContent>
    </SettingsHubLayout>
  );
};
