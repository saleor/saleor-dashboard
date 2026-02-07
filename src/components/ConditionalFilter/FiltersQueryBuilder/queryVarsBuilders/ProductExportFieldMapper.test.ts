import { ApolloClient } from "@apollo/client";

import { CategoryHandler, CollectionHandler, ProductTypeHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import {
  ConditionItem,
  ConditionOptions,
  StaticElementName,
} from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { ProductExportFieldMapper } from "./ProductExportFieldMapper";

describe("ProductExportFieldMapper", () => {
  const builder = new ProductExportFieldMapper();
  const client = {} as ApolloClient<unknown>;

  function createFilterElement(
    fieldName: string,
    selectedValue: unknown,
    conditionLabel?: string,
  ): FilterElement {
    const value = new ExpressionValue(fieldName, fieldName, fieldName);
    const conditionType = Array.isArray(selectedValue) ? "multiselect" : "select";
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel || fieldName,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(
      conditionItem,
      selectedValue as ConditionValue,
    );
    const condition = new Condition(
      ConditionOptions.fromName(fieldName as StaticElementName),
      selected,
      false,
    );

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("should return true for collection field", () => {
      // Arrange
      const element = createFilterElement("collection", "col-123");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for category field", () => {
      // Arrange
      const element = createFilterElement("category", "cat-123");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for productType field", () => {
      // Arrange
      const element = createFilterElement("productType", "type-123");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-mappable fields", () => {
      // Arrange
      const element = createFilterElement("status", "PUBLISHED");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return CollectionHandler for collection field", () => {
      // Arrange
      const element = createFilterElement("collection", "col-123");
      const inputValue = "search-term";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(fetcher).toBeInstanceOf(CollectionHandler);
    });

    it("should return CategoryHandler for category field", () => {
      // Arrange
      const element = createFilterElement("category", "cat-123");
      const inputValue = "search-term";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(fetcher).toBeInstanceOf(CategoryHandler);
    });

    it("should return ProductTypeHandler for productType field", () => {
      // Arrange
      const element = createFilterElement("productType", "type-123");
      const inputValue = "search-term";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(fetcher).toBeInstanceOf(ProductTypeHandler);
    });

    it("should throw error for unhandled field type when called with non-mappable field", () => {
      // Arrange - using a valid FilterElement that ProductExportFieldMapper doesn't handle
      const element = createFilterElement("price", "value");
      const inputValue = "search-term";

      // Act & Assert
      expect(() => {
        builder.createOptionFetcher(client, inputValue, element);
      }).toThrow("Unknown field type for product export mapper: price");
    });
  });

  describe("updateFilterQueryVariables (FILTER API)", () => {
    describe("singular field to plural field mapping", () => {
      it("should map 'collection' field to 'collections' in FILTER format", () => {
        // Arrange
        const element = createFilterElement("collection", "col-123", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          collections: ["col-123"],
        });
      });

      it("should map 'category' field to 'categories' in FILTER format", () => {
        // Arrange
        const element = createFilterElement("category", "cat-456", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          categories: ["cat-456"],
        });
      });

      it("should map 'productType' field to 'productTypes' in FILTER format", () => {
        // Arrange
        const element = createFilterElement("productType", "type-789", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          productTypes: ["type-789"],
        });
      });
    });

    describe("single value always returns array", () => {
      it("should wrap single collection ID in array", () => {
        // Arrange
        const element = createFilterElement("collection", "col-single", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          collections: ["col-single"],
        });
      });

      it("should wrap single category ID in array", () => {
        // Arrange
        const element = createFilterElement("category", "cat-single", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          categories: ["cat-single"],
        });
      });
    });

    describe("multiple values return array", () => {
      it("should return array for multiple collections", () => {
        // Arrange
        const collections = [
          { label: "Summer", value: "col-summer", slug: "col-summer" },
          { label: "Winter", value: "col-winter", slug: "col-winter" },
        ];
        const element = createFilterElement("collection", collections, "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          collections: ["col-summer", "col-winter"],
        });
      });

      it("should return array for multiple categories", () => {
        // Arrange
        const categories = [
          { label: "Electronics", value: "cat-electronics", slug: "cat-electronics" },
          { label: "Clothing", value: "cat-clothing", slug: "cat-clothing" },
        ];
        const element = createFilterElement("category", categories, "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          categories: ["cat-electronics", "cat-clothing"],
        });
      });

      it("should return array for multiple product types", () => {
        // Arrange
        const productTypes = [
          { label: "Physical", value: "type-physical", slug: "type-physical" },
          { label: "Digital", value: "type-digital", slug: "type-digital" },
        ];
        const element = createFilterElement("productType", productTypes, "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          productTypes: ["type-physical", "type-digital"],
        });
      });
    });

    describe("query immutability", () => {
      it("should not mutate original query object", () => {
        // Arrange
        const element = createFilterElement("collection", "col-123", "is");
        const query = { categories: ["existing-cat"] };
        const originalQuery = { ...query };

        // Act
        builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(query).toEqual(originalQuery);
      });

      it("should preserve existing fields in query", () => {
        // Arrange
        const element = createFilterElement("collection", "col-new", "is");
        const query = { categories: ["cat-1"], productTypes: ["type-1"] };

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          categories: ["cat-1"],
          productTypes: ["type-1"],
          collections: ["col-new"],
        });
      });
    });
  });
});
