import { type FormsetQuantityData } from "@dashboard/orders/components/OrderReturnPage/form";

import {
  type GrantRefundInputLine,
  prepareGrantRefundLines,
  squashLines,
} from "./useRefundWithinReturn";

const getQuantityLine = ({
  id,
  orderLineId,
  value,
}: {
  id: string;
  orderLineId: string;
  value: number;
}): FormsetQuantityData[number] => ({
  id,
  label: "",
  value,
  data: {
    isFulfillment: true,
    isRefunded: false,
    orderLineId,
  },
});

describe("prepareGrantRefundLines", () => {
  it("includes fulfilled, waiting for approval and unfulfilled lines in the refund payload", () => {
    // Arrange
    const fulfilledItemsQuantities: FormsetQuantityData = [
      getQuantityLine({ id: "fulfillment-line-1", orderLineId: "order-line-1", value: 2 }),
    ];
    const waitingItemsQuantities: FormsetQuantityData = [
      getQuantityLine({ id: "fulfillment-line-2", orderLineId: "order-line-2", value: 1 }),
    ];
    const unfulfilledItemsQuantities: FormsetQuantityData = [
      getQuantityLine({ id: "order-line-3", orderLineId: "order-line-3", value: 3 }),
    ];

    // Act
    const result = prepareGrantRefundLines({
      fulfilledItemsQuantities,
      waitingItemsQuantities,
      unfulfilledItemsQuantities,
    });

    // Assert
    expect(result).toEqual([
      { id: "order-line-1", quantity: 2 },
      { id: "order-line-2", quantity: 1 },
      { id: "order-line-3", quantity: 3 },
    ]);
  });
  it("maps waiting for approval lines to order line ids", () => {
    // Arrange
    const waitingItemsQuantities: FormsetQuantityData = [
      getQuantityLine({ id: "fulfillment-line-1", orderLineId: "order-line-1", value: 4 }),
    ];

    // Act
    const result = prepareGrantRefundLines({
      fulfilledItemsQuantities: [],
      waitingItemsQuantities,
      unfulfilledItemsQuantities: [],
    });

    // Assert
    expect(result).toEqual([{ id: "order-line-1", quantity: 4 }]);
  });
  it("squashes lines referencing the same order line", () => {
    // Arrange
    const fulfilledItemsQuantities: FormsetQuantityData = [
      getQuantityLine({ id: "fulfillment-line-1", orderLineId: "order-line-1", value: 2 }),
    ];
    const waitingItemsQuantities: FormsetQuantityData = [
      getQuantityLine({ id: "fulfillment-line-2", orderLineId: "order-line-1", value: 1 }),
    ];

    // Act
    const result = prepareGrantRefundLines({
      fulfilledItemsQuantities,
      waitingItemsQuantities,
      unfulfilledItemsQuantities: [],
    });

    // Assert
    expect(result).toEqual([{ id: "order-line-1", quantity: 3 }]);
  });
});

describe("squashLines", () => {
  it("merges items with the same ID", () => {
    const items = [
      { id: "abc", quantity: 1 },
      { id: "def", quantity: 2 },
      { id: "abc", quantity: 3 },
    ];
    const result = squashLines(items);

    expect(result).toEqual([
      { id: "abc", quantity: 4 },
      { id: "def", quantity: 2 },
    ]);
  });
  it("handles an empty array", () => {
    const items = [] as GrantRefundInputLine[];
    const result = squashLines(items);

    expect(result).toEqual([]);
  });
  it("does not modify items with unique IDs", () => {
    const items = [
      { id: "abc", quantity: 1 },
      { id: "def", quantity: 2 },
    ];
    const result = squashLines(items);

    expect(result).toEqual(items);
  });
});
