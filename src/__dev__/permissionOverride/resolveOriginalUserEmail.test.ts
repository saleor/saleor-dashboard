import { resolveOriginalUserEmail } from "./resolveOriginalUserEmail";

describe("resolveOriginalUserEmail", () => {
  it("prefers the stored original email", () => {
    // Arrange // Act // Assert
    expect(resolveOriginalUserEmail("admin@saleor.io", "admin+debugdev-12345678@saleor.io")).toBe(
      "admin@saleor.io",
    );
  });

  it("derives the base email from the current debug session", () => {
    // Arrange // Act // Assert
    expect(resolveOriginalUserEmail(null, "mirek+dashboard+debugdev-abcdef12@saleor.io")).toBe(
      "mirek+dashboard@saleor.io",
    );
  });

  it("returns the current email for a normal session", () => {
    // Arrange // Act // Assert
    expect(resolveOriginalUserEmail(null, "mirek+dashboard@saleor.io")).toBe(
      "mirek+dashboard@saleor.io",
    );
    expect(resolveOriginalUserEmail(null, undefined)).toBeNull();
  });
});
