import { FetchResult } from "@apollo/client";
import { getAttributesAfterFileAttributesUpdate } from "@dashboard/attributes/utils/data";
import { prepareAttributesInput } from "@dashboard/attributes/utils/handlers";
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/NumberCell";
import {
  DatagridChange,
  DatagridChangeOpts,
} from "@dashboard/components/Datagrid/useDatagridChange";
import { VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  FileUploadMutation,
  ProductChannelListingAddInput,
  ProductChannelListingUpdateInput,
  ProductChannelListingUpdateMutationVariables,
  ProductFragment,
  ProductVariantBulkUpdateInput,
} from "@dashboard/graphql";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { getAttributeInputFromProduct } from "@dashboard/products/utils/data";
import {
  getColumnAttribute,
  getColumnChannelAvailability,
  getColumnStock,
  isCurrentRow,
} from "@dashboard/products/utils/datagrid";
import { getVariantChannelsInputs } from "@dashboard/products/utils/getVariantChannelsInputs";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import pick from "lodash/pick";
import uniq from "lodash/uniq";

export function getProductUpdateVariables(
  product: ProductFragment,
  data: ProductUpdateSubmitData,
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
) {
  const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
    data.attributesWithNewFileValue,
    uploadFilesResult,
  );

  return {
    id: product.id,
    input: {
      attributes: prepareAttributesInput({
        attributes: data.attributes,
        prevAttributes: getAttributeInputFromProduct(product),
        updatedFileAttributes,
      }),
      category: data.category,
      collections: data.collections,
      description: getParsedDataForJsonStringField(data.description),
      name: data.name,
      rating: data.rating,
      seo: {
        description: data.seoDescription,
        title: data.seoTitle,
      },
      slug: data.slug,
      taxClass: data.taxClassId,
    },
    firstValues: VALUES_PAGINATE_BY,
  };
}

export function getProductChannelsUpdateVariables(
  product: ProductFragment,
  data: ProductUpdateSubmitData,
): ProductChannelListingUpdateMutationVariables {
  const channels = inferProductChannelsAfterUpdate(product, data);

  const dataUpdated = new Map<string, ProductChannelListingAddInput>();
  data.channels.updateChannels
    .map(listing =>
      pick(
        listing,
        // Filtering it here so we send only fields defined in input schema
        [
          "availableForPurchaseAt",
          "availableForPurchaseDate",
          "channelId",
          "isAvailableForPurchase",
          "isPublished",
          "publicationDate",
          "publishedAt",
          "visibleInListings",
        ] as Array<keyof ProductChannelListingAddInput>,
      ),
    )
    .forEach(listing => dataUpdated.set(listing.channelId, listing));

  const variantsUpdates = new Map<string, ProductChannelListingAddInput>();
  channels
    .map(channelId => ({
      channelId,
      addVariants: data.variants.updates
        .filter(
          change =>
            !data.variants.added.includes(change.row) &&
            !hasChannel(channelId, product.variants[change.row]) &&
            channelId === getColumnChannelAvailability(change.column) &&
            change.data,
        )
        .map(change => product.variants[change.row].id),
      removeVariants: data.variants.updates
        .filter(
          change =>
            product.variants[change.row] &&
            channelId === getColumnChannelAvailability(change.column) &&
            !change.data,
        )
        .map(change => product.variants[change.row].id),
    }))
    .filter(
      listing =>
        listing.addVariants.length > 0 || listing.removeVariants.length > 0,
    )
    .forEach(listing => variantsUpdates.set(listing.channelId, listing));

  const updateChannels = channels
    .filter(
      channelId => dataUpdated.has(channelId) || variantsUpdates.has(channelId),
    )
    .map(channelId => ({
      ...dataUpdated.get(channelId),
      ...variantsUpdates.get(channelId),
    }));

  return {
    id: product.id,
    input: {
      ...data.channels,
      updateChannels,
    },
  };
}

export function getCreateVariantInput(data: DatagridChangeOpts, index: number) {
  return {
    attributes: getAttributeData(data.updates, index, data.removed),
    sku: getSkuData(data.updates, index, data.removed),
    name: getNameData(data.updates, index, data.removed),
    channelListings: getVariantChannelsInputs(data, index),
    stocks: getStockData(data.updates, index, data.removed),
  };
}

export function getBulkVariantUpdateInputs(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): ProductVariantBulkUpdateInput[] {
  const toUpdateInput = createToUpdateInput(data);
  return variants.map(toUpdateInput).filter(byAvailability);
}

const createToUpdateInput =
  (data: DatagridChangeOpts) =>
  (variant, variantIndex): ProductVariantBulkUpdateInput => ({
    id: variant.id,
    attributes: getAttributeData(data.updates, variantIndex, data.removed),
    sku: getSkuData(data.updates, variantIndex, data.removed),
    name: getNameData(data.updates, variantIndex, data.removed),
    stocks: getStockData(data.updates, variantIndex, data.removed),
    channelListings: getVariantChannelsInputs(data, variantIndex),
  });

const byAvailability = (variant: ProductVariantBulkUpdateInput): boolean =>
  !!variant.name ||
  !!variant.sku ||
  variant.attributes.length > 0 ||
  variant.stocks.length > 0 ||
  variant.channelListings.length > 0;

export function hasProductChannelsUpdate(
  data: ProductChannelListingUpdateInput,
) {
  return data?.removeChannels?.length || data?.updateChannels?.length;
}

export function inferProductChannelsAfterUpdate(
  product: ProductFragment,
  data: ProductUpdateSubmitData,
) {
  const productChannelsIds = product.channelListings.map(
    listing => listing.channel.id,
  );
  const updatedChannelsIds =
    data.channels.updateChannels?.map(listing => listing.channelId) || [];
  const removedChannelsIds = data.channels.removeChannels || [];

  return uniq([
    ...productChannelsIds.filter(
      channelId => !removedChannelsIds.includes(channelId),
    ),
    ...updatedChannelsIds,
  ]);
}

function hasChannel(
  channelId: string,
  variant?: ProductFragment["variants"][number],
) {
  if (!variant) {
    return false;
  }

  return variant.channelListings.some(c => c.channel.id === channelId);
}

function getAttributeData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
) {
  return data
    .filter(change => isCurrentRow(change.row, currentIndex, removedIds))
    .filter(byHavingAnyAttribute)
    .map(toAttributeData);
}

function byHavingAnyAttribute(change: DatagridChange) {
  return getColumnAttribute(change.column);
}

function toAttributeData(change: DatagridChange) {
  const attributeId = getColumnAttribute(change.column);

  return {
    id: attributeId,
    values: [change.data.value.value],
  };
}

function getSkuData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
) {
  return data.find(
    change =>
      change.column === "sku" &&
      isCurrentRow(change.row, currentIndex, removedIds),
  )?.data;
}

function getNameData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
) {
  return data.find(
    change =>
      change.column === "name" &&
      isCurrentRow(change.row, currentIndex, removedIds),
  )?.data;
}

function getStockData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
) {
  return data
    .filter(change => byHavingStockColumn(change, currentIndex, removedIds))
    .map(toStockData)
    .filter(byStockWithQuantity);
}

function toStockData(change: DatagridChange) {
  return {
    warehouse: getColumnStock(change.column),
    quantity: change.data.value,
  };
}

function byStockWithQuantity(stock: { quantity: unknown }) {
  return stock.quantity !== numberCellEmptyValue;
}

function byHavingStockColumn(
  change: DatagridChange,
  currentIndex: number,
  removedIds: number[],
) {
  return (
    getColumnStock(change.column) &&
    isCurrentRow(change.row, currentIndex, removedIds)
  );
}
