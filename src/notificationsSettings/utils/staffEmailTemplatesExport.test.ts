import { type ConfigurationItemFragment } from "@dashboard/graphql";

import { DEFAULT_EMAIL_TEMPLATE_VALUE, type EmailNotificationDefinition } from "../constants";
import { buildFormStateFromConfiguration } from "./emailNotificationConfig";
import { buildStaffEmailTemplatesExport } from "./staffEmailTemplatesExport";

const definitions: EmailNotificationDefinition[] = [
  {
    id: "invite",
    subjectField: "invite_subject",
    templateField: "invite_template",
    defaultSubject: "Welcome",
    variables: ["user.email"],
  },
  {
    id: "reset",
    subjectField: "reset_subject",
    templateField: "reset_template",
    defaultSubject: "Reset",
    variables: [],
  },
];

const item = (name: string, value: string | null): ConfigurationItemFragment => ({
  __typename: "ConfigurationItem",
  name,
  value,
  type: null,
  helpText: null,
  label: null,
});

describe("staffEmailTemplatesExport", () => {
  it("exports subjects and template modes for every notification", () => {
    // Arrange
    const formState = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Custom invite subject"),
        item("invite_template", "<p>Custom invite</p>"),
        item("reset_subject", "Reset"),
        item("reset_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
      ],
      definitions,
    });

    // Act
    const payload = buildStaffEmailTemplatesExport({
      formState,
      definitions,
      exportedAt: "2026-08-12T12:00:00.000Z",
    });

    // Assert
    expect(payload).toEqual({
      version: 1,
      kind: "saleor.staff-email-templates",
      exportedAt: "2026-08-12T12:00:00.000Z",
      notifications: [
        {
          id: "invite",
          subjectField: "invite_subject",
          templateField: "invite_template",
          subject: "Custom invite subject",
          templateMode: "custom",
          template: "<p>Custom invite</p>",
        },
        {
          id: "reset",
          subjectField: "reset_subject",
          templateField: "reset_template",
          subject: "Reset",
          templateMode: "default",
          template: "",
        },
      ],
    });
  });
});
