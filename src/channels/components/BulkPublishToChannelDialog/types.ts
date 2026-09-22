import { type Container } from "@dashboard/types";

export enum BulkPublishStep {
  SELECT = 0,
  DEFAULTS = 1,
  REVIEW = 2,
  CONFIRM = 3,
}

export type BulkPublishChannel = {
  id: string;
  name: string;
  slug: string;
  currencyCode: string;
};

export type BulkPublishWarehouse = {
  id: string;
  name: string;
};

export type BulkPublishSelectedProduct = Container & {
  name?: string;
};

export type BulkPublishStockWarehouseScope = "all_channel" | "single";

export type BulkPublishStockSettings = {
  enabled: boolean;
  /** Applied to every variant in every target warehouse unless overridden per product */
  defaultQuantity: string;
  warehouseScope: BulkPublishStockWarehouseScope;
  warehouseId: string;
};

export type BulkPublishDefaults = {
  stock: BulkPublishStockSettings;
  isPublished: boolean;
  visibleInListings: boolean;
  isAvailableForPurchase: boolean;
};

/** What the product's variants are priced at in the target channel today. */
export type BulkPublishCurrentPrice = {
  min: number;
  max: number;
  /** True when listed variants do not all share the same price. */
  isMixed: boolean;
};

/** How the product sits in the target channel today, used to describe what a run will change. */
export type BulkPublishCurrentListing = {
  /** Undefined when no variant is listed in the channel yet. */
  price?: BulkPublishCurrentPrice;
  listedVariantCount: number;
  /** Variants with no listing here. They need a price, so a blank one leaves them unlisted. */
  unlistedVariantCount: number;
};

export type ProductPublishDraft = {
  productId: string;
  name: string;
  variantCount: number;
  /** True when the product has more variants than this wizard supports. */
  exceedsVariantLimit: boolean;
  /** True when publishing may take longer due to variant count. */
  hasManyVariants: boolean;
  /** Saleor requires a category before a product can be published. */
  hasCategory: boolean;
  alreadyInChannel: boolean;
  /**
   * Single price applied to all variants of this product. Empty leaves prices untouched, which is
   * only possible for products already listed in the channel — creating a listing requires a price.
   */
  price: string;
  /** Optional cost price applied to all variants; empty skips the update */
  costPrice: string;
  /** Stock per variant per warehouse; empty uses the default quantity */
  stock: string;
  /**
   * How the product looks in the channel today, used for the "unchanged" placeholder and to warn
   * about variants a blank price would leave unlisted. Undefined when the product is not listed
   * yet, or when it has too many variants to sample exactly.
   */
  currentListing?: BulkPublishCurrentListing;
};

export type PublishProgressStatus = "pending" | "in_progress" | "success" | "error";

export type PublishProgressItem = {
  productId: string;
  name: string;
  status: PublishProgressStatus;
  errorMessage?: string;
};

export const BULK_PUBLISH_MAX_PRODUCTS = 50;

/** Product picker page size — matches wizard cap so one page covers the full selection. */
export const BULK_PUBLISH_PICKER_PAGE_SIZE = BULK_PUBLISH_MAX_PRODUCTS;

/** GraphQL page size and mutation batch size — matches Saleor bulk guidance. */
export const BULK_PUBLISH_VARIANT_PAGE_SIZE = 100;

/** Soft threshold — show a slower-publish warning above this count. */
export const BULK_PUBLISH_MANY_VARIANTS_THRESHOLD = 100;

/** Hard cap per product for this wizard; products above cannot be published here. */
export const BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT = 500;

/**
 * How many variants we sample to show a product's current price. Saleor caps `first` at 100, so
 * products above this get no placeholder rather than a range we cannot guarantee is complete.
 */
export const BULK_PUBLISH_PRICE_SAMPLE_LIMIT = 100;
