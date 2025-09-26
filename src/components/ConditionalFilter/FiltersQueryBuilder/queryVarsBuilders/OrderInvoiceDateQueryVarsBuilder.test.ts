import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { OrderInvoiceDateQueryVarsBuilder } from "./OrderInvoiceDateQueryVarsBuilder";

describe("OrderInvoiceDateQueryVarsBuilder", () => {
  const builder = new OrderInvoiceDateQueryVarsBuilder();

  function createElement(selectedValue: ConditionValue, conditionLabel: string): FilterElement {
    const type = "invoicesCreatedAt";
    const value = new ExpressionValue(type, "Invoice Date", type);
    const conditionType = conditionLabel === "between" ? "date.range" : "date";
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(ConditionOptions.fromName(type), selected, false);

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("handles invoicesCreatedAt", () => {
      // Arrange
      const element = createElement("2023-01-01", "lower");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("does not handle other fields", () => {
      // Arrange
      const value = new ExpressionValue("createdAt", "createdAt", "createdAt");
      const element = new FilterElement(value, Condition.createEmpty(), false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("returns NoopValuesHandler", () => {
      // Act
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    it("handles 'lower' condition", () => {
      // Arrange
      const element = createElement("2023-12-01", "lower");
      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ invoices: [{ createdAt: { lte: "2023-12-01T00:00:00.000Z" } }] });
    });

    it("handles 'greater' condition", () => {
      // Arrange
      const element = createElement("2023-12-01", "greater");
      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ invoices: [{ createdAt: { gte: "2023-12-01T00:00:00.000Z" } }] });
    });

    it("handles 'between' condition", () => {
      // Arrange
      const element = createElement(["2023-01-01", "2023-01-31"], "between");
      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        invoices: [
          { createdAt: { gte: "2023-01-01T00:00:00.000Z", lte: "2023-01-31T00:00:00.000Z" } },
        ],
      });
    });

    it("handles single date with 'is' by creating day range", () => {
      // Arrange - Build FilterElement manually to set 'is' condition
      const type = "invoicesCreatedAt";
      const value = new ExpressionValue(type, "Invoice Date", type);
      const conditionItem: ConditionItem = { type: "date", label: "is", value: "input-date" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "2023-06-15");
      const condition = new Condition(ConditionOptions.fromName(type), selected, false);
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        invoices: [
          { createdAt: { gte: "2023-06-15T00:00:00.000Z", lte: "2023-06-15T23:59:59.999Z" } },
        ],
      });
    });
  });
});
