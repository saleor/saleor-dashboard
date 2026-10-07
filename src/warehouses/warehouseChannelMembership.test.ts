import {
  buildMembershipChannelUpdates,
  buildMembershipProbe,
  channelIdsFromMatrix,
  channelIdsPresentInProbe,
  chunkList,
  membershipBatchSucceeded,
  membershipQueryPlan,
  runPool,
  WAREHOUSE_CHANNEL_MEMBERSHIP_LIMIT,
} from "./warehouseChannelMembership";

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
    // Arrange / Act
    const plan = membershipQueryPlan({ channelCount: 100, warehouseCount: 51 });

    // Assert
    expect(plan).toBe("probe");
  });

  it("probes when the warehouse count could not be loaded", () => {
    // Arrange / Act
    const plan = membershipQueryPlan({ channelCount: 2, warehouseCount: null });

    // Assert
    expect(plan).toBe("probe");
  });
});

describe("channelIdsFromMatrix", () => {
  it("keeps channels whose warehouse list includes this location", () => {
    // Arrange
    const channels = [
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
    const { variables } = buildMembershipProbe(channelIds);

    // Act
    const present = channelIdsPresentInProbe(channelIds, {
      c0: { totalCount: 1 },
      c1: { totalCount: 0 },
    });

    // Assert
    expect(variables("w1")).toEqual({
      warehouseId: ["w1"],
      c0: ["eu"],
      c1: ["us"],
    });
    expect(present).toEqual(["eu"]);
  });
});

describe("buildMembershipChannelUpdates", () => {
  it("aliases one channelUpdate per channel in a single document", () => {
    // Arrange
    const channelIds = ["eu", "us"];

    // Act
    const { document, variables } = buildMembershipChannelUpdates({
      channelIds,
      action: "add",
    });
    const source = document.loc?.source.body ?? "";

    // Assert
    expect(source).toContain("c0: channelUpdate");
    expect(source).toContain("c1: channelUpdate");
    expect(source).toContain("addWarehouses: [$warehouseId]");
    expect(variables("w1")).toEqual({ warehouseId: "w1", c0: "eu", c1: "us" });
  });

  it("reports which aliases succeeded", () => {
    // Arrange / Act
    const results = membershipBatchSucceeded(["eu", "us"], {
      c0: { errors: [] },
      c1: { errors: [{ code: "NOT_FOUND" }] },
    });

    // Assert
    expect(results).toEqual([true, false]);
  });
});

describe("chunkList", () => {
  it("splits ids into fixed chunks", () => {
    // Arrange / Act
    const chunks = chunkList(["a", "b", "c"], 2);

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
