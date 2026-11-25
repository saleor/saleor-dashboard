import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";

import { getOrderLineError } from "./datagrid";

type Line = Parameters<typeof getOrderLineError>[1];

const line: Line = { id: "line-1", variant: { id: "variant-1" } };

const error = (overrides: Partial<OrderErrorFragment>): OrderErrorFragment => ({
  __typename: "OrderError",
  code: OrderErrorCode.NOT_AVAILABLE_IN_CHANNEL,
  field: "lines",
  addressType: null,
  message: "Cannot add lines with unavailable variants.",
  orderLines: null,
  variants: null,
  ...overrides,
});

describe("getOrderLineError", () => {
  it("matches an error that points at the line through its variant", () => {
    // Arrange
    const errors = [error({ variants: ["variant-2", "variant-1"] })];

    // Act
    const result = getOrderLineError(errors, line);

    // Assert
    expect(result).toBe(errors[0]);
  });

  it("matches an error that points at the line directly", () => {
    // Arrange
    const errors = [
      error({ code: OrderErrorCode.PRODUCT_UNAVAILABLE_FOR_PURCHASE, orderLines: ["line-1"] }),
    ];

    // Act
    const result = getOrderLineError(errors, line);

    // Assert
    expect(result).toBe(errors[0]);
  });

  it("ignores errors for other lines and lines without a variant", () => {
    // Arrange
    const errors = [error({ orderLines: ["line-2"], variants: ["variant-2"] })];
    const deletedVariantLine: Line = { id: "line-3", variant: null };

    // Act
    const results = [
      getOrderLineError(errors, line),
      getOrderLineError(errors, deletedVariantLine),
    ];

    // Assert
    expect(results).toEqual([undefined, undefined]);
  });
});
