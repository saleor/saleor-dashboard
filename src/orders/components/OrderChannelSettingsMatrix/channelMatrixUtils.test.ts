import {
  CHANNEL_MATRIX_SCROLL_THRESHOLD,
  CHANNEL_MATRIX_SEARCH_THRESHOLD,
  filterChannelsForMatrix,
  getVisibleChannelsForMatrix,
  sortChannelsForMatrix,
} from "./channelMatrixUtils";

const channels = [
  { id: "1", name: "Zebra", slug: "zebra", isActive: false },
  { id: "2", name: "Alpha", slug: "alpha", isActive: true },
  { id: "3", name: "Beta", slug: "beta", isActive: false },
  { id: "4", name: "Gamma", slug: "gamma", isActive: true },
];

describe("channelMatrixUtils", () => {
  it("exposes search threshold aligned with long-list UX", () => {
    // Arrange // Act // Assert
    expect(CHANNEL_MATRIX_SEARCH_THRESHOLD).toBe(10);
  });

  it("exposes scroll threshold for five visible rows without scrolling", () => {
    // Arrange // Act // Assert
    expect(CHANNEL_MATRIX_SCROLL_THRESHOLD).toBe(5);
  });

  it("sorts active channels before inactive, then by name", () => {
    // Arrange // Act
    const sorted = sortChannelsForMatrix(channels);

    // Assert
    expect(sorted.map(channel => channel.name)).toEqual(["Alpha", "Gamma", "Beta", "Zebra"]);
  });

  it("filters by channel name or slug", () => {
    // Arrange // Act
    const filtered = filterChannelsForMatrix(channels, { query: "zeb", hideInactive: false });

    // Assert
    expect(filtered.map(channel => channel.slug)).toEqual(["zebra"]);
  });

  it("can hide inactive channels", () => {
    // Arrange // Act
    const filtered = filterChannelsForMatrix(channels, { query: "", hideInactive: true });

    // Assert
    expect(filtered.map(channel => channel.slug)).toEqual(["alpha", "gamma"]);
  });

  it("applies sort then filter for visible rows", () => {
    // Arrange // Act
    const visible = getVisibleChannelsForMatrix(channels, { query: "a", hideInactive: false });

    // Assert
    expect(visible.map(channel => channel.slug)).toEqual(["alpha", "gamma", "beta", "zebra"]);
  });
});
