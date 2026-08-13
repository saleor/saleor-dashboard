import urlJoin from "url-join";

const notificationsSettingsSection = "/notifications-settings";

export const notificationsSettingsPath = notificationsSettingsSection;
export const notificationsStaffEmailsPath = urlJoin(notificationsSettingsSection, "staff");
export const notificationsCustomerEmailsPath = urlJoin(notificationsSettingsSection, "customer");

export const notificationsSettingsUrl = (): string => notificationsSettingsPath;

export const notificationsStaffEmailsUrl = (): string => notificationsStaffEmailsPath;

export const notificationsCustomerEmailsUrl = (): string => notificationsCustomerEmailsPath;
