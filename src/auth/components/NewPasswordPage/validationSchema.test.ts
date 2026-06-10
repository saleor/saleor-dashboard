import { type IntlShape, type MessageDescriptor } from "react-intl";

import { getNewPasswordSchema } from "./validationSchema";

const intl: IntlShape = {
  formatMessage: (descriptor: MessageDescriptor) => descriptor.defaultMessage ?? "",
} as IntlShape;

describe("getNewPasswordSchema", () => {
  const schema = getNewPasswordSchema(intl);

  it("rejects empty password with the required message", () => {
    // Arrange
    const input = { password: "", confirmPassword: "" };

    // Act
    const result = schema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);

    if (result.success) return;

    const passwordIssue = result.error.issues.find(issue => issue.path[0] === "password");

    expect(passwordIssue?.message).toBe("Password is required");
  });

  it("rejects mismatched passwords with the path on confirmPassword", () => {
    // Arrange
    const input = { password: "secret-1", confirmPassword: "secret-2" };

    // Act
    const result = schema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);

    if (result.success) return;

    const confirmIssue = result.error.issues.find(issue => issue.path[0] === "confirmPassword");

    expect(confirmIssue?.message).toBe("Passwords do not match");
  });

  it("accepts a valid pair of matching passwords", () => {
    // Arrange
    const input = { password: "secret-123", confirmPassword: "secret-123" };

    // Act
    const result = schema.safeParse(input);

    // Assert
    expect(result.success).toBe(true);
  });
});
