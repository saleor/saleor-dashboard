import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { BooleanValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { StaticBooleanQueryVarsBuilder } from "./StaticBooleanQueryVarsBuilder";

describe("StaticBooleanQueryVarsBuilder", () => {
  describe("canHandle", () => {
    const supportedFields = [
      "isPublished",
      "hasCategory",
      "hasVariants",
      "isAvailable",
      "isVisibleInListing",
      "giftCard",
      "isActive",
    ];

    it.each(supportedFields)("should return true for the '%s' field", field => {
      // Arrange
      const value = new ExpressionValue(field, field, field);
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new StaticBooleanQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for unsupported field names", () => {
      // Arrange
      const value = new ExpressionValue("unsupported", "Unsupported", "unsupported");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new StaticBooleanQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for elements that are not static", () => {
      // Arrange
      const value = new ExpressionValue("attribute", "Attribute", "attribute");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new StaticBooleanQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a BooleanValuesHandler with correct 'Yes'/'No' options", () => {
      // Arrange
      const def = new StaticBooleanQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(BooleanValuesHandler);

      const options = (handler as BooleanValuesHandler).options;

      expect(options).toEqual([
        {
          label: "Yes",
          value: "true",
          type: AttributeInputTypeEnum.BOOLEAN,
          slug: "true",
        },
        {
          label: "No",
          value: "false",
          type: AttributeInputTypeEnum.BOOLEAN,
          slug: "false",
        },
      ]);
    });
  });

  describe("updateWhereQueryVariables", () => {
    const def = new StaticBooleanQueryVarsBuilder();
    const value = new ExpressionValue("isActive", "Is Active", "isActive");
    const options = ConditionOptions.fromName("isActive");
    const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };

    it("should correctly set a true value on the query object", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "true");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.isActive).toBe(true);
    });
    it("should correctly set a false value on the query object", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "false");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.isActive).toBe(false);
    });
  });

  describe("updateFilterQueryVariables", () => {
    const def = new StaticBooleanQueryVarsBuilder();
    const value = new ExpressionValue("isActive", "Is Active", "isActive");
    const options = ConditionOptions.fromName("isActive");
    const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };

    it("should produce the same boolean value as updateWhereQueryVariables", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "true");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const whereResult = def.updateWhereQueryVariables({}, element);
      const filterResult = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(filterResult.isActive).toBe(whereResult.isActive);
    });
  });
});
