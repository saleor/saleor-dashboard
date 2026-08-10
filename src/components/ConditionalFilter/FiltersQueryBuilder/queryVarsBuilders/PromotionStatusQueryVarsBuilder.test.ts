import { DiscountStatusEnum } from "@dashboard/graphql";

import { Condition } from "../../FilterElement/Condition";
import { type ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { type ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { PromotionStatusQueryVarsBuilder } from "./PromotionStatusQueryVarsBuilder";

const now = new Date("2024-06-15T12:00:00.000Z");
const nowIso = now.toISOString();

describe("PromotionStatusQueryVarsBuilder", () => {
  const builder = new PromotionStatusQueryVarsBuilder();
  const value = new ExpressionValue("promotionStatus", "Status", "promotionStatus");
  const options = ConditionOptions.fromName("promotionStatus");
  const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };
  const multiConditionItem: ConditionItem = {
    type: "multiselect",
    label: "in",
    value: "input-2",
  };

  it("should return true for promotionStatus elements", () => {
    // Arrange
    const element = new FilterElement(value, Condition.createEmpty(), false);

    // Act & Assert
    expect(builder.canHandle(element)).toBe(true);
  });

  it("maps SCHEDULED to startDate gte now", () => {
    // Arrange
    const itemOption: ItemOption = {
      label: "Scheduled",
      value: DiscountStatusEnum.SCHEDULED,
      slug: "SCHEDULED",
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
    const element = new FilterElement(value, new Condition(options, selected, false), false);

    // Act
    const result = builder.buildWhereQueryVariables({}, element, now);

    // Assert
    expect(result).toEqual({
      AND: [{ startDate: { range: { gte: nowIso } } }],
    });
  });

  it("maps EXPIRED to endDate lte now", () => {
    // Arrange
    const itemOption: ItemOption = {
      label: "Ended",
      value: DiscountStatusEnum.EXPIRED,
      slug: "EXPIRED",
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
    const element = new FilterElement(value, new Condition(options, selected, false), false);

    // Act
    const result = builder.buildWhereQueryVariables({}, element, now);

    // Assert
    expect(result).toEqual({
      AND: [{ endDate: { range: { lte: nowIso } } }],
    });
  });

  it("maps ACTIVE to started and not yet ended", () => {
    // Arrange
    const itemOption: ItemOption = {
      label: "Active",
      value: DiscountStatusEnum.ACTIVE,
      slug: "ACTIVE",
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
    const element = new FilterElement(value, new Condition(options, selected, false), false);

    // Act
    const result = builder.buildWhereQueryVariables({}, element, now);

    // Assert
    expect(result).toEqual({
      AND: [
        {
          AND: [{ startDate: { range: { lte: nowIso } } }, { endDate: { range: { gte: nowIso } } }],
        },
      ],
    });
  });

  it("ORs multiple selected statuses", () => {
    // Arrange
    const selected = ConditionSelected.fromConditionItemAndValue(multiConditionItem, [
      {
        label: "Scheduled",
        value: DiscountStatusEnum.SCHEDULED,
        slug: "SCHEDULED",
      },
      {
        label: "Ended",
        value: DiscountStatusEnum.EXPIRED,
        slug: "EXPIRED",
      },
    ]);
    const element = new FilterElement(value, new Condition(options, selected, false), false);

    // Act
    const result = builder.buildWhereQueryVariables({}, element, now);

    // Assert
    expect(result).toEqual({
      AND: [
        {
          OR: [{ startDate: { range: { gte: nowIso } } }, { endDate: { range: { lte: nowIso } } }],
        },
      ],
    });
  });
});
