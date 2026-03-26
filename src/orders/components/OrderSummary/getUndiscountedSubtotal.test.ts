import { type OrderLineFragment } from "@dashboard/graphql";

import { getUndiscountedSubtotal } from "./getUndiscountedSubtotal";

type LineInput = Pick<OrderLineFragment, "undiscountedTotalPrice">;

const makeLine = ({
  netTotal,
  grossTotal,
  currency = "USD",
}: {
  netTotal: number;
  grossTotal: number;
  currency?: string;
}): LineInput => ({
  undiscountedTotalPrice: {
    __typename: "TaxedMoney",
    gross: { __typename: "Money", amount: grossTotal, currency },
    net: { __typename: "Money", amount: netTotal, currency },
  },
});

describe("getUndiscountedSubtotal", () => {
  it("returns 0 for an empty line list", () => {
    // Arrange
    const lines: LineInput[] = [];

    // Act
    const result = getUndiscountedSubtotal(lines, false);

    // Assert
    expect(result).toBe(0);
  });

  it("sums net undiscounted line totals when useGrossAmount is false", () => {
    // Arrange
    const lines = [makeLine({ netTotal: 20, grossTotal: 24 })];

    // Act
    const result = getUndiscountedSubtotal(lines, false);

    // Assert
    expect(result).toBe(20);
  });

  it("sums gross undiscounted line totals when useGrossAmount is true", () => {
    // Arrange
    const lines = [makeLine({ netTotal: 20, grossTotal: 24 })];

    // Act
    const result = getUndiscountedSubtotal(lines, true);

    // Assert
    expect(result).toBe(24);
  });

  it("aggregates multiple lines", () => {
    // Arrange
    const lines = [
      makeLine({ netTotal: 5, grossTotal: 6 }),
      makeLine({ netTotal: 9, grossTotal: 12 }),
    ];

    // Act
    const netTotal = getUndiscountedSubtotal(lines, false);
    const grossTotal = getUndiscountedSubtotal(lines, true);

    // Assert
    expect(netTotal).toBe(14);
    expect(grossTotal).toBe(18);
  });

  it("handles decimal line totals", () => {
    // Arrange
    const lines = [
      makeLine({ netTotal: 9.98, grossTotal: 11.38 }),
      makeLine({ netTotal: 5, grossTotal: 6 }),
    ];

    // Act
    const netTotal = getUndiscountedSubtotal(lines, false);
    const grossTotal = getUndiscountedSubtotal(lines, true);

    // Assert
    expect(netTotal).toBe(14.98);
    expect(grossTotal).toBeCloseTo(17.38, 10);
  });

  it("matches IEEE-754 float results for amounts that are not exactly representable", () => {
    // Arrange — e.g. 10.1 * 3 is not exactly 30.3 in binary float
    const lines = [makeLine({ netTotal: 30.3, grossTotal: 36.6 })];

    // Act
    const netTotal = getUndiscountedSubtotal(lines, false);
    const grossTotal = getUndiscountedSubtotal(lines, true);

    // Assert
    expect(netTotal).toBeCloseTo(30.3, 10);
    expect(grossTotal).toBeCloseTo(36.6, 10);
  });

  it("handles three fractional digits (ISO 4217 currencies such as KWD)", () => {
    // Arrange — Saleor exposes fractionDigits per currency; see e.g. OrderCaptureDialog
    const lines = [
      makeLine({
        currency: "KWD",
        netTotal: 4.936,
        grossTotal: 5.824,
      }),
      makeLine({
        currency: "KWD",
        netTotal: 1.134,
        grossTotal: 1.578,
      }),
    ];

    // Act
    const netTotal = getUndiscountedSubtotal(lines, false);
    const grossTotal = getUndiscountedSubtotal(lines, true);

    // Assert
    expect(netTotal).toBe(6.07);
    expect(grossTotal).toBe(7.402);
  });

  it("uses API line totals instead of recomputing unit times quantity", () => {
    // Arrange — backend undiscountedTotalPrice can differ from unit × qty after tax/quantize
    const lines = [
      makeLine({
        netTotal: 99.5,
        grossTotal: 100.25,
      }),
    ];

    // Act
    expect(getUndiscountedSubtotal(lines, false)).toBe(99.5);
    expect(getUndiscountedSubtotal(lines, true)).toBe(100.25);
  });
});
