import { getPromotionStatus } from "@dashboard/discounts/utils";
import {
  type DateTimeFilterInput,
  DiscountStatusEnum,
  type PromotionWhereInput,
} from "@dashboard/graphql";

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

  it("maps EXPIRED to started and ended", () => {
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
      AND: [
        {
          AND: [{ startDate: { range: { lte: nowIso } } }, { endDate: { range: { lte: nowIso } } }],
        },
      ],
    });
  });

  it("maps ACTIVE to started, with no end date or one still ahead", () => {
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
          AND: [
            { startDate: { range: { lte: nowIso } } },
            { OR: [{ endDate: { eq: null } }, { endDate: { range: { gte: nowIso } } }] },
          ],
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
          OR: [
            { startDate: { range: { gte: nowIso } } },
            {
              AND: [
                { startDate: { range: { lte: nowIso } } },
                { endDate: { range: { lte: nowIso } } },
              ],
            },
          ],
        },
      ],
    });
  });

  describe("agrees with the Status column", () => {
    type Where = PromotionWhereInput;
    interface Dates {
      startDate: string | null;
      endDate: string | null;
    }

    // Reads a where clause the way the API does, for the fields the builder uses.
    const matchesRange = (
      value: string | null,
      filter: DateTimeFilterInput | null | undefined,
    ): boolean => {
      if (!filter) {
        return true;
      }

      if ("eq" in filter) {
        return value === filter.eq;
      }

      const { gte, lte } = filter.range ?? {};

      return value !== null && (!gte || value >= String(gte)) && (!lte || value <= String(lte));
    };
    const matches = (where: Where, dates: Dates): boolean =>
      (where.AND ?? []).every(clause => matches(clause, dates)) &&
      (!where.OR || where.OR.some(clause => matches(clause, dates))) &&
      matchesRange(dates.startDate, where.startDate) &&
      matchesRange(dates.endDate, where.endDate);

    const statusOf: Record<string, DiscountStatusEnum> = {
      active: DiscountStatusEnum.ACTIVE,
      scheduled: DiscountStatusEnum.SCHEDULED,
      finished: DiscountStatusEnum.EXPIRED,
    };
    const hourAgo = "2024-06-15T11:00:00.000Z";
    const inAnHour = "2024-06-15T13:00:00.000Z";

    it.each<[string, Dates]>([
      ["started, no end date", { startDate: hourAgo, endDate: null }],
      ["started, ends later", { startDate: hourAgo, endDate: inAnHour }],
      ["started, ended", { startDate: hourAgo, endDate: hourAgo }],
      ["starts later, no end date", { startDate: inAnHour, endDate: null }],
      ["starts later, ends later", { startDate: inAnHour, endDate: inAnHour }],
      ["starts later, end date in the past", { startDate: inAnHour, endDate: hourAgo }],
    ])("finds a promotion that %s under its column status only", (_case, dates) => {
      // Arrange
      const columnStatus = statusOf[getPromotionStatus({ ...dates, now })];

      // Act
      const filtersFindingIt = Object.values(DiscountStatusEnum).filter(status => {
        const element = new FilterElement(
          value,
          new Condition(
            options,
            ConditionSelected.fromConditionItemAndValue(conditionItem, {
              label: status,
              value: status,
              slug: status,
            }),
            false,
          ),
          false,
        );

        return matches(builder.buildWhereQueryVariables({}, element, now), dates);
      });

      // Assert
      expect(filtersFindingIt).toEqual([columnStatus]);
    });
  });
});
