import { renderHook } from "@testing-library/react-hooks";

import { useFulfillmentFormset } from "./useFulfillmentFormset";

describe("useFulfillmentFormset", () => {
  it("should be disabled when no items are returned, no shipping and no amount", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useFulfillmentFormset({
        order: {
          fulfillments: [],
          lines: [],
        } as any,
        formData: {
          amount: 0,
          refundShipmentCosts: false,
        },
      }),
    );

    // Assert
    expect(result.current.disabled).toBe(true);
  });

  it("should not disabled when no items are returned, but with shipping and no amount", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useFulfillmentFormset({
        order: {
          fulfillments: [],
          lines: [],
        } as any,
        formData: {
          amount: 0,
          refundShipmentCosts: true,
        },
      }),
    );

    // Assert
    expect(result.current.disabled).toBe(false);
  });

  it("should not disabled when no items are returned, but with shipping and amount", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useFulfillmentFormset({
        order: {
          fulfillments: [],
          lines: [],
        } as any,
        formData: {
          amount: 21.37,
          refundShipmentCosts: true,
        },
      }),
    );

    // Assert
    expect(result.current.disabled).toBe(false);
  });

  it("should not disabled when there are items selected with value, but with no shipping and no amount", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useFulfillmentFormset({
        order: {
          fulfillments: [
            {
              status: "FULFILLED",
              lines: [
                {
                  id: "id",
                  quantity: 1,
                  orderLine: {
                    id: "id",
                  },
                },
              ],
            } as any,
          ],
          lines: [
            {
              id: "id",
              quantity: 1,
            } as any,
          ],
        } as any,
        formData: {
          amount: 0,
          refundShipmentCosts: false,
        },
      }),
    );

    result.current.fulfiledItemsQuatities.change("id", 21.37);

    // Assert
    expect(result.current.fulfiledItemsQuatities.data.length).toBe(1);
    expect(result.current.disabled).toBe(false);
  });
});
