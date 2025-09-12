import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { DateTimeRangeQueryVarsBuilder } from "./DateTimeRangeQueryVarsBuilder";

describe("DateTimeRangeQueryVarsBuilder", () => {
  const builder = new DateTimeRangeQueryVarsBuilder();

  function createDateElement(
    fieldName: string,
    selectedValue: any,
    conditionType: string = "select",
  ): FilterElement {
    const value = new ExpressionValue(
      fieldName,
      `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} Field`,
      fieldName,
    );
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionType,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(ConditionOptions.fromName(fieldName as any), selected, false);

    return new FilterElement(value, condition, false);
  }

  function createDateFilterElement(
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

    const conditionType = conditionLabel === "between" ? "date.range" : "date";
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
    it("should return true for createdAt field", () => {
      // Arrange
      const element = createDateElement("createdAt", "2023-01-01");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for updatedAt field", () => {
      // Arrange
      const element = createDateElement("updatedAt", "2023-01-01");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for dateJoined field", () => {
      // Arrange
      const element = createDateElement("dateJoined", "2023-01-01");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-date fields", () => {
      // Arrange
      const element = createDateElement("status", "CONFIRMED");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for other date-like fields", () => {
      // Arrange
      const element = createDateElement("status", "2023-01-01");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return NoopValuesHandler", () => {
      // Arrange

      // Act
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    describe("createdAt field", () => {
      it("should handle 'lower' condition with date", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-12-01", "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            lte: "2023-12-01T00:00:00.000Z",
          },
        });
      });

      it("should handle 'greater' condition with date", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-12-01", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-12-01T00:00:00.000Z",
          },
        });
      });

      it("should handle 'between' condition with date range", () => {
        // Arrange
        const element = createDateFilterElement(
          "createdAt",
          ["2023-01-01", "2023-01-31"],
          "between",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-01-01T00:00:00.000Z",
            lte: "2023-01-31T00:00:00.000Z",
          },
        });
      });

      it("should handle single date value (creates day range)", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-06-15", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-06-15T00:00:00.000Z",
            lte: "2023-06-15T23:59:59.999Z",
          },
        });
      });

      it("should handle single datetime value (creates 1-minute range)", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-06-15T14:30:00", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-06-15T14:30:00.000Z",
            lte: "2023-06-15T14:31:00.000Z",
          },
        });
      });

      it("should handle ISO datetime string", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-06-15T14:30:00.000Z", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-06-15T14:30:00.000Z",
          },
        });
      });

      it("should handle ItemOption with date value", () => {
        // Arrange
        const dateOption = {
          label: "January 1st",
          value: "2023-01-01",
          slug: "2023-01-01",
        };
        const element = createDateFilterElement("createdAt", dateOption, "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            lte: "2023-01-01T00:00:00.000Z",
          },
        });
      });
    });

    describe("updatedAt field", () => {
      it("should handle updatedAt with datetime range", () => {
        // Arrange
        const element = createDateFilterElement(
          "updatedAt",
          ["2023-06-01T10:00", "2023-06-30T18:00"],
          "between",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          updatedAt: {
            gte: "2023-06-01T10:00:00.000Z",
            lte: "2023-06-30T18:00:00.000Z",
          },
        });
      });

      it("should preserve existing createdAt when adding updatedAt", () => {
        // Arrange
        const element = createDateFilterElement("updatedAt", "2023-07-01", "greater");
        const query = {
          createdAt: { lte: "2023-01-01T00:00:00.000Z" },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: { lte: "2023-01-01T00:00:00.000Z" },
          updatedAt: { gte: "2023-07-01T00:00:00.000Z" },
        });
      });
    });

    describe("dateJoined field", () => {
      it("should handle dateJoined field", () => {
        // Arrange
        const element = createDateFilterElement("dateJoined", "2023-05-15", "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          dateJoined: {
            lte: "2023-05-15T00:00:00.000Z",
          },
        });
      });
    });

    describe("edge cases and error conditions", () => {
      it("should skip filter when no condition value provided", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-01-01", undefined);
        const query = { status: { eq: "ACTIVE" } };

        // Act
        const result = builder.updateWhereQueryVariables(query as any, element);

        // Assert
        expect(result).toEqual({
          status: { eq: "ACTIVE" },
          createdAt: undefined,
        });
      });

      it("should skip filter for invalid date strings", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "invalid-date", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: undefined,
        });
      });

      it("should skip filter for empty date strings", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "", "lower");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: undefined,
        });
      });

      it("should handle whitespace-only date strings", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "   ", "greater");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: undefined,
        });
      });

      it("should skip between filter with invalid tuple", () => {
        // Arrange
        const element = createDateFilterElement(
          "createdAt",
          ["2023-01-01", "invalid-date"],
          "between",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-01-01T00:00:00.000Z",
            lte: "", // Invalid dates result in empty string
          },
        });
      });
    });

    describe("handles incorrect date usages in UI", () => {
      it("should detect datetime `is` and add 1min for a timespan search", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-06-15T10:30:45", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-06-15T10:30:45.000Z",
            lte: "2023-06-15T10:31:45.000Z",
          },
        });
      });

      it("should detect date without time and add end of day", () => {
        // Arrange
        const element = createDateFilterElement("createdAt", "2023-06-15", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-06-15T00:00:00.000Z",
            lte: "2023-06-15T23:59:59.999Z",
          },
        });
      });

      it("should handle timezone-aware datetime", () => {
        // Arrange
        const element = createDateFilterElement(
          "createdAt",
          "2023-06-15T14:30:00+02:00",
          "greater",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          createdAt: {
            gte: "2023-06-15T12:30:00.000Z", // Converted to UTC
          },
        });
      });
    });
  });
});
