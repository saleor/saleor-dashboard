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
    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: savedChannels,
        savedShippingChannels: savedChannels,
      }),
    );

    // Assert
    expect(result.current).toBe(false);
  });

  it("reports changes when a channel price is edited", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: [{ ...savedChannels[0], price: "12" }],
        savedShippingChannels: savedChannels,
      }),
    );

    // Assert
    expect(result.current).toBe(true);
  });

  it("reports changes when postal codes are edited", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: savedChannels,
        savedShippingChannels: savedChannels,
        hasPostalCodeChanges: true,
      }),
    );

    // Assert
    expect(result.current).toBe(true);
  });

  it("does not report changes when numeric form fields only differ by formatting", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: {
          ...initialFormData,
          minValue: "5.00",
          maxValue: "10.0",
        },
        initialFormData: {
          ...initialFormData,
          minValue: "5",
          maxValue: "10",
        },
        shippingChannels: savedChannels,
        savedShippingChannels: savedChannels,
      }),
    );

    // Assert
    expect(result.current).toBe(false);
  });

  it("does not report changes when a draft channel is auto-added without a price", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: [
          ...savedChannels,
          {
            id: "ch-2",
            name: "EUR",
            currency: "EUR",
            price: "",
            minValue: "",
            maxValue: "",
          },
        ],
        savedShippingChannels: savedChannels,
        savedChannelIds: ["ch-1"],
        pricedChannelIds: ["ch-1"],
      }),
    );

    // Assert
    expect(result.current).toBe(false);
  });

  it("reports changes when a draft channel receives a price", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingRateEditChanges({
        formData: initialFormData,
        initialFormData,
        shippingChannels: [
          ...savedChannels,
          {
            id: "ch-2",
            name: "EUR",
            currency: "EUR",
            price: "5",
            minValue: "",
            maxValue: "",
          },
        ],
        savedShippingChannels: savedChannels,
        savedChannelIds: ["ch-1"],
        pricedChannelIds: ["ch-1", "ch-2"],
      }),
    );

    // Assert
    expect(result.current).toBe(true);
  });
});
