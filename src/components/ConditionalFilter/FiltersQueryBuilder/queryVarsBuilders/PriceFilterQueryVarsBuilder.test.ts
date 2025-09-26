import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { PriceFilterQueryVarsBuilder } from "./PriceFilterQueryVarsBuilder";

describe("PriceFilterQueryVarsBuilder", () => {
  const builder = new PriceFilterQueryVarsBuilder();

  // Helper function to create price FilterElement
  function createPriceElement(fieldName: string, selectedValue: any): FilterElement {
    const value = new ExpressionValue(
      fieldName,
      `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} Field`,
      fieldName,
    );
    const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(ConditionOptions.fromName(fieldName as any), selected, false);

    return new FilterElement(value, condition, false);
  }

  // Helper for price filters with specific condition labels
  function createPriceFilterElement(
    fieldName: string,
    selectedValue: any,
    conditionLabel?: string,
  ): FilterElement {
    const value = new ExpressionValue(
      fieldName,
      `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} Field`,
      fieldName,
    );

    if (!conditionLabel) {
      // Create empty condition
      const selected = ConditionSelected.empty();
      const condition = new Condition(ConditionOptions.fromName(fieldName as any), selected, false);

      return new FilterElement(value, condition, false);
    }

    const conditionType = conditionLabel === "between" ? "number.range" : "number";
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(ConditionOptions.fromName(fieldName as any), selected, false);

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("should return true for totalGross", () => {
      // Arrange
      const element = createPriceElement("totalGross", 1000);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for totalNet", () => {
      // Arrange
      const element = createPriceElement("totalNet", 500);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-price fields", () => {
      // Arrange
      const element = createPriceElement("status", "PAID");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for currency field", () => {
      // Arrange
      const element = createPriceElement("currency", "USD");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return NoopValuesHandler", () => {
      // Act
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    describe("totalGross field", () => {
      it("should handle single numeric value with 'is' condition", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "123.45", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { eq: 123.45 },
          },
        });
      });

      it("should handle 'lower' condition", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "1000", "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { range: { lte: 1000 } },
          },
        });
      });

      it("should handle 'greater' condition", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "500.50", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { range: { gte: 500.5 } },
          },
        });
      });

      it("should handle 'between' condition with two values", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", [100, 200], "between");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { range: { gte: 100, lte: 200 } },
          },
        });
      });

      it("should handle 'in' condition with array of values", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", [100, 200, 300], "in");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        // Note: 'in' condition is not supported by the current implementation
        expect(result).toEqual({
          totalGross: null,
        });
      });

      it("should handle array values with 'is' condition", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", [150, 250], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { oneOf: [150, 250] },
          },
        });
      });
    });

    describe("totalNet field", () => {
      it("should handle totalNet with numeric value", () => {
        // Arrange
        const element = createPriceFilterElement("totalNet", "75.25", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalNet: {
            amount: { eq: 75.25 },
          },
        });
      });

      it("should handle totalNet with range condition", () => {
        // Arrange
        const element = createPriceFilterElement("totalNet", "1000", "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalNet: {
            amount: { range: { lte: 1000 } },
          },
        });
      });
    });

    describe("error handling", () => {
      it("should set field to null when amount parsing fails", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "invalid", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: null,
        });
      });

      it("should set field to null when no condition label is provided", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "100", undefined);
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: null,
        });
      });

      it("should set field to null when unsupported condition is provided", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "100", "contains");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: null,
        });
      });

      it("should set field to null when between condition has insufficient values", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", [100], "between");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: null,
        });
      });
    });

    describe("immutability", () => {
      it("should preserve existing fields in query", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "100", "is");
        const query = {
          totalNet: { amount: { eq: 50 } },
          otherField: "preserved",
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalNet: { amount: { eq: 50 } },
          otherField: "preserved",
          totalGross: { amount: { eq: 100 } },
        });
      });

      it("should override existing field with same name", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "200", "greater");
        const query = {
          totalGross: { amount: { eq: 100 } },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: { amount: { range: { gte: 200 } } },
        });
      });
    });

    describe("decimal precision", () => {
      it("should preserve decimal precision", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "99.99", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { eq: 99.99 },
          },
        });
      });

      it("should handle very small decimal values", () => {
        // Arrange
        const element = createPriceFilterElement("totalGross", "0.01", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          totalGross: {
            amount: { range: { gte: 0.01 } },
          },
        });
      });
    });
  });
});
