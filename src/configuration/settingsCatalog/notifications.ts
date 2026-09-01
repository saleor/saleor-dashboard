import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import {
  notificationsCustomerEmailsPath,
  notificationsSettingsPath,
  notificationsStaffEmailsPath,
} from "@dashboard/notificationsSettings/urls";
import { defineMessages } from "react-intl";

import { settingsHashes, settingsHref } from "./hashes";
import { type SettingsCatalogEntry } from "./types";

const keywords = defineMessages({
  staffEmails: {
    id: "A0WxFL",
    defaultMessage: "staff emails invites password smtp recipients order alerts",
    description: "settings search alias",
  },
  customerEmails: {
    id: "o0ZEIX",
    defaultMessage: "customer emails order confirmation smtp",
    description: "settings search alias",
  },
  orderAlerts: {
    id: "ehuvEV",
    defaultMessage: "staffNotificationRecipients recipients order alerts who gets notified",
    description: "settings search alias",
  },
});

const hubBreadcrumb = [sectionNames.notifications];

export const notificationsCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "notifications.hub",
    kind: "hub",
    title: sectionNames.notifications,
    description: notificationsMessages.hubDescription,
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(notificationsSettingsPath),
    permissions: [PermissionEnum.MANAGE_PLUGINS],
    ownership: "shop",
    keywords: [keywords.staffEmails, keywords.customerEmails],
  },
  {
    id: "notifications.staff",
    kind: "setting",
    title: notificationsMessages.staffEmailsTitle,
    description: notificationsMessages.staffEmailsDescription,
    breadcrumbs: [...hubBreadcrumb, notificationsMessages.staffEmailsTitle],
    href: settingsHref(notificationsStaffEmailsPath),
    permissions: [PermissionEnum.MANAGE_PLUGINS],
    ownership: "shop",
    keywords: [keywords.staffEmails],
  },
  {
    id: "notifications.staffDelivery",
    kind: "setting",
    title: notificationsMessages.staffDeliveryTitle,
    description: notificationsMessages.staffDeliveryDescriptionPlain,
    breadcrumbs: [...hubBreadcrumb, notificationsMessages.staffDeliveryTitle],
    href: settingsHref(notificationsStaffEmailsPath, settingsHashes.notificationsDelivery),
    hash: settingsHashes.notificationsDelivery,
    permissions: [PermissionEnum.MANAGE_PLUGINS],
    ownership: "shop",
    keywords: [keywords.staffEmails],
  },
  {
    id: "notifications.staffOrderAlerts",
    kind: "setting",
    title: notificationsMessages.orderAlertsTitle,
    description: notificationsMessages.orderAlertsCatalogDescription,
    breadcrumbs: [...hubBreadcrumb, notificationsMessages.orderAlertsTitle],
    href: settingsHref(notificationsStaffEmailsPath, settingsHashes.notificationsOrderAlerts),
    hash: settingsHashes.notificationsOrderAlerts,
    permissions: [PermissionEnum.MANAGE_SETTINGS, PermissionEnum.MANAGE_PLUGINS],
    requireAllPermissions: true,
    ownership: "shop",
    keywords: [keywords.orderAlerts, keywords.staffEmails],
  },
  {
    id: "notifications.staffMessages",
    kind: "setting",
    title: notificationsMessages.messagesSubsectionTitle,
    description: notificationsMessages.messagesSubsectionHint,
    breadcrumbs: [...hubBreadcrumb, notificationsMessages.messagesSubsectionTitle],
    href: settingsHref(notificationsStaffEmailsPath, settingsHashes.notificationsMessages),
    hash: settingsHashes.notificationsMessages,
    permissions: [PermissionEnum.MANAGE_PLUGINS],
    ownership: "shop",
    keywords: [keywords.staffEmails],
  },
  {
    id: "notifications.customer",
    kind: "setting",
    title: notificationsMessages.customerEmailsTitle,
    description: notificationsMessages.customerEmailsSmtpDescription,
    breadcrumbs: [...hubBreadcrumb, notificationsMessages.customerEmailsTitle],
    href: settingsHref(notificationsCustomerEmailsPath),
    permissions: [PermissionEnum.MANAGE_PLUGINS],
    ownership: "channel",
    keywords: [keywords.customerEmails],
  },
];
