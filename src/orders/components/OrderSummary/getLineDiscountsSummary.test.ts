import { DiscountValueTypeEnum, OrderDiscountType } from "@dashboard/graphql";

import {
  getLineDiscountsSummary,
  type LineDiscountSummaryEntry,
  type LineInput,
} from "./getLineDiscountsSummary";

const makeLine = ({
  unitDiscountAmount = 0,
  quantity = 1,
  discountType,
}: {
  unitDiscountAmount?: number;
  quantity?: number;
  discountType?: OrderDiscountType;
}): LineInput => ({
  unitDiscount: { __typename: "Money" as const, amount: unitDiscountAmount, currency: "USD" },
  quantity,
  discounts: discountType
    ? [
        {
          __typename: "OrderLineDiscount" as const,
          id: "d-1",
          type: discountType,
          name: "test",
          translatedName: "test",
          valueType: DiscountValueTypeEnum.FIXED,
          value: unitDiscountAmount,
          reason: "",
        },
      ]
    : [],
});

describe("getLineDiscountsSummary", () => {
  it("returns empty array when no lines have discounts", () => {
    // Arrange
    const lines = [makeLine({}), makeLine({})];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns single entry for one discounted line", () => {
    // Arrange
    const lines = [
      makeLine({
        unitDiscountAmount: 4.5,
        discountType: OrderDiscountType.MANUAL,
        quantity: 1,
      }),
    ];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    const expected: LineDiscountSummaryEntry[] = [
      {
        type: OrderDiscountType.MANUAL,
        lineCount: 1,
        totalAmount: 4.5,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("aggregates multiple lines with the same discount type", () => {
    // Arrange
    const lines = [
      makeLine({
        unitDiscountAmount: 10,
        discountType: OrderDiscountType.PROMOTION,
        quantity: 2,
      }),
      makeLine({
        unitDiscountAmount: 5,
        discountType: OrderDiscountType.PROMOTION,
        quantity: 3,
      }),
    ];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    const expected: LineDiscountSummaryEntry[] = [
      {
        type: OrderDiscountType.PROMOTION,
        lineCount: 2,
        totalAmount: 35,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("groups by discount type when lines have different types", () => {
    // Arrange
    const lines = [
      makeLine({
        unitDiscountAmount: 4.5,
        discountType: OrderDiscountType.MANUAL,
        quantity: 1,
      }),
      makeLine({
        unitDiscountAmount: 40,
        discountType: OrderDiscountType.PROMOTION,
        quantity: 1,
      }),
      makeLine({}),
    ];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      type: OrderDiscountType.MANUAL,
      lineCount: 1,
      totalAmount: 4.5,
    });
    expect(result).toContainEqual({
      type: OrderDiscountType.PROMOTION,
      lineCount: 1,
      totalAmount: 40,
    });
  });

  it("multiplies unit discount by quantity", () => {
    // Arrange
    const lines = [
      makeLine({
        unitDiscountAmount: 1.0,
        discountType: OrderDiscountType.VOUCHER,
        quantity: 30,
      }),
    ];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    expect(result[0].totalAmount).toBe(30);
  });

  it("skips lines with zero discount amount", () => {
    // Arrange
    const lines = [
      makeLine({}),
      makeLine({
        unitDiscountAmount: 2,
        discountType: OrderDiscountType.VOUCHER,
        quantity: 1,
      }),
    ];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(OrderDiscountType.VOUCHER);
  });

  it("skips lines with empty discounts array", () => {
    // Arrange
    const lines = [
      makeLine({ unitDiscountAmount: 5 }),
      makeLine({
        unitDiscountAmount: 7,
        discountType: OrderDiscountType.MANUAL,
        quantity: 1,
      }),
    ];

    // Act
    const result = getLineDiscountsSummary(lines);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: OrderDiscountType.MANUAL,
      lineCount: 1,
      totalAmount: 7,
    });
  });
});
