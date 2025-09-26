import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { OrderIdQueryVarsBuilder } from "./OrderIdQueryVarsBuilder";

describe("OrderIdQueryVarsBuilder", () => {
  const builder = new OrderIdQueryVarsBuilder();

  function createElement(
    selectedValue: ConditionValue,
    conditionLabel: string = "is",
  ): FilterElement {
    const type = "ids";
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
    it("handles ids field", () => {
      // Arrange
      const element = createElement("abc");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("does not handle other fields", () => {
      // Arrange
      const value = new ExpressionValue("status", "status", "status");
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
    it("maps single string to array with one id", () => {
      // Arrange
      const element = createElement("ord_1");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ ids: ["ord_1"] });
    });

    it("maps array of strings directly", () => {
      // Arrange
      const element = createElement(["ord_1", "ord_2"]);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ ids: ["ord_1", "ord_2"] });
    });

    it("maps ItemOption array using originalSlug when present", () => {
      // Arrange
      const options = [
        { label: "#1", value: "v1", slug: "s1", originalSlug: "ord_1" },
        { label: "#2", value: "v2", slug: "s2", originalSlug: "ord_2" },
      ];
      const element = createElement(options);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ ids: ["ord_1", "ord_2"] });
    });

    it("falls back to value when originalSlug is missing", () => {
      // Arrange
      const options = [
        { label: "#1", value: "ord_1", slug: "s1" },
        { label: "#2", value: "ord_2", slug: "s2" },
      ];
      const element = createElement(options);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ ids: ["ord_1", "ord_2"] });
    });

    it("preserves other query fields", () => {
      // Arrange
      const element = createElement(["ord_3"]);
      const query = { status: { oneOf: ["CONFIRMED"] } } as any; // Using any to test behavior with different queries than expected

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toEqual({ status: { oneOf: ["CONFIRMED"] }, ids: ["ord_3"] });
    });
  });
});
