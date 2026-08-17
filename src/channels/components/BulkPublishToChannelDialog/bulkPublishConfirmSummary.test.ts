import {
  countBulkPublishDraftsWithCostPrice,
  countBulkPublishDraftsWithStock,
  getBulkPublishCostPriceRange,
  getBulkPublishPriceRange,
  getBulkPublishProductNamePreview,
  getBulkPublishStockQuantityRange,
} from "./bulkPublishConfirmSummary";
import { type ProductPublishDraft } from "./types";

const createDraft = (overrides: Partial<ProductPublishDraft>): ProductPublishDraft => ({
  productId: "p1",
  name: "Product",
  variantCount: 1,
  exceedsVariantLimit: false,
  hasManyVariants: false,
  hasCategory: true,
  alreadyInChannel: false,
  price: "",
  costPrice: "",
  stock: "",
  ...overrides,
});

describe("bulkPublishConfirmSummary", () => {
  describe("getBulkPublishPriceRange", () => {
    it("returns a single-value range when all prices match", () => {
      const drafts = [createDraft({ price: "10" }), createDraft({ productId: "p2", price: "10" })];

      expect(getBulkPublishPriceRange(drafts)).toEqual({ min: 10, max: 10 });
    });

    it("returns min and max for mixed prices", () => {
      const drafts = [createDraft({ price: "7" }), createDraft({ productId: "p2", price: "12.5" })];

      expect(getBulkPublishPriceRange(drafts)).toEqual({ min: 7, max: 12.5 });
    });

    it("includes zero prices in the range", () => {
      const drafts = [createDraft({ price: "0" }), createDraft({ productId: "p2", price: "10" })];

      expect(getBulkPublishPriceRange(drafts)).toEqual({ min: 0, max: 10 });
    });
  });

  describe("getBulkPublishCostPriceRange", () => {
    it("ignores empty cost prices", () => {
      const drafts = [
        createDraft({ costPrice: "5" }),
        createDraft({ productId: "p2", costPrice: "" }),
      ];

      expect(getBulkPublishCostPriceRange(drafts)).toEqual({ min: 5, max: 5 });
      expect(countBulkPublishDraftsWithCostPrice(drafts)).toBe(1);
    });
  });

  describe("getBulkPublishStockQuantityRange", () => {
    it("returns the range of explicit stock quantities", () => {
      const drafts = [createDraft({ stock: "5" }), createDraft({ productId: "p2", stock: "12" })];

      expect(getBulkPublishStockQuantityRange(drafts)).toEqual({ min: 5, max: 12 });
      expect(countBulkPublishDraftsWithStock(drafts)).toBe(2);
    });
  });

  describe("getBulkPublishProductNamePreview", () => {
    it("returns the first names and remaining count", () => {
      const drafts = [
        createDraft({ name: "Apple Juice" }),
        createDraft({ productId: "p2", name: "Banana Juice" }),
        createDraft({ productId: "p3", name: "Cherry Juice" }),
        createDraft({ productId: "p4", name: "Date Juice" }),
      ];

      expect(getBulkPublishProductNamePreview(drafts)).toEqual({
        previewNames: "Apple Juice, Banana Juice, Cherry Juice",
        remainingCount: 1,
      });
    });
  });
});
