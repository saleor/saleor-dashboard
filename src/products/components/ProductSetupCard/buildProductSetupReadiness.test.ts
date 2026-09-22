import {
  buildProductSetupReadinessInput,
  getMakeAvailableChannelOpts,
  getProductSetupSeoStatus,
} from "./buildProductSetupReadiness";

describe("buildProductSetupReadinessInput", () => {
  it("maps form channel drafts and treats removed channels as unlisted", () => {
    // Arrange & Act
    const input = buildProductSetupReadinessInput({
      categoryId: "cat1",
      formChannelListings: [
        {
          channelId: "ch1",
          isPublished: true,
          isAvailableForPurchase: true,
          availableForPurchaseAt: "2020-01-01T00:00:00.000Z",
          publishedAt: null,
          visibleInListings: true,
        },
        {
          channelId: "ch2",
          isPublished: false,
          isAvailableForPurchase: false,
          availableForPurchaseAt: null,
          publishedAt: null,
          visibleInListings: false,
        },
      ],
      removeChannelIds: ["ch2"],
      channelSummaries: [
        {
          id: "ch1",
          name: "Default",
          slug: "default",
          currencyCode: "USD",
          isActive: true,
          isPublished: true,
          publishedAt: null,
          isAvailableForPurchase: true,
          availableForPurchaseAt: "2020-01-01T00:00:00.000Z",
          visibleInListings: true,
          warehouseCount: 1,
          warehouseNames: ["Main"],
          shippingZoneCount: 1,
          shippingZoneNames: ["Zone"],
          countryCount: 1,
        },
      ],
      diagnostics: {
        permissions: {
          canViewChannelWarehouses: true,
          canViewShippingZones: true,
          missingPermissions: [],
        },
        isShippingRequired: true,
      },
      productDiagnostic: {
        id: "p1",
        name: "Tee",
        isShippingRequired: true,
        channelListings: [],
        variants: [
          {
            id: "v1",
            name: "S",
            channelListings: [{ channel: { id: "ch1" }, price: { amount: 10 } }],
            stocks: [{ warehouse: { id: "wh1" }, quantity: 3 }],
          },
        ],
        variantsTotalCount: 1,
      },
      mediaCount: 2,
      slug: "tee",
      seoTitle: "Tee",
      seoDescription: "",
      dateNow: Date.parse("2024-01-01T00:00:00.000Z"),
    });

    // Assert
    expect(input.channelListings).toHaveLength(1);
    expect(input.channelListings[0]).toMatchObject({
      channelId: "ch1",
      isPublished: true,
      isAvailableForPurchase: true,
    });
    expect(input.seoStatus).toBe("partial");
    expect(input.mediaCount).toBe(2);
    expect(input.variants[0].channelListings[0].hasPrice).toBe(true);
  });
});

describe("getProductSetupSeoStatus", () => {
  it("returns complete only when slug, title, and description are set", () => {
    // Arrange & Act & Assert
    expect(
      getProductSetupSeoStatus({
        slug: "tee",
        seoTitle: "Tee",
        seoDescription: "Soft cotton",
      }),
    ).toBe("complete");
    expect(
      getProductSetupSeoStatus({
        slug: "tee",
        seoTitle: "Tee",
        seoDescription: "",
      }),
    ).toBe("partial");
    expect(
      getProductSetupSeoStatus({
        slug: "",
        seoTitle: "",
        seoDescription: "",
      }),
    ).toBe("empty");
  });
});

describe("getMakeAvailableChannelOpts", () => {
  it("publishes, lists, and opens purchase with a past publishedAt to avoid scheduled flash", () => {
    // Arrange
    const now = Date.parse("2024-06-01T12:00:00.000Z");

    // Act
    const opts = getMakeAvailableChannelOpts(now);

    // Assert
    expect(opts.isPublished).toBe(true);
    expect(opts.isAvailableForPurchase).toBe(true);
    expect(opts.visibleInListings).toBe(true);
    expect(opts.availableForPurchase).toBe(new Date(now).toISOString());
    expect(Date.parse(opts.publishedAt!)).toBeLessThan(now);
  });
});
