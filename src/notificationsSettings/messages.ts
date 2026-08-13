import { defineMessages } from "react-intl";

export const notificationsMessages = defineMessages({
  hubTitle: {
    id: "7L3jpR",
    defaultMessage: "Notifications",
    description: "notifications settings hub title",
  },
  hubDescription: {
    id: "aXb6gP",
    defaultMessage:
      "Staff Dashboard emails are configured here. Customer (shopper) emails use the SMTP app — a separate setup.",
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
    id: "s6+A2i",
    defaultMessage:
      "Choose default delivery or your own SMTP, then adjust which staff messages go out and how they read. This is not the SMTP app used for shopper emails.",
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
    id: "WXcmOW",
    defaultMessage: "Sent to staff when a new order is placed.",
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
