import { type EmailNotificationDefinition } from "../constants";
import { type EmailNotificationsFormState } from "./emailNotificationConfig";

export const STAFF_EMAIL_TEMPLATES_EXPORT_VERSION = 1 as const;

export interface StaffEmailTemplateExportItem {
  id: string;
  subjectField: string;
  templateField: string;
  subject: string;
  templateMode: "default" | "custom" | "off";
  template: string;
}

export interface StaffEmailTemplatesExport {
  version: typeof STAFF_EMAIL_TEMPLATES_EXPORT_VERSION;
  kind: "saleor.staff-email-templates";
  exportedAt: string;
  notifications: StaffEmailTemplateExportItem[];
}

/** Backup of subjects + template modes/bodies for all configured staff messages. */
export const buildStaffEmailTemplatesExport = ({
  formState,
  definitions,
  exportedAt = new Date().toISOString(),
}: {
  formState: EmailNotificationsFormState;
  definitions: EmailNotificationDefinition[];
  exportedAt?: string;
}): StaffEmailTemplatesExport => {
  const notifications: StaffEmailTemplateExportItem[] = [];

  for (const definition of definitions) {
    const values = formState.notifications[definition.id];

    if (!values) {
      continue;
    }

    notifications.push({
      id: definition.id,
      subjectField: definition.subjectField,
      templateField: definition.templateField,
      subject: values.subject,
      templateMode: values.templateMode,
      template: values.templateMode === "custom" ? values.customTemplate : "",
    });
  }

  return {
    version: STAFF_EMAIL_TEMPLATES_EXPORT_VERSION,
    kind: "saleor.staff-email-templates",
    exportedAt,
    notifications,
  };
};

export const downloadStaffEmailTemplatesJson = (payload: StaffEmailTemplatesExport): void => {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const dateStamp = payload.exportedAt.slice(0, 10);

  anchor.href = url;
  anchor.download = `staff-email-templates-${dateStamp}.json`;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
