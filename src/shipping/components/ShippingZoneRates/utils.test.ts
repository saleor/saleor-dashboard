import { describe, expect, it } from "@jest/globals";

import {
  getConfiguredChannelCount,
  getPriceSpan,
  type ShippingRate,
  type ZoneChannel,
} from "./utils";

const zoneChannels: ZoneChannel[] = [
  { id: "ch-1", name: "USD", currencyCode: "USD" },
  { id: "ch-2", name: "EUR", currencyCode: "EUR" },
];

const rate: ShippingRate = {
  id: "rate-1",
  name: "Standard",
  type: "PRICE",
  channelListings: [
    {
      id: "listing-1",
      channel: { id: "ch-1", name: "USD", currencyCode: "USD" },
      price: { amount: 5, currency: "USD" },
      minimumOrderPrice: { amount: 0, currency: "USD" },
      maximumOrderPrice: { amount: 50, currency: "USD" },
    },
    {
      id: "listing-2",
      channel: { id: "ch-2", name: "EUR", currencyCode: "EUR" },
      price: { amount: 4, currency: "EUR" },
      minimumOrderPrice: { amount: 0, currency: "EUR" },
      maximumOrderPrice: { amount: 50, currency: "EUR" },
    },
  ],
} as ShippingRate;

describe("shipping zone rate utils", () => {
  it("counts configured channel listings for zone channels", () => {
    // Arrange
    // Act
    const configuredCount = getConfiguredChannelCount(rate, zoneChannels);

    // Assert
    expect(configuredCount).toBe(2);
  });

  it("returns null price span when configured currencies differ", () => {
    // Arrange
    // Act
    const priceSpan = getPriceSpan(rate, zoneChannels);

    // Assert
    expect(priceSpan).toBeNull();
  });

  it("returns min and max price span for same currency", () => {
    // Arrange
    const usdOnlyRate: ShippingRate = {
      ...rate,
      channelListings: [
        {
          id: "listing-1",
          channel: { id: "ch-1", name: "USD", currencyCode: "USD" },
          price: { amount: 5, currency: "USD" },
          minimumOrderPrice: { amount: 0, currency: "USD" },
          maximumOrderPrice: { amount: 50, currency: "USD" },
        },
        {
          id: "listing-3",
          channel: { id: "ch-3", name: "USD 2", currencyCode: "USD" },
          price: { amount: 10, currency: "USD" },
          minimumOrderPrice: { amount: 0, currency: "USD" },
          maximumOrderPrice: null,
        },
      ],
    } as ShippingRate;
    const usdChannels: ZoneChannel[] = [
      { id: "ch-1", name: "USD", currencyCode: "USD" },
      { id: "ch-3", name: "USD 2", currencyCode: "USD" },
    ];

    // Act
    const priceSpan = getPriceSpan(usdOnlyRate, usdChannels);

    // Assert
    expect(priceSpan).toEqual({ currency: "USD", min: 5, max: 10 });
  });
});
