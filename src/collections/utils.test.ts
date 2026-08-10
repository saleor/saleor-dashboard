import { type ChannelCollectionData } from "@dashboard/channels/utils";

import {
  areCollectionPublishedAtEqual,
  getCollectionChannelsUpdateVariables,
  hasCollectionChannelListingsChanges,
} from "./utils";

const savedChannelListings: ChannelCollectionData[] = [
  {
    id: "channel-1",
    name: "Channel 1",
    isPublished: true,
    publishedAt: null,
  },
  {
    id: "channel-2",
    name: "Channel 2",
    isPublished: false,
    publishedAt: null,
  },
];

describe("hasCollectionChannelListingsChanges", () => {
  it("returns false when listings match the baseline", () => {
    // Act / Assert
    expect(hasCollectionChannelListingsChanges(savedChannelListings, savedChannelListings)).toBe(
      false,
    );
  });

  it("returns false when a channel was toggled and reverted", () => {
    // Arrange
    const revertedListings: ChannelCollectionData[] = [
      { ...savedChannelListings[0] },
      { ...savedChannelListings[1] },
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(revertedListings, savedChannelListings)).toBe(false);
  });

  it("ignores channel order when comparing listings", () => {
    // Arrange
    const reorderedListings = [savedChannelListings[1], savedChannelListings[0]];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(reorderedListings, savedChannelListings)).toBe(
      false,
    );
  });

  it("treats null and undefined publishedAt as equal", () => {
    // Arrange
    const current: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        publishedAt: null,
      },
    ];
    const baseline: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        publishedAt: undefined as unknown as null,
      },
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(current, baseline)).toBe(false);
  });

  it("returns true when publication state differs", () => {
    // Arrange
    const updatedListings: ChannelCollectionData[] = [
      { ...savedChannelListings[0], isPublished: false },
      savedChannelListings[1],
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(updatedListings, savedChannelListings)).toBe(true);
  });

  it("returns false when both sides are hidden regardless of publishedAt", () => {
    // Arrange
    const current: ChannelCollectionData[] = [
      { ...savedChannelListings[0], isPublished: false, publishedAt: null },
    ];
    const baseline: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: false,
        publishedAt: "2024-06-01T10:00:00Z",
      },
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(current, baseline)).toBe(false);
  });

  it("returns false after an off/on cycle restores the saved publishedAt", () => {
    // Arrange
    const baseline: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: true,
        publishedAt: "2024-06-01T10:00:00Z",
      },
    ];
    const afterCycle: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: true,
        publishedAt: "2024-06-01T10:00:00Z",
      },
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(afterCycle, baseline)).toBe(false);
  });

  it("treats equivalent publishedAt instants as unchanged after scheduled save", () => {
    // Arrange — form emit vs typical Saleor DateTime serialization
    const formListings: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: true,
        publishedAt: "2026-08-10T12:00:00Z",
      },
    ];
    const savedListings: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: true,
        publishedAt: "2026-08-10T12:00:00+00:00",
      },
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(formListings, savedListings)).toBe(false);
  });

  it("still detects a real publishedAt change", () => {
    // Arrange
    const formListings: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: true,
        publishedAt: "2026-08-10T12:00:00Z",
      },
    ];
    const savedListings: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        isPublished: true,
        publishedAt: "2026-08-11T12:00:00+00:00",
      },
    ];

    // Act / Assert
    expect(hasCollectionChannelListingsChanges(formListings, savedListings)).toBe(true);
  });
});

describe("areCollectionPublishedAtEqual", () => {
  it("equates Z and +00:00 forms of the same instant", () => {
    // Arrange / Act / Assert
    expect(areCollectionPublishedAtEqual("2026-08-10T12:00:00Z", "2026-08-10T12:00:00+00:00")).toBe(
      true,
    );
  });

  it("equates fractional-second API values with form emits", () => {
    // Arrange / Act / Assert
    expect(
      areCollectionPublishedAtEqual("2026-08-10T12:00:00Z", "2026-08-10T12:00:00.000000+00:00"),
    ).toBe(true);
  });
});

describe("getCollectionChannelsUpdateVariables", () => {
  it("returns null when channel listings are unchanged", () => {
    // Act
    const result = getCollectionChannelsUpdateVariables(
      "collection-1",
      savedChannelListings,
      savedChannelListings,
    );

    // Assert
    expect(result).toBeNull();
  });

  it("builds add/remove payload when availability changes", () => {
    // Arrange
    const updatedListings: ChannelCollectionData[] = [
      { ...savedChannelListings[0], isPublished: false },
      {
        id: "channel-2",
        name: "Channel 2",
        isPublished: true,
        publishedAt: null,
      },
    ];

    // Act
    const result = getCollectionChannelsUpdateVariables(
      "collection-1",
      savedChannelListings,
      updatedListings,
    );

    // Assert
    expect(result).toEqual({
      id: "collection-1",
      input: {
        addChannels: [
          {
            channelId: "channel-1",
            isPublished: false,
            publishedAt: null,
          },
          {
            channelId: "channel-2",
            isPublished: true,
            publishedAt: null,
          },
        ],
        removeChannels: [],
      },
    });
  });

  it("includes removed channels in removeChannels", () => {
    // Act
    const result = getCollectionChannelsUpdateVariables("collection-1", savedChannelListings, []);

    // Assert
    expect(result?.input.removeChannels).toEqual(["channel-1", "channel-2"]);
    expect(result?.input.addChannels).toEqual([]);
  });
});
