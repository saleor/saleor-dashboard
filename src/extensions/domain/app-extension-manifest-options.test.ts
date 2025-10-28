import { appExtensionManifestOptionsSchema } from "./app-extension-manifest-options";

describe("App Extension Manifest Options Schema", () => {
  describe("Valid cases", () => {
    it("should accept valid newTabTarget with GET method", () => {
      // Arrange
      const validData = {
        newTabTarget: {
          method: "GET",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept valid newTabTarget with POST method", () => {
      // Arrange
      const validData = {
        newTabTarget: {
          method: "POST",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept valid widgetTarget with GET method", () => {
      // Arrange
      const validData = {
        widgetTarget: {
          method: "GET",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept valid widgetTarget with POST method", () => {
      // Arrange
      const validData = {
        widgetTarget: {
          method: "POST",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept empty object when both targets are optional", () => {
      // Arrange
      const validData = {};

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });

  describe("Invalid cases - method validation", () => {
    it("should reject newTabTarget with invalid method", () => {
      // Arrange
      const invalidData = {
        newTabTarget: {
          method: "PATCH",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Method must be either GET or POST");
      }
    });

    it("should reject widgetTarget with invalid method", () => {
      // Arrange
      const invalidData = {
        widgetTarget: {
          method: "DELETE",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Method must be either GET or POST");
      }
    });

    it("should reject lowercase method values", () => {
      // Arrange
      const invalidData = {
        newTabTarget: {
          method: "get",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Method must be either GET or POST");
      }
    });

    it("should reject missing method in newTabTarget", () => {
      // Arrange
      const invalidData = {
        newTabTarget: {},
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject missing method in widgetTarget", () => {
      // Arrange
      const invalidData = {
        widgetTarget: {},
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid cases - exclusive target validation", () => {
    it("should reject when both newTabTarget and widgetTarget are set", () => {
      // Arrange
      const invalidData = {
        newTabTarget: {
          method: "GET",
        },
        widgetTarget: {
          method: "POST",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
        );
      }
    });

    it("should reject when both newTabTarget and widgetTarget are set with same method", () => {
      // Arrange
      const invalidData = {
        newTabTarget: {
          method: "GET",
        },
        widgetTarget: {
          method: "GET",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
        );
      }
    });
  });

  describe("Edge cases", () => {
    it("should reject null values", () => {
      // Arrange
      const invalidData = null;

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject undefined values", () => {
      // Arrange
      const invalidData = undefined;

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject string values", () => {
      // Arrange
      const invalidData = "newTabTarget";

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject array values", () => {
      // Arrange
      const invalidData = [{ method: "GET" }];

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should allow additional properties to be stripped", () => {
      // Arrange
      const dataWithExtra = {
        newTabTarget: {
          method: "GET",
        },
        extraField: "should be ignored",
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(dataWithExtra);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({ newTabTarget: { method: "GET" } });
      }
    });
  });
});
