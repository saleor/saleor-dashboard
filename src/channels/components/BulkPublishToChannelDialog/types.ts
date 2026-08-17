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
  /** Single price applied to all variants of this product */
  price: string;
  /** Optional cost price applied to all variants; empty skips the update */
  costPrice: string;
  /** Stock per variant per warehouse; empty uses the default quantity */
  stock: string;
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
