import { type ChannelShippingData } from "@dashboard/channels/utils";
import { act, renderHook } from "@testing-library/react";

import { useShippingRateChannels } from "./useShippingRateChannels";

describe("useShippingRateChannels", () => {
  const baseChannel: ChannelShippingData = {
    id: "ch-1",
    name: "USD",
    currency: "USD",
    price: "",
    minValue: "",
    maxValue: "",
  };

  it("disables save when a channel price is cleared to null", () => {
    // Arrange
    const onChannelsChange = jest.fn();
    const triggerChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ shippingChannels }) =>
        useShippingRateChannels({
          shippingChannels,
          onChannelsChange,
          triggerChange,
        }),
      {
        initialProps: {
          shippingChannels: [baseChannel],
        },
      },
    );

    // Act
    act(() => {
      result.current.handleChannelsChange("ch-1", {
        maxValue: "",
        minValue: "",
        price: "10",
      });
    });

    rerender({
      shippingChannels: [{ ...baseChannel, price: "10" }],
    });

    act(() => {
      result.current.handleChannelsChange("ch-1", {
        maxValue: "",
        minValue: "",
        price: null,
      });
    });

    rerender({
      shippingChannels: [{ ...baseChannel, price: "" }],
    });

    // Assert
    expect(result.current.hasValidChannelPrices).toBe(false);
    expect(result.current.pricedChannelIdsList).toEqual(["ch-1"]);
  });
});
