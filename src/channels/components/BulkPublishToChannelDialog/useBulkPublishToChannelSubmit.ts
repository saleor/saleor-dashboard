import { type FetchResult, useApolloClient } from "@apollo/client";
import {
  BULK_PUBLISH_MAX_PRODUCTS,
  BULK_PUBLISH_VARIANT_PAGE_SIZE,
  type BulkPublishChannel,
  type BulkPublishDefaults,
  type BulkPublishWarehouse,
  type ProductPublishDraft,
  type PublishProgressItem,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import {
  ErrorPolicyEnum,
  type ProductErrorCode,
  type ProductVariantBulkUpdateInput,
  type ProductVariantBulkUpdateMutation,
  useBulkPublishProductsDataQuery,
  useProductChannelListingUpdateMutation,
  useProductVariantBulkUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useState } from "react";
import { type IntlShape, useIntl } from "react-intl";

import {
  chunkBulkPublishItems,
  getDraftsMissingPrice,
  getDraftsWithInvalidPrice,
  getEffectiveStockQuantity,
  hasBulkPublishCostPrice,
  hasBulkPublishPrice,
} from "./bulkPublishDrafts";
import { getBulkPublishStockWarehouses } from "./bulkPublishStockWarehouses";
import { buildBulkPublishVariantChannelListingsInput } from "./bulkPublishVariantChannelListings";
import { buildBulkPublishVariantStocksInput } from "./bulkPublishVariantStocks";
import {
  type BulkPublishVariantNode,
  fetchAllBulkPublishProductVariants,
} from "./fetchBulkPublishProductVariants";
import { messages } from "./messages";

type BulkPublishProductNode = {
  id: string;
  name: string;
  category: { id: string } | null;
};

type MutationErrorLike = {
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
};

const getBulkPublishMutationErrorMessage = (
  errors: MutationErrorLike[],
  intl: IntlShape,
): string | undefined => {
  const firstError = errors[0];

  if (!firstError) {
    return undefined;
  }

  return getProductErrorMessage(firstError, intl) ?? firstError.message ?? undefined;
};

const hasVariantBulkUpdateErrors = (
  variantResult: FetchResult<ProductVariantBulkUpdateMutation>,
): boolean => {
  if (variantResult.errors?.length) {
    return true;
  }

  const payload = variantResult.data?.productVariantBulkUpdate;

  if (!payload) {
    return true;
  }

  const rowErrors = payload.results?.flatMap(result => result.errors ?? []) ?? [];

  return payload.errors.length > 0 || rowErrors.length > 0;
};

const getVariantBulkUpdateErrorMessage = (
  variantResult: FetchResult<ProductVariantBulkUpdateMutation>,
  intl: IntlShape,
): string | undefined => {
  const payloadErrors = getMutationErrors(variantResult) as MutationErrorLike[];

  return getBulkPublishMutationErrorMessage(payloadErrors, intl);
};

const buildVariantBulkUpdateInputs = ({
  variants,
  channelId,
  price,
  costPrice,
  stock,
}: {
  variants: BulkPublishVariantNode[];
  channelId: string;
  price?: string;
  costPrice?: string;
  stock?: {
    warehouseIds: string[];
    quantity: number;
  };
}): ProductVariantBulkUpdateInput[] =>
  variants
    .map((variant): ProductVariantBulkUpdateInput | undefined => {
      const channelListings = buildBulkPublishVariantChannelListingsInput({
        variant,
        channelId,
        price,
        costPrice,
      });
      const stocks = stock
        ? buildBulkPublishVariantStocksInput({
            variant,
            warehouseIds: stock.warehouseIds,
            quantity: stock.quantity,
          })
        : undefined;

      if (!channelListings && !stocks) {
        return undefined;
      }

      return {
        id: variant.id,
        ...(channelListings ? { channelListings } : {}),
        ...(stocks ? { stocks } : {}),
      };
    })
    .filter((input): input is ProductVariantBulkUpdateInput => input !== undefined);

export type BulkPublishSubmitResult = {
  failedProductIds: string[];
};

export const useBulkPublishToChannelSubmit = ({
  channel,
  channelWarehouses,
}: {
  channel: BulkPublishChannel;
  channelWarehouses: BulkPublishWarehouse[];
}): {
  publishProducts: (args: {
    productDrafts: ProductPublishDraft[];
    defaults: BulkPublishDefaults;
    productIds: string[];
    onProgressChange: (progress: PublishProgressItem[]) => void;
  }) => Promise<BulkPublishSubmitResult>;
  submitting: boolean;
} => {
  const intl = useIntl();
  const notify = useNotifier();
  const client = useApolloClient();
  const [submitting, setSubmitting] = useState(false);
  const { refetch: fetchProductsData } = useBulkPublishProductsDataQuery({
    skip: true,
    variables: {
      ids: [],
      first: 1,
    },
  });
  // Wizard surfaces per-product errors in the progress list — suppress global mutation toasts.
  const [updateChannelListing] = useProductChannelListingUpdateMutation({
    disableErrorHandling: true,
  });
  const [bulkUpdateVariants] = useProductVariantBulkUpdateMutation({
    disableErrorHandling: true,
  });

  const publishProducts = useCallback(
    async ({
      productDrafts,
      defaults,
      productIds,
      onProgressChange,
    }: {
      productDrafts: ProductPublishDraft[];
      defaults: BulkPublishDefaults;
      productIds: string[];
      onProgressChange: (progress: PublishProgressItem[]) => void;
    }): Promise<BulkPublishSubmitResult> => {
      const draftsToPublish = productDrafts.filter(draft => productIds.includes(draft.productId));

      if (draftsToPublish.length === 0) {
        return { failedProductIds: [] };
      }

      // Same rules the review step enforces — kept here as a backstop against a caller that skips it.
      const hasUnusablePrice =
        getDraftsWithInvalidPrice(draftsToPublish).length > 0 ||
        getDraftsMissingPrice(draftsToPublish).length > 0;

      if (hasUnusablePrice) {
        notify({
          status: "error",
          text: intl.formatMessage(messages.priceRequired),
        });

        return { failedProductIds: productIds };
      }

      setSubmitting(true);

      const progress: PublishProgressItem[] = draftsToPublish.map(draft => ({
        productId: draft.productId,
        name: draft.name,
        status: "pending",
      }));

      onProgressChange(progress);

      const failedProductIds: string[] = [];
      const stockWarehouses = defaults.stock.enabled
        ? getBulkPublishStockWarehouses({
            channelWarehouses,
            stock: defaults.stock,
          })
        : [];
      const stockWarehouseIds = stockWarehouses.map(warehouse => warehouse.id);
      const missingCategoryMessage = intl.formatMessage(messages.missingCategoryForPublish, {
        count: 1,
      });

      try {
        const { data } = await fetchProductsData({
          ids: draftsToPublish.map(draft => draft.productId),
          first: BULK_PUBLISH_MAX_PRODUCTS,
        });
        const products = mapEdgesToItems(data?.products) as BulkPublishProductNode[];
        const productsById = new Map(products.map(product => [product.id, product]));

        for (let index = 0; index < draftsToPublish.length; index += 1) {
          const draft = draftsToPublish[index];

          progress[index] = {
            ...progress[index],
            status: "in_progress",
            errorMessage: undefined,
          };
          onProgressChange([...progress]);

          try {
            const product = productsById.get(draft.productId);

            if (!product) {
              failedProductIds.push(draft.productId);
              progress[index] = {
                ...progress[index],
                status: "error",
                errorMessage: intl.formatMessage(messages.productLoadFailed),
              };
              onProgressChange([...progress]);
              continue;
            }

            if (defaults.isPublished && !product.category) {
              failedProductIds.push(draft.productId);
              progress[index] = {
                ...progress[index],
                status: "error",
                errorMessage: missingCategoryMessage,
              };
              onProgressChange([...progress]);
              continue;
            }

            const channelListingResult = await updateChannelListing({
              variables: {
                id: product.id,
                input: {
                  updateChannels: [
                    {
                      channelId: channel.id,
                      isPublished: defaults.isPublished,
                      visibleInListings: defaults.visibleInListings,
                      isAvailableForPurchase: defaults.isAvailableForPurchase,
                    },
                  ],
                },
              },
            });

            const channelListing = channelListingResult.data?.productChannelListingUpdate;
            const channelListingErrors = (channelListing?.errors ?? []) as MutationErrorLike[];

            if (
              channelListingResult.errors?.length ||
              !channelListing ||
              channelListingErrors.length > 0
            ) {
              failedProductIds.push(draft.productId);
              progress[index] = {
                ...progress[index],
                status: "error",
                errorMessage:
                  getBulkPublishMutationErrorMessage(channelListingErrors, intl) ??
                  channelListingResult.errors?.[0]?.message ??
                  intl.formatMessage(messages.publishFailed),
              };
              onProgressChange([...progress]);
              continue;
            }

            // Refetch after the product channel update so we don't attempt channelListings.create
            // when listings were already created (e.g. by a prior failed publish attempt).
            // Also loads stocks so we can create missing rows and update existing ones.
            const variants = await fetchAllBulkPublishProductVariants(client, product.id);
            const price = hasBulkPublishPrice(draft.price) ? draft.price : undefined;
            const costPrice = hasBulkPublishCostPrice(draft.costPrice)
              ? draft.costPrice
              : undefined;
            const stockQuantity = getEffectiveStockQuantity(draft);
            const stock =
              defaults.stock.enabled &&
              stockWarehouseIds.length > 0 &&
              Number.isFinite(stockQuantity)
                ? {
                    warehouseIds: stockWarehouseIds,
                    quantity: stockQuantity,
                  }
                : undefined;

            if (variants.length > 0) {
              const variantInputs = buildVariantBulkUpdateInputs({
                variants,
                channelId: channel.id,
                price,
                costPrice,
                stock,
              });
              const variantInputChunks = chunkBulkPublishItems(
                variantInputs,
                BULK_PUBLISH_VARIANT_PAGE_SIZE,
              );

              for (const variantInputChunk of variantInputChunks) {
                const variantResult = await bulkUpdateVariants({
                  variables: {
                    product: product.id,
                    input: variantInputChunk,
                    errorPolicy: ErrorPolicyEnum.REJECT_FAILED_ROWS,
                  },
                });

                if (hasVariantBulkUpdateErrors(variantResult)) {
                  failedProductIds.push(draft.productId);
                  progress[index] = {
                    ...progress[index],
                    status: "error",
                    errorMessage:
                      getVariantBulkUpdateErrorMessage(variantResult, intl) ??
                      variantResult.errors?.[0]?.message ??
                      intl.formatMessage(messages.publishFailed),
                  };
                  onProgressChange([...progress]);
                  break;
                }
              }

              if (failedProductIds.includes(draft.productId)) {
                continue;
              }
            }

            progress[index] = {
              ...progress[index],
              status: "success",
              errorMessage: undefined,
            };
            onProgressChange([...progress]);
          } catch {
            failedProductIds.push(draft.productId);
            progress[index] = {
              ...progress[index],
              status: "error",
              errorMessage: intl.formatMessage(messages.publishFailed),
            };
            onProgressChange([...progress]);
          }
        }

        return { failedProductIds };
      } catch {
        progress.forEach((item, index) => {
          progress[index] = {
            ...item,
            status: "error",
            errorMessage: item.errorMessage ?? intl.formatMessage(messages.publishFailed),
          };
        });
        onProgressChange([...progress]);
        notify({
          status: "error",
          text: intl.formatMessage(messages.publishFailed),
        });

        return { failedProductIds: productIds };
      } finally {
        setSubmitting(false);
      }
    },
    [
      bulkUpdateVariants,
      channel.id,
      client,
      fetchProductsData,
      intl,
      notify,
      updateChannelListing,
      channelWarehouses,
    ],
  );

  return {
    publishProducts,
    submitting,
  };
};
