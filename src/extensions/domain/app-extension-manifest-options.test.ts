import {
  appExtensionManifestOptionsSchema,
  appExtensionManifestOptionsSchemaWithDefault,
} from "./app-extension-manifest-options";

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

    it("should accept missing method in newTabTarget since method is optional", () => {
      // Arrange
      const validData = {
        newTabTarget: {},
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept missing method in widgetTarget since method is optional", () => {
      // Arrange
      const validData = {
        widgetTarget: {},
      };

      // Act
      const result = appExtensionManifestOptionsSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
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

describe("App Extension Manifest Options Schema With Default", () => {
  describe("Default value behavior", () => {
    it("should apply default value when undefined is provided", () => {
      // Arrange
      const undefinedInput = undefined;

      // Act
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(undefinedInput);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        // The default value violates the exclusive target validation
        expect(result.error.issues[0].message).toBe(
          "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
        );
      }
    });

    it("should not apply default when empty object is provided", () => {
      // Arrange
      const emptyObject = {};

      // Act
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(emptyObject);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({});
      }
    });

    it("should not apply default when null is provided", () => {
      // Arrange
      const nullInput = null;

      // Act
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(nullInput);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Valid cases - default does not override explicit values", () => {
    it("should accept explicit newTabTarget with GET method", () => {
      // Arrange
      const validData = {
        newTabTarget: {
          method: "GET",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept explicit widgetTarget with POST method", () => {
      // Arrange
      const validData = {
        widgetTarget: {
          method: "POST",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });

  describe("Invalid cases - validation still applies", () => {
    it("should reject when both targets are explicitly set", () => {
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
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
        );
      }
    });

    it("should reject invalid HTTP methods even with default", () => {
      // Arrange
      const invalidData = {
        newTabTarget: {
          method: "PATCH",
        },
      };

      // Act
      const result = appExtensionManifestOptionsSchemaWithDefault.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Method must be either GET or POST");
      }
    });
  });
});
