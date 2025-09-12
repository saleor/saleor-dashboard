import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import {
  ConditionItem,
  ConditionOptions,
  StaticElementName,
} from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { ArrayMetadataQueryVarsBuilder } from "./ArrayMetadataQueryVarsBuilder";

describe("ArrayMetadataQueryVarsBuilder", () => {
  const builder = new ArrayMetadataQueryVarsBuilder();

  // Helper function to create metadata FilterElement
  function createMetadataElement(
    type: StaticElementName,
    metadataValue: ConditionValue,
  ): FilterElement {
    const value = new ExpressionValue(type, `${type} Metadata`, type);
    const conditionItem: ConditionItem = {
      type: "tuple",
      label: "key-value",
      value: "input-tuple",
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, metadataValue);
    const condition = new Condition(ConditionOptions.fromName(type), selected, false);

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("should return true for linesMetadata", () => {
      // Arrange
      const value = new ExpressionValue("linesMetadata", "Lines Metadata", "linesMetadata");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for transactionsMetadata", () => {
      // Arrange
      const value = new ExpressionValue(
        "transactionsMetadata",
        "Transactions Metadata",
        "transactionsMetadata",
      );
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for fulfillmentsMetadata", () => {
      // Arrange
      const value = new ExpressionValue(
        "fulfillmentsMetadata",
        "Fulfillments Metadata",
        "fulfillmentsMetadata",
      );
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-metadata types", () => {
      // Arrange
      const value = new ExpressionValue("customer", "Customer", "customer");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return NoopValuesHandler", () => {
      // Arrange
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    it("should add new metadata filter to empty query", () => {
      // Arrange
      const element = createMetadataElement("linesMetadata", ["key1", "value1"]);
      const query = {};

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({
        lines: [
          {
            metadata: {
              key: "key1",
              value: { eq: "value1" },
            },
          },
        ],
      });
    });

    it("should add new metadata filter to existing query", () => {
      // Arrange
      const element = createMetadataElement("linesMetadata", ["key2", "value2"]);
      const query = {
        lines: [
          {
            metadata: {
              key: "key1",
              value: { eq: "value1" },
            },
          },
        ],
      };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({
        lines: [
          {
            metadata: {
              key: "key1",
              value: { eq: "value1" },
            },
          },
          {
            metadata: {
              key: "key2",
              value: { eq: "value2" },
            },
          },
        ],
      });
    });

    it("should merge same-key metadata using oneOf", () => {
      // Arrange
      const element = createMetadataElement("linesMetadata", ["key1", "value2"]);
      const query = {
        lines: [
          {
            metadata: {
              key: "key1",
              value: { eq: "value1" },
            },
          },
        ],
      };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({
        lines: [
          {
            metadata: {
              key: "key1",
              value: { oneOf: ["value1", "value2"] },
            },
          },
        ],
      });
    });

    it("should extend existing oneOf array for same key", () => {
      // Arrange
      const element = createMetadataElement("linesMetadata", ["key1", "value3"]);
      const query = {
        lines: [
          {
            metadata: {
              key: "key1",
              value: { oneOf: ["value1", "value2"] },
            },
          },
        ],
      };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({
        lines: [
          {
            metadata: {
              key: "key1",
              value: { oneOf: ["value1", "value2", "value3"] },
            },
          },
        ],
      });
    });

    it("should handle mixed metadata fields in single query", () => {
      // Arrange
      const linesElement = createMetadataElement("linesMetadata", ["product", "book"]);
      const transactionsElement = createMetadataElement("transactionsMetadata", [
        "gateway",
        "stripe",
      ]);
      const fulfillmentsElement = createMetadataElement("fulfillmentsMetadata", [
        "warehouse",
        "west",
      ]);

      let query = {};

      // Act
      query = builder.updateWhereQueryVariables(query, linesElement);
      query = builder.updateWhereQueryVariables(query, transactionsElement);
      query = builder.updateWhereQueryVariables(query, fulfillmentsElement);

      // Assert
      expect(query).toEqual({
        lines: [
          {
            metadata: {
              key: "product",
              value: { eq: "book" },
            },
          },
        ],
        transactions: [
          {
            metadata: {
              key: "gateway",
              value: { eq: "stripe" },
            },
          },
        ],
        fulfillments: [
          {
            metadata: {
              key: "warehouse",
              value: { eq: "west" },
            },
          },
        ],
      });
    });

    it("should preserve existing non-metadata array elements", () => {
      // Arrange
      const element = createMetadataElement("linesMetadata", ["size", "large"]);
      const query = {
        lines: [
          { quantity: { gte: 5 } },
          {
            metadata: {
              key: "color",
              value: { eq: "red" },
            },
          },
        ],
      };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({
        lines: [
          { quantity: { gte: 5 } },
          {
            metadata: {
              key: "color",
              value: { eq: "red" },
            },
          },
          {
            metadata: {
              key: "size",
              value: { eq: "large" },
            },
          },
        ],
      });
    });

    it("should return unchanged query for non-tuple input", () => {
      // Arrange
      const element = createMetadataElement("linesMetadata", "invalid-input");
      const query = { lines: [] };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({ lines: [] });
    });

    it("should return unchanged query for empty tuple", () => {
      const element = createMetadataElement("linesMetadata", []);
      const query = { lines: [] };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({ lines: [] });
    });

    it("should return unchanged query for single-element tuple", () => {
      const element = createMetadataElement("linesMetadata", ["only-key"]);
      const query = { lines: [] };

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({ lines: [] });
    });
  });
});
