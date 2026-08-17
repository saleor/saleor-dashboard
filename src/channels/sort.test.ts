import { ChannelsListUrlSortField } from "@dashboard/channels/urls";
import { type ChannelDetailsFragment } from "@dashboard/graphql";

import { sortChannels } from "./sort";

const channel = (overrides: Partial<ChannelDetailsFragment>): ChannelDetailsFragment =>
  ({
    id: overrides.id ?? "1",
    name: overrides.name ?? "Channel",
    isActive: overrides.isActive ?? false,
    ...overrides,
  }) as ChannelDetailsFragment;

describe("sortChannels", () => {
  it("sorts by name ascending and descending", () => {
    // Arrange
    const channels = [channel({ id: "2", name: "Zulu" }), channel({ id: "1", name: "Alpha" })];

    // Act / Assert
    expect(
      [...channels].sort(sortChannels(ChannelsListUrlSortField.name, true)).map(c => c.name),
    ).toEqual(["Alpha", "Zulu"]);
    expect(
      [...channels].sort(sortChannels(ChannelsListUrlSortField.name, false)).map(c => c.name),
    ).toEqual(["Zulu", "Alpha"]);
  });

  it("sorts by status with inactive first when ascending", () => {
    // Arrange
    const channels = [
      channel({ id: "1", name: "Active", isActive: true }),
      channel({ id: "2", name: "Inactive", isActive: false }),
    ];

    // Act
    const ascending = [...channels].sort(sortChannels(ChannelsListUrlSortField.status, true));
    const descending = [...channels].sort(sortChannels(ChannelsListUrlSortField.status, false));

    // Assert
    expect(ascending.map(c => c.isActive)).toEqual([false, true]);
    expect(descending.map(c => c.isActive)).toEqual([true, false]);
  });

  it("uses name as a stable secondary key when status matches", () => {
    // Arrange
    const channels = [
      channel({ id: "1", name: "Zulu", isActive: true }),
      channel({ id: "2", name: "Alpha", isActive: true }),
    ];

    // Act
    const sorted = [...channels].sort(sortChannels(ChannelsListUrlSortField.status, true));

    // Assert
    expect(sorted.map(c => c.name)).toEqual(["Alpha", "Zulu"]);
  });

  it("defaults to name sort for unknown fields", () => {
    // Arrange
    const channels = [channel({ name: "Beta" }), channel({ name: "Alpha" })];

    // Act / Assert
    expect([...channels].sort(sortChannels(undefined, true)).map(c => c.name)).toEqual([
      "Alpha",
      "Beta",
    ]);
  });
});
