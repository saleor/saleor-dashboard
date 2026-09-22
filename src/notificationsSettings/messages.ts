import { defineMessages } from "react-intl";

export const notificationsMessages = defineMessages({
  hubTitle: {
    id: "7L3jpR",
    defaultMessage: "Notifications",
    description: "notifications settings hub title",
  },
  hubDescription: {
    id: "NQaMkx",
    defaultMessage:
      "Staff Dashboard emails and who gets new-order alerts are configured here. Customer (shopper) emails use the SMTP app — a separate setup.",
    description: "notifications settings hub description",
  },
  staffEmailsTitle: {
    id: "0tk2Vm",
    defaultMessage: "Staff emails",
    description: "staff emails settings page title",
  },
  staffEmailsDescription: {
    id: "U1U2Zv",
    defaultMessage:
      "Invites, password resets, order alerts, and export results for Dashboard users — including default or custom SMTP for those messages.",
    description: "staff emails hub card description",
  },
  staffEmailsPageDescription: {
    id: "dByesK",
    defaultMessage:
      "Choose how staff mail is sent, who gets new-order alerts, and how each message reads. This is not the SMTP app used for shopper emails.",
    description: "staff emails page intro",
  },
  customerEmailsTitle: {
    id: "mGKNxS",
    defaultMessage: "Customer emails",
    description: "customer emails hub card title",
  },
  customerEmailsSmtpDescription: {
    id: "rxT4ua",
    defaultMessage:
      "Order, account, and fulfillment emails for shoppers are managed in the SMTP app.",
    description: "customer emails hub card pointing to SMTP app",
  },
  customerEmailsRedirectFailed: {
    id: "4osJ1F",
    defaultMessage: "Couldn’t open customer emails. Try again.",
    description: "error when SMTP app lookup fails on customer emails redirect",
  },
  staffDeliveryTitle: {
    id: "5p/P1C",
    defaultMessage: "Staff email delivery",
    description: "staff delivery mode section title",
  },
  staffDeliveryDescription: {
    id: "B3TMMF",
    defaultMessage:
      "How staff emails are sent. In Saleor, staff communication is separate from customer notifications. For the latter, see {customerEmailsLink}.",
    description: "staff delivery mode section description with link to customer emails",
  },
  staffDeliveryDescriptionPlain: {
    id: "vLInt4",
    defaultMessage:
      "How staff emails are sent. In Saleor, staff communication is separate from customer notifications.",
    description: "staff delivery description for Cmd+K / settings search without link",
  },
  staffDeliveryCustomerEmailsLink: {
    id: "LCNVrx",
    defaultMessage: "customer emails",
    description: "inline link label to customer emails / SMTP app",
  },
  staffDeliveryModeDefault: {
    id: "tEjGRk",
    defaultMessage: "Default",
    description: "staff delivery mode: platform/env defaults",
  },
  staffDeliveryModeDefaultHintCloud: {
    id: "QVYKtb",
    defaultMessage:
      "Saleor Cloud sends staff mail for you. Custom subjects and templates stay locked to Saleor defaults.",
    description: "default mode hint on cloud",
  },
  staffDeliveryModeDefaultHintSelfHosted: {
    id: "Tv4WnJ",
    defaultMessage: "Send staff mail with your store’s usual email settings.",
    description: "default mode hint on self-hosted",
  },
  staffDeliveryModeCustom: {
    id: "SblSIo",
    defaultMessage: "Custom SMTP",
    description: "staff delivery mode: own SMTP",
  },
  staffDeliveryModeCustomHint: {
    id: "ku8aHA",
    defaultMessage: "Send staff mail from your own server and customize subjects and templates.",
    description: "custom mode hint",
  },
  staffDeliveryDefaultBodyCloud: {
    id: "jDZb4p",
    defaultMessage:
      "No SMTP setup needed for invites and other staff messages. Switch to Custom SMTP if you need your brand From address or custom email copy.",
    description: "body copy when default delivery selected on cloud",
  },
  staffDeliveryDefaultBodySelfHosted: {
    id: "mKr+Rn",
    defaultMessage:
      "Staff mail uses your store’s usual email settings. Switch to Custom SMTP to set your own server and sender in the Dashboard.",
    description: "body copy when default delivery selected on self-hosted",
  },
  messagesSubsectionTitle: {
    id: "vYRPvL",
    defaultMessage: "Staff messages",
    description: "subsection listing staff notification emails",
  },
  messagesSubsectionHint: {
    id: "U2uWJ0",
    defaultMessage:
      "Choose Saleor default, a custom subject and body, or don’t send for each message.",
    description: "hint when message templates are editable",
  },
  orderAlertsTitle: {
    id: "npWcXm",
    defaultMessage: "New order alerts",
    description: "staff order confirmation recipients section title",
  },
  orderAlertsDescription: {
    id: "VWW8dR",
    defaultMessage:
      "Active staff members listed here get an email when a customer completes checkout. Draft orders you complete in the Dashboard are not included.",
    description: "staff order confirmation recipients section description",
  },
  orderAlertsEmailsDisabled: {
    id: "CUGRtv",
    defaultMessage:
      "Staff emails are turned off. These people will not be notified until you enable them above.",
    description: "warning when staff email plugin is inactive",
  },
  orderAlertsEmptyTitle: {
    id: "kAbS/r",
    defaultMessage: "No one is subscribed",
    description: "empty state title for staff order alert recipients",
  },
  orderAlertsEmptyDescription: {
    id: "iqvjTX",
    defaultMessage: "Staff will not be emailed when a customer places an order.",
    description: "empty state description for staff order alert recipients",
  },
  orderAlertsAssign: {
    id: "LrMfvz",
    defaultMessage: "Assign staff",
    description: "button to add staff order alert recipients",
  },
  orderAlertsUnlinkedHint: {
    id: "3k1Hiz",
    defaultMessage:
      "Not linked to an active staff member, so Saleor will not send new-order emails to this address.",
    description: "hint for email-only staff notification recipients",
  },
  orderAlertsInactiveHint: {
    id: "ZOFvAC",
    defaultMessage: "This staff member is inactive, so they will not receive new-order emails.",
    description: "hint when assigned staff user is deactivated",
  },
  orderAlertsMutedHint: {
    id: "4H9bIs",
    defaultMessage: "This recipient is muted, so they will not receive new-order emails.",
    description: "hint when a stored recipient has active=false",
  },
  orderAlertsAssignNeedsStaff: {
    id: "jbda4N",
    defaultMessage: "You need permission to manage staff to add people to this list.",
    description: "hint when user can view recipients but not assign staff",
  },
  recipientAdded: {
    id: "oi9xgK",
    defaultMessage: "Recipient added",
    description: "toast after assigning one staff order alert recipient",
  },
  recipientsAdded: {
    id: "td6upx",
    defaultMessage: "Recipients added",
    description: "toast after assigning multiple staff order alert recipients",
  },
  recipientRemoved: {
    id: "X+dg8b",
    defaultMessage: "Recipient removed",
    description: "toast after removing a staff order alert recipient",
  },
  couldNotAddRecipient: {
    id: "HY1sEu",
    defaultMessage: "Couldn’t add recipient. Try again.",
    description: "error toast when creating a staff notification recipient fails",
  },
  couldNotRemoveRecipient: {
    id: "6GLJUd",
    defaultMessage: "Couldn’t remove recipient. Try again.",
    description: "error toast when deleting a staff notification recipient fails",
  },
  someRecipientsFailed: {
    id: "iM5nh1",
    defaultMessage: "Some staff couldn’t be added. Try again.",
    description: "warning when assigning staff order alert recipients partially fails",
  },
  recipientAlreadyExists: {
    id: "dzfHno",
    defaultMessage: "This person is already subscribed.",
    description: "error when assigning a duplicate staff notification recipient",
  },
  skippedInactiveStaff: {
    id: "I8hHsh",
    defaultMessage: "Inactive staff were skipped. Only active staff receive new-order emails.",
    description: "warning when assign includes inactive staff members",
  },
  orderAlertsCatalogDescription: {
    id: "rnADHu",
    defaultMessage: "Choose which staff members get an email when a customer places an order",
    description: "settings catalog description for new order alerts",
  },
  deliveryWhyTitle: {
    id: "k12W/5",
    defaultMessage: "When to use your own email service",
    description: "BYO email reasons heading",
  },
  deliveryWhyBrand: {
    id: "MrTfiO",
    defaultMessage: "Send from your brand domain (for example orders@yourstore.com)",
    description: "BYO reason: brand from address",
  },
  deliveryWhyCompliance: {
    id: "VZ5qPE",
    defaultMessage: "Manage bounces, suppression lists, and sending history in your email provider",
    description: "BYO reason: compliance",
  },
  deliveryWhyMarketing: {
    id: "XM9NSO",
    defaultMessage: "Keep staff and marketing email on the same provider",
    description: "BYO reason: unify providers",
  },
  emailsEnabledTitle: {
    id: "Gv+I7K",
    defaultMessage: "Send these emails",
    description: "plugin active toggle title",
  },
  emailsEnabledDescription: {
    id: "GsyvkU",
    defaultMessage: "When off, Saleor will not send any of these staff emails.",
    description: "staff emails active toggle description",
  },
  subjectLabel: {
    id: "ljwr2Q",
    defaultMessage: "Subject",
    description: "email subject field label",
  },
  templateLabel: {
    id: "Ds9qMV",
    defaultMessage: "Email body",
    description: "email template mode label",
  },
  templateDefault: {
    id: "U4Ppt6",
    defaultMessage: "Saleor default",
    description: "use default template option",
  },
  templateCustom: {
    id: "/7j98I",
    defaultMessage: "Custom",
    description: "use custom template option",
  },
  statusCustomSubject: {
    id: "2jHGjL",
    defaultMessage: "Custom subject",
    description: "message row status: only subject differs from Saleor default",
  },
  statusCustomBody: {
    id: "ysIDsl",
    defaultMessage: "Custom body",
    description: "message row status: only email body is customized",
  },
  statusCustomSubjectAndBody: {
    id: "8ss9/7",
    defaultMessage: "Custom subject & body",
    description: "message row status: subject and body are customized",
  },
  templateOff: {
    id: "FnZMYr",
    defaultMessage: "Don’t send",
    description: "disable this notification email",
  },
  templateDefaultHint: {
    id: "74H6RX",
    defaultMessage: "Using the built-in Saleor template for this message.",
    description: "hint when default template mode is selected",
  },
  emailPreviewLabel: {
    id: "BW9Lnw",
    defaultMessage: "Preview",
    description: "label above staff email preview",
  },
  emailPreviewFooter: {
    id: "SvVLgH",
    defaultMessage: "This is an automatically generated e-mail, please do not reply.",
    description: "footer line in staff email preview mock",
  },
  templateOffHint: {
    id: "j7AoSX",
    defaultMessage: "This email will not be sent.",
    description: "hint when notification is turned off",
  },
  templateCustomPlaceholder: {
    id: "6eKMnl",
    defaultMessage: "Email body (HTML)",
    description: "placeholder for custom template editor",
  },
  templateCustomBodyRequired: {
    id: "daJDoe",
    defaultMessage:
      "Add an email body, or choose Saleor default or Don’t send. An empty custom body is not allowed.",
    description: "validation when Custom template mode has empty body",
  },
  templateLockedToDefaultHint: {
    id: "Yr1YZv",
    defaultMessage:
      "Saleor Cloud sends this with the default subject and template. Switch to Custom SMTP above to edit copy or turn this email off.",
    description: "shown when Cloud default delivery locks copy editing",
  },
  variablesLabel: {
    id: "KehG2Y",
    defaultMessage: "Insert variable",
    description: "variable chips legend",
  },
  customizeTemplate: {
    id: "x+jH+T",
    defaultMessage: "Customize",
    description: "switch from default to custom template",
  },
  saved: {
    id: "jQ4VBo",
    defaultMessage: "Notification settings saved",
    description: "success toast after saving email notifications",
  },
  couldNotSaveNotificationSettings: {
    id: "n6fM40",
    defaultMessage: "Couldn’t save notification settings",
    description: "error toast title after failed staff email settings save",
  },
  checkSmtpFields: {
    id: "qZ62YJ",
    defaultMessage: "Check the highlighted fields.",
    description: "error toast recovery when SMTP fields are invalid",
  },
  tryAgainShort: {
    id: "KTpYX7",
    defaultMessage: "Try again.",
    description: "error toast recovery when save failed without field context",
  },
  smtpFieldRequired: {
    id: "beOQ/V",
    defaultMessage: "Required",
    description: "inline error when a required SMTP field is empty",
  },
  smtpSenderAddressInvalid: {
    id: "dvpwuq",
    defaultMessage: "Enter a valid email address",
    description: "inline error when sender email format is invalid",
  },
  smtpTlsSslExclusive: {
    id: "Blyy4D",
    defaultMessage: "Use TLS and Use SSL can’t both be on. Turn one off.",
    description: "inline error when both TLS and SSL toggles are enabled",
  },
  smtpConnectionFailedTitle: {
    id: "WuuXbr",
    defaultMessage: "Couldn’t connect to SMTP",
    description: "callout title when Saleor can’t open an SMTP session",
  },
  smtpHost: {
    id: "kIas9j",
    defaultMessage: "SMTP host",
    description: "SMTP host field",
  },
  smtpHostHelper: {
    id: "8QlXZs",
    defaultMessage:
      "Hostname only — for example smtp.sendgrid.net. Don’t include https://, smtp://, a port, or a path.",
    description: "SMTP host field helper with example and what to exclude",
  },
  smtpHostPlaceholder: {
    id: "xs5hgj",
    defaultMessage: "smtp.sendgrid.net",
    description: "SMTP host field placeholder example",
  },
  smtpPort: {
    id: "iUVLZ9",
    defaultMessage: "SMTP port",
    description: "SMTP port field",
  },
  smtpUsername: {
    id: "DiMS8t",
    defaultMessage: "SMTP user (optional)",
    description: "SMTP username field — optional; many servers need it, Saleor does not require it",
  },
  smtpPassword: {
    id: "jN3XL5",
    defaultMessage: "Password (optional)",
    description: "SMTP password field — optional; blank keeps the stored secret on update",
  },
  smtpPasswordHelper: {
    id: "g35CVS",
    defaultMessage: "Leave blank to keep the current password.",
    description: "SMTP password helper",
  },
  smtpSenderName: {
    id: "sykM/J",
    defaultMessage: "Sender name (optional)",
    description: "SMTP sender name field — optional; Saleor only requires sender email",
  },
  smtpSenderAddress: {
    id: "IAmnQ/",
    defaultMessage: "Sender email",
    description: "SMTP sender address field",
  },
  smtpUseTls: {
    id: "C+XrXi",
    defaultMessage: "Use TLS",
    description: "SMTP use TLS toggle",
  },
  smtpUseSsl: {
    id: "dpr5yI",
    defaultMessage: "Use SSL",
    description: "SMTP use SSL toggle",
  },
  switchToDefaultTitle: {
    id: "d5QslN",
    defaultMessage: "Save Default delivery?",
    description: "confirm dialog title when saving default delivery over custom SMTP",
  },
  switchToDefaultIntro: {
    id: "XPpy7A",
    defaultMessage: "You’re switching from Custom SMTP to the Default setup.",
    description: "intro text above callouts when saving default over custom SMTP",
  },
  switchToDefaultWarningTitle: {
    id: "fq4FLl",
    defaultMessage:
      "Default delivery uses Saleor’s built-in staff email templates. Saleor does not keep a separate Custom SMTP profile — saving will remove these overrides.",
    description: "warning callout title when saving default over custom SMTP",
  },
  switchToDefaultLoseSmtp: {
    id: "xTS+W3",
    defaultMessage: "Your SMTP host, credentials, and sender fields will be cleared.",
    description: "confirm dialog bullet: SMTP cleared",
  },
  switchToDefaultLoseSubjects: {
    id: "1cednX",
    defaultMessage: "Custom subjects will be reset to Saleor defaults.",
    description: "confirm dialog bullet: custom subjects reset",
  },
  switchToDefaultLoseBodies: {
    id: "S7m7gp",
    defaultMessage: "Custom email bodies will be deleted.",
    description: "confirm dialog bullet: custom bodies deleted",
  },
  switchToDefaultLoseOff: {
    id: "CPiLc1",
    defaultMessage: "Messages set to “Don’t send” will send again with Saleor default templates.",
    description: "confirm dialog bullet: don’t-send messages resume with defaults",
  },
  switchToDefaultDownloadTitle: {
    id: "SaHwWJ",
    defaultMessage: "Back up first",
    description: "neutral callout title for downloading staff email backup before save",
  },
  switchToDefaultDownloadHint: {
    id: "F348/L",
    defaultMessage:
      "Download a JSON backup of your subjects and templates if you might need them later.",
    description: "hint in download backup callout",
  },
  switchToDefaultDownload: {
    id: "t5s7MG",
    defaultMessage: "Download subjects & templates (JSON)",
    description: "button to export staff email subjects and templates",
  },
  switchToDefaultConfirm: {
    id: "1cRgKA",
    defaultMessage: "Save",
    description: "confirm button when saving default delivery over custom SMTP",
  },
  disableEmailsTitle: {
    id: "0GNjGO",
    defaultMessage: "Turn off staff emails?",
    description: "confirm dialog title when disabling staff email sending",
  },
  disableEmailsIntro: {
    id: "XE99+s",
    defaultMessage: "You’re turning off all staff Dashboard emails from this page.",
    description: "intro when confirming disable staff emails",
  },
  disableEmailsWarningTitle: {
    id: "wUMBnP",
    defaultMessage: "Saleor will stop sending these messages.",
    description: "warning callout title when disabling staff emails",
  },
  disableEmailsLoseInvites: {
    id: "b5F3lD",
    defaultMessage: "Staff invites and password reset emails will not be sent.",
    description: "bullet: invites and password resets stop",
  },
  disableEmailsLoseAlerts: {
    id: "PNbIOd",
    defaultMessage: "Order confirmation and CSV export emails to staff will not be sent.",
    description: "bullet: order and export emails stop",
  },
  disableEmailsCanReenable: {
    id: "f4mftg",
    defaultMessage: "You can turn this back on later.",
    description: "bullet: can re-enable later",
  },
  disableEmailsConfirm: {
    id: "oGsuHg",
    defaultMessage: "Save",
    description: "confirm button when saving with staff emails disabled",
  },
});

export const staffNotificationCopy = defineMessages({
  "staff-invite": {
    id: "O31Ggf",
    defaultMessage: "Staff invite",
    description: "staff notification title",
  },
  "staff-inviteDesc": {
    id: "h/3meW",
    defaultMessage: "Sent when you invite someone to the Dashboard.",
    description: "staff notification description",
  },
  "staff-password-reset": {
    id: "HvzN3o",
    defaultMessage: "Staff password reset",
    description: "staff notification title",
  },
  "staff-password-resetDesc": {
    id: "IHqdou",
    defaultMessage: "Sent when a staff member requests a password reset.",
    description: "staff notification description",
  },
  "staff-order-confirmation": {
    id: "rNAI8p",
    defaultMessage: "Staff order confirmation",
    description: "staff notification title",
  },
  "staff-order-confirmationDesc": {
    id: "0R1EEd",
    defaultMessage:
      "Sent to people in {alertsLink} when a customer completes checkout. Draft orders completed in the Dashboard are not included.",
    description: "staff notification description",
  },
  "csv-export-success": {
    id: "gkQbh9",
    defaultMessage: "Export ready",
    description: "staff notification title",
  },
  "csv-export-successDesc": {
    id: "fuuoDR",
    defaultMessage: "Sent when a CSV export finishes successfully.",
    description: "staff notification description",
  },
  "csv-export-failed": {
    id: "LHmmdv",
    defaultMessage: "Export failed",
    description: "staff notification title",
  },
  "csv-export-failedDesc": {
    id: "Rx2Gp6",
    defaultMessage: "Sent when a CSV export fails.",
    description: "staff notification description",
  },
});
