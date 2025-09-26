import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { FulfillmentStatusQueryVarsBuilder } from "./FulfillmentStatusQueryVarsBuilder";

describe("FulfillmentStatusQueryVarsBuilder", () => {
  const builder = new FulfillmentStatusQueryVarsBuilder();

  function createElement(
    selectedValue: ConditionValue,
    conditionLabel: string = "is",
  ): FilterElement {
    const type = "fulfillmentStatus";
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
    it("handles fulfillmentStatus", () => {
      // Arrange
      const element = createElement("FULFILLED");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("does not handle other types", () => {
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
    it("adds single status as eq in a new array element", () => {
      // Arrange
      const element = createElement("FULFILLED", "is");
      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        fulfillments: [{ status: { eq: "FULFILLED" } }],
      });
    });

    it("appends multiple statuses as separate array elements", () => {
      // Arrange
      const first = createElement("RETURNED", "is");
      const second = createElement("CANCELED", "is");

      // Act
      let query = builder.updateWhereQueryVariables({}, first);

      query = builder.updateWhereQueryVariables(query, second);

      // Assert
      expect(query).toEqual({
        fulfillments: [{ status: { eq: "RETURNED" } }, { status: { eq: "CANCELED" } }],
      });
    });

    it("skips update when there is no selected condition value", () => {
      // Arrange
      const value = new ExpressionValue(
        "fulfillmentStatus",
        "fulfillmentStatus",
        "fulfillmentStatus",
      );
      const selected = ConditionSelected.empty();
      const condition = new Condition(
        ConditionOptions.fromName("fulfillmentStatus"),
        selected,
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
