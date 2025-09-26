import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import {
  AnyFilterElementName,
  ConditionItem,
  ConditionOptions,
} from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { ArrayNestedFieldQueryVarsBuilder } from "./ArrayNestedFieldQueryVarsBuilder";

describe("ArrayNestedFieldQueryVarsBuilder", () => {
  const builder = new ArrayNestedFieldQueryVarsBuilder();

  function createElement(
    type: AnyFilterElementName,
    selectedValue: any,
    conditionLabel: string = "is",
  ): FilterElement {
    const value = new ExpressionValue(type, type, type);
    const conditionType = Array.isArray(selectedValue) ? "multiselect" : "select";
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
    it("handles transactionsPaymentType", () => {
      // Arrange
      const element = createElement("transactionsPaymentType", "CARD");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("handles transactionsCardBrand", () => {
      // Arrange
      const element = createElement("transactionsCardBrand", "visa");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("does not handle other types", () => {
      // Arrange
      const element = createElement("status", "CONFIRMED");

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
    it("adds payment type under transactions array", () => {
      // Arrange
      const element = createElement("transactionsPaymentType", "CARD", "is");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        transactions: [
          {
            paymentMethodDetails: {
              type: { eq: "CARD" },
            },
          },
        ],
      });
    });

    it("adds card brand under transactions array", () => {
      // Arrange
      const element = createElement("transactionsCardBrand", "Visa", "is");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        transactions: [
          {
            paymentMethodDetails: {
              card: { brand: { eq: "Visa" } },
            },
          },
        ],
      });
    });

    it("appends additional entries preserving existing ones", () => {
      // Arrange
      const first = createElement("transactionsPaymentType", "CARD", "is");
      const second = createElement("transactionsCardBrand", "Visa", "is");

      // Act
      let query = builder.updateWhereQueryVariables({}, first);

      query = builder.updateWhereQueryVariables(query, second);

      // Assert
      expect(query).toEqual({
        transactions: [
          { paymentMethodDetails: { type: { eq: "CARD" } } },
          { paymentMethodDetails: { card: { brand: { eq: "Visa" } } } },
        ],
      });
    });

    it("skips when no condition value resolvable", () => {
      // Arrange
      const value = new ExpressionValue(
        "transactionsPaymentType",
        "transactionsPaymentType",
        "transactionsPaymentType",
      );
      const emptySelected = ConditionSelected.empty();
      const condition = new Condition(
        ConditionOptions.fromName("transactionsPaymentType"),
        emptySelected,
        false,
      );
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });
  });
});
