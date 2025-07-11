import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { VoucherTimesUsedQueryVarsBuilder } from "./VoucherTimesUsedQueryVarsBuilder";

describe("VoucherTimesUsedQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'timesUsed'", () => {
      // Arrange
      const value = new ExpressionValue("timesUsed", "Times Used", "timesUsed");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new VoucherTimesUsedQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });
    it("should return false for other values", () => {
      // Arrange
      const value = new ExpressionValue("other", "Other", "other");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new VoucherTimesUsedQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new VoucherTimesUsedQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateFilterQueryVariables", () => {
    const def = new VoucherTimesUsedQueryVarsBuilder();
    const value = new ExpressionValue("timesUsed", "Times Used", "timesUsed");
    const options = ConditionOptions.fromName("timesUsed");

    it("should map 'is' condition to timesUsed IntRangeInput with gte/lte that are the same", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "number", label: "is", value: "input-2" };
      const selected = new ConditionSelected("10", conditionItem, [], false);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.timesUsed).toEqual({ gte: 10, lte: 10 });
    });

    it("should map 'between' condition to timesUsed IntRangeInput with gte/lte", () => {
      // Arrange
      const conditionItem: ConditionItem = {
        type: "number.range",
        label: "between",
        value: "input-3",
      };
      const selected = new ConditionSelected(["10", "20"], conditionItem, [], false);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.timesUsed).toEqual({ gte: 10, lte: 20 });
    });
  });
});
