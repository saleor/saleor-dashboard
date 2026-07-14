import { filterChannelsBySearch, paginateItems } from "./utils";

describe("ChannelAvailability / utils", () => {
  const channels = [
    { id: "1", name: "Channel USD", currencyCode: "USD" },
    { id: "2", name: "Channel PLN", currencyCode: "PLN" },
    { id: "3", name: "Europe", currencyCode: "EUR" },
  ];

  describe("filterChannelsBySearch", () => {
    it("returns all channels when search is empty", () => {
      // Arrange // Act
      const result = filterChannelsBySearch(channels, "");

      // Assert
      expect(result).toHaveLength(3);
    });

    it("filters channels by name", () => {
      // Arrange // Act
      const result = filterChannelsBySearch(channels, "usd");

      // Assert
      expect(result).toEqual([channels[0]]);
    });

    it("filters channels by currency code", () => {
      // Arrange // Act
      const result = filterChannelsBySearch(channels, "eur");

      // Assert
      expect(result).toEqual([channels[2]]);
    });
  });

  describe("paginateItems", () => {
    it("returns the requested page slice", () => {
      // Arrange // Act
      const result = paginateItems(channels, 2, 2);

      // Assert
      expect(result).toEqual([channels[2]]);
    });
  });
});
