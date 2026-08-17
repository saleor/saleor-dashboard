import {
  type BulkPublishProductForDraft,
  chunkBulkPublishItems,
  countVariantsInDrafts,
  createProductDrafts,
  getAppliedDefaultStock,
  getDraftsExceedingVariantLimit,
  getDraftsMissingCategoryForPublish,
  getDraftsMissingPrice,
  getDraftsWithInvalidCostPrice,
  getDraftsWithInvalidStock,
  getDraftsWithManyVariants,
  getEffectiveStockQuantity,
  hasBulkPublishStock,
  isStillDefaultBulkPublishStock,
  isValidBulkPublishCostPrice,
  isValidBulkPublishPrice,
  isValidBulkPublishStock,
  isValidStockQuantity,
  mergeProductDrafts,
} from "./bulkPublishDrafts";

describe("bulkPublishDrafts", () => {
  const products: BulkPublishProductForDraft[] = [
    {
      id: "p1",
      name: "Product A",
      category: { id: "cat1" },
      channelListings: [{ channel: { id: "ch1" } }],
      productVariants: {
        totalCount: 2,
        edges: [{ node: { id: "v1" } }, { node: { id: "v2" } }],
      },
    },
    {
      id: "p2",
      name: "Product B",
      category: { id: "cat1" },
      channelListings: null,
      productVariants: {
        totalCount: 1,
        edges: [{ node: { id: "v3" } }],
      },
    },
  ];

  describe("createProductDrafts", () => {
    it("uses totalCount for variantCount when available", () => {
      const drafts = createProductDrafts({
        products: [
          {
            id: "p1",
            name: "Product 1",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: {
              totalCount: 120,
              edges: [{ node: { id: "v1" } }],
            },
          },
        ],
        channelId: "ch1",
      });

      expect(drafts[0].variantCount).toBe(120);
      expect(drafts[0].exceedsVariantLimit).toBe(false);
      expect(drafts[0].hasManyVariants).toBe(true);
    });

    it("flags products above the wizard variant cap", () => {
      const drafts = createProductDrafts({
        products: [
          {
            id: "p1",
            name: "Product 1",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: {
              totalCount: 501,
              edges: [{ node: { id: "v1" } }],
            },
          },
        ],
        channelId: "ch1",
      });

      expect(drafts[0].exceedsVariantLimit).toBe(true);
      expect(drafts[0].hasManyVariants).toBe(true);
    });

    it("flags products without a category", () => {
      // Arrange & Act
      const drafts = createProductDrafts({
        products: [
          {
            id: "p1",
            name: "Uncategorized",
            category: null,
            channelListings: null,
            productVariants: {
              totalCount: 1,
              edges: [{ node: { id: "v1" } }],
            },
          },
        ],
        channelId: "ch1",
      });

      // Assert
      expect(drafts[0].hasCategory).toBe(false);
    });

    it("creates drafts with empty price and stock", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
      });

      expect(drafts).toEqual([
        {
          productId: "p1",
          name: "Product A",
          variantCount: 2,
          exceedsVariantLimit: false,
          hasManyVariants: false,
          hasCategory: true,
          alreadyInChannel: true,
          price: "",
          costPrice: "",
          stock: "",
        },
        {
          productId: "p2",
          name: "Product B",
          variantCount: 1,
          exceedsVariantLimit: false,
          hasManyVariants: false,
          hasCategory: true,
          alreadyInChannel: false,
          price: "",
          costPrice: "",
          stock: "",
        },
      ]);
    });

    it("prefills stock from the default quantity when provided", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
        defaultStock: "10",
      });

      expect(drafts[0].stock).toBe("10");
      expect(drafts[1].stock).toBe("10");
    });

    it("leaves stock empty when the default quantity is blank", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
        defaultStock: "   ",
      });

      expect(drafts[0].stock).toBe("");
      expect(drafts[1].stock).toBe("");
    });
  });

  describe("isStillDefaultBulkPublishStock", () => {
    it("treats empty stock as default when stock updates were disabled", () => {
      expect(isStillDefaultBulkPublishStock("", undefined)).toBe(true);
      expect(isStillDefaultBulkPublishStock("5", undefined)).toBe(false);
    });

    it("matches the previous default quantity when stock updates were enabled", () => {
      expect(isStillDefaultBulkPublishStock("10", "10")).toBe(true);
      expect(isStillDefaultBulkPublishStock("5", "10")).toBe(false);
      expect(isStillDefaultBulkPublishStock("", "")).toBe(true);
    });
  });

  describe("getAppliedDefaultStock", () => {
    it("returns undefined when stock updates are disabled", () => {
      expect(
        getAppliedDefaultStock({
          stock: {
            enabled: false,
            defaultQuantity: "10",
            warehouseScope: "all_channel",
            warehouseId: "",
          },
          isPublished: true,
          visibleInListings: true,
          isAvailableForPurchase: true,
        }),
      ).toBeUndefined();
    });

    it("returns the trimmed default quantity when stock updates are enabled", () => {
      expect(
        getAppliedDefaultStock({
          stock: {
            enabled: true,
            defaultQuantity: "  10  ",
            warehouseScope: "all_channel",
            warehouseId: "",
          },
          isPublished: true,
          visibleInListings: true,
          isAvailableForPurchase: true,
        }),
      ).toBe("10");
    });
  });

  describe("mergeProductDrafts", () => {
    it("preserves price, cost price, and user-overridden stock from previous drafts", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
      });
      const previousDrafts = drafts.map((draft, index) =>
        index === 0
          ? {
              ...draft,
              price: "25",
              costPrice: "12",
              stock: "5",
            }
          : draft,
      );

      const merged = mergeProductDrafts({
        drafts,
        previousDrafts,
        previousDefaultStock: "",
      });

      expect(merged[0].price).toBe("25");
      expect(merged[0].costPrice).toBe("12");
      expect(merged[0].stock).toBe("5");
      expect(merged[1].stock).toBe("");
    });

    it("updates stock that still matches the previous default", () => {
      const previousDrafts = createProductDrafts({
        products,
        channelId: "ch1",
        defaultStock: "10",
      }).map((draft, index) =>
        index === 1
          ? {
              ...draft,
              stock: "5",
            }
          : draft,
      );
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
        defaultStock: "20",
      });

      const merged = mergeProductDrafts({
        drafts,
        previousDrafts,
        previousDefaultStock: "10",
      });

      expect(merged[0].stock).toBe("20");
      expect(merged[1].stock).toBe("5");
    });
  });

  describe("isValidBulkPublishCostPrice", () => {
    it("accepts empty and non-negative numbers", () => {
      expect(isValidBulkPublishCostPrice("")).toBe(true);
      expect(isValidBulkPublishCostPrice("0")).toBe(true);
      expect(isValidBulkPublishCostPrice("12.5")).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(isValidBulkPublishCostPrice("-1")).toBe(false);
      expect(isValidBulkPublishCostPrice("abc")).toBe(false);
    });
  });

  describe("chunkBulkPublishItems", () => {
    it("splits items into fixed-size chunks", () => {
      expect(chunkBulkPublishItems([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe("getDraftsExceedingVariantLimit", () => {
    it("returns drafts above the variant limit", () => {
      const drafts = createProductDrafts({
        products: [
          {
            id: "p1",
            name: "Small",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: { totalCount: 5, edges: [{ node: { id: "v1" } }] },
          },
          {
            id: "p2",
            name: "Large",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: { totalCount: 501, edges: [{ node: { id: "v2" } }] },
          },
        ],
        channelId: "ch1",
      });

      expect(getDraftsExceedingVariantLimit(drafts)).toEqual([drafts[1]]);
    });
  });

  describe("getDraftsMissingCategoryForPublish", () => {
    it("returns uncategorized drafts only when publishing", () => {
      // Arrange
      const drafts = createProductDrafts({
        products: [
          {
            id: "p1",
            name: "With category",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: { totalCount: 1, edges: [{ node: { id: "v1" } }] },
          },
          {
            id: "p2",
            name: "No category",
            category: null,
            channelListings: null,
            productVariants: { totalCount: 1, edges: [{ node: { id: "v2" } }] },
          },
        ],
        channelId: "ch1",
      });

      // Act & Assert
      expect(getDraftsMissingCategoryForPublish(drafts, true)).toEqual([drafts[1]]);
      expect(getDraftsMissingCategoryForPublish(drafts, false)).toEqual([]);
    });
  });

  describe("getDraftsWithManyVariants", () => {
    it("returns drafts above the many-variants threshold", () => {
      const drafts = createProductDrafts({
        products: [
          {
            id: "p1",
            name: "Small",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: { totalCount: 50, edges: [{ node: { id: "v1" } }] },
          },
          {
            id: "p2",
            name: "Medium",
            category: { id: "cat1" },
            channelListings: null,
            productVariants: { totalCount: 150, edges: [{ node: { id: "v2" } }] },
          },
        ],
        channelId: "ch1",
      });

      expect(getDraftsWithManyVariants(drafts)).toEqual([drafts[1]]);
    });
  });

  describe("getDraftsWithInvalidCostPrice", () => {
    it("returns drafts with invalid cost price only", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
      });

      expect(getDraftsWithInvalidCostPrice(drafts)).toHaveLength(0);
      expect(
        getDraftsWithInvalidCostPrice([
          {
            ...drafts[0],
            costPrice: "bad",
          },
        ]),
      ).toHaveLength(1);
    });
  });

  describe("isValidBulkPublishStock", () => {
    it("accepts empty stock and valid quantities", () => {
      expect(isValidBulkPublishStock("")).toBe(true);
      expect(isValidBulkPublishStock("0")).toBe(true);
      expect(isValidBulkPublishStock("42")).toBe(true);
    });

    it("rejects invalid explicit values", () => {
      expect(isValidBulkPublishStock("abc")).toBe(false);
    });
  });

  describe("isValidStockQuantity", () => {
    it("accepts zero and positive integers", () => {
      expect(isValidStockQuantity("0")).toBe(true);
      expect(isValidStockQuantity("42")).toBe(true);
    });

    it("rejects empty and invalid values", () => {
      expect(isValidStockQuantity("")).toBe(false);
      expect(isValidStockQuantity("abc")).toBe(false);
    });

    it("rejects values that would be silently truncated to a different quantity", () => {
      expect(isValidStockQuantity("12.5")).toBe(false);
      expect(isValidStockQuantity("12 pcs")).toBe(false);
      expect(isValidStockQuantity("1 000")).toBe(false);
      expect(isValidStockQuantity("-3")).toBe(false);
    });
  });

  describe("getEffectiveStockQuantity", () => {
    it("uses draft stock when set", () => {
      const draft = createProductDrafts({ products: [products[0]], channelId: "ch1" })[0];

      expect(
        getEffectiveStockQuantity({
          ...draft,
          stock: "7",
        }),
      ).toBe(7);
    });

    it("returns NaN when draft stock is empty", () => {
      const draft = createProductDrafts({ products: [products[0]], channelId: "ch1" })[0];

      expect(getEffectiveStockQuantity(draft)).toBeNaN();
      expect(hasBulkPublishStock(draft.stock)).toBe(false);
    });

    it("returns NaN rather than a truncated quantity for non-integer stock", () => {
      const draft = createProductDrafts({ products: [products[0]], channelId: "ch1" })[0];

      expect(getEffectiveStockQuantity({ ...draft, stock: "12.5" })).toBeNaN();
    });
  });

  describe("getDraftsWithInvalidStock", () => {
    it("returns drafts with invalid explicit stock only", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
      });

      expect(getDraftsWithInvalidStock(drafts)).toHaveLength(0);
      expect(
        getDraftsWithInvalidStock([
          {
            ...drafts[0],
            stock: "bad",
          },
        ]),
      ).toHaveLength(1);
    });
  });

  describe("isValidBulkPublishPrice", () => {
    it("accepts positive numbers", () => {
      expect(isValidBulkPublishPrice("9.99")).toBe(true);
    });

    it("accepts zero — Saleor PositiveDecimal allows free products", () => {
      expect(isValidBulkPublishPrice("0")).toBe(true);
      expect(isValidBulkPublishPrice("0.00")).toBe(true);
    });

    it("rejects empty and negative values", () => {
      expect(isValidBulkPublishPrice("")).toBe(false);
      expect(isValidBulkPublishPrice("-1")).toBe(false);
    });
  });

  describe("getDraftsMissingPrice", () => {
    it("returns drafts without a valid price", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
      });

      expect(getDraftsMissingPrice(drafts)).toHaveLength(2);
    });
  });

  describe("countVariantsInDrafts", () => {
    it("sums variant counts across drafts", () => {
      const drafts = createProductDrafts({
        products,
        channelId: "ch1",
      });

      expect(countVariantsInDrafts(drafts)).toBe(3);
    });
  });
});
