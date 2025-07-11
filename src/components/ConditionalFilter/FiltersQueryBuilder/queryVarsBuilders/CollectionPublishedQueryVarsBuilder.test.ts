import { CollectionPublished } from "@dashboard/graphql";

import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { CollectionPublishedQueryVarsBuilder } from "./CollectionPublishedQueryVarsBuilder";

describe("CollectionPublishedQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'published'", () => {
      // Arrange
      const value = new ExpressionValue("published", "Published", "published");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new CollectionPublishedQueryVarsBuilder();
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
      const def = new CollectionPublishedQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new CollectionPublishedQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  // Note: This filter has support only for legacy FILTER API
  describe("updateFilterQueryVariables", () => {
    const def = new CollectionPublishedQueryVarsBuilder();
    const value = new ExpressionValue("published", "Published", "published");
    const options = ConditionOptions.fromName("published");
    const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };

    it("should correctly handle ItemOption with 'true' value", () => {
      // Arrange
      const itemOption: ItemOption = { label: "Yes", value: "true", slug: "true" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.published).toBe(CollectionPublished.PUBLISHED);
    });
    it("should correctly handle ItemOption with 'false' value", () => {
      // Arrange
      const itemOption: ItemOption = { label: "No", value: "false", slug: "false" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.published).toBe(CollectionPublished.HIDDEN);
    });
  });
});
