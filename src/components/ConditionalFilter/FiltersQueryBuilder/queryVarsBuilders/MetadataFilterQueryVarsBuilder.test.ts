import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { MetadataFilterQueryVarsBuilder } from "./MetadataFilterQueryVarsBuilder";

describe("MetadataBasicFilterQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'metadata'", () => {
      // Arrange
      const value = new ExpressionValue("metadata", "Metadata", "metadata");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new MetadataFilterQueryVarsBuilder();
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
      const def = new MetadataFilterQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new MetadataFilterQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    const def = new MetadataFilterQueryVarsBuilder();
    const value = new ExpressionValue("metadata", "Meta Label", "metadata");
    const options = ConditionOptions.fromName("metadata");
    const conditionItem: ConditionItem = { type: "text.double", label: "is", value: "input-1" };

    it("should create a metadata object from a [key, value] tuple", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.metadata).toEqual([{ key: "foo", value: "bar" }]);
    });
    it("should use element label as key for non-tuple values", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "baz");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.metadata).toEqual([{ key: "Meta Label", value: "baz" }]);
    });
    it("should append to an existing metadata array on the query", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      const initialQuery = { metadata: [{ key: "a", value: "b" }] };
      // Act
      const result = def.updateWhereQueryVariables(initialQuery, element);

      // Assert
      expect(result.metadata).toEqual([
        { key: "a", value: "b" },
        { key: "foo", value: "bar" },
      ]);
    });
    it("should create a new metadata array if one does not exist", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.metadata).toEqual([{ key: "foo", value: "bar" }]);
    });
  });

  describe("updateFilterQueryVariables", () => {
    const def = new MetadataFilterQueryVarsBuilder();
    const value = new ExpressionValue("metadata", "Meta Label", "metadata");
    const options = ConditionOptions.fromName("metadata");
    const conditionItem: ConditionItem = { type: "text.double", label: "is", value: "input-1" };

    it("should create a metadata object from a [key, value] tuple", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.metadata).toEqual([{ key: "foo", value: "bar" }]);
    });
    it("should append to an existing metadata array", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["foo", "bar"]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      const initialQuery = { metadata: [{ key: "a", value: "b" }] };
      // Act
      const result = def.updateFilterQueryVariables(initialQuery, element);

      // Assert
      expect(result.metadata).toEqual([
        { key: "a", value: "b" },
        { key: "foo", value: "bar" },
      ]);
    });
  });
});
