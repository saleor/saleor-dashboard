import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { AttributeTypeQueryVarsBuilder } from "./AttributeTypeQueryVarsBuilder";

describe("AttributeTypeQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'attributeType'", () => {
      // Arrange
      const value = new ExpressionValue("attributeType", "Attribute Type", "attributeType");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new AttributeTypeQueryVarsBuilder();
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
      const def = new AttributeTypeQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should create a NoopValuesHandler as options are static", () => {
      // Arrange
      const def = new AttributeTypeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  const def = new AttributeTypeQueryVarsBuilder();
  const value = new ExpressionValue("attributeType", "Attribute Type", "attributeType");

  describe("updateWhereQueryVariables", () => {
    it("should rename field to 'type' in the where query", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "PRODUCT_TYPE");
      const condition = new Condition(ConditionOptions.fromName("attributeType"), selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toHaveProperty("type");
    });
    it("should create an 'eq' object for a single value", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "PRODUCT_TYPE");
      const condition = new Condition(ConditionOptions.fromName("attributeType"), selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.type).toEqual({ eq: "PRODUCT_TYPE" });
    });
    it("should create an 'oneOf' object for multiple values", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "multiselect", label: "in", value: "input-2" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        "PRODUCT_TYPE",
        "PAGE_TYPE",
      ]);
      const condition = new Condition(ConditionOptions.fromName("attributeType"), selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.type).toEqual({ oneOf: ["PRODUCT_TYPE", "PAGE_TYPE"] });
    });
  });

  describe("updateFilterQueryVariables", () => {
    it("should rename field to 'type' in the filter query", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "PRODUCT_TYPE");
      const condition = new Condition(ConditionOptions.fromName("attributeType"), selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result).toHaveProperty("type");
    });
    it("should map a single value correctly", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "PRODUCT_TYPE");
      const condition = new Condition(ConditionOptions.fromName("attributeType"), selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.type).toBe("PRODUCT_TYPE");
    });
    it("should map multiple values correctly", () => {
      // Arrange
      const conditionItem: ConditionItem = { type: "multiselect", label: "in", value: "input-2" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        "PRODUCT_TYPE",
        "PAGE_TYPE",
      ]);
      const condition = new Condition(ConditionOptions.fromName("attributeType"), selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.type).toEqual(["PRODUCT_TYPE", "PAGE_TYPE"]);
    });
  });
});
