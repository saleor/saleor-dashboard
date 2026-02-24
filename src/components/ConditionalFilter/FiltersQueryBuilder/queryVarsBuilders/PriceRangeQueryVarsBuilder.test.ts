import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { type ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { PriceRangeQueryVarsBuilder } from "./PriceRangeQueryVarsBuilder";
import { supportsFilterApi, supportsWhereApi } from "./types";

describe("PriceRangeQueryVarsBuilder", () => {
  const builder = new PriceRangeQueryVarsBuilder();

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

  describe("API support", () => {
    it("should only support FILTER API, not WHERE API", () => {
      // Arrange / Act
      const supportsFilter = supportsFilterApi(builder);
      const supportsWhere = supportsWhereApi(builder);

      // Assert
      expect(supportsFilter).toBe(true);
      expect(supportsWhere).toBe(false);
    });
  });

  describe("canHandle", () => {
    it("should return true for price field", () => {
      // Arrange
      const element = createPriceFilterElement("price", "100", "is");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for minimalPrice field", () => {
      // Arrange
      const value = new ExpressionValue("minimalPrice", "Minimal Price", "minimalPrice");
      const conditionItem: ConditionItem = {
        type: "number",
        label: "is",
        value: "input-number",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "100");
      const condition = new Condition(ConditionOptions.fromName("price"), selected, false);
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for totalGross field", () => {
      // Arrange
      const element = createPriceFilterElement("totalGross", "100", "is");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for non-price fields", () => {
      // Arrange
      const element = createPriceFilterElement("status", "PAID", "is");

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

  describe("updateFilterQueryVariables", () => {
    describe("value mapping", () => {
      it("should handle 'is' condition by mapping to gte and lte with the same value", () => {
        // Arrange
        const element = createPriceFilterElement("price", "123.45", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { gte: 123.45, lte: 123.45 },
        });
      });

      it("should handle 'lower' condition", () => {
        // Arrange
        const element = createPriceFilterElement("price", "1000", "lower");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { lte: 1000 },
        });
      });

      it("should handle 'greater' condition", () => {
        // Arrange
        const element = createPriceFilterElement("price", "500.50", "greater");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { gte: 500.5 },
        });
      });

      it("should handle 'between' condition with two values", () => {
        // Arrange
        const element = createPriceFilterElement("price", [100, 200], "between");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { gte: 100, lte: 200 },
        });
      });
    });

    describe("error handling", () => {
      it("should set field to null when amount parsing fails", () => {
        // Arrange
        const element = createPriceFilterElement("price", "invalid", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: null,
        });
      });

      it("should set field to null when no condition label is provided", () => {
        // Arrange
        const element = createPriceFilterElement("price", "100", undefined);
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: null,
        });
      });

      it("should set field to null when unsupported condition is provided", () => {
        // Arrange
        const element = createPriceFilterElement("price", "100", "contains");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: null,
        });
      });

      it("should set field to null when between condition has insufficient values", () => {
        // Arrange
        const element = createPriceFilterElement("price", [100], "between");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: null,
        });
      });

      it("should set field to null when is condition receives array", () => {
        // Arrange
        const element = createPriceFilterElement("price", [100, 200], "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: null,
        });
      });
    });

    describe("decimal precision", () => {
      it("should preserve decimal precision", () => {
        // Arrange
        const element = createPriceFilterElement("price", "99.99", "is");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { gte: 99.99, lte: 99.99 },
        });
      });

      it("should handle very small decimal values", () => {
        // Arrange
        const element = createPriceFilterElement("price", "0.01", "greater");
        const query = {};

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { gte: 0.01 },
        });
      });
    });

    describe("immutability", () => {
      it("should preserve existing fields in query", () => {
        // Arrange
        const element = createPriceFilterElement("price", "100", "is");
        const query = {
          minimalPrice: { gte: 50, lte: 50 },
          otherField: "preserved",
        };

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          minimalPrice: { gte: 50, lte: 50 },
          otherField: "preserved",
          price: { gte: 100, lte: 100 },
        });
      });

      it("should override existing field with same name", () => {
        // Arrange
        const element = createPriceFilterElement("price", "200", "greater");
        const query = {
          price: { gte: 100, lte: 100 },
        };

        // Act
        const result = builder.updateFilterQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          price: { gte: 200 },
        });
      });
    });
  });
});
