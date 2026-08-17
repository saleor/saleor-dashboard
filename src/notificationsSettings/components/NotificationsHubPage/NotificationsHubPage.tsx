import { TopNavDestinationIcon } from "@dashboard/components/AppLayout/TopNav/destinationIcons";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsLinkCard } from "@dashboard/components/Settings/SettingsLinkCard";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { sectionNames } from "@dashboard/intl";
import {
  notificationsCustomerEmailsPath,
  notificationsStaffEmailsPath,
} from "@dashboard/notificationsSettings/urls";
import { FormattedMessage, useIntl } from "react-intl";

import { notificationsMessages } from "../../messages";

export const NotificationsHubPage = (): JSX.Element => {
  const intl = useIntl();

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
        <SettingsLinkCard
          id={settingsHashes.notificationsCustomer}
          data-test-id="notifications-customer-smtp-link"
          title={intl.formatMessage(notificationsMessages.customerEmailsTitle)}
          description={intl.formatMessage(notificationsMessages.customerEmailsSmtpDescription)}
          to={notificationsCustomerEmailsPath}
          ownership="channel"
        />
      </SettingsPageContent>
    </SettingsHubLayout>
  );
};
