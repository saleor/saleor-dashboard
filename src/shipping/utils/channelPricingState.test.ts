import { type ChannelShippingData } from "@dashboard/channels/utils";

import {
  areChannelListingsEqual,
  getChannelIdsWithPrice,
  hasMissingChannelPrices,
  isDraftShippingChannel,
} from "./channelPricingState";

describe("channelPricingState", () => {
  const channelWithoutPrice: ChannelShippingData = {
    id: "ch-1",
    name: "Japan",
    currency: "JPY",
    price: "",
    minValue: "",
    maxValue: "",
  };

  const channelWithPrice: ChannelShippingData = {
    ...channelWithoutPrice,
    price: "10",
  };

  describe("getChannelIdsWithPrice", () => {
    it("returns channel ids that have a valid price", () => {
      // Arrange // Act
      const result = getChannelIdsWithPrice([channelWithoutPrice, channelWithPrice]);

      // Assert
      expect(result).toEqual(new Set(["ch-1"]));
    });

    it("does not treat null price as a valid price", () => {
      // Arrange
      const channelWithNullPrice: ChannelShippingData = {
        ...channelWithoutPrice,
        price: null as unknown as string,
      };

      // Act
      const result = getChannelIdsWithPrice([channelWithNullPrice]);

      // Assert
      expect(result).toEqual(new Set());
    });
  });

  describe("hasMissingChannelPrices", () => {
    it("returns true when any channel has a missing price", () => {
      // Assert
      expect(hasMissingChannelPrices([channelWithoutPrice])).toBe(true);
      expect(hasMissingChannelPrices([channelWithPrice])).toBe(false);
      expect(
        hasMissingChannelPrices([
          channelWithPrice,
          { ...channelWithoutPrice, price: null as unknown as string },
        ]),
      ).toBe(true);
    });
  });

  describe("areChannelListingsEqual", () => {
    it("returns true for equivalent channel listings with normalized values", () => {
      // Arrange
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
      const currentChannels: ChannelShippingData[] = [
        {
          ...savedChannels[0],
          minValue: null as unknown as string,
        },
      ];

      // Assert
      expect(areChannelListingsEqual(currentChannels, savedChannels)).toBe(true);
    });

    it("returns false when channel membership changes", () => {
      // Arrange
      const savedChannels: ChannelShippingData[] = [];
      const currentChannels: ChannelShippingData[] = [
        {
          id: "ch-1",
          name: "USD",
          currency: "USD",
          price: "10",
          minValue: "",
          maxValue: "",
        },
      ];

      // Assert
      expect(areChannelListingsEqual(currentChannels, savedChannels)).toBe(false);
    });

    it("treats numerically equivalent prices as equal", () => {
      // Arrange
      const savedChannels: ChannelShippingData[] = [
        {
          id: "ch-1",
          name: "USD",
          currency: "USD",
          price: "10",
          minValue: "5.00",
          maxValue: "100.0",
        },
      ];
      const currentChannels: ChannelShippingData[] = [
        {
          ...savedChannels[0],
          price: "10.00",
          minValue: "5",
          maxValue: "100",
        },
      ];

      // Assert
      expect(areChannelListingsEqual(currentChannels, savedChannels)).toBe(true);
    });
  });

  describe("isDraftShippingChannel", () => {
    it("returns true for newly added channel without prior price entry", () => {
      // Arrange
      const savedChannelIds = new Set<string>();
      const pricedChannelIds = new Set<string>();

      // Act // Assert
      expect(isDraftShippingChannel("ch-1", savedChannelIds, pricedChannelIds)).toBe(true);
    });

    it("returns false for channel that had price entered then cleared", () => {
      // Arrange
      const savedChannelIds = new Set<string>();
      const pricedChannelIds = new Set(["ch-1"]);

      // Act // Assert
      expect(isDraftShippingChannel("ch-1", savedChannelIds, pricedChannelIds)).toBe(false);
    });

    it("returns false for saved channel without price", () => {
      // Arrange
      const savedChannelIds = new Set(["ch-1"]);
      const pricedChannelIds = new Set<string>();

      // Act // Assert
      expect(isDraftShippingChannel("ch-1", savedChannelIds, pricedChannelIds)).toBe(false);
    });
  });
});
