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
import { IntFilterQueryVarsBuilder } from "./IntFilterQueryVarsBuilder";

describe("IntFilterQueryVarsBuilder", () => {
  const builder = new IntFilterQueryVarsBuilder();

  function createIntElement(fieldName: StaticElementName, selectedValue: unknown): FilterElement {
    const value = new ExpressionValue(fieldName, fieldName, fieldName);
    const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
    const selected = ConditionSelected.fromConditionItemAndValue(
      conditionItem,
      selectedValue as ConditionValue,
    );
    const condition = new Condition(ConditionOptions.fromName(fieldName), selected, false);

    return new FilterElement(value, condition, false);
  }

  function createIntFilterElement(
    fieldName: StaticElementName,
    selectedValue: unknown,
    conditionLabel?: string,
  ): FilterElement {
    const value = new ExpressionValue(fieldName, fieldName, fieldName);

    if (!conditionLabel) {
      const selected = ConditionSelected.empty();
      const condition = new Condition(ConditionOptions.fromName(fieldName), selected, false);

      return new FilterElement(value, condition, false);
    }

    const conditionType = conditionLabel === "between" ? "number.range" : "number";
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(
      conditionItem,
      selectedValue as ConditionValue,
    );
    const condition = new Condition(ConditionOptions.fromName(fieldName), selected, false);

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("should return true for linesCount field", () => {
      // Arrange
      const element = createIntElement("linesCount", "5");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for number field", () => {
      // Arrange
      const element = createIntElement("number", "12345");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-integer fields", () => {
      // Arrange
      const element = createIntElement("status", "CONFIRMED");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for price fields", () => {
      // Arrange
      const element = createIntElement("totalGross", "100.50");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return NoopValuesHandler", () => {
      // Arrange & Act
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    describe("building valid query from filter element", () => {
      it("should handle single integer value with 'is' condition", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "3", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { eq: 3 },
        });
      });

      it("should handle 'lower' condition", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "10", "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { range: { lte: 10 } },
        });
      });

      it("should handle 'greater' condition", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "5", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { range: { gte: 5 } },
        });
      });

      it("should handle 'between' condition with two values", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", [2, 8], "between");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { range: { gte: 2, lte: 8 } },
        });
      });

      it("should handle array values with 'is' condition", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", [1, 3, 5], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { oneOf: [1, 3, 5] },
        });
      });

      it("should handle ItemOption with integer value", () => {
        // Arrange
        const countOption = {
          label: "Five items",
          value: "5",
          slug: "5",
        };
        const element = createIntFilterElement("linesCount", countOption, "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { eq: 5 },
        });
      });

      it("should handle array of ItemOption values", () => {
        // Arrange
        const countOptions = [
          { label: "One", value: "1", slug: "1" },
          { label: "Two", value: "2", slug: "2" },
          { label: "Three", value: "3", slug: "3" },
        ];
        const element = createIntFilterElement("linesCount", countOptions, "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { oneOf: [1, 2, 3] },
        });
      });

      it("should handle numeric value directly", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", 7, "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { range: { lte: 7 } },
        });
      });
    });

    describe("error conditions", () => {
      it("should handle invalid integer strings", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "invalid", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: null,
        });
      });

      it("should handle empty string values", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: null,
        });
      });

      it("should handle floating point numbers by truncating", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "5.7", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { eq: 5 },
        });
      });

      it("should handle negative numbers", () => {
        // Arrange
        const element = createIntFilterElement("number", "-123", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          number: { range: { gte: -123 } },
        });
      });

      it("should handle zero values", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "0", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { range: { gte: 0 } },
        });
      });

      it("should filter out invalid values from arrays", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", ["1", "invalid", "3"], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { oneOf: [1, 3] },
        });
      });

      it("should handle array with all invalid values", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", ["invalid", "also-invalid"], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: null,
        });
      });
    });

    describe("immutability and query preservation", () => {
      it("should not mutate the original query object", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "5", "is");
        const originalQuery = {
          status: { eq: "CONFIRMED" },
          number: { range: { gte: 1000 } },
        };
        const querySnapshot = JSON.parse(JSON.stringify(originalQuery));

        // Act
        builder.updateWhereQueryVariables(originalQuery, element);

        // Assert
        expect(originalQuery).toEqual(querySnapshot);
      });

      it("should preserve existing fields in query", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "3", "lower");
        const query = {
          status: { oneOf: ["PENDING", "CONFIRMED"] },
          totalGross: { amount: { gte: 50 } },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query as any, element);

        // Assert
        expect(result).toEqual({
          status: { oneOf: ["PENDING", "CONFIRMED"] },
          totalGross: { amount: { gte: 50 } },
          linesCount: { range: { lte: 3 } },
        });
      });

      it("should override existing field with same name", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "10", "greater");
        const query = {
          linesCount: { eq: 5 },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { range: { gte: 10 } },
        });
      });
    });

    describe("edge cases", () => {
      it("should handle large integer values", () => {
        // Arrange
        const element = createIntFilterElement("number", "999999999", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          number: { eq: 999999999 },
        });
      });

      it("should handle hexadecimal-like strings as invalid", () => {
        // Arrange
        const element = createIntFilterElement("number", "0x123", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          number: { eq: 0 }, // parseInt("0x123", 10) returns 0
        });
      });

      it("should handle whitespace around numbers", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", "  5  ", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { eq: 5 },
        });
      });

      it("should handle single-element array", () => {
        // Arrange
        const element = createIntFilterElement("linesCount", ["7"], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          linesCount: { oneOf: [7] },
        });
      });
    });
  });
});
