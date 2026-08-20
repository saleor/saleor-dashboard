import { type ProductPublishDraft } from "@dashboard/channels/components/BulkPublishToChannelDialog/types";

import {
  getEffectiveStockQuantity,
  hasBulkPublishCostPrice,
  hasBulkPublishPrice,
  hasBulkPublishStock,
} from "./bulkPublishDrafts";

const BULK_PUBLISH_CONFIRM_PREVIEW_NAME_LIMIT = 3;

export type BulkPublishNumericRange = {
  min: number;
  max: number;
};

const getNumericRange = (values: number[]): BulkPublishNumericRange | null => {
  if (values.length === 0) {
    return null;
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

export const getBulkPublishPriceRange = (
  drafts: ProductPublishDraft[],
): BulkPublishNumericRange | null => {
  const prices = drafts
    .map(draft => Number.parseFloat(draft.price))
    .filter(price => Number.isFinite(price) && price >= 0);

  return getNumericRange(prices);
};

export const getBulkPublishCostPriceRange = (
  drafts: ProductPublishDraft[],
): BulkPublishNumericRange | null => {
  const costPrices = drafts
    .filter(draft => hasBulkPublishCostPrice(draft.costPrice))
    .map(draft => Number.parseFloat(draft.costPrice))
    .filter(price => Number.isFinite(price) && price >= 0);

  return getNumericRange(costPrices);
};

export const getBulkPublishStockQuantityRange = (
  drafts: ProductPublishDraft[],
): BulkPublishNumericRange | null => {
  const quantities = drafts
    .map(draft => getEffectiveStockQuantity(draft))
    .filter(quantity => Number.isFinite(quantity));

  return getNumericRange(quantities);
};

export const countBulkPublishDraftsWithCostPrice = (drafts: ProductPublishDraft[]): number =>
  drafts.filter(draft => hasBulkPublishCostPrice(draft.costPrice)).length;

export const countBulkPublishDraftsKeepingPrice = (drafts: ProductPublishDraft[]): number =>
  drafts.filter(draft => !hasBulkPublishPrice(draft.price)).length;

export const countBulkPublishDraftsWithStock = (drafts: ProductPublishDraft[]): number =>
  drafts.filter(draft => hasBulkPublishStock(draft.stock)).length;

export const getBulkPublishProductNamePreview = (
  drafts: ProductPublishDraft[],
  previewLimit = BULK_PUBLISH_CONFIRM_PREVIEW_NAME_LIMIT,
): { previewNames: string; remainingCount: number } => {
  const visibleNames = drafts.slice(0, previewLimit).map(draft => draft.name);
  const remainingCount = Math.max(drafts.length - previewLimit, 0);

  return {
    previewNames: visibleNames.join(", "),
    remainingCount,
  };
};
