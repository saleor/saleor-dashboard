import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { CustomerNumberOfOrdersQueryVarsBuilder } from "./CustomerNumberOfOrdersQueryVarsBuilder";

describe("CustomerNumberOfOrdersQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'numberOfOrders'", () => {
      // Arrange
      const value = new ExpressionValue("numberOfOrders", "Number of Orders", "numberOfOrders");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new CustomerNumberOfOrdersQueryVarsBuilder();
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
      const def = new CustomerNumberOfOrdersQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new CustomerNumberOfOrdersQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  const def = new CustomerNumberOfOrdersQueryVarsBuilder();
  const value = new ExpressionValue("numberOfOrders", "Number of Orders", "numberOfOrders");
  const options = ConditionOptions.fromName("numberOfOrders");
  const conditionItem: ConditionItem = { type: "number.range", label: "between", value: "input-2" };

  describe("updateWhereQueryVariables", () => {
    it("should create a gte/lte object from a tuple value", () => {
      // Arrange
      const itemOption1: ItemOption = { label: "Five", value: "5", slug: "5" };
      const itemOption2: ItemOption = { label: "Ten", value: "10", slug: "10" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.numberOfOrders).toEqual({ gte: "5", lte: "10" });
    });
    it("should return the query unchanged if value is not a 2-element tuple", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["5"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const initialQuery = {};
      const result = def.updateWhereQueryVariables(initialQuery, element);

      // Assert
      expect(result).toBe(initialQuery);
    });
  });

  describe("updateFilterQueryVariables", () => {
    it("should create a gte/lte object from a tuple value", () => {
      // Arrange
      const itemOption1: ItemOption = { label: "Five", value: "5", slug: "5" };
      const itemOption2: ItemOption = { label: "Ten", value: "10", slug: "10" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.numberOfOrders).toEqual({ gte: "5", lte: "10" });
    });
  });
});
