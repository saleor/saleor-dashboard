import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { VoucherChannelDefinition } from "./VoucherChannelDefinition";

describe("VoucherChannelDefinition", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'channel'", () => {
      // Arrange
      const value = new ExpressionValue("channel", "Channel", "channel");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new VoucherChannelDefinition();
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
      const def = new VoucherChannelDefinition();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new VoucherChannelDefinition();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  // Note: This filter has support only for legacy FILTER API
  describe("updateFilterQuery", () => {
    const def = new VoucherChannelDefinition();
    const value = new ExpressionValue("channel", "Channel", "channel");
    const options = ConditionOptions.fromName("channel");
    const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-5" };

    it.skip("should use the channel's slug for a single value", () => {
      // Arrange
      const itemOption: ItemOption = { label: "Channel A", value: "idA", slug: "slugA" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQuery({}, element);

      // Assert
      expect(result.channel).toBe("slugA");
    });
    it.skip("should use an array of channel slugs for multiple values", () => {
      // Arrange
      const itemOption1: ItemOption = { label: "Channel A", value: "idA", slug: "slugA" };
      const itemOption2: ItemOption = { label: "Channel B", value: "idB", slug: "slugB" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQuery({}, element);

      // Assert
      expect(result.channel).toEqual(["slugA", "slugB"]);
    });
  });
});
