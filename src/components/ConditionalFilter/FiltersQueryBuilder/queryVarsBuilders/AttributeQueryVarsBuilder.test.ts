import { ApolloClient } from "@apollo/client";
import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { AttributeChoicesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { AttributeQueryVarsBuilder } from "./AttributeQueryVarsBuilder";

describe("AttributeQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with rowType 'attribute'", () => {
      // Arrange
      const value = new ExpressionValue("attribute", "Attribute", "attribute");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new AttributeQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for elements with other rowTypes", () => {
      // Arrange
      const value = new ExpressionValue("not-attribute", "Other", "other");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new AttributeQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    const client = {} as ApolloClient<unknown>;
    const inputValue = "test";
    const baseElement = new FilterElement(
      new ExpressionValue("attribute", "Attribute", "attribute"),
      Condition.createEmpty(),
      false,
      undefined,
    );

    it("should create AttributeChoicesHandler for other attribute types", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        new ExpressionValue("attr-slug", "Attr", AttributeInputTypeEnum.DROPDOWN),
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(AttributeChoicesHandler);
    });

    it("should handle gracefully if attribute is not selected", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        null,
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(AttributeChoicesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    const def = new AttributeQueryVarsBuilder();
    const baseValue = new ExpressionValue("attribute", "Attribute", "attribute");
    const baseConditionItem: ConditionItem = { type: "multiselect", label: "in", value: "input-2" };
    const baseSelected = ConditionSelected.fromConditionItem(baseConditionItem);
    const baseCondition = new Condition(
      ConditionOptions.fromName(AttributeInputTypeEnum.DROPDOWN),
      baseSelected,
      false,
    );

    it("should correctly build query for DROPDOWN/MULTISELECT attributes", () => {
      // Arrange
      const attributeSlug = "dropdown-attr";
      const optionValue = "option-1";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "DropdownAttr",
        AttributeInputTypeEnum.DROPDOWN,
      );
      const selected = ConditionSelected.fromConditionItemAndValue(baseConditionItem, {
        label: "Option 1",
        value: optionValue,
        slug: optionValue,
      });
      const condition = new Condition(
        ConditionOptions.fromName(AttributeInputTypeEnum.DROPDOWN),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ attributes: [{ slug: attributeSlug, values: [optionValue] }] });
    });

    it("should correctly build query for NUMERIC attributes with range", () => {
      // Arrange
      const attributeSlug = "numeric-attr";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "NumericAttr",
        AttributeInputTypeEnum.NUMERIC,
      );
      const rangeConditionItem: ConditionItem = {
        type: "number.range",
        label: "between",
        value: "input-4",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(rangeConditionItem, [
        "10",
        "20",
      ]);
      const condition = new Condition(
        ConditionOptions.fromName(AttributeInputTypeEnum.NUMERIC),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [{ slug: attributeSlug, valuesRange: { gte: 10, lte: 20 } }],
      });
    });

    it("should correctly build query for DATE attributes with range", () => {
      // Arrange
      const attributeSlug = "date-attr";
      const startDate = "2023-01-01";
      const endDate = "2023-01-31";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "DateAttr",
        AttributeInputTypeEnum.DATE,
      );
      const rangeConditionItem: ConditionItem = {
        type: "date.range",
        label: "between",
        value: "input-3",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(rangeConditionItem, [
        startDate,
        endDate,
      ]);
      const condition = new Condition(
        ConditionOptions.fromName(AttributeInputTypeEnum.DATE),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [{ slug: attributeSlug, date: { gte: startDate, lte: endDate } }],
      });
    });

    it("should correctly build query for DATETIME attributes with range", () => {
      // Arrange
      const attributeSlug = "datetime-attr";
      const startDateTime = "2023-01-01T00:00:00Z";
      const endDateTime = "2023-01-31T23:59:59Z";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "DatetimeAttr",
        AttributeInputTypeEnum.DATE_TIME,
      );
      const rangeConditionItem: ConditionItem = {
        type: "datetime.range",
        label: "between",
        value: "input-4",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(rangeConditionItem, [
        startDateTime,
        endDateTime,
      ]);
      const condition = new Condition(
        ConditionOptions.fromName(AttributeInputTypeEnum.DATE_TIME),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [{ slug: attributeSlug, dateTime: { gte: startDateTime, lte: endDateTime } }],
      });
    });

    it("should correctly build query for BOOLEAN attributes", () => {
      // Arrange
      const attributeSlug = "bool-attr";
      const boolValue = true;
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "BoolAttr",
        AttributeInputTypeEnum.BOOLEAN,
      );
      const boolConditionItem: ConditionItem = { type: "select", label: "is", value: "input-5" };
      const selected = ConditionSelected.fromConditionItemAndValue(boolConditionItem, {
        label: "Yes",
        value: boolValue.toString(),
        slug: boolValue.toString(),
      });
      const condition = new Condition(
        ConditionOptions.fromName(AttributeInputTypeEnum.BOOLEAN),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ attributes: [{ slug: attributeSlug, boolean: boolValue }] });
    });

    it("should return query unchanged if attribute slug is missing", () => {
      // Arrange
      const selectedAttribute = null;
      const element = new FilterElement(
        baseValue,
        baseCondition,
        false,
        undefined,
        selectedAttribute,
      );
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });
  });
});
