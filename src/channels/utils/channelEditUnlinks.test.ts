import {
  candidateLinksForChannelEdit,
  type ChannelEditZone,
  linksDroppedByChannelEdit,
} from "./channelEditUnlinks";

type CandidateLinksInput = Parameters<typeof candidateLinksForChannelEdit>[0];

const europe: ChannelEditZone = {
  id: "z-eu",
  name: "Europe",
  channelIds: ["ch-eu"],
  warehouses: [{ id: "w-warsaw", name: "Warsaw" }],
};
const both: ChannelEditZone = {
  id: "z-both",
  name: "Both",
  channelIds: ["ch-eu", "ch-us"],
  warehouses: [{ id: "w-warsaw", name: "Warsaw" }],
};

describe("candidateLinksForChannelEdit", () => {
  it("includes a linked warehouse that is being removed from this channel", () => {
    // Arrange
    const input: CandidateLinksInput = {
      channelId: "ch-eu",
      channelWarehouseIds: ["w-warsaw"],
      zones: [europe],
      removeWarehouseIds: ["w-warsaw"],
      removeZoneIds: [],
    };

    // Act
    const links = candidateLinksForChannelEdit(input);

    // Assert
    expect(links).toEqual([
      {
        zoneId: "z-eu",
        zoneName: "Europe",
        warehouseId: "w-warsaw",
        warehouseName: "Warsaw",
        otherChannelIds: [],
      },
    ]);
  });

  it("skips a warehouse that is not on this channel", () => {
    // Arrange
    const input: CandidateLinksInput = {
      channelId: "ch-eu",
      channelWarehouseIds: [],
      zones: [europe],
      removeWarehouseIds: [],
      removeZoneIds: ["z-eu"],
    };

    // Act
    const links = candidateLinksForChannelEdit(input);

    // Assert
    expect(links).toEqual([]);
  });
});

describe("linksDroppedByChannelEdit", () => {
  it("drops a link that has no other channel, and keeps one that still shares a channel", () => {
    // Arrange
    const candidates = candidateLinksForChannelEdit({
      channelId: "ch-eu",
      channelWarehouseIds: ["w-warsaw"],
      zones: [europe, both],
      removeWarehouseIds: ["w-warsaw"],
      removeZoneIds: [],
    });

    // Act
    const dropped = linksDroppedByChannelEdit({
      candidates,
      sharesAnotherChannel: link => link.otherChannelIds.includes("ch-us"),
    });

    // Assert
    expect(dropped.map(link => link.zoneId)).toEqual(["z-eu"]);
  });
});
