import { type ConfigurationItemFragment, type ConfigurationItemInput } from "@dashboard/graphql";

import {
  DEFAULT_EMAIL_TEMPLATE_VALUE,
  type EmailNotificationDefinition,
  SMTP_CONFIG_FIELD_NAMES,
  type TemplateMode,
} from "../constants";

export interface NotificationFormValues {
  subject: string;
  templateMode: TemplateMode;
  customTemplate: string;
}

export interface EmailNotificationsFormState {
  active: boolean;
  notifications: Record<string, NotificationFormValues>;
  /** Leftover + SMTP fields keyed by configuration name */
  otherFields: Record<string, string>;
}

export const getTemplateMode = (value: string | null | undefined): TemplateMode => {
  if (value == null || value.trim() === "") {
    return "off";
  }

  if (value === DEFAULT_EMAIL_TEMPLATE_VALUE) {
    return "default";
  }

  return "custom";
};

export const templateModeToApiValue = (mode: TemplateMode, customTemplate: string): string => {
  if (mode === "off") {
    return "";
  }

  if (mode === "default") {
    return DEFAULT_EMAIL_TEMPLATE_VALUE;
  }

  return customTemplate;
};

/** Custom mode with a blank body would serialize as “Don’t send” (empty string). */
export const hasEmptyCustomEmailBody = (formState: EmailNotificationsFormState): boolean =>
  Object.values(formState.notifications).some(
    values => values.templateMode === "custom" && values.customTemplate.trim() === "",
  );

/**
 * Empty custom bodies only block save when staff emails are on and copy is editable.
 * Otherwise merchants can be stuck (messages hidden while disabled, or Cloud Default lock).
 */
export const hasBlockingEmptyCustomEmailBody = ({
  formState,
  copyEditable,
}: {
  formState: EmailNotificationsFormState;
  copyEditable: boolean;
}): boolean => formState.active && copyEditable && hasEmptyCustomEmailBody(formState);

export const isEmptyCustomEmailBody = (values: NotificationFormValues): boolean =>
  values.templateMode === "custom" && values.customTemplate.trim() === "";

export const isSmtpFieldName = (name: string): boolean =>
  (SMTP_CONFIG_FIELD_NAMES as readonly string[]).includes(name);

export const buildFormStateFromConfiguration = ({
  active,
  configuration,
  definitions,
}: {
  active: boolean;
  configuration: ConfigurationItemFragment[] | null | undefined;
  definitions: EmailNotificationDefinition[];
}): EmailNotificationsFormState => {
  const byName = new Map((configuration ?? []).map(item => [item.name, item]));
  const knownFields = new Set<string>();
  const notifications: Record<string, NotificationFormValues> = {};

  for (const definition of definitions) {
    knownFields.add(definition.subjectField);
    knownFields.add(definition.templateField);

    const subject = byName.get(definition.subjectField)?.value ?? "";
    const templateValue =
      byName.get(definition.templateField)?.value ?? DEFAULT_EMAIL_TEMPLATE_VALUE;
    const templateMode = getTemplateMode(templateValue);

    notifications[definition.id] = {
      subject,
      templateMode,
      customTemplate: templateMode === "custom" ? templateValue : "",
    };
  }

  const otherFields: Record<string, string> = {};

  for (const item of configuration ?? []) {
    if (knownFields.has(item.name)) {
      continue;
    }

    const raw = item.value;

    otherFields[item.name] =
      raw === null || raw === undefined ? "" : typeof raw === "boolean" ? String(raw) : String(raw);
  }

  return {
    active,
    notifications,
    otherFields,
  };
};

export const buildConfigurationInputFromFormState = ({
  formState,
  definitions,
  includeSmtp,
  omitEmptyPassword = true,
}: {
  formState: EmailNotificationsFormState;
  definitions: EmailNotificationDefinition[];
  includeSmtp: boolean;
  omitEmptyPassword?: boolean;
}): ConfigurationItemInput[] => {
  const input: ConfigurationItemInput[] = [];

  for (const definition of definitions) {
    const values = formState.notifications[definition.id];

    if (!values) {
      continue;
    }

    input.push({
      name: definition.subjectField,
      value: values.subject,
    });
    input.push({
      name: definition.templateField,
      value: templateModeToApiValue(values.templateMode, values.customTemplate),
    });
  }

  for (const [name, value] of Object.entries(formState.otherFields)) {
    if (!includeSmtp && isSmtpFieldName(name)) {
      continue;
    }

    if (omitEmptyPassword && name === "password" && value.trim() === "") {
      continue;
    }

    input.push({ name, value });
  }

  return input;
};

export const hasStaffSmtpOverrides = (otherFields: Record<string, string>): boolean => {
  const host = (otherFields.host ?? "").trim();
  const port = (otherFields.port ?? "").trim();
  const sender = (otherFields.sender_address ?? "").trim();

  return Boolean(host || port || sender);
};

export const ensureSmtpFieldDefaults = (
  otherFields: Record<string, string>,
): Record<string, string> => {
  const next = { ...otherFields };

  for (const name of SMTP_CONFIG_FIELD_NAMES) {
    if (next[name] === undefined) {
      next[name] = name === "use_tls" || name === "use_ssl" ? "false" : "";
    }
  }

  return next;
};

/**
 * Fields Saleor validates as required when the admin email plugin is active
 * (`REQUIRED_EMAIL_CONFIG_FIELDS` in saleor/plugins/email_common.py).
 * `sender_name` is optional.
 */
export const REQUIRED_CUSTOM_SMTP_FIELDS = ["host", "port", "sender_address"] as const;

export type CustomSmtpClientErrorCode = "required" | "invalidEmail" | "tlsSslExclusive";

export type CustomSmtpClientErrors = Partial<
  Record<(typeof SMTP_CONFIG_FIELD_NAMES)[number], CustomSmtpClientErrorCode>
>;

/** Lightweight email shape check — Saleor also runs Django’s EmailValidator. */
const looksLikeEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/**
 * Client-side Custom SMTP checks aligned with Saleor’s plugin validators.
 * Returns field → error code (resolve copy via intl in the view).
 */
export const getCustomSmtpClientErrors = (
  otherFields: Record<string, string>,
): CustomSmtpClientErrors => {
  const values = ensureSmtpFieldDefaults(otherFields);
  const errors: CustomSmtpClientErrors = {};

  for (const field of REQUIRED_CUSTOM_SMTP_FIELDS) {
    if (!values[field]?.trim()) {
      errors[field] = "required";
    }
  }

  const sender = values.sender_address?.trim() ?? "";

  if (sender && !looksLikeEmail(sender)) {
    errors.sender_address = "invalidEmail";
  }

  if (values.use_tls === "true" && values.use_ssl === "true") {
    errors.use_tls = "tlsSslExclusive";
    errors.use_ssl = "tlsSslExclusive";
  }

  return errors;
};

export const hasCustomSmtpClientErrors = (errors: CustomSmtpClientErrors): boolean =>
  Object.keys(errors).length > 0;

export const clearSmtpFields = (otherFields: Record<string, string>): Record<string, string> => {
  const next = { ...otherFields };

  for (const name of SMTP_CONFIG_FIELD_NAMES) {
    next[name] = name === "use_tls" || name === "use_ssl" ? "false" : "";
  }

  return next;
};

/** Reset every notification to Saleor default subject + template (used when leaving Custom SMTP). */
export const forceDefaultNotificationCopy = ({
  formState,
  definitions,
}: {
  formState: EmailNotificationsFormState;
  definitions: EmailNotificationDefinition[];
}): EmailNotificationsFormState => {
  const byId = new Map(definitions.map(definition => [definition.id, definition]));

  return {
    ...formState,
    notifications: Object.fromEntries(
      Object.entries(formState.notifications).map(([id, values]) => {
        const definition = byId.get(id);

        return [
          id,
          {
            ...values,
            subject: definition?.defaultSubject ?? values.subject,
            templateMode: "default" as const,
            customTemplate: "",
          },
        ];
      }),
    ),
  };
};

/** True when saving Default would clear SMTP and/or (when resetting copy) non-default subjects/bodies. */
export const hasStaffEmailCustomizationsToLose = (
  formState: EmailNotificationsFormState,
  definitions: EmailNotificationDefinition[],
  { resetNotificationCopy }: { resetNotificationCopy: boolean },
): boolean => {
  if (hasStaffSmtpOverrides(formState.otherFields)) {
    return true;
  }

  if (!resetNotificationCopy) {
    return false;
  }

  return definitions.some(definition => {
    const values = formState.notifications[definition.id];

    if (!values) {
      return false;
    }

    return (
      values.templateMode !== "default" ||
      values.subject.trim() !== definition.defaultSubject.trim()
    );
  });
};

export type NotificationCopyStatus =
  | "off"
  | "default"
  | "custom-subject"
  | "custom-body"
  | "custom-subject-and-body";

export const getNotificationCopyStatus = ({
  values,
  defaultSubject,
  lockToDefault = false,
}: {
  values: NotificationFormValues;
  defaultSubject: string;
  lockToDefault?: boolean;
}): NotificationCopyStatus => {
  if (lockToDefault) {
    return "default";
  }

  if (values.templateMode === "off") {
    return "off";
  }

  const customSubject = values.subject.trim() !== defaultSubject.trim();
  const customBody = values.templateMode === "custom";

  if (customSubject && customBody) {
    return "custom-subject-and-body";
  }

  if (customSubject) {
    return "custom-subject";
  }

  if (customBody) {
    return "custom-body";
  }

  return "default";
};
