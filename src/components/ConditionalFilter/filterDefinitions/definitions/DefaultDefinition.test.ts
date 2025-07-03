import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { DefaultDefinition } from "./DefaultDefinition";

describe("DefaultDefinition", () => {
  describe("canHandle", () => {
    it("should always return true", () => {
      // Arrange
      const def = new DefaultDefinition();
      // Act
      const result = def.canHandle();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new DefaultDefinition();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("getQueryFieldName", () => {
    const def = new DefaultDefinition();

    it("should use element.value.value as the field name", () => {
      // Arrange
      const value = new ExpressionValue("foo", "Foo", "foo");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      // Act
      const fieldName = def["getQueryFieldName"](element);

      // Assert
      expect(fieldName).toBe("foo");
    });
    it("should fallback to element.value.label if value is missing", () => {
      // Arrange
      const value = new ExpressionValue("", "Bar", "bar");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      // Act
      const fieldName = def["getQueryFieldName"](element);

      // Assert
      expect(fieldName).toBe("Bar");
    });
    it("should fallback to 'unknown' if both value and label are missing", () => {
      // Arrange
      const value = new ExpressionValue("", "", "baz");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      // Act
      const fieldName = def["getQueryFieldName"](element);

      // Assert
      expect(fieldName).toBe("unknown");
    });
  });

  const def = new DefaultDefinition();
  const value = new ExpressionValue("foo", "Foo", "foo");
  const options = ConditionOptions.fromName("category");
  const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };

  describe("updateWhereQuery", () => {
    it("should use the dynamic field name for the query key", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "bar");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQuery({}, element);

      // Assert
      expect(result.foo).toBeDefined();
    });
    it("should create an 'eq' object for single values", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "bar");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQuery({}, element);

      // Assert
      expect(result.foo).toEqual({ eq: "bar" });
    });
    it("should create an 'oneOf' object for multiple values", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["bar", "baz"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQuery({}, element);

      // Assert
      expect(result.foo).toEqual({ oneOf: ["bar", "baz"] });
    });
  });

  describe("updateFilterQuery", () => {
    it("should correctly map the 'eq' object to a direct value", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "bar");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQuery({}, element);

      // Assert
      expect(result.foo).toBe("bar");
    });
    it("should correctly map the 'oneOf' object to a direct value array", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["bar", "baz"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQuery({}, element);

      // Assert
      expect(result.foo).toEqual(["bar", "baz"]);
    });
  });
});
