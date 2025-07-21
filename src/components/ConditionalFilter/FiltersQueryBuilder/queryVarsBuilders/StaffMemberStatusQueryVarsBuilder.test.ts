import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { StaffMemberStatusQueryVarsBuilder } from "./StaffMemberStatusQueryVarsBuilder";

describe("StaffMemberStatusQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with value 'staffMemberStatus'", () => {
      // Arrange
      const value = new ExpressionValue(
        "staffMemberStatus",
        "Staff Member Status",
        "staffMemberStatus",
      );
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new StaffMemberStatusQueryVarsBuilder();
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
      const def = new StaffMemberStatusQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return a NoopValuesHandler", () => {
      // Arrange
      const def = new StaffMemberStatusQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher();

      // Assert
      expect(handler).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("query updates (FILTER API only)", () => {
    const def = new StaffMemberStatusQueryVarsBuilder();
    const value = new ExpressionValue(
      "staffMemberStatus",
      "Staff Member Status",
      "staffMemberStatus",
    );
    const options = ConditionOptions.fromName("status");
    const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };

    it("should map the field to 'status' in the filter query", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "ACTIVE");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.status).toBeDefined();
    });
    it("should correctly map a single value (e.g., 'ACTIVE')", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "ACTIVE");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.status).toBe("ACTIVE");
    });
    it("should correctly map multiple values", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        "ACTIVE",
        "DEACTIVATED",
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.status).toEqual(["ACTIVE", "DEACTIVATED"]);
    });
  });
});
