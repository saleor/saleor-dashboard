import { PluginErrorCode } from "@dashboard/graphql";

import { getNonSmtpPluginErrorMessage, mapPluginErrorsToSmtpState } from "./smtpPluginErrors";

describe("mapPluginErrorsToSmtpState", () => {
  it("maps missing sender_address to a field error", () => {
    // Arrange
    const errors = [
      {
        field: "sender_address",
        code: PluginErrorCode.PLUGIN_MISCONFIGURED,
        message: "Missing sender address value.",
      },
    ];

    // Act
    const state = mapPluginErrorsToSmtpState(errors);

    // Assert
    expect(state.connectionError).toBeNull();
    expect(state.fieldErrors).toEqual({
      sender_address: "Missing sender address value.",
    });
  });

  it("collapses identical connection failures into one callout", () => {
    // Arrange
    const message =
      "Unable to connect to email backend. Make sure that you provided correct values. timeout";
    const errors = ["host", "port", "username", "password", "sender_address"].map(field => ({
      field,
      code: PluginErrorCode.PLUGIN_MISCONFIGURED,
      message,
    }));

    // Act
    const state = mapPluginErrorsToSmtpState(errors);

    // Assert
    expect(state.fieldErrors).toEqual({});
    expect(state.connectionError).toBe(message);
  });

  it("ignores non-SMTP plugin fields", () => {
    // Arrange // Act
    const state = mapPluginErrorsToSmtpState([
      {
        field: "set_staff_password_template",
        code: PluginErrorCode.INVALID,
        message: "Broken template",
      },
    ]);

    // Assert
    expect(state).toEqual({ fieldErrors: {}, connectionError: null });
  });

  it("surfaces non-SMTP API messages for toast detail", () => {
    // Arrange // Act // Assert
    expect(
      getNonSmtpPluginErrorMessage([
        {
          field: "set_staff_password_template",
          message: "Broken template",
        },
      ]),
    ).toBe("Broken template");
    expect(
      getNonSmtpPluginErrorMessage([
        {
          field: "host",
          message: "Missing host value.",
        },
      ]),
    ).toBeNull();
  });
});
