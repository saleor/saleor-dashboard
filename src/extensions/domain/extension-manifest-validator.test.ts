import { ExtensionManifestValidator } from "./extension-manifest-validator";

describe("ExtensionManifestValidator", () => {
  let validator: ExtensionManifestValidator;

  beforeEach(() => {
    validator = new ExtensionManifestValidator();
  });

  it("should return valid AppManifest data when validation succeeds", () => {
    // Arrange
    const validManifest = {
      appUrl: "https://example.com",
      permissions: [{ code: "MANAGE_PRODUCTS" }],
    };

    // Act
    const result = validator.validateAppManifest(validManifest);

    // Assert
    const isFailure = "issues" in result;

    expect(isFailure).toBe(false);

    if (!isFailure) {
      expect(result.appUrl).toBe("https://example.com");
      expect(result.permissions).toHaveLength(1);
      expect(result.permissions[0].code).toBe("MANAGE_PRODUCTS");
    }
  });

  it("should return issues array when validation fails", () => {
    // Arrange
    const invalidManifest = {
      extensions: [
        {
          label: "Extension",
          url: "https://example.com/ext",
          mount: "PRODUCT_OVERVIEW_CREATE",
          permissions: ["INVALID_PERMISSION"],
        },
      ],
    };

    // Act
    const result = validator.validateAppManifest(invalidManifest);

    // Assert
    expect("issues" in result).toBe(true);

    if ("issues" in result) {
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);

      const firstIssue = result.issues[0];

      expect(firstIssue).toHaveProperty("path");
      expect(firstIssue).toHaveProperty("message");
      expect(firstIssue).toHaveProperty("code");
    }
  });

  it("should handle null input and return issues", () => {
    // Arrange
    const invalidManifest = null;

    // Act
    const result = validator.validateAppManifest(invalidManifest);

    // Assert
    expect("issues" in result).toBe(true);

    if ("issues" in result) {
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });

  it("should return valid manifest with minimal data", () => {
    // Arrange
    const minimalManifest = {};

    // Act
    const result = validator.validateAppManifest(minimalManifest);

    // Assert
    expect("issues" in result).toBe(false);
    expect("extensions" in result).toBe(true);

    if ("extensions" in result) {
      expect(result.extensions).toEqual([]);
    }
  });
});
