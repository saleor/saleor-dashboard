import {
  getProductSetupReadiness,
  type ProductSetupReadinessInput,
} from "./getProductSetupReadiness";

const shopReadyChannel = {
  id: "ch1",
  isActive: true,
  warehouseCount: 1 as const,
  shippingZoneCount: 1 as const,
  warehouseIds: ["wh1"],
};

const pricedVariant = {
  channelListings: [{ channelId: "ch1", hasPrice: true }],
  stocks: [{ warehouseId: "wh1", quantity: 5 }],
};

const readyInput: ProductSetupReadinessInput = {
  categoryId: "cat1",
  channelListings: [
    {
      channelId: "ch1",
      isPublished: true,
      isAvailableForPurchase: true,
    },
  ],
  channelShop: [shopReadyChannel],
  variants: [pricedVariant],
  variantsTotalCount: 1,
  isShippingRequired: true,
  mediaCount: 0,
  seoStatus: "empty",
  canViewWarehouses: true,
  canViewShipping: true,
};

describe("getProductSetupReadiness", () => {
  it("marks core ready when category, shop channel, offer, stock, and live flags are set", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness(readyInput);

    // Assert
    expect(readiness).toMatchObject({
      hasChannels: true,
      hasShopReadyChannel: true,
      hasCategory: true,
      hasOffer: true,
      hasStock: true,
      isLive: true,
      coreReady: true,
    });
  });

  it("requires a category before core ready", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness({
      ...readyInput,
      categoryId: null,
    });

    // Assert
    expect(readiness.hasCategory).toBe(false);
    expect(readiness.coreReady).toBe(false);
  });

  it("treats inactive or warehouse-less channels as not shop-ready", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness({
      ...readyInput,
      channelShop: [
        {
          ...shopReadyChannel,
          warehouseCount: 0,
          warehouseIds: [],
        },
      ],
    });

    // Assert
    expect(readiness.hasShopReadyChannel).toBe(false);
    expect(readiness.setupChannelId).toBe("ch1");
    expect(readiness.coreReady).toBe(false);
  });

  it("requires shipping zones only when the product type needs shipping", () => {
    // Arrange & Act
    const withoutZones = {
      ...shopReadyChannel,
      shippingZoneCount: 0 as const,
    };
    const shippable = getProductSetupReadiness({
      ...readyInput,
      isShippingRequired: true,
      channelShop: [withoutZones],
    });
    const digital = getProductSetupReadiness({
      ...readyInput,
      isShippingRequired: false,
      channelShop: [withoutZones],
    });

    // Assert
    expect(shippable.hasShopReadyChannel).toBe(false);
    expect(digital.hasShopReadyChannel).toBe(true);
  });

  it("requires a priced variant in a listed channel", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness({
      ...readyInput,
      channelListings: [
        {
          channelId: "ch1",
          isPublished: false,
          isAvailableForPurchase: false,
        },
      ],
      variants: [
        {
          channelListings: [{ channelId: "ch1", hasPrice: false }],
          stocks: [{ warehouseId: "wh1", quantity: 5 }],
        },
      ],
    });

    // Assert
    expect(readiness.hasOffer).toBe(false);
    expect(readiness.isLive).toBe(false);
    expect(readiness.coreReady).toBe(false);
  });

  it("requires stock in a shop-ready channel warehouse when warehouses are visible", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness({
      ...readyInput,
      variants: [
        {
          channelListings: [{ channelId: "ch1", hasPrice: true }],
          stocks: [{ warehouseId: "wh1", quantity: 0 }],
        },
      ],
    });

    // Assert
    expect(readiness.needsStock).toBe(true);
    expect(readiness.hasStock).toBe(false);
    expect(readiness.coreReady).toBe(false);
  });

  it("skips stock when warehouse diagnostics are unavailable", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness({
      ...readyInput,
      canViewWarehouses: false,
      variants: [
        {
          channelListings: [{ channelId: "ch1", hasPrice: true }],
          stocks: [],
        },
      ],
    });

    // Assert
    expect(readiness.needsStock).toBe(false);
    expect(readiness.hasStock).toBe(true);
    expect(readiness.coreReady).toBe(true);
  });

  it("treats missing variants as not ready to sell", () => {
    // Arrange & Act
    const readiness = getProductSetupReadiness({
      ...readyInput,
      variants: [],
      variantsTotalCount: 0,
    });

    // Assert
    expect(readiness.hasVariants).toBe(false);
    expect(readiness.hasOffer).toBe(false);
    expect(readiness.coreReady).toBe(false);
  });
});
