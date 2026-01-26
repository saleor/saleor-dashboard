import {
  areChannelFieldsDifferent,
  ChannelAvailabilityFields,
  updateChannelsInput,
} from "./formChannels";

describe("ProductUpdatePage - fromChannels", () => {
  describe("areChannelFieldsDifferent", () => {
    it("should return false when both states are identical", () => {
      // Arrange
      const current: ChannelAvailabilityFields = {
        isPublished: true,
        publishedAt: "2024-01-01T00:00:00Z",
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2024-01-01T00:00:00Z",
        visibleInListings: true,
      };
      const original: ChannelAvailabilityFields = { ...current };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(false);
    });

    it("should return true when isPublished differs", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { isPublished: true };
      const original: ChannelAvailabilityFields = { isPublished: false };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when publishedAt differs", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { publishedAt: "2024-01-01T00:00:00Z" };
      const original: ChannelAvailabilityFields = { publishedAt: "2024-06-01T00:00:00Z" };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(true);
    });

    it("should treat null and undefined as equal for publishedAt", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { publishedAt: null };
      const original: ChannelAvailabilityFields = { publishedAt: undefined };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(false);
    });

    it("should return true when isAvailableForPurchase changes from false to true", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { isAvailableForPurchase: true };
      const original: ChannelAvailabilityFields = { isAvailableForPurchase: false };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(true);
    });

    it("should treat null and false as equal for isAvailableForPurchase (both mean 'not available')", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { isAvailableForPurchase: null };
      const original: ChannelAvailabilityFields = { isAvailableForPurchase: false };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(false);
    });

    it("should treat undefined and false as equal for isAvailableForPurchase", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { isAvailableForPurchase: undefined };
      const original: ChannelAvailabilityFields = { isAvailableForPurchase: false };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(false);
    });

    it("should compare availableForPurchaseAt only when product is available for purchase", () => {
      // Arrange - both unavailable, dates differ but should be ignored
      const current: ChannelAvailabilityFields = {
        isAvailableForPurchase: false,
        availableForPurchaseAt: "2024-01-01T00:00:00Z",
      };
      const original: ChannelAvailabilityFields = {
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
      };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert - dates differ but both are unavailable, so no effective change
      expect(result).toBe(false);
    });

    it("should detect date change when product is available for purchase", () => {
      // Arrange
      const current: ChannelAvailabilityFields = {
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2024-06-01T00:00:00Z",
      };
      const original: ChannelAvailabilityFields = {
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2024-01-01T00:00:00Z",
      };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when visibleInListings differs", () => {
      // Arrange
      const current: ChannelAvailabilityFields = { visibleInListings: true };
      const original: ChannelAvailabilityFields = { visibleInListings: false };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("updateChannelsInput", () => {
    const channel = {
      channelId: "Q2hhbm5lbDox",
      availableForPurchaseAt: null,
      __typename: "ProductChannelListing",
      isPublished: true,
      publishedAt: "2020-01-01",
      isAvailableForPurchase: false,
      availableForPurchase: null,
      visibleInListings: true,
      channel: {
        __typename: "Channel",
        id: "Q2hhbm5lbDox",
        name: "Default channel",
        currencyCode: "USD",
      },
    };

    it("should update availableForPurchaseAt if isAvailableForPurchase is set to true", () => {
      const input = {
        removeChannels: [],
        updateChannels: [channel],
      };
      const data = {
        availableForPurchase: "2020-10-01",
        isAvailableForPurchase: true,
        isPublished: true,
        publishedAt: "2020-01-01",
        visibleInListings: true,
      };
      const result = updateChannelsInput(input, data, channel.channelId);

      expect(result).toEqual({
        removeChannels: [],
        updateChannels: [
          {
            ...channel,
            isAvailableForPurchase: true,
            availableForPurchaseAt: "2020-10-01",
            availableForPurchase: "2020-10-01",
          },
        ],
      });
    });
    it("should update availableForPurchaseAt if isAvailableForPurchase is set to false", () => {
      const oldData = {
        removeChannels: [],
        updateChannels: [channel],
      };
      const newData = {
        availableForPurchase: "2020-10-01",
        isAvailableForPurchase: false,
        isPublished: true,
        publishedAt: "2020-01-01",
        visibleInListings: true,
      };
      const result = updateChannelsInput(oldData, newData, channel.channelId);

      expect(result).toEqual({
        removeChannels: [],
        updateChannels: [
          {
            ...channel,
            availableForPurchaseAt: "2020-10-01",
            availableForPurchase: "2020-10-01",
          },
        ],
      });
    });
    it("should not update listing if channel id do not match", () => {
      const input = {
        removeChannels: [],
        updateChannels: [channel],
      };
      const data = {
        availableForPurchase: "2020-10-01",
        isAvailableForPurchase: true,
        isPublished: true,
        publishedAt: "2020-01-01",
        visibleInListings: true,
      };
      const result = updateChannelsInput(input, data, "42");

      expect(result).toEqual({
        removeChannels: [],
        updateChannels: [channel],
      });
    });
  });
});
