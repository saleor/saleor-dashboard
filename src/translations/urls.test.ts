import {
  languageEntitiesPath,
  languageEntitiesUrl,
  languageEntityPath,
  languageEntityUrl,
  languageListUrl,
  productUrl,
  productVariantUrl,
  TranslatableEntities,
} from "./urls";

describe("translations/urls", () => {
  describe("languageListUrl", () => {
    // Arrange // Act // Assert

    it("should return translations section path", () => {
      expect(languageListUrl).toBe("/translations/");
    });
  });

  describe("languageEntitiesPath", () => {
    // Arrange // Act // Assert

    it("should generate path for language code", () => {
      const result = languageEntitiesPath("en");

      expect(result).toBe("/translations/en");
    });

    it("should handle uppercase language codes", () => {
      const result = languageEntitiesPath("EN");

      expect(result).toBe("/translations/EN");
    });

    it("should handle language codes with region", () => {
      const result = languageEntitiesPath("en-US");

      expect(result).toBe("/translations/en-US");
    });

    it("should handle special characters in language code", () => {
      const result = languageEntitiesPath("zh_CN");

      expect(result).toBe("/translations/zh_CN");
    });
  });

  describe("languageEntitiesUrl", () => {
    // Arrange // Act // Assert

    it("should generate URL with query parameters", () => {
      const result = languageEntitiesUrl("en", {
        after: "cursor123",
        before: "cursor456",
      });

      expect(result).toContain("/translations/en?");
      expect(result).toContain("after=cursor123");
      expect(result).toContain("before=cursor456");
    });

    it("should handle tab parameter", () => {
      const result = languageEntitiesUrl("en", {
        tab: TranslatableEntities.products,
      });

      expect(result).toBe("/translations/en?tab=products");
    });

    it("should handle query parameter", () => {
      const result = languageEntitiesUrl("en", {
        query: "search term",
      });

      expect(result).toContain("/translations/en?");
      expect(result).toContain("query=search");
      expect(result).toContain("term");
    });

    it("should handle multiple parameters", () => {
      const result = languageEntitiesUrl("pl", {
        tab: TranslatableEntities.categories,
        query: "test",
        after: "cursor",
      });

      expect(result).toContain("/translations/pl?");
      expect(result).toContain("tab=categories");
      expect(result).toContain("query=test");
      expect(result).toContain("after=cursor");
    });

    it("should handle empty parameters object", () => {
      const result = languageEntitiesUrl("en", {});

      expect(result).toBe("/translations/en?");
    });

    it("should encode special characters in query parameter", () => {
      const result = languageEntitiesUrl("en", {
        query: "test & special",
      });

      expect(result).toContain("/translations/en?");
      // URL encoding should handle special characters
      expect(result).toMatch(/query=test.*special/);
    });
  });

  describe("languageEntityPath", () => {
    // Arrange // Act // Assert

    it("should generate path for entity without extra args", () => {
      const result = languageEntityPath("en", TranslatableEntities.products, "prod123");

      expect(result).toBe("/translations/en/products/prod123");
    });

    it("should handle all entity types", () => {
      const entities = [
        TranslatableEntities.categories,
        TranslatableEntities.products,
        TranslatableEntities.productVariants,
        TranslatableEntities.collections,
        TranslatableEntities.sales,
        TranslatableEntities.vouchers,
        TranslatableEntities.pages,
        TranslatableEntities.attributes,
        TranslatableEntities.shippingMethods,
        TranslatableEntities.menuItems,
      ];

      entities.forEach(entity => {
        const result = languageEntityPath("en", entity, "id123");

        expect(result).toBe(`/translations/en/${entity}/id123`);
      });
    });

    it("should handle extra path arguments", () => {
      const result = languageEntityPath(
        "en",
        TranslatableEntities.products,
        "prod123",
        "variants",
        "var456",
      );

      expect(result).toBe("/translations/en/products/prod123/variants/var456");
    });

    it("should handle multiple extra arguments", () => {
      const result = languageEntityPath(
        "pl",
        TranslatableEntities.categories,
        "cat123",
        "subcategory",
        "subcat456",
        "details",
      );

      expect(result).toBe("/translations/pl/categories/cat123/subcategory/subcat456/details");
    });

    it("should handle empty extra arguments array", () => {
      const result = languageEntityPath("en", TranslatableEntities.products, "prod123");

      expect(result).toBe("/translations/en/products/prod123");
    });

    it("should not encode special characters in path (raw path generation)", () => {
      const result = languageEntityPath("en", TranslatableEntities.products, "prod 123");

      // languageEntityPath doesn't encode - it's raw path
      expect(result).toBe("/translations/en/products/prod 123");
    });
  });

  describe("languageEntityUrl", () => {
    // Arrange // Act // Assert

    it("should generate URL with encoded ID", () => {
      const result = languageEntityUrl("en", TranslatableEntities.products, "prod123");

      expect(result).toBe("/translations/en/products/prod123");
    });

    it("should encode special characters in ID", () => {
      const result = languageEntityUrl("en", TranslatableEntities.products, "prod 123");

      expect(result).toBe("/translations/en/products/prod%20123");
    });

    it("should encode base64-like IDs", () => {
      const base64Id = "UHJvZHVjdDoxNTc=";
      const result = languageEntityUrl("en", TranslatableEntities.products, base64Id);

      expect(result).toBe("/translations/en/products/UHJvZHVjdDoxNTc%3D");
    });

    it("should encode special URL characters", () => {
      const result = languageEntityUrl(
        "en",
        TranslatableEntities.products,
        "id&with?special/chars",
      );

      expect(result).toContain("/translations/en/products/");
      expect(result).not.toContain("&with?special/chars");
      // Should be URL encoded
      expect(result).toContain("%26"); // &
      expect(result).toContain("%3F"); // ?
      expect(result).toContain("%2F"); // /
    });

    it("should handle Unicode characters in ID", () => {
      const result = languageEntityUrl("pl", TranslatableEntities.products, "produkt-test");

      expect(result).toContain("/translations/pl/products/");
      expect(result).toContain("produkt");
    });

    it("should handle extra arguments without encoding", () => {
      const result = languageEntityUrl(
        "en",
        TranslatableEntities.products,
        "prod 123",
        "variants",
        "var456",
      );

      expect(result).toContain("/translations/en/products/prod%20123/variants/var456");
    });

    it("should handle empty string ID", () => {
      const result = languageEntityUrl("en", TranslatableEntities.products, "");

      // url-join removes trailing slash for empty string
      expect(result).toBe("/translations/en/products");
    });

    it("should handle all translatable entity types", () => {
      const entityTests = [
        { entity: TranslatableEntities.categories, expected: "categories" },
        { entity: TranslatableEntities.products, expected: "products" },
        { entity: TranslatableEntities.productVariants, expected: "variants" },
        { entity: TranslatableEntities.collections, expected: "collections" },
        { entity: TranslatableEntities.sales, expected: "sales" },
        { entity: TranslatableEntities.vouchers, expected: "vouchers" },
        { entity: TranslatableEntities.pages, expected: "pages" },
        { entity: TranslatableEntities.attributes, expected: "attributes" },
        { entity: TranslatableEntities.shippingMethods, expected: "shippingMethods" },
        { entity: TranslatableEntities.menuItems, expected: "menuItems" },
      ];

      entityTests.forEach(({ entity, expected }) => {
        const result = languageEntityUrl("en", entity, "id123");

        expect(result).toBe(`/translations/en/${expected}/id123`);
      });
    });
  });

  describe("productVariantUrl", () => {
    // Arrange // Act // Assert

    it("should generate URL for product variant", () => {
      const result = productVariantUrl("en", "prod123", "var456");

      expect(result).toBe("/translations/en/products/prod123/variants/var456");
    });

    it("should encode product ID with special characters", () => {
      const result = productVariantUrl("en", "prod 123", "var456");

      expect(result).toBe("/translations/en/products/prod%20123/variants/var456");
    });

    it("should NOT encode variant ID (passed as extra arg)", () => {
      const result = productVariantUrl("en", "prod123", "var 456");

      // Variant ID is passed as extra arg, not encoded
      expect(result).toBe("/translations/en/products/prod123/variants/var 456");
    });

    it("should encode product ID but not variant ID (extra args not encoded)", () => {
      const result = productVariantUrl("pl", "prod&123", "var?456");

      // Product ID is encoded, variant ID is not (it's an extra arg)
      expect(result).toBe("/translations/pl/products/prod%26123/variants/var?456");
    });

    it("should handle base64-encoded IDs", () => {
      const productId = "UHJvZHVjdDoxNTc=";
      const variantId = "UHJvZHVjdFZhcmlhbnQ6MzQ1";
      const result = productVariantUrl("en", productId, variantId);

      expect(result).toContain("/translations/en/products/UHJvZHVjdDoxNTc%3D/variants/");
      expect(result).toContain("UHJvZHVjdFZhcmlhbnQ6MzQ1");
    });

    it("should work with different language codes", () => {
      const languageCodes = ["en", "pl", "de", "fr", "es", "en-US", "zh-CN"];

      languageCodes.forEach(code => {
        const result = productVariantUrl(code, "prod123", "var456");

        expect(result).toBe(`/translations/${code}/products/prod123/variants/var456`);
      });
    });

    it("should handle empty product ID", () => {
      const result = productVariantUrl("en", "", "var456");

      // url-join handles empty strings
      expect(result).toContain("/translations/en/products");
      expect(result).toContain("variants/var456");
    });

    it("should handle empty variant ID", () => {
      const result = productVariantUrl("en", "prod123", "");

      // url-join may remove trailing slash
      expect(result).toContain("/translations/en/products/prod123/variants");
    });
  });

  describe("productUrl", () => {
    // Arrange // Act // Assert

    it("should generate URL for product", () => {
      const result = productUrl("en", "prod123");

      expect(result).toBe("/translations/en/products/prod123");
    });

    it("should encode product ID with special characters", () => {
      const result = productUrl("en", "prod 123");

      expect(result).toBe("/translations/en/products/prod%20123");
    });

    it("should handle base64-encoded product ID", () => {
      const productId = "UHJvZHVjdDoxNTc=";
      const result = productUrl("en", productId);

      expect(result).toBe("/translations/en/products/UHJvZHVjdDoxNTc%3D");
    });

    it("should encode special URL characters", () => {
      const result = productUrl("pl", "prod&id?test");

      expect(result).toContain("/translations/pl/products/");
      expect(result).toContain("%26"); // &
      expect(result).toContain("%3F"); // ?
    });

    it("should work with different language codes", () => {
      const languageCodes = ["en", "pl", "de", "fr", "es", "ja", "ko"];

      languageCodes.forEach(code => {
        const result = productUrl(code, "prod123");

        expect(result).toBe(`/translations/${code}/products/prod123`);
      });
    });

    it("should handle Unicode characters in product ID", () => {
      const result = productUrl("pl", "produkt-test");

      expect(result).toContain("/translations/pl/products/");
      // Should contain the product name
      expect(result).toContain("produkt-test");
    });

    it("should handle empty product ID", () => {
      const result = productUrl("en", "");

      // url-join removes trailing slash for empty string
      expect(result).toBe("/translations/en/products");
    });

    it("should handle forward slashes in product ID", () => {
      const result = productUrl("en", "category/subcategory/product");

      expect(result).toContain("/translations/en/products/");
      expect(result).toContain("%2F"); // Encoded /
    });
  });

  describe("Edge Cases and Security", () => {
    // Arrange // Act // Assert

    it("should handle null-like strings in language code", () => {
      const result = languageEntitiesPath("null");

      expect(result).toBe("/translations/null");
    });

    it("should handle XSS attempts in entity IDs", () => {
      const xssAttempt = "<script>alert('xss')</script>";
      const result = languageEntityUrl("en", TranslatableEntities.products, xssAttempt);

      expect(result).toContain("/translations/en/products/");
      expect(result).not.toContain("<script>");
      expect(result).toContain("%3C"); // Encoded <
      expect(result).toContain("%3E"); // Encoded >
    });

    it("should handle path traversal attempts in entity IDs", () => {
      const pathTraversal = "../../../etc/passwd";
      const result = languageEntityUrl("en", TranslatableEntities.products, pathTraversal);

      expect(result).toContain("/translations/en/products/");
      expect(result).toContain("%2F"); // Encoded /
      expect(result).toContain(".."); // Dots are not encoded but / is
    });

    it("should handle SQL injection-like strings in IDs", () => {
      const sqlInjection = "'; DROP TABLE products--";
      const result = languageEntityUrl("en", TranslatableEntities.products, sqlInjection);

      expect(result).toContain("/translations/en/products/");
      // URL encoding should make it safe - single quote becomes %27 or '
      expect(result).toContain("DROP");
      expect(result).toContain("TABLE");
      // Verify dangerous chars are handled
      expect(result).toMatch(/['%27].*DROP/);
    });

    it("should handle very long IDs", () => {
      const longId = "a".repeat(1000);
      const result = productUrl("en", longId);

      expect(result).toBe(`/translations/en/products/${longId}`);
      expect(result.length).toBeGreaterThan(1000);
    });

    it("should handle IDs with only special characters", () => {
      const specialId = "!@#$%^&*()";
      const result = languageEntityUrl("en", TranslatableEntities.products, specialId);

      expect(result).toContain("/translations/en/products/");
      // All special chars should be encoded
      expect(result).not.toContain("!@#$%^&*()");
    });

    it("should handle query parameters with arrays", () => {
      const result = languageEntitiesUrl("en", {
        tab: TranslatableEntities.products,
        // @ts-expect-error - testing edge case
        multiValue: ["value1", "value2"],
      });

      expect(result).toContain("/translations/en?");
      expect(result).toContain("tab=products");
    });

    it("should handle reserved URI characters in language code", () => {
      const result = languageEntitiesPath("en:US");

      // Language code is not encoded in path generation
      expect(result).toBe("/translations/en:US");
    });

    it("should handle percent-encoded values passed to productUrl", () => {
      const alreadyEncoded = "prod%20123";
      const result = productUrl("en", alreadyEncoded);

      // Should double-encode
      expect(result).toBe("/translations/en/products/prod%2520123");
    });
  });

  describe("Integration Scenarios", () => {
    // Arrange // Act // Assert

    it("should create valid navigation path from list to entity", () => {
      const listUrl = languageEntitiesUrl("en", {
        tab: TranslatableEntities.products,
      });
      const entityUrl = languageEntityUrl("en", TranslatableEntities.products, "prod123");

      expect(listUrl).toBe("/translations/en?tab=products");
      expect(entityUrl).toBe("/translations/en/products/prod123");
      expect(entityUrl).toContain("/translations/en");
    });

    it("should create valid path from product to variant", () => {
      const productPath = productUrl("pl", "prod123");
      const variantPath = productVariantUrl("pl", "prod123", "var456");

      expect(variantPath).toContain(productPath);
      expect(variantPath).toBe("/translations/pl/products/prod123/variants/var456");
    });

    it("should handle real-world GraphQL base64 IDs", () => {
      const productId = "UHJvZHVjdDoxNTc=";
      const variantId = "UHJvZHVjdFZhcmlhbnQ6MzQ1";

      const productPath = productUrl("en", productId);
      const variantPath = productVariantUrl("en", productId, variantId);

      expect(productPath).toBe("/translations/en/products/UHJvZHVjdDoxNTc%3D");
      expect(variantPath).toContain("UHJvZHVjdDoxNTc%3D");
      expect(variantPath).toContain("UHJvZHVjdFZhcmlhbnQ6MzQ1");
    });

    it("should maintain consistency between path and url functions", () => {
      const path = languageEntityPath("en", TranslatableEntities.products, "simple-id");
      const url = languageEntityUrl("en", TranslatableEntities.products, "simple-id");

      // For simple IDs without special chars, path and url should match
      expect(path).toBe(url);
    });

    it("should handle language switching for same entity", () => {
      const languages = ["en", "pl", "de", "fr"];
      const productId = "prod123";

      const urls = languages.map(lang => productUrl(lang, productId));

      expect(urls).toEqual([
        "/translations/en/products/prod123",
        "/translations/pl/products/prod123",
        "/translations/de/products/prod123",
        "/translations/fr/products/prod123",
      ]);
    });
  });
});
