import {
  isAuthOnlyPath,
  newPasswordPath,
  passwordResetPath,
  passwordResetSuccessPath,
} from "./urls";

describe("isAuthOnlyPath", () => {
  it("matches new-password and reset-password routes", () => {
    // Arrange // Act // Assert
    expect(isAuthOnlyPath(newPasswordPath)).toBe(true);
    expect(isAuthOnlyPath("/dashboard/new-password/")).toBe(true);
    expect(isAuthOnlyPath(passwordResetPath)).toBe(true);
    expect(isAuthOnlyPath(passwordResetSuccessPath)).toBe(true);
  });

  it("does not match dashboard routes", () => {
    // Arrange // Act // Assert
    expect(isAuthOnlyPath("/orders/")).toBe(false);
    expect(isAuthOnlyPath("/")).toBe(false);
  });
});
