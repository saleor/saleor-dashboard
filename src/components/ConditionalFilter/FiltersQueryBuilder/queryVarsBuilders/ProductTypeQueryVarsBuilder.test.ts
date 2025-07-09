import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { ProductTypeQueryVarsBuilder } from "./ProductTypeQueryVarsBuilder";

describe("ProductTypeQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'typeOfProduct'", () => {
      // Arrange
      const value = new ExpressionValue("typeOfProduct", "Type of Product", "typeOfProduct");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new ProductTypeQueryVarsBuilder();
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
      const def = new ProductTypeQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new ProductTypeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("query updates (FILTER API only)", () => {
    const def = new ProductTypeQueryVarsBuilder();
    const value = new ExpressionValue("typeOfProduct", "Type of Product", "typeOfProduct");
    const options = ConditionOptions.fromName("productType");
    const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };

    it("should map the field to 'productType' in the filter query", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "foo");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.productType).toBeDefined();
    });
    it("should correctly map a single value", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "foo");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.productType).toBe("foo");
    });
    it("should correctly map multiple values", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.productType).toEqual(["foo", "bar"]);
    });
  });
});
