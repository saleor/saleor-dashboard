import {
  buildMembershipProbe,
  buildWarehouseLinkUpdates,
  channelIdsFromMatrix,
  channelIdsPresentInProbe,
  chunkList,
  membershipQueryPlan,
  runPool,
  WAREHOUSE_CHANNEL_MEMBERSHIP_LIMIT,
  warehouseLinkBatchSucceeded,
} from "./warehouseChannelMembership";

type MembershipPlanInput = Parameters<typeof membershipQueryPlan>[0];
type MatrixChannels = Parameters<typeof channelIdsFromMatrix>[0]["channels"];
type ProbeData = Parameters<typeof channelIdsPresentInProbe>[1];
type LinkUpdatesInput = Parameters<typeof buildWarehouseLinkUpdates>[0];
type LinkBatchData = Parameters<typeof warehouseLinkBatchSucceeded>[1];

describe("membershipQueryPlan", () => {
  it("uses one matrix query when channels times warehouses stay under the limit", () => {
    // Arrange
    const channelCount = 40;
    const warehouseCount = 100;

    // Act
    const plan = membershipQueryPlan({ channelCount, warehouseCount });

    // Assert
    expect(channelCount * warehouseCount).toBeLessThanOrEqual(WAREHOUSE_CHANNEL_MEMBERSHIP_LIMIT);
    expect(plan).toBe("fast");
  });

  it("probes this warehouse when the matrix would be large", () => {
    // Arrange
    const input: MembershipPlanInput = { channelCount: 100, warehouseCount: 51 };

    // Act
    const plan = membershipQueryPlan(input);

    // Assert
    expect(plan).toBe("probe");
  });

  it("probes when the warehouse count could not be loaded", () => {
    // Arrange
    const input: MembershipPlanInput = { channelCount: 2, warehouseCount: null };

    // Act
    const plan = membershipQueryPlan(input);

    // Assert
    expect(plan).toBe("probe");
  });
});

describe("channelIdsFromMatrix", () => {
  it("keeps channels whose warehouse list includes this location", () => {
    // Arrange
    const channels: MatrixChannels = [
      { id: "eu", warehouses: [{ id: "w1" }] },
      { id: "us", warehouses: [{ id: "w2" }] },
    ];

    // Act
    const ids = channelIdsFromMatrix({ warehouseId: "w1", channels });

    // Assert
    expect(ids).toEqual(["eu"]);
  });
});

describe("buildMembershipProbe", () => {
  it("reports a channel only when its alias count is above zero", () => {
    // Arrange
    const channelIds = ["eu", "us"];
    const probeData: ProbeData = {
      c0: { totalCount: 1 },
      c1: { totalCount: 0 },
    };

    // Act
    const { variables } = buildMembershipProbe(channelIds);
    const present = channelIdsPresentInProbe(channelIds, probeData);

    // Assert
    expect(variables("w1")).toEqual({
      warehouseId: ["w1"],
      c0: ["eu"],
      c1: ["us"],
    });
    expect(present).toEqual(["eu"]);
  });
});

describe("buildWarehouseLinkUpdates", () => {
  it("aliases one channelUpdate per channel in a single document", () => {
    // Arrange
    const input: LinkUpdatesInput = {
      entityIds: ["eu", "us"],
      action: "add",
      linkVia: "channel",
    };

    // Act
    const { document, variables } = buildWarehouseLinkUpdates(input);
    const source = document.loc?.source.body ?? "";

    // Assert
    expect(source).toContain("e0: channelUpdate");
    expect(source).toContain("e1: channelUpdate");
    expect(source).toContain("addWarehouses: [$warehouseId]");
    expect(variables("w1")).toEqual({ warehouseId: "w1", e0: "eu", e1: "us" });
  });

  it("aliases shippingZoneUpdate when linking zones", () => {
    // Arrange
    const input: LinkUpdatesInput = {
      entityIds: ["z1"],
      action: "remove",
      linkVia: "shippingZone",
    };

    // Act
    const { document } = buildWarehouseLinkUpdates(input);
    const source = document.loc?.source.body ?? "";

    // Assert
    expect(source).toContain("e0: shippingZoneUpdate");
    expect(source).toContain("removeWarehouses: [$warehouseId]");
    expect(source).toContain("shippingZone { id }");
  });

  it("reports which aliases succeeded", () => {
    // Arrange
    const channelData: LinkBatchData = {
      e0: { errors: [] },
      e1: { errors: [{ code: "NOT_FOUND" }] },
    };
    const zoneData: LinkBatchData = {
      e0: { errors: [], shippingZone: { id: "z1" } },
      e1: { errors: [], shippingZone: null },
    };

    // Act
    const channelResults = warehouseLinkBatchSucceeded(["eu", "us"], channelData, "channel");
    const zoneResults = warehouseLinkBatchSucceeded(["z1", "z2"], zoneData, "shippingZone");
    const missingResults = warehouseLinkBatchSucceeded(["eu"], null, "channel");

    // Assert
    expect(channelResults).toEqual([true, false]);
    expect(zoneResults).toEqual([true, false]);
    expect(missingResults).toEqual([false]);
  });
});

describe("chunkList", () => {
  it("splits ids into fixed chunks", () => {
    // Arrange
    const ids = ["a", "b", "c"];

    // Act
    const chunks = chunkList(ids, 2);

    // Assert
    expect(chunks).toEqual([["a", "b"], ["c"]]);
  });
});

describe("runPool", () => {
  it("keeps result order while running a bounded number of workers", async () => {
    // Arrange
    let active = 0;
    let peak = 0;

    // Act
    const results = await runPool([1, 2, 3, 4], 2, async item => {
      active += 1;
      peak = Math.max(peak, active);
      await Promise.resolve();
      active -= 1;

      return item * 10;
    });

    // Assert
    expect(results).toEqual([10, 20, 30, 40]);
    expect(peak).toBeLessThanOrEqual(2);
  });
});
