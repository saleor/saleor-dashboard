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
  ProductFragment,
  ProductVariantBulkUpdateInput,
  ProductVariantStocksUpdateInput,
} from "@dashboard/graphql";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { getAttributeInputFromProduct } from "@dashboard/products/utils/data";
import {
  getColumnAttribute,
  getColumnStock,
  isCurrentRow,
} from "@dashboard/products/utils/datagrid";
import {
  getUpdateVariantChannelInputs,
  getVariantChannelsInputs,
} from "@dashboard/products/utils/getVariantChannelsInputs";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
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
    stocks: getVaraintUpdateStockData(
      data.updates,
      variantIndex,
      data.removed,
      variant,
    ),
    channelListings: getUpdateVariantChannelInputs(data, variantIndex, variant),
  });

const byAvailability = (variant: ProductVariantBulkUpdateInput): boolean =>
  !!variant.name ||
  !!variant.sku ||
  variant.attributes.length > 0 ||
  variant.stocks.create.length > 0 ||
  variant.stocks.update.length > 0 ||
  variant.stocks.remove.length > 0 ||
  variant.channelListings.update.length > 0 ||
  variant.channelListings.remove.length > 0 ||
  variant.channelListings.create.length > 0;

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

function getVaraintUpdateStockData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
  variant: ProductFragment["variants"][number],
) {
  return data
    .filter(change => byHavingStockColumn(change, currentIndex, removedIds))
    .map(toStockData)
    .reduce<ProductVariantStocksUpdateInput>(
      (acc, stock) => {
        const variantStock = variant.stocks.find(
          vStock => vStock.warehouse.id === stock.warehouse,
        );

        if (stock.quantity === numberCellEmptyValue) {
          acc.remove.push(variantStock.id);
          return acc;
        }

        if (variant.stocks.some(s => s.warehouse.id === stock.warehouse)) {
          acc.update.push({
            quantity: stock.quantity,
            stock: variant.stocks.find(s => s.warehouse.id === stock.warehouse)
              .id,
          });
          return acc;
        }

        acc.create.push(stock);
        return acc;
      },
      {
        create: [],
        remove: [],
        update: [],
      },
    );
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
