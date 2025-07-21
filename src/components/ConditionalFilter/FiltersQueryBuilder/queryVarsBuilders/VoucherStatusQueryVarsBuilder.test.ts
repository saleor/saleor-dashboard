import { DiscountStatusEnum } from "@dashboard/graphql";

import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { VoucherStatusQueryVarsBuilder } from "./VoucherStatusQueryVarsBuilder";

describe("VoucherStatusQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'voucherStatus'", () => {
      // Arrange
      const value = new ExpressionValue("voucherStatus", "Voucher Status", "voucherStatus");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new VoucherStatusQueryVarsBuilder();
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
      const def = new VoucherStatusQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new VoucherStatusQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  // Note: This filter has support only for legacy FILTER API
  describe("updateFilterQueryVariables", () => {
    const def = new VoucherStatusQueryVarsBuilder();
    const value = new ExpressionValue("voucherStatus", "Voucher Status", "voucherStatus");
    const options = ConditionOptions.fromName("voucherStatus");
    const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };

    it("should map the field to 'status' in the filter query", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "ACTIVE");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result).toHaveProperty("status");
    });
    it("should correctly map a single status value", () => {
      // Arrange
      const itemOption: ItemOption = {
        label: "Active",
        value: DiscountStatusEnum.ACTIVE,
        slug: "ACTIVE",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.status).toEqual([DiscountStatusEnum.ACTIVE]);
    });
    it("should correctly map multiple status values into an array of enums", () => {
      // Arrange
      const itemOption1: ItemOption = {
        label: "Active",
        value: DiscountStatusEnum.ACTIVE,
        slug: "ACTIVE",
      };
      const itemOption2: ItemOption = {
        label: "Expired",
        value: DiscountStatusEnum.EXPIRED,
        slug: "EXPIRED",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.status).toEqual([DiscountStatusEnum.ACTIVE, DiscountStatusEnum.EXPIRED]);
    });
    it("should return undefined if the value is not a valid selection", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.status).toBeUndefined();
    });
  });
});
