import { getKnownAppViewUrl } from "@dashboard/extensions/knownApps";
import urlJoin from "url-join";

import { CUSTOMER_EMAILS_APP_IDENTIFIER } from "./constants";

const notificationsSettingsSection = "/notifications-settings";

export const notificationsSettingsPath = notificationsSettingsSection;
export const notificationsStaffEmailsPath = urlJoin(notificationsSettingsSection, "staff");
/** Legacy Configuration path — redirects to `notificationsCustomerEmailsAppPath`. */
export const notificationsCustomerEmailsPath = urlJoin(notificationsSettingsSection, "customer");
/** Official Dashboard URL: `/extensions/app/<manifest-identifier>`. */
export const notificationsCustomerEmailsAppPath = getKnownAppViewUrl(
  CUSTOMER_EMAILS_APP_IDENTIFIER,
);

export const notificationsSettingsUrl = (): string => notificationsSettingsPath;
