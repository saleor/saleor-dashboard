import { FetchResult } from "@apollo/client";
import { getAttributesAfterFileAttributesUpdate } from "@dashboard/attributes/utils/data";
import { prepareAttributesInput } from "@dashboard/attributes/utils/handlers";
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/NumberCell";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/useDatagridChange";
import { VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  FileUploadMutation,
  ProductChannelListingAddInput,
  ProductChannelListingUpdateMutationVariables,
  ProductFragment,
  ProductVariantBulkUpdateInput,
  VariantDatagridChannelListingUpdateMutationVariables,
  VariantDatagridStockUpdateMutationVariables,
} from "@dashboard/graphql";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { getAttributeInputFromProduct } from "@dashboard/products/utils/data";
import {
  getColumnAttribute,
  getColumnChannelAvailability,
  getColumnStock,
  getCurrentRow,
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

const hasChannel = (
  channelId: string,
  variant?: ProductFragment["variants"][number],
) => {
  if (!variant) {
    return false;
  }

  return variant.channelListings.some(c => c.channel.id === channelId);
};

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

export function getVariantInput(data: DatagridChangeOpts, index: number) {
  const attributes = data.updates
    .filter(
      change =>
        getColumnAttribute(change.column) &&
        getCurrentRow(change.row, index, data.removed),
    )
    .map(change => {
      const attributeId = getColumnAttribute(change.column);

      return {
        id: attributeId,
        values: [change.data.value.value],
      };
    });

  const sku = data.updates.find(
    change =>
      change.column === "sku" && getCurrentRow(change.row, index, data.removed),
  )?.data;

  const name = data.updates.find(
    change =>
      change.column === "name" &&
      getCurrentRow(change.row, index, data.removed),
  )?.data;

  return {
    attributes,
    sku,
    name,
  };
}

export function getVariantBulkInput(
  data: DatagridChangeOpts,
  index: number,
): Omit<ProductVariantBulkUpdateInput, "id"> {
  const stocks = data.updates
    .filter(
      change =>
        getColumnStock(change.column) &&
        change.row === index + data.removed.filter(r => r <= index).length,
    )
    .map(change => ({
      warehouse: getColumnStock(change.column),
      quantity: change.data.value,
    }));

  const attributes = data.updates
    .filter(
      change =>
        getColumnAttribute(change.column) &&
        getCurrentRow(change.row, index, data.removed),
    )
    .map(change => {
      const attributeId = getColumnAttribute(change.column);

      return {
        id: attributeId,
        values: [change.data.value.value],
      };
    });

  const sku = data.updates.find(
    change =>
      change.column === "sku" && getCurrentRow(change.row, index, data.removed),
  )?.data;

  const name = data.updates.find(
    change =>
      change.column === "name" &&
      getCurrentRow(change.row, index, data.removed),
  )?.data;

  return {
    attributes,
    sku,
    name,
    stocks,
    channelListings: getVariantChannelsInputs(data, index),
  };
}

export function getVariantInputs(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): ProductVariantBulkUpdateInput[] {
  return variants
    .map(
      (variant, variantIndex): ProductVariantBulkUpdateInput => ({
        id: variant.id,
        ...getVariantBulkInput(data, variantIndex),
      }),
    )
    .filter(
      variant =>
        variant.name ||
        variant.sku ||
        variant.attributes.length > 0 ||
        variant.stocks.length > 0 ||
        variant.channelListings.length > 0,
    );
}

export function getStockInputs(data: DatagridChangeOpts, index: number) {
  const stockChanges = data.updates.filter(change =>
    getColumnStock(change.column),
  );

  const variantChanges = stockChanges
    .filter(
      change =>
        change.row === index + data.removed.filter(r => r <= index).length,
    )
    .map(change => ({
      warehouse: getColumnStock(change.column),
      quantity: change.data.value,
    }));

  return {
    stocks: variantChanges.filter(
      change => change.quantity !== numberCellEmptyValue,
    ),
    removeStocks: variantChanges
      .filter(change => change.quantity === numberCellEmptyValue)
      .map(({ warehouse }) => warehouse),
  };
}

export function getStocks(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridStockUpdateMutationVariables[] {
  return variants
    .map((variant, variantIndex) => ({
      id: variant.id,
      ...getStockInputs(data, variantIndex),
    }))
    .filter(
      variables =>
        variables.removeStocks.length > 0 || variables.stocks.length > 0,
    );
}

export function getVariantChannels(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridChannelListingUpdateMutationVariables[] {
  return variants
    .map((variant, variantIndex) => ({
      id: variant.id,
      input: getVariantChannelsInputs(data, variantIndex),
    }))
    .filter(({ input }) => input.length > 0);
}
