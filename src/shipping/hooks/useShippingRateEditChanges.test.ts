import { type ChannelShippingData } from "@dashboard/channels/utils";
import { renderHook } from "@testing-library/react";

import { useShippingRateEditChanges } from "./useShippingRateEditChanges";

describe("useShippingRateEditChanges", () => {
  const initialFormData = {
    channelListings: [],
    name: "Standard",
    minDays: "1",
    maxDays: "5",
    minValue: "",
    maxValue: "",
    type: null,
    taxClassId: "",
  };
  const savedChannels: ChannelShippingData[] = [
    {
      id: "ch-1",
      name: "USD",
      currency: "USD",
      price: "10",
      minValue: "",
      maxValue: "",
    },
  ];

  it("reports no changes on initial load", () => {
    // Arrange
    const triggerChange = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: savedChannels,
        savedShippingChannels: savedChannels,
        triggerChange,
      }),
    );

    // Assert
    expect(result.current).toBe(false);
    expect(triggerChange).toHaveBeenCalledWith(false);
  });

  it("reports changes when a channel price is edited", () => {
    // Arrange
    const triggerChange = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: [{ ...savedChannels[0], price: "12" }],
        savedShippingChannels: savedChannels,
        triggerChange,
      }),
    );

    // Assert
    expect(result.current).toBe(true);
    expect(triggerChange).toHaveBeenCalledWith(true);
  });
});
