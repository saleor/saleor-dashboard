import { updateChannelsInput } from "./formChannels";

describe("ProductUpdatePage - fromChannels", () => {
  describe("updateChannelsInput", () => {
    const channel = {
      channelId: "Q2hhbm5lbDox",
      availableForPurchaseDate: null,
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

    it("should update availableForPurchaseDate if isAvailableForPurchase is set to true", () => {
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
            availableForPurchaseDate: "2020-10-01",
            availableForPurchase: "2020-10-01",
          },
        ],
      });
    });
    it("should update availableForPurchaseDate if isAvailableForPurchase is set to false", () => {
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
            availableForPurchaseDate: "2020-10-01",
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
