import {
  DiscountValueTypeEnum,
  type OrderDetailsFragment,
  type OrderDiscountFragment,
  OrderDiscountType,
  type OrderLineDiscountFragment,
} from "@dashboard/graphql";

import { type AutomaticDiscountInfo, type OrderLineDiscountData } from "./types";
import { getAutomaticLineDiscounts, getOrderLineDiscount } from "./utils";

/** Minimal order line shape for these tests; cast to full fragment at the boundary. */
type OrderDetailsLineStub = Partial<OrderDetailsFragment["lines"][number]> &
  Pick<OrderDetailsFragment["lines"][number], "id">;

type OrderLinePriceStub = Pick<
  OrderDetailsFragment["lines"][number],
  "id" | "unitPrice" | "undiscountedUnitPrice"
>;

const orderAsDetails = (partial: {
  lines: OrderDetailsLineStub[];
  discounts: OrderDetailsFragment["discounts"];
}): OrderDetailsFragment => partial as OrderDetailsFragment;

const lineBase = (
  id: string,
  unitGross: number,
  undiscountedGross: number,
): OrderLinePriceStub => ({
  id,
  unitPrice: {
    __typename: "TaxedMoney" as const,
    gross: { __typename: "Money" as const, amount: unitGross, currency: "USD" },
    net: { __typename: "Money" as const, amount: unitGross, currency: "USD" },
  },
  undiscountedUnitPrice: {
    __typename: "TaxedMoney" as const,
    currency: "USD",
    gross: { __typename: "Money" as const, amount: undiscountedGross, currency: "USD" },
    net: { __typename: "Money" as const, amount: undiscountedGross, currency: "USD" },
  },
});

const orderLineDiscount = ({
  id,
  type,
  name = null,
  translatedName = null,
}: {
  id: string;
  type: OrderDiscountType;
  name?: string | null;
  translatedName?: string | null;
}): OrderLineDiscountFragment => ({
  __typename: "OrderLineDiscount" as const,
  id,
  type,
  name,
  translatedName,
  valueType: DiscountValueTypeEnum.FIXED,
  value: 1,
  reason: null as string | null,
});

const orderDiscount = (
  id: string,
  type: OrderDiscountType,
  name: string | null,
): OrderDiscountFragment => ({
  __typename: "OrderDiscount" as const,
  id,
  type,
  name,
  value: 0,
  reason: null as string | null,
  calculationMode: DiscountValueTypeEnum.FIXED,
  amount: { __typename: "Money" as const, amount: 0, currency: "USD" },
});

type OrderLineManualDiscountStub = Pick<
  OrderDetailsFragment["lines"][number],
  "id" | "discounts" | "unitDiscount" | "undiscountedUnitPrice"
>;

const manualOrderLineDiscount = ({
  id,
  value = 15,
  valueType = DiscountValueTypeEnum.PERCENTAGE,
  reason = null as string | null,
}: {
  id: string;
  value?: number;
  valueType?: DiscountValueTypeEnum;
  reason?: string | null;
}): OrderLineDiscountFragment => ({
  __typename: "OrderLineDiscount" as const,
  id,
  type: OrderDiscountType.MANUAL,
  name: null,
  translatedName: null,
  valueType,
  value,
  reason,
});

const defaultUnitDiscount = {
  __typename: "Money" as const,
  amount: 3,
  currency: "USD",
};

const defaultUndiscountedUnitPrice = {
  __typename: "TaxedMoney" as const,
  currency: "USD",
  gross: { __typename: "Money" as const, amount: 50, currency: "USD" },
  net: { __typename: "Money" as const, amount: 40, currency: "USD" },
};

const orderLineWithManualContext = ({
  id,
  discounts,
  unitDiscount = defaultUnitDiscount,
  undiscountedUnitPrice = defaultUndiscountedUnitPrice,
}: {
  id: string;
  discounts: OrderLineDiscountFragment[] | null | undefined;
  unitDiscount?: OrderLineManualDiscountStub["unitDiscount"];
  undiscountedUnitPrice?: OrderLineManualDiscountStub["undiscountedUnitPrice"];
}): OrderLineManualDiscountStub => ({
  id,
  discounts: discounts ?? null,
  unitDiscount,
  undiscountedUnitPrice,
});

describe("getOrderLineDiscount", () => {
  const lineId = "line-1";

  it("returns null when the line is not on the order", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [
        orderLineWithManualContext({
          id: "other-line",
          discounts: [manualOrderLineDiscount({ id: "d1" })],
        }),
      ],
      discounts: [],
    });

    // Act
    const result = getOrderLineDiscount(order, lineId);

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when the line has no discounts", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [orderLineWithManualContext({ id: lineId, discounts: [] })],
      discounts: [],
    });

    // Act
    const result = getOrderLineDiscount(order, lineId);

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when the line has no manual discount", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [
        orderLineWithManualContext({
          id: lineId,
          discounts: [orderLineDiscount({ id: "d1", type: OrderDiscountType.VOUCHER, name: "V" })],
        }),
      ],
      discounts: [],
    });

    // Act
    const result = getOrderLineDiscount(order, lineId);

    // Assert
    expect(result).toBeNull();
  });

  it("returns manual discount data mapped from the line", () => {
    // Arrange
    const manual = manualOrderLineDiscount({
      id: "d1",
      value: 20,
      valueType: DiscountValueTypeEnum.FIXED,
      reason: "Staff adjustment",
    });
    const order = orderAsDetails({
      lines: [orderLineWithManualContext({ id: lineId, discounts: [manual] })],
      discounts: [],
    });

    // Act
    const result = getOrderLineDiscount(order, lineId);

    // Assert
    const expected: OrderLineDiscountData = {
      calculationMode: DiscountValueTypeEnum.FIXED,
      moneyValue: defaultUnitDiscount,
      reason: "Staff adjustment",
      undiscountedPrice: defaultUndiscountedUnitPrice,
      value: 20,
    };

    expect(result).toEqual(expected);
  });

  it("uses empty string when manual discount reason is null", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [
        orderLineWithManualContext({
          id: lineId,
          discounts: [manualOrderLineDiscount({ id: "d1", reason: null })],
        }),
      ],
      discounts: [],
    });

    // Act
    const result = getOrderLineDiscount(order, lineId);

    // Assert
    expect(result?.reason).toBe("");
  });

  it("picks the first manual discount when several are present", () => {
    // Arrange
    const first = manualOrderLineDiscount({ id: "d1", value: 5, reason: "First" });
    const second = manualOrderLineDiscount({ id: "d2", value: 99, reason: "Second" });
    const order = orderAsDetails({
      lines: [orderLineWithManualContext({ id: lineId, discounts: [first, second] })],
      discounts: [],
    });

    // Act
    const result = getOrderLineDiscount(order, lineId);

    // Assert
    expect(result?.value).toBe(5);
    expect(result?.reason).toBe("First");
  });
});

describe("getAutomaticLineDiscounts", () => {
  const lineId = "line-1";

  it("returns empty array when the line is not on the order", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [lineBase("other-line", 80, 100)],
      discounts: [],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns empty array when there is no unit price reduction", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [lineBase(lineId, 100, 100)],
      discounts: [],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns non-manual line discounts when the line is reduced and has automatic entries", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [
        {
          ...lineBase(lineId, 80, 100),
          discounts: [
            orderLineDiscount({ id: "d1", type: OrderDiscountType.VOUCHER, name: "SAVE10" }),
            orderLineDiscount({ id: "d2", type: OrderDiscountType.MANUAL, name: "Staff" }),
          ],
        },
      ],
      discounts: [],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    const expected: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.VOUCHER, name: "SAVE10" }];

    expect(result).toEqual(expected);
  });

  it("prefers translatedName over name for line discounts", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [
        {
          ...lineBase(lineId, 80, 100),
          discounts: [
            orderLineDiscount({
              id: "d1",
              type: OrderDiscountType.PROMOTION,
              name: "Internal",
              translatedName: "Summer Sale",
            }),
          ],
        },
      ],
      discounts: [],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    expect(result).toEqual([{ type: OrderDiscountType.PROMOTION, name: "Summer Sale" }]);
  });

  it("falls back to order-level discounts when the line is reduced but has no automatic line discounts and no manual line discount", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [{ ...lineBase(lineId, 80, 100), discounts: [] }],
      discounts: [
        orderDiscount("od1", OrderDiscountType.ORDER_PROMOTION, "Order promo"),
        orderDiscount("od2", OrderDiscountType.MANUAL, "Manual order"),
      ],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    expect(result).toEqual([{ type: OrderDiscountType.ORDER_PROMOTION, name: "Order promo" }]);
  });

  it("returns empty array when only a manual line discount explains the reduction", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [
        {
          ...lineBase(lineId, 80, 100),
          discounts: [
            orderLineDiscount({ id: "d1", type: OrderDiscountType.MANUAL, name: "Staff" }),
          ],
        },
      ],
      discounts: [orderDiscount("od1", OrderDiscountType.VOUCHER, "Would ignore")],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    expect(result).toEqual([]);
  });

  it("treats missing line discounts like an empty list for order-level fallback", () => {
    // Arrange
    const order = orderAsDetails({
      lines: [{ ...lineBase(lineId, 80, 100) }],
      discounts: [orderDiscount("od1", OrderDiscountType.SALE, "Sale")],
    });

    // Act
    const result = getAutomaticLineDiscounts(order, lineId);

    // Assert
    expect(result).toEqual([{ type: OrderDiscountType.SALE, name: "Sale" }]);
  });
});
