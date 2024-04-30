import { ChannelFragment } from "@dashboard/graphql";

import { getCurencySymbol } from "./utils";

describe("DiscountRules utils", () => {
  describe("getCurencySymbol", () => {
    it("should return currency symbol from selected channel", () => {
      // Arrange
      const selectedChannel = { value: "1", label: "Channel 1" };
      const channels = [
        { id: "1", currencyCode: "USD" },
        { id: "2", currencyCode: "EUR" },
      ] as ChannelFragment[];
      // Act
      const result = getCurencySymbol(selectedChannel, channels);

      // Assert
      expect(result).toBe("USD");
    });
    it("should return null when can not find channel", () => {
      // Arrange
      const selectedChannel = { value: "3", label: "Channel 1" };
      const channels = [
        { id: "1", currencyCode: "USD" },
        { id: "2", currencyCode: "EUR" },
      ] as ChannelFragment[];
      // Act
      const result = getCurencySymbol(selectedChannel, channels);

      // Assert
      expect(result).toBe("");
    });
  });
});
