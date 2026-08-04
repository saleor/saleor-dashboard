import { type ChannelCollectionData } from "@dashboard/channels/utils";

import { buildCollectionSaveComposition, hasCollectionSaveComposition } from "./saveComposition";

const baselineChannels: ChannelCollectionData[] = [
  {
    id: "channel-1",
    name: "Channel",
    isPublished: true,
    publishedAt: null,
  },
];

const updatedChannels: ChannelCollectionData[] = [
  {
    ...baselineChannels[0],
    isPublished: false,
  },
];

describe("buildCollectionSaveComposition", () => {
  it("returns general when description is dirty", () => {
    // Arrange
    const composition = buildCollectionSaveComposition(
      [],
      true,
      baselineChannels,
      baselineChannels,
    );

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(composition.hasChannels).toBe(false);
    expect(hasCollectionSaveComposition(composition)).toBe(true);
  });

  it("returns channels when channel listings differ from baseline", () => {
    // Arrange
    const composition = buildCollectionSaveComposition(
      [],
      false,
      updatedChannels,
      baselineChannels,
    );

    // Assert
    expect(composition.hasGeneral).toBe(false);
    expect(composition.hasChannels).toBe(true);
  });

  it("does not return channels when listings were changed and reverted", () => {
    // Arrange
    const composition = buildCollectionSaveComposition(
      [],
      false,
      baselineChannels,
      baselineChannels,
    );

    // Assert
    expect(composition.hasChannels).toBe(false);
  });

  it("does not return channels when only channel order differs", () => {
    // Arrange
    const reorderedChannels = [baselineChannels[0]];
    const composition = buildCollectionSaveComposition(
      [],
      false,
      reorderedChannels,
      baselineChannels,
    );

    // Assert
    expect(composition.hasChannels).toBe(false);
  });

  it("returns general for slug changes", () => {
    // Arrange
    const composition = buildCollectionSaveComposition(
      ["slug"],
      false,
      baselineChannels,
      baselineChannels,
    );

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(composition.hasChannels).toBe(false);
  });
});
