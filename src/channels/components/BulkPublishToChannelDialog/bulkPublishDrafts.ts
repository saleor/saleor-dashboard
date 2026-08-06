import {
  BULK_PUBLISH_MANY_VARIANTS_THRESHOLD,
  BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
  type BulkPublishDefaults,
  type ProductPublishDraft,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";

export type BulkPublishProductForDraft = {
  id: string;
  name: string;
  category: { id: string } | null;
  channelListings: Array<{ channel: { id: string } }> | null;
  productVariants: {
    totalCount: number;
    edges: Array<{ node: { id: string } }>;
  } | null;
};

const getVariantLimitState = (
  productVariants: BulkPublishProductForDraft["productVariants"],
): { variantCount: number; exceedsVariantLimit: boolean; hasManyVariants: boolean } => {
  const variantCount = productVariants?.totalCount ?? productVariants?.edges.length ?? 0;

  return {
    variantCount,
    exceedsVariantLimit: variantCount > BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
    hasManyVariants: variantCount > BULK_PUBLISH_MANY_VARIANTS_THRESHOLD,
  };
};

export const chunkBulkPublishItems = <TItem>(items: TItem[], chunkSize: number): TItem[][] => {
  if (chunkSize <= 0) {
    return [];
  }

  const chunks: TItem[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
};

export const isValidBulkPublishPrice = (price: string): boolean => {
  const parsed = Number.parseFloat(price);

  // Saleor PositiveDecimal is nonnegative (0 or greater), not strictly positive.
  return Number.isFinite(parsed) && parsed >= 0;
};

export const isValidBulkPublishCostPrice = (costPrice: string): boolean => {
  if (costPrice.trim() === "") {
    return true;
  }

  const parsed = Number.parseFloat(costPrice);

  return Number.isFinite(parsed) && parsed >= 0;
};

export const hasBulkPublishCostPrice = (costPrice: string): boolean => costPrice.trim() !== "";

const WHOLE_NUMBER = /^\d+$/;

/** Stock is whole units — `parseInt` would silently accept "12.5" or "12 pcs" and write 12. */
export const isValidStockQuantity = (quantity: string): boolean =>
  WHOLE_NUMBER.test(quantity.trim());

export const hasBulkPublishStock = (stock: string): boolean => stock.trim() !== "";

export const isValidBulkPublishStock = (stock: string): boolean => {
  if (!hasBulkPublishStock(stock)) {
    return true;
  }

  return isValidStockQuantity(stock);
};

export const getEffectiveStockQuantity = (draft: ProductPublishDraft): number =>
  isValidStockQuantity(draft.stock) ? Number.parseInt(draft.stock.trim(), 10) : Number.NaN;

export const getAppliedDefaultStock = (defaults: BulkPublishDefaults): string | undefined => {
  if (!defaults.stock.enabled) {
    return undefined;
  }

  return defaults.stock.defaultQuantity.trim();
};

export const isStillDefaultBulkPublishStock = (
  stock: string,
  previousDefaultStock: string | undefined,
): boolean => {
  const trimmedStock = stock.trim();

  if (previousDefaultStock === undefined) {
    return trimmedStock === "";
  }

  return trimmedStock === previousDefaultStock;
};

export const createProductDrafts = ({
  products,
  channelId,
  defaultStock,
}: {
  products: BulkPublishProductForDraft[];
  channelId: string;
  defaultStock?: string;
}): ProductPublishDraft[] => {
  const trimmedDefaultStock = defaultStock?.trim() ?? "";
  const shouldPrefillStock =
    trimmedDefaultStock !== "" && isValidStockQuantity(trimmedDefaultStock);

  return products.map(product => {
    const { variantCount, exceedsVariantLimit, hasManyVariants } = getVariantLimitState(
      product.productVariants,
    );

    return {
      productId: product.id,
      name: product.name,
      variantCount,
      exceedsVariantLimit,
      hasManyVariants,
      hasCategory: product.category !== null,
      alreadyInChannel:
        product.channelListings?.some(listing => listing.channel.id === channelId) ?? false,
      price: "",
      costPrice: "",
      stock: shouldPrefillStock ? trimmedDefaultStock : "",
    };
  });
};

export const mergeProductDrafts = ({
  drafts,
  previousDrafts,
  previousDefaultStock,
}: {
  drafts: ProductPublishDraft[];
  previousDrafts: ProductPublishDraft[];
  previousDefaultStock?: string;
}): ProductPublishDraft[] =>
  drafts.map(draft => {
    const existingDraft = previousDrafts.find(
      previousDraft => previousDraft.productId === draft.productId,
    );

    if (!existingDraft) {
      return draft;
    }

    const stock = isStillDefaultBulkPublishStock(existingDraft.stock, previousDefaultStock)
      ? draft.stock
      : existingDraft.stock;

    return {
      ...draft,
      price: existingDraft.price,
      costPrice: existingDraft.costPrice,
      stock,
    };
  });

export const getDraftsMissingPrice = (drafts: ProductPublishDraft[]): ProductPublishDraft[] =>
  drafts.filter(draft => !isValidBulkPublishPrice(draft.price));

export const getDraftsWithInvalidCostPrice = (
  drafts: ProductPublishDraft[],
): ProductPublishDraft[] => drafts.filter(draft => !isValidBulkPublishCostPrice(draft.costPrice));

export const getDraftsExceedingVariantLimit = (
  drafts: ProductPublishDraft[],
): ProductPublishDraft[] => drafts.filter(draft => draft.exceedsVariantLimit);

export const getDraftsWithManyVariants = (drafts: ProductPublishDraft[]): ProductPublishDraft[] =>
  drafts.filter(draft => draft.hasManyVariants);

/** Products that cannot be published because Saleor requires a category. */
export const getDraftsMissingCategoryForPublish = (
  drafts: ProductPublishDraft[],
  isPublished: boolean,
): ProductPublishDraft[] => (isPublished ? drafts.filter(draft => !draft.hasCategory) : []);

export const getDraftsWithInvalidStock = (drafts: ProductPublishDraft[]): ProductPublishDraft[] =>
  drafts.filter(draft => !isValidBulkPublishStock(draft.stock));

export const countVariantsInDrafts = (drafts: ProductPublishDraft[]): number =>
  drafts.reduce((count, draft) => count + draft.variantCount, 0);
