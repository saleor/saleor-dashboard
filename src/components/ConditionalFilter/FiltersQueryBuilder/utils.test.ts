import { Condition } from "../FilterElement/Condition";
import { ConditionOptions } from "../FilterElement/ConditionOptions";
import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { ItemOption } from "../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../FilterElement/FilterElement";
import { QueryVarsBuilderUtils } from "./utils";

describe("QueryVarsBuilderUtils", () => {
  describe("getBooleanValueFromElement", () => {
    it("should extract boolean value from ItemOption with 'true' value", () => {
      const itemOption: ItemOption = { label: "Yes", value: "true", slug: "true" };
      const conditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
      const element = new FilterElement(
        new ExpressionValue("isActive", "Is Active", "isActive"),
        condition,
        false,
      );

      expect(QueryVarsBuilderUtils.getBooleanValueFromElement(element)).toBe(true);
    });
    it("should extract boolean value from ItemOption with 'false' value", () => {
      const itemOption: ItemOption = { label: "No", value: "false", slug: "false" };
      const conditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
      const element = new FilterElement(
        new ExpressionValue("isActive", "Is Active", "isActive"),
        condition,
        false,
      );

      expect(QueryVarsBuilderUtils.getBooleanValueFromElement(element)).toBe(false);
    });
    it("should extract boolean value from direct boolean true", () => {
      const conditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "true");
      const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
      const element = new FilterElement(
        new ExpressionValue("isActive", "Is Active", "isActive"),
        condition,
        false,
      );

      expect(QueryVarsBuilderUtils.getBooleanValueFromElement(element)).toBe(true);
    });
    it("should extract boolean value from direct boolean false", () => {
      const conditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "false");
      const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
      const element = new FilterElement(
        new ExpressionValue("isActive", "Is Active", "isActive"),
        condition,
        false,
      );

      expect(QueryVarsBuilderUtils.getBooleanValueFromElement(element)).toBe(false);
    });
    it("should handle edge case with non-boolean strings", () => {
      const conditionItem = { type: "select", label: "is", value: "input-1" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "notabool");
      const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
      const element = new FilterElement(
        new ExpressionValue("isActive", "Is Active", "isActive"),
        condition,
        false,
      );

      expect(QueryVarsBuilderUtils.getBooleanValueFromElement(element)).toBe(false);
    });
  });

  describe("QueryVarsBuilderUtils.extractConditionValueFromFilterElement", () => {
    describe("range conditions", () => {
      it("should process 'lower' condition into a range object with lte", () => {
        const conditionItem = { type: "number", label: "lower", value: "input-2" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "10");
        const condition = new Condition(ConditionOptions.fromName("price"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("price", "Price", "price"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          range: { lte: "10" },
        });
      });
      it("should process 'greater' condition into a range object with gte", () => {
        const conditionItem = { type: "number", label: "greater", value: "input-3" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "5");
        const condition = new Condition(ConditionOptions.fromName("price"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("price", "Price", "price"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          range: { gte: "5" },
        });
      });
      it("should process 'between' condition with tuple into a range object", () => {
        const conditionItem = { type: "number.range", label: "between", value: "input-4" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["1", "10"]);
        const condition = new Condition(ConditionOptions.fromName("price"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("price", "Price", "price"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          range: { gte: "1", lte: "10" },
        });
      });
    });

    describe("boolean values", () => {
      it("should process ItemOption with 'true' value", () => {
        const itemOption: ItemOption = { label: "Yes", value: "true", slug: "true" };
        const conditionItem = { type: "select", label: "is", value: "input-1" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
        const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("isActive", "Is Active", "isActive"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toBe(true);
      });
      it("should process ItemOption with 'false' value", () => {
        const itemOption: ItemOption = { label: "No", value: "false", slug: "false" };
        const conditionItem = { type: "select", label: "is", value: "input-1" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
        const condition = new Condition(ConditionOptions.fromName("isActive"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("isActive", "Is Active", "isActive"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toBe(false);
      });
    });

    describe("single values", () => {
      it("should process single ItemOption into an 'eq' object using originalSlug when available", () => {
        const itemOption: ItemOption = {
          label: "Foo",
          value: "foo",
          slug: "foo",
          originalSlug: "orig-foo",
        };
        const conditionItem = { type: "combobox", label: "is", value: "input-1" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          eq: "orig-foo",
        });
      });
      it("should process single ItemOption into an 'eq' object using value when originalSlug is not available", () => {
        const itemOption: ItemOption = { label: "Foo", value: "foo", slug: "foo" };
        const conditionItem = { type: "combobox", label: "is", value: "input-1" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          eq: "foo",
        });
      });
      it("should process single string into an 'eq' object", () => {
        const conditionItem = { type: "combobox", label: "is", value: "input-1" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "foo");
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          eq: "foo",
        });
      });
    });

    describe("multiple values", () => {
      it("should process ItemOption array into an 'oneOf' object using originalSlug when available", () => {
        const itemOption1: ItemOption = {
          label: "Foo",
          value: "foo",
          slug: "foo",
          originalSlug: "orig-foo",
        };
        const itemOption2: ItemOption = {
          label: "Bar",
          value: "bar",
          slug: "bar",
          originalSlug: "orig-bar",
        };
        const conditionItem = { type: "multiselect", label: "in", value: "input-2" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
          itemOption1,
          itemOption2,
        ]);
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          oneOf: ["orig-foo", "orig-bar"],
        });
      });
      it("should process ItemOption array into an 'oneOf' object using value when originalSlug is not available", () => {
        const itemOption1: ItemOption = { label: "Foo", value: "foo", slug: "foo" };
        const itemOption2: ItemOption = { label: "Bar", value: "bar", slug: "bar" };
        const conditionItem = { type: "multiselect", label: "in", value: "input-2" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
          itemOption1,
          itemOption2,
        ]);
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          oneOf: ["foo", "bar"],
        });
      });
      it("should process string array into an 'oneOf' object", () => {
        const conditionItem = { type: "multiselect", label: "in", value: "input-2" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          oneOf: ["foo", "bar"],
        });
      });
    });

    describe("edge cases", () => {
      it("should return empty string when conditionValue is missing", () => {
        const selected = new ConditionSelected("foo", null, [], false);
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toBe("");
      });
      it("should handle unknown condition labels gracefully", () => {
        const conditionItem = { type: "combobox", label: "unknown", value: "input-1" };
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "foo");
        const condition = new Condition(ConditionOptions.fromName("category"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("category", "Category", "category"),
          condition,
          false,
        );

        // Should fallback to eq for string
        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          eq: "foo",
        });
      });
      it("should handle malformed tuple values", () => {
        const conditionItem = { type: "number.range", label: "between", value: "input-4" };
        // Malformed tuple (not length 2)
        const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["1"]);
        const condition = new Condition(ConditionOptions.fromName("price"), selected, false);
        const element = new FilterElement(
          new ExpressionValue("price", "Price", "price"),
          condition,
          false,
        );

        // Should fallback to returning a oneOf object for string arrays
        expect(QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element)).toEqual({
          oneOf: ["1"],
        });
      });
    });
  });

  describe("mapStaticQueryPartToLegacyVariables", () => {
    it("should return queryPart if it is not an object", () => {
      // Arrange
      const queryPart = "queryPart";
      const expectedOutput = "queryPart";

      // Act
      const result = QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(queryPart);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it("should transform range input to legacy format", () => {
      // Arrange
      const queryPart = { range: { lte: "value" } };
      const expectedOutput = { lte: "value" };

      // Act
      const result = QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(queryPart);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it("should transform eq input to legacy format", () => {
      // Arrange
      const queryPart = { eq: "value" };
      const expectedOutput = "value";
      // Act
      const result = QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(queryPart);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it("should transform oneOf input to legacy format", () => {
      // Arrange
      const queryPart = { oneOf: ["value1", "value2"] };
      const expectedOutput = ["value1", "value2"];
      // Act
      const result = QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(queryPart);

      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
