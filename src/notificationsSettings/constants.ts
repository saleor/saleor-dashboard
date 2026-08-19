export const ADMIN_EMAIL_PLUGIN_ID = "mirumee.notifications.admin_email";
/** Legacy plugin — customer emails are handled by the SMTP app. Kept for hide/redirect only. */
export const USER_EMAIL_PLUGIN_ID = "mirumee.notifications.user_email";

/** Official SMTP app — customer (shopper) transactional emails. */
export const SMTP_APP_IDENTIFIER = "saleor.app.smtp";

export const EMAIL_NOTIFICATION_PLUGIN_IDS = [ADMIN_EMAIL_PLUGIN_ID, USER_EMAIL_PLUGIN_ID] as const;

export const DEFAULT_EMAIL_TEMPLATE_VALUE = "DEFAULT";

export const SMTP_CONFIG_FIELD_NAMES = [
  "host",
  "port",
  "username",
  "password",
  "sender_name",
  "sender_address",
  "use_tls",
  "use_ssl",
] as const;

export type SmtpConfigFieldName = (typeof SMTP_CONFIG_FIELD_NAMES)[number];

export type TemplateMode = "default" | "custom" | "off";

export interface EmailNotificationDefinition {
  id: string;
  subjectField: string;
  templateField: string;
  /** Saleor plugin default subject — used to detect a customized subject in the UI. */
  defaultSubject: string;
  variables: string[];
}

/** Staff emails — mirumee.notifications.admin_email */
export const ADMIN_EMAIL_NOTIFICATIONS: EmailNotificationDefinition[] = [
  {
    id: "staff-invite",
    subjectField: "set_staff_password_subject",
    templateField: "set_staff_password_template",
    defaultSubject: "You’re invited to join Saleor",
    variables: ["site_name", "domain", "url", "user.email"],
  },
  {
    id: "staff-password-reset",
    subjectField: "staff_password_reset_subject",
    templateField: "staff_password_reset_template",
    defaultSubject: "Reset your Saleor password",
    variables: ["site_name", "domain", "url", "user.email"],
  },
  {
    id: "staff-order-confirmation",
    subjectField: "staff_order_confirmation_subject",
    templateField: "staff_order_confirmation_template",
    defaultSubject: "Order {{ order.number }} details",
    variables: ["order.number", "order.details_url", "site_name"],
  },
  {
    id: "csv-export-success",
    subjectField: "csv_export_success_subject",
    templateField: "csv_export_success_template",
    defaultSubject: "Your exported {{ data_type }} data is ready",
    variables: ["data_type", "csv_link", "site_name"],
  },
  {
    id: "csv-export-failed",
    subjectField: "csv_export_failed_subject",
    templateField: "csv_export_failed_template",
    defaultSubject: "Exporting {{ data_type }} data failed",
    variables: ["data_type", "site_name"],
  },
];
