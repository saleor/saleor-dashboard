import { ChannelFragment } from "@dashboard/graphql";

import { getCurencySymbol } from "./utils";

describe("DiscountRules utils", () => {
  describe("getCurencySymbol", () => {
    it("should return currency symbol from selected channel", () => {
      // Arrange
      const selectedChannels = [{ value: "1", label: "Channel 1" }];
      const channels = [
        { id: "1", currencyCode: "USD" },
        { id: "2", currencyCode: "EUR" },
      ] as ChannelFragment[];

      // Act
      const result = getCurencySymbol(selectedChannels, channels);

      // Assert
      expect(result).toBe("USD");
    });

    it("should return null when selected channels with different currencies", () => {
      // Arrange
      const selectedChannels = [
        { value: "1", label: "Channel 1" },
        { value: "2", label: "Channel 2" },
      ];
      const channels = [
        { id: "1", currencyCode: "USD" },
        { id: "2", currencyCode: "EUR" },
      ] as ChannelFragment[];

      // Act
      const result = getCurencySymbol(selectedChannels, channels);

      // Assert
      expect(result).toBe(null);
    });

    it("should return currency code when multipe selected channels with same currency", () => {
      // Arrange
      const selectedChannels = [
        { value: "1", label: "Channel 1" },
        { value: "2", label: "Channel 2" },
      ];
      const channels = [
        { id: "1", currencyCode: "USD" },
        { id: "2", currencyCode: "USD" },
      ] as ChannelFragment[];

      // Act
      const result = getCurencySymbol(selectedChannels, channels);

      // Assert
      expect(result).toBe("USD");
    });
  });
});
