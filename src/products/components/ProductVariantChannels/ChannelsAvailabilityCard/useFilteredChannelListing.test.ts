import { useFilteredChannelListing } from "./useFilteredChannelListing";

describe("useFilteredChannelListing", () => {
  it("should return empty array if channelListing is null or undefined", () => {
    // Arrange
    const allAvailableListings = [{ id: "1" }, { id: "2" }];
    const channelListing = null;
    // Act
    const result = useFilteredChannelListing({
      allAvailableListings,
      channelListing,
    });

    // Assert
    expect(result).toEqual([]);
  });
  it("should return array with filtered channel listings", () => {
    // Arrange
    const allAvailableListings = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const channelListing = [
      { channel: { id: "1" } },
      { channel: { id: "3" } },
      { channel: { id: "4" } },
    ];
    // Act
    const result = useFilteredChannelListing({
      allAvailableListings,
      channelListing,
    });

    // Assert
    expect(result).toEqual([{ channel: { id: "1" } }, { channel: { id: "3" } }]);
  });
});
