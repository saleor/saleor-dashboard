import { appExtensionManifest } from "./app-extension-manifest";

describe("App Extension Manifest Schema", () => {
  describe("Valid cases - basic structure", () => {
    it("should accept valid manifest with required fields only", () => {
      // Arrange
      const validData = {
        label: "My Extension",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.label).toBe("My Extension");
        expect(result.data.url).toBe("https://example.com/extension");
        expect(result.data.mount).toBe("PRODUCT_OVERVIEW_CREATE");
        expect(result.data.target).toBe("POPUP"); // default value
        expect(result.data.permissions).toEqual([]); // default value
      }
    });

    it("should accept manifest with all fields", () => {
      // Arrange
      const validData = {
        label: "My Extension",
        url: "/app/extension",
        mount: "NAVIGATION_CATALOG",
        target: "APP_PAGE" as const,
        permissions: [{ code: "MANAGE_PRODUCTS" }],
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept manifest with POPUP target", () => {
      // Arrange
      const validData = {
        label: "Popup Extension",
        url: "https://example.com/popup",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "POPUP" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept manifest with NEW_TAB target and options", () => {
      // Arrange
      const validData = {
        label: "New Tab Extension",
        url: "https://example.com/newtab",
        mount: "PRODUCT_OVERVIEW_MORE_ACTIONS",
        target: "NEW_TAB" as const,
        options: {
          newTabTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept manifest with WIDGET target and widget-compatible mount", () => {
      // Arrange
      const validData = {
        label: "Widget Extension",
        url: "https://example.com/widget",
        mount: "PRODUCT_DETAILS_WIDGETS",
        target: "WIDGET" as const,
        options: {
          widgetTarget: {
            method: "POST" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept manifest with relative URL for APP_PAGE target", () => {
      // Arrange
      const validData = {
        label: "App Page Extension",
        url: "/app/extension",
        mount: "NAVIGATION_CATALOG",
        target: "APP_PAGE" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept manifest with absolute URL for non-APP_PAGE target", () => {
      // Arrange
      const validData = {
        label: "External Extension",
        url: "https://example.com/extension",
        mount: "ORDER_OVERVIEW_CREATE",
        target: "POPUP" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept different widget-compatible mounts", () => {
      // Arrange
      const mounts = [
        "ORDER_DETAILS_WIDGETS",
        "PRODUCT_DETAILS_WIDGETS",
        "VOUCHER_DETAILS_WIDGETS",
        "DRAFT_ORDER_DETAILS_WIDGETS",
        "GIFT_CARD_DETAILS_WIDGETS",
        "CUSTOMER_DETAILS_WIDGETS",
        "COLLECTION_DETAILS_WIDGETS",
      ];

      // Act & Assert
      for (const mount of mounts) {
        const result = appExtensionManifest.safeParse({
          label: "Widget Extension",
          url: "https://example.com/widget",
          mount,
          target: "WIDGET" as const,
        });

        expect(result.success).toBe(true);
      }
    });
  });

  describe("Invalid cases - WIDGET target mount validation", () => {
    it("should reject WIDGET target with non-widget mount", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Widget",
        url: "https://example.com/widget",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "WIDGET" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Mount is not available for WIDGET target.");
      }
    });

    it("should reject WIDGET target with navigation mount", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Widget",
        url: "https://example.com/widget",
        mount: "NAVIGATION_CATALOG",
        target: "WIDGET" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Mount is not available for WIDGET target.");
      }
    });

    it("should reject WIDGET target with order creation mount", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Widget",
        url: "https://example.com/widget",
        mount: "ORDER_OVERVIEW_CREATE",
        target: "WIDGET" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid cases - widgetTarget options validation", () => {
    it("should reject widgetTarget options on POPUP target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Options",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "POPUP" as const,
        options: {
          widgetTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "widgetTarget options must be set only on WIDGET target",
        );
      }
    });

    it("should reject widgetTarget options on NEW_TAB target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Options",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "NEW_TAB" as const,
        options: {
          widgetTarget: {
            method: "POST" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject widgetTarget options on APP_PAGE target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Options",
        url: "/app/extension",
        mount: "NAVIGATION_CATALOG",
        target: "APP_PAGE" as const,
        options: {
          widgetTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid cases - newTabTarget options validation", () => {
    it("should reject newTabTarget options on POPUP target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Options",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "POPUP" as const,
        options: {
          newTabTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "newTabTarget options must be set only on NEW_TAB target",
        );
      }
    });

    it("should reject newTabTarget options on WIDGET target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Options",
        url: "https://example.com/extension",
        mount: "PRODUCT_DETAILS_WIDGETS",
        target: "WIDGET" as const,
        options: {
          newTabTarget: {
            method: "POST" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject newTabTarget options on APP_PAGE target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Options",
        url: "/app/extension",
        mount: "NAVIGATION_CATALOG",
        target: "APP_PAGE" as const,
        options: {
          newTabTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid cases - URL validation", () => {
    it("should accept relative URL on POPUP target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid URL",
        url: "/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "POPUP" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept relative URL on NEW_TAB target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid URL",
        url: "/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "NEW_TAB" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept relative URL on WIDGET target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid URL",
        url: "/widget",
        mount: "PRODUCT_DETAILS_WIDGETS",
        target: "WIDGET" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should reject absolute URL on APP_PAGE target", () => {
      // Arrange
      const invalidData = {
        label: "Invalid URL",
        url: "https://example.com/extension",
        mount: "NAVIGATION_CATALOG",
        target: "APP_PAGE" as const,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          `APP_PAGE type of extension must start with "/"`,
        );
      }
    });
  });

  describe("Invalid cases - required fields validation", () => {
    it("should reject manifest with empty label", () => {
      // Arrange
      const invalidData = {
        label: "",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject manifest with empty URL", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        url: "",
        mount: "PRODUCT_OVERVIEW_CREATE",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject manifest without label", () => {
      // Arrange
      const invalidData = {
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject manifest without URL", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject manifest without mount", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        url: "https://example.com/extension",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid cases - invalid values", () => {
    it("should reject invalid mount", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        url: "https://example.com/extension",
        mount: "INVALID_MOUNT",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject invalid target", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        target: "INVALID_TARGET",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject invalid permission type", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        permissions: 123,
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should reject null values", () => {
      // Arrange
      const invalidData = null;

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject undefined values", () => {
      // Arrange
      const invalidData = undefined;

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject string values", () => {
      // Arrange
      const invalidData = "manifest";

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject array values", () => {
      // Arrange
      const invalidData = [
        {
          label: "Extension",
          url: "https://example.com",
          mount: "PRODUCT_OVERVIEW_CREATE",
        },
      ];

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should strip additional properties", () => {
      // Arrange
      const dataWithExtra = {
        label: "My Extension",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        extraField: "should be ignored",
        anotherExtra: 123,
      };

      // Act
      const result = appExtensionManifest.safeParse(dataWithExtra);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({
          label: "My Extension",
          url: "https://example.com/extension",
          mount: "PRODUCT_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
        });
        expect("extraField" in result.data).toBe(false);
      }
    });

    it("should reject permissions as non-array", () => {
      // Arrange
      const invalidData = {
        label: "My Extension",
        url: "https://example.com/extension",
        mount: "PRODUCT_OVERVIEW_CREATE",
        permissions: "MANAGE_PRODUCTS",
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("Combined validation scenarios", () => {
    it("should validate WIDGET target with widgetTarget options and widget-compatible mount", () => {
      // Arrange
      const validData = {
        label: "Product Widget",
        url: "https://example.com/widget",
        mount: "PRODUCT_DETAILS_WIDGETS",
        target: "WIDGET" as const,
        permissions: [{ code: "MANAGE_PRODUCTS" }],
        options: {
          widgetTarget: {
            method: "POST" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should validate NEW_TAB target with newTabTarget options and absolute URL", () => {
      // Arrange
      const validData = {
        label: "New Tab Extension",
        url: "https://example.com/extension",
        mount: "ORDER_OVERVIEW_MORE_ACTIONS",
        target: "NEW_TAB" as const,
        permissions: [{ code: "MANAGE_ORDERS" }],
        options: {
          newTabTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should validate APP_PAGE target with relative URL and navigation mount", () => {
      // Arrange
      const validData = {
        label: "App Page Extension",
        url: "/my-extension",
        mount: "NAVIGATION_CATALOG",
        target: "APP_PAGE" as const,
        permissions: [{ code: "MANAGE_PRODUCTS" }, { code: "MANAGE_ORDERS" }],
      };

      // Act
      const result = appExtensionManifest.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should reject WIDGET target with widgetTarget on wrong mount", () => {
      // Arrange
      const invalidData = {
        label: "Invalid Widget",
        url: "https://example.com/widget",
        mount: "PRODUCT_OVERVIEW_CREATE", // Not a widget mount
        target: "WIDGET" as const,
        options: {
          widgetTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject manifest with multiple validation errors", () => {
      // Arrange
      const invalidData = {
        label: "", // Empty label
        url: "/relative", // Relative URL on non-APP_PAGE
        mount: "INVALID_MOUNT",
        target: "POPUP" as const,
        options: {
          newTabTarget: {
            method: "GET" as const,
          },
        },
      };

      // Act
      const result = appExtensionManifest.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
      // Will fail on the first validation that fails
    });
  });
});
