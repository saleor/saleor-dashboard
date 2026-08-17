import { type CollectionChannels, getChannelAvailabilityStatus, getDropdownStatus } from "./utils";

const scheduledChannel: CollectionChannels = {
  __typename: "CollectionChannelListing",
  channel: {
    __typename: "Channel",
    id: "channel-id",
    name: "Channel",
  },
  isPublished: true,
  publishedAt: "2099-09-09T12:00:00+00:00",
} as CollectionChannels;

describe("ChannelsAvailabilityDropdown utils", () => {
  it("returns scheduled for a future publication date", () => {
    // Act
    const dropdownStatus = getDropdownStatus([scheduledChannel]);
    const channelStatus = getChannelAvailabilityStatus(scheduledChannel);

    // Assert
    expect(dropdownStatus).toBe("scheduled");
    expect(channelStatus).toBe("scheduled");
  });

  it("does not treat an unpublished listing with a future date as scheduled", () => {
    // Arrange
    const unpublishedChannel: CollectionChannels = {
      ...scheduledChannel,
      isPublished: false,
    };

    // Act
    const result = getDropdownStatus([unpublishedChannel]);

    // Assert
    expect(result).toBe("warning");
  });
});
