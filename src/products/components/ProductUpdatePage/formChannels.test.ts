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

    it("should NOT compare isAvailableForPurchase (it's computed by Saleor from the date)", () => {
      // Arrange - isAvailableForPurchase differs but dates are the same (both null)
      // This happens for scheduled products where server returns false (computed)
      // but form sends true (user intent)
      const current: ChannelAvailabilityFields = { isAvailableForPurchase: true };
      const original: ChannelAvailabilityFields = { isAvailableForPurchase: false };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert - no difference because dates are the same (both undefined/null)
      expect(result).toBe(false);
    });

    it("should detect availability change based on date, not isAvailableForPurchase boolean", () => {
      // Arrange - user is making product available (setting a date)
      const current: ChannelAvailabilityFields = {
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2024-01-01T00:00:00Z",
      };
      const original: ChannelAvailabilityFields = {
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
      };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert - different because dates differ (null vs date)
      expect(result).toBe(true);
    });

    it("should detect date change for scheduled products (isAvailableForPurchase is computed false for future dates)", () => {
      // Arrange - scheduled product (future date) has isAvailableForPurchase: false
      // but clearing the date is a meaningful change
      const current: ChannelAvailabilityFields = {
        isAvailableForPurchase: false,
        availableForPurchaseAt: null, // User cleared the scheduled date
      };
      const original: ChannelAvailabilityFields = {
        isAvailableForPurchase: false, // Computed as false because date is in future
        availableForPurchaseAt: "2099-01-01T00:00:00Z", // Future date (scheduled)
      };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert - date change should be detected even when isAvailableForPurchase is false on both sides
      expect(result).toBe(true);
    });

    it("should not detect change when both have no date and are not available", () => {
      // Arrange - both truly not available (no date)
      const current: ChannelAvailabilityFields = {
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
      };
      const original: ChannelAvailabilityFields = {
        isAvailableForPurchase: null, // null and false both mean not available
        availableForPurchaseAt: null,
      };

      // Act
      const result = areChannelFieldsDifferent(current, original);

      // Assert - no change when both have no date
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
