import { AppManifestFragment, PermissionEnum } from "@dashboard/graphql";

import { appManifestSchema } from "./app-manifest";

const getValidManifestBase = (overrides: Partial<AppManifestFragment> = {}) => {
  const validData: AppManifestFragment = {
    appUrl: "https://example.com",
    permissions: [],
    extensions: [],
    __typename: "Manifest",
    identifier: "",
    version: "",
    about: "",
    name: "",
    configurationUrl: "",
    tokenTargetUrl: "",
    dataPrivacy: "",
    dataPrivacyUrl: "",
    homepageUrl: "",
    supportUrl: "",
    brand: {
      __typename: "AppManifestBrand",
      logo: {
        __typename: "AppManifestBrandLogo",
        default: "",
      },
    },
    ...overrides,
  };

  return validData;
};

describe("App Manifest Schema", () => {
  describe("Valid cases - basic structure", () => {
    it("should accept valid manifest with all optional fields", () => {
      // Arrange
      const validData = getValidManifestBase();

      validData.extensions = [
        {
          label: "My Extension",
          url: "https://example.com/extension",
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "POPUP",
          permissions: [
            {
              code: PermissionEnum.MANAGE_PRODUCTS,
              __typename: "Permission",
              name: "Manage Products",
            },
          ],
          __typename: "AppManifestExtension",
        },
      ];

      validData.permissions = [
        {
          code: PermissionEnum.MANAGE_PRODUCTS,
          __typename: "Permission",
          name: "Manage Products",
        },
        { code: PermissionEnum.MANAGE_ORDERS, __typename: "Permission", name: "Manage Products" },
      ];

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.appUrl).toBe("https://example.com");
        expect(result.data.permissions).toEqual([
          { code: "MANAGE_PRODUCTS" },
          { code: "MANAGE_ORDERS" },
        ]);
        expect(result.data.extensions).toHaveLength(1);
      }
    });

    it("should accept manifest with only appUrl", () => {
      // Arrange
      const validData = {
        appUrl: "https://example.com",
      };

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.appUrl).toBe("https://example.com");
        expect(result.data.permissions).toEqual([]); // default value
        expect(result.data.extensions).toEqual([]); // default value
      }
    });

    it("should accept manifest with only permissions", () => {
      // Arrange
      const validData = {
        permissions: [{ code: "MANAGE_PRODUCTS" }],
      };

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.permissions).toEqual([{ code: "MANAGE_PRODUCTS" }]);
        expect(result.data.appUrl).toBeUndefined();
        expect(result.data.extensions).toEqual([]); // default value
      }
    });

    it("should accept empty manifest with defaults", () => {
      // Arrange
      const validData = {};

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.permissions).toEqual([]);
        expect(result.data.extensions).toEqual([]);
      }
    });

    it("should accept manifest with absolute URL extension and appUrl", () => {
      const validData = getValidManifestBase({
        permissions: [
          {
            code: PermissionEnum.MANAGE_PRODUCTS,
            __typename: "Permission",
            name: "MANAGE_PRODUCTS",
          },
        ],
        extensions: [
          {
            label: "Extension",
            url: "https://example.com/ext",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "POPUP",
            permissions: [],
            __typename: "AppManifestExtension",
          },
        ],
      });

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });
  });

  describe("Valid cases - extension URL validation", () => {
    it("should accept absolute URL with NEW_TAB target without appUrl", () => {
      // Arrange
      const validData = getValidManifestBase();

      validData.extensions = [
        {
          label: "Extension",
          url: "https://example.com/ext",
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "NEW_TAB",
          __typename: "AppManifestExtension",
          permissions: [],
        },
      ];

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept relative URL with APP_PAGE target without appUrl", () => {
      // Arrange
      const validData = getValidManifestBase();

      validData.extensions = [
        {
          label: "Extension",
          url: "/app/page",
          mountName: "NAVIGATION_CATALOG",
          targetName: "APP_PAGE",
          permissions: [],
          __typename: "AppManifestExtension",
        },
      ];

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid cases - permission subset validation", () => {
    it("should reject when extension permission is not in app permissions", () => {
      // Arrange
      const baseData = getValidManifestBase();

      baseData.permissions = [
        { code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission", name: "" },
      ];
      baseData.extensions = [
        {
          label: "Extension",
          url: "https://example.com/ext",
          mountName: "PRODUCT_OVERVIEW_CREATE",
          permissions: [
            {
              code: PermissionEnum.MANAGE_ORDERS,
              __typename: "Permission",
              name: "Manage Products",
            },
          ],
          __typename: "AppManifestExtension",
          targetName: "POPUP",
        },
      ];

      // Act
      const result = appManifestSchema.safeParse(baseData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Extension permission must be listed in App's permissions.",
        );
      }
    });

    it("should accept when all extension permissions are subset of app permissions", () => {
      // Arrange
      const validData = getValidManifestBase({
        permissions: [
          { code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission", name: "" },
          { code: PermissionEnum.MANAGE_ORDERS, __typename: "Permission", name: "" },
        ],
        extensions: [
          {
            label: "Extension",
            url: "https://example.com/ext",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            permissions: [
              {
                code: PermissionEnum.MANAGE_PRODUCTS,
                __typename: "Permission",
                name: "Manage Products",
              },
            ],
            __typename: "AppManifestExtension",
            targetName: "POPUP",
          },
        ],
      });

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should accept extension with empty permissions", () => {
      // Arrange
      const validData = getValidManifestBase({
        permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission", name: "" }],
        extensions: [
          {
            label: "Extension",
            url: "https://example.com/ext",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            permissions: [],
            __typename: "AppManifestExtension",
            targetName: "POPUP",
          },
        ],
      });

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should reject when any extension permission is not in app permissions", () => {
      // Arrange
      const invalidData = getValidManifestBase({
        permissions: [
          { code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission", name: "" },
          { code: PermissionEnum.MANAGE_ORDERS, __typename: "Permission", name: "" },
        ],
        extensions: [
          {
            label: "Extension",
            url: "https://example.com/ext",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            permissions: [
              {
                code: PermissionEnum.MANAGE_PRODUCTS,
                __typename: "Permission",
                name: "Manage Products",
              },
              {
                code: PermissionEnum.MANAGE_STAFF,
                __typename: "Permission",
                name: "Manage Staff",
              },
            ],
            __typename: "AppManifestExtension",
            targetName: "POPUP",
          },
        ],
      });

      // Act
      const result = appManifestSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Extension permission must be listed in App's permissions.",
        );
      }
    });
  });

  describe("Smoke tests - extensions field", () => {
    it("should accept manifest with one extension (basic smoke test)", () => {
      // Arrange
      const validData = getValidManifestBase({
        permissions: [
          {
            code: PermissionEnum.MANAGE_PRODUCTS,
            __typename: "Permission",
            name: "Manage Products",
          },
        ],
        extensions: [
          {
            label: "Product Extension",
            url: "https://example.com/product-ext",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "POPUP",
            permissions: [
              {
                code: PermissionEnum.MANAGE_PRODUCTS,
                __typename: "Permission",
                name: "Manage Products",
              },
            ],
            __typename: "AppManifestExtension",
          },
        ],
      });

      // Act
      const result = appManifestSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.extensions).toHaveLength(1);
        expect(result.data.extensions[0].label).toBe("Product Extension");
      }
    });
  });

  describe("Edge cases", () => {
    it("should reject null values", () => {
      // Arrange
      const invalidData = null;

      // Act
      const result = appManifestSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject undefined values", () => {
      // Arrange
      const invalidData = undefined;

      // Act
      const result = appManifestSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject string values", () => {
      // Arrange
      const invalidData = "manifest";

      // Act
      const result = appManifestSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should reject invalid permission type (number instead of array)", () => {
      // Arrange
      const invalidData = {
        permissions: 123,
      };

      // Act
      const result = appManifestSchema.safeParse(invalidData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should strip additional properties", () => {
      // Arrange
      const dataWithExtra = {
        appUrl: "https://example.com",
        permissions: [{ code: "MANAGE_PRODUCTS" }],
        extraField: "should be ignored",
      };

      // Act
      const result = appManifestSchema.safeParse(dataWithExtra);

      // Assert
      expect(result.success).toBe(true);

      if (result.success) {
        expect("extraField" in result.data).toBe(false);
      }
    });
  });
});
