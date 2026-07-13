import { buildDebugStaffEmail, getBaseStaffEmail, isDebugStaffEmail } from "./debugStaffEmail";

describe("debugStaffEmail", () => {
  it("detects debug staff emails", () => {
    // Arrange // Act // Assert
    expect(isDebugStaffEmail("admin+debugdev-12345678@saleor.io")).toBe(true);
    expect(isDebugStaffEmail("mirek+dashboard+debugdev-abcdef12@saleor.io")).toBe(true);
    expect(isDebugStaffEmail("admin@saleor.io")).toBe(false);
    expect(isDebugStaffEmail(undefined)).toBe(false);
  });

  it("builds debug staff emails from base addresses with existing plus tags", () => {
    // Arrange // Act // Assert
    expect(buildDebugStaffEmail("mirek+dashboard@saleor.io", "abcdef12")).toBe(
      "mirek+dashboard+debugdev-abcdef12@saleor.io",
    );
    expect(buildDebugStaffEmail("admin+debugdev-12345678@saleor.io", "abcdef12")).toBe(
      "admin+debugdev-abcdef12@saleor.io",
    );
  });

  it("restores the base staff email from a debug address", () => {
    // Arrange // Act // Assert
    expect(getBaseStaffEmail("mirek+dashboard+debugdev-abcdef12@saleor.io")).toBe(
      "mirek+dashboard@saleor.io",
    );
    expect(getBaseStaffEmail("admin@saleor.io")).toBe("admin@saleor.io");
  });
});
