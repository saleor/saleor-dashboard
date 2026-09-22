import { type ConfigurationItemFragment } from "@dashboard/graphql";

import { DEFAULT_EMAIL_TEMPLATE_VALUE, type EmailNotificationDefinition } from "../constants";
import {
  buildConfigurationInputFromFormState,
  buildFormStateFromConfiguration,
  forceDefaultNotificationCopy,
  getCustomSmtpClientErrors,
  getNotificationCopyStatus,
  getTemplateMode,
  hasBlockingEmptyCustomEmailBody,
  hasEmptyCustomEmailBody,
  hasStaffEmailCustomizationsToLose,
  templateModeToApiValue,
} from "./emailNotificationConfig";

const definitions: EmailNotificationDefinition[] = [
  {
    id: "invite",
    subjectField: "invite_subject",
    templateField: "invite_template",
    defaultSubject: "Welcome",
    variables: ["user.email"],
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

describe("emailNotificationConfig", () => {
  it("maps DEFAULT / empty / custom template modes", () => {
    // Arrange // Act // Assert
    expect(getTemplateMode(DEFAULT_EMAIL_TEMPLATE_VALUE)).toBe("default");
    expect(getTemplateMode("")).toBe("off");
    expect(getTemplateMode(null)).toBe("off");
    expect(getTemplateMode("<p>Hello</p>")).toBe("custom");
    expect(templateModeToApiValue("default", "")).toBe(DEFAULT_EMAIL_TEMPLATE_VALUE);
    expect(templateModeToApiValue("off", "x")).toBe("");
    expect(templateModeToApiValue("custom", "<p>Hi</p>")).toBe("<p>Hi</p>");
  });

  it("builds form state from plugin configuration", () => {
    // Arrange
    const configuration: ConfigurationItemFragment[] = [
      item("invite_subject", "Welcome"),
      item("invite_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
      item("host", ""),
    ];

    // Act
    const state = buildFormStateFromConfiguration({
      active: true,
      configuration,
      definitions,
    });

    // Assert
    expect(state.active).toBe(true);
    expect(state.notifications.invite).toEqual({
      subject: "Welcome",
      templateMode: "default",
      customTemplate: "",
    });
    expect(state.otherFields.host).toBe("");
  });

  it("serializes form state back to configuration input without SMTP by default", () => {
    // Arrange
    const formState = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Welcome"),
        item("invite_template", "<p>Custom</p>"),
        item("host", "smtp.example.com"),
      ],
      definitions,
    });

    formState.notifications.invite.templateMode = "off";

    // Act
    const withoutSmtp = buildConfigurationInputFromFormState({
      formState,
      definitions,
      includeSmtp: false,
    });
    const withSmtp = buildConfigurationInputFromFormState({
      formState,
      definitions,
      includeSmtp: true,
    });

    // Assert
    expect(withoutSmtp).toEqual([
      { name: "invite_subject", value: "Welcome" },
      { name: "invite_template", value: "" },
    ]);
    expect(withSmtp).toContainEqual({ name: "host", value: "smtp.example.com" });
  });

  it("omits empty password when saving SMTP fields", () => {
    // Arrange
    const formState = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Welcome"),
        item("invite_template", "DEFAULT"),
        item("host", "smtp.example.com"),
        item("password", ""),
      ],
      definitions,
    });

    // Act
    const input = buildConfigurationInputFromFormState({
      formState,
      definitions,
      includeSmtp: true,
      omitEmptyPassword: true,
    });
    const inputClearingSmtp = buildConfigurationInputFromFormState({
      formState: {
        ...formState,
        otherFields: {
          ...formState.otherFields,
          host: "",
          port: "",
          password: "",
          sender_address: "",
        },
      },
      definitions,
      includeSmtp: true,
      omitEmptyPassword: false,
    });

    // Assert
    expect(input.find(field => field.name === "password")).toBeUndefined();
    expect(input).toContainEqual({ name: "host", value: "smtp.example.com" });
    expect(inputClearingSmtp).toContainEqual({ name: "password", value: "" });
  });

  it("detects customizations that would be lost when switching to Default", () => {
    // Arrange
    const withSmtp = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Welcome"),
        item("invite_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
        item("host", "smtp.example.com"),
      ],
      definitions,
    });
    const withCustomTemplate = buildFormStateFromConfiguration({
      active: true,
      configuration: [item("invite_subject", "Welcome"), item("invite_template", "<p>Custom</p>")],
      definitions,
    });
    const withCustomSubjectOnly = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Custom subject"),
        item("invite_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
      ],
      definitions,
    });
    const defaultsOnly = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Welcome"),
        item("invite_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
      ],
      definitions,
    });

    // Act // Assert
    expect(
      hasStaffEmailCustomizationsToLose(withSmtp, definitions, { resetNotificationCopy: true }),
    ).toBe(true);
    expect(
      hasStaffEmailCustomizationsToLose(withCustomTemplate, definitions, {
        resetNotificationCopy: true,
      }),
    ).toBe(true);
    expect(
      hasStaffEmailCustomizationsToLose(withCustomSubjectOnly, definitions, {
        resetNotificationCopy: true,
      }),
    ).toBe(true);
    expect(
      hasStaffEmailCustomizationsToLose(withCustomSubjectOnly, definitions, {
        resetNotificationCopy: false,
      }),
    ).toBe(false);
    expect(
      hasStaffEmailCustomizationsToLose(defaultsOnly, definitions, { resetNotificationCopy: true }),
    ).toBe(false);
  });

  it("forces notification copy back to Saleor defaults", () => {
    // Arrange
    const formState = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Custom subject"),
        item("invite_template", "<p>Custom</p>"),
      ],
      definitions,
    });

    // Act
    const next = forceDefaultNotificationCopy({ formState, definitions });

    // Assert
    expect(next.notifications.invite).toEqual({
      subject: "Welcome",
      templateMode: "default",
      customTemplate: "",
    });
  });

  it("differentiates subject vs body customization in copy status", () => {
    // Arrange // Act // Assert
    expect(
      getNotificationCopyStatus({
        values: { subject: "Welcome", templateMode: "default", customTemplate: "" },
        defaultSubject: "Welcome",
      }),
    ).toBe("default");
    expect(
      getNotificationCopyStatus({
        values: { subject: "Hello", templateMode: "default", customTemplate: "" },
        defaultSubject: "Welcome",
      }),
    ).toBe("custom-subject");
    expect(
      getNotificationCopyStatus({
        values: { subject: "Welcome", templateMode: "custom", customTemplate: "<p>Hi</p>" },
        defaultSubject: "Welcome",
      }),
    ).toBe("custom-body");
    expect(
      getNotificationCopyStatus({
        values: { subject: "Hello", templateMode: "custom", customTemplate: "<p>Hi</p>" },
        defaultSubject: "Welcome",
      }),
    ).toBe("custom-subject-and-body");
    expect(
      getNotificationCopyStatus({
        values: { subject: "Hello", templateMode: "off", customTemplate: "" },
        defaultSubject: "Welcome",
      }),
    ).toBe("off");
    expect(
      getNotificationCopyStatus({
        values: { subject: "Hello", templateMode: "custom", customTemplate: "<p>Hi</p>" },
        defaultSubject: "Welcome",
        lockToDefault: true,
      }),
    ).toBe("default");
  });

  it("flags Custom mode with an empty body as invalid", () => {
    // Arrange
    const emptyCustom = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Welcome"),
        item("invite_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
      ],
      definitions,
    });

    emptyCustom.notifications.invite.templateMode = "custom";
    emptyCustom.notifications.invite.customTemplate = "   ";

    const filledCustom = {
      ...emptyCustom,
      notifications: {
        invite: {
          ...emptyCustom.notifications.invite,
          customTemplate: "<p>Hi</p>",
        },
      },
    };

    // Act // Assert
    expect(hasEmptyCustomEmailBody(emptyCustom)).toBe(true);
    expect(hasEmptyCustomEmailBody(filledCustom)).toBe(false);
  });

  it("requires host, port, and sender_address for Custom SMTP (not sender_name)", () => {
    // Arrange // Act
    const errors = getCustomSmtpClientErrors({
      host: "smtp.example.com",
      port: "587",
      sender_name: "",
      sender_address: "",
      use_tls: "false",
      use_ssl: "false",
    });

    // Assert
    expect(errors).toEqual({ sender_address: "required" });
    expect(errors.sender_name).toBeUndefined();
  });

  it("rejects TLS and SSL both enabled", () => {
    // Arrange // Act
    const errors = getCustomSmtpClientErrors({
      host: "smtp.example.com",
      port: "465",
      sender_address: "ops@example.com",
      use_tls: "true",
      use_ssl: "true",
    });

    // Assert
    expect(errors.use_tls).toBe("tlsSslExclusive");
    expect(errors.use_ssl).toBe("tlsSslExclusive");
  });

  it("flags invalid sender email shape", () => {
    // Arrange // Act // Assert
    expect(
      getCustomSmtpClientErrors({
        host: "smtp.example.com",
        port: "587",
        sender_address: "not-an-email",
      }).sender_address,
    ).toBe("invalidEmail");
  });

  it("does not block save for empty custom bodies when emails are off or copy is locked", () => {
    // Arrange
    const withEmptyCustom = buildFormStateFromConfiguration({
      active: true,
      configuration: [
        item("invite_subject", "Welcome"),
        item("invite_template", DEFAULT_EMAIL_TEMPLATE_VALUE),
      ],
      definitions,
    });

    withEmptyCustom.notifications.invite.templateMode = "custom";
    withEmptyCustom.notifications.invite.customTemplate = "";

    // Act // Assert
    expect(
      hasBlockingEmptyCustomEmailBody({
        formState: withEmptyCustom,
        copyEditable: true,
      }),
    ).toBe(true);
    expect(
      hasBlockingEmptyCustomEmailBody({
        formState: { ...withEmptyCustom, active: false },
        copyEditable: true,
      }),
    ).toBe(false);
    expect(
      hasBlockingEmptyCustomEmailBody({
        formState: withEmptyCustom,
        copyEditable: false,
      }),
    ).toBe(false);
  });
});
