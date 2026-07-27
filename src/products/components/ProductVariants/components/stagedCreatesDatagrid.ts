import { type ChannelData } from "@dashboard/channels/utils";
import { moneyCell, numberCell, textCell } from "@dashboard/components/Datagrid/customCells/cells";
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type ProductVariantBulkCreateInput, type WarehouseFragment } from "@dashboard/graphql";
import { getColumnChannel, getColumnStock } from "@dashboard/products/utils/datagrid";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type MutableRefObject } from "react";
import { type IntlShape } from "react-intl";

import { variantsStaticColumnsAdapter } from "../datagrid";
import messages from "../messages";

export const buildStagedCreatesColumns = ({
  intl,
  channels,
  warehouses,
}: {
  intl: IntlShape;
  channels: ChannelData[];
  warehouses: WarehouseFragment[];
}): AvailableColumn[] => [
  ...variantsStaticColumnsAdapter(intl),
  ...channels.map(
    (channel): AvailableColumn => ({
      id: `channel:${channel.id}`,
      group: channel.name,
      metaGroup: intl.formatMessage(messages.channel),
      title: intl.formatMessage(messages.price),
      width: 150,
    }),
  ),
  ...warehouses.map(
    (warehouse): AvailableColumn => ({
      id: `warehouse:${warehouse.id}`,
      group: intl.formatMessage(messages.warehouses),
      metaGroup: intl.formatMessage(messages.warehouses),
      title: warehouse.name,
      width: 150,
    }),
  ),
];

export const getStagedCreateCellContent = ({
  creates,
  columns,
  channels,
  changes,
  getChangeIndex,
}: {
  creates: ProductVariantBulkCreateInput[];
  columns: AvailableColumn[];
  channels: ChannelData[];
  changes: MutableRefObject<DatagridChange[]>;
  getChangeIndex: (column: string, row: number) => number;
}) => {
  return ([column, row]: Item): GridCell => {
    if (column < 0) {
      return textCell("");
    }

    const columnId = columns[column]?.id;
    const create = creates[row];
    const change = changes.current[getChangeIndex(columnId, row)]?.data;

    if (!columnId || !create) {
      return textCell("");
    }

    if (columnId === "name" || columnId === "sku") {
      const value = change ?? create[columnId] ?? "";

      return textCell(value || "");
    }

    const channelId = getColumnChannel(columnId);

    if (channelId) {
      const listing = create.channelListings?.find(entry => entry.channelId === channelId);
      const currency = channels.find(channel => channel.id === channelId)?.currency ?? "";
      const value = change?.value ?? listing?.price ?? null;
      const numericValue =
        value === numberCellEmptyValue || value === "" || value === null || value === undefined
          ? null
          : Number(value);

      return moneyCell(numericValue, currency);
    }

    const warehouseId = getColumnStock(columnId);

    if (warehouseId) {
      const stock = create.stocks?.find(entry => entry.warehouse === warehouseId);
      const value = change?.value ?? stock?.quantity ?? numberCellEmptyValue;

      return numberCell(value);
    }

    return textCell("");
  };
};

export const applyStagedCreateUpdate = (
  create: ProductVariantBulkCreateInput,
  update: DatagridChange,
): ProductVariantBulkCreateInput => {
  if (update.column === "name") {
    return { ...create, name: update.data || undefined };
  }

  if (update.column === "sku") {
    const sku = typeof update.data === "string" ? update.data.trim() : "";

    return { ...create, sku: sku || undefined };
  }

  const channelId = getColumnChannel(update.column);

  if (channelId) {
    const listings = [...(create.channelListings ?? [])];
    const existingIndex = listings.findIndex(listing => listing.channelId === channelId);
    const rawPrice = update.data?.value;

    if (
      rawPrice === numberCellEmptyValue ||
      rawPrice === "" ||
      rawPrice === null ||
      rawPrice === undefined
    ) {
      return {
        ...create,
        channelListings: listings.filter(listing => listing.channelId !== channelId),
      };
    }

    const nextListing = {
      channelId,
      price: String(rawPrice),
    };

    if (!Number.isFinite(Number(rawPrice))) {
      return create;
    }

    if (existingIndex >= 0) {
      listings[existingIndex] = { ...listings[existingIndex], ...nextListing };
    } else {
      listings.push(nextListing);
    }

    return { ...create, channelListings: listings };
  }

  const warehouseId = getColumnStock(update.column);

  if (warehouseId) {
    const stocks = [...(create.stocks ?? [])];
    const existingIndex = stocks.findIndex(stock => stock.warehouse === warehouseId);
    const rawQuantity = update.data?.value;

    if (rawQuantity === numberCellEmptyValue || rawQuantity === null || rawQuantity === undefined) {
      return {
        ...create,
        stocks: stocks.filter(stock => stock.warehouse !== warehouseId),
      };
    }

    const quantity = Number(rawQuantity);

    if (!Number.isFinite(quantity)) {
      return create;
    }

    const nextStock = {
      warehouse: warehouseId,
      quantity,
    };

    if (existingIndex >= 0) {
      stocks[existingIndex] = nextStock;
    } else {
      stocks.push(nextStock);
    }

    return { ...create, stocks };
  }

  return create;
};

export const applyStagedCreatesDatagridOpts = (
  creates: ProductVariantBulkCreateInput[],
  opts: DatagridChangeOpts,
): ProductVariantBulkCreateInput[] => {
  let next: ProductVariantBulkCreateInput[] = creates.map(create => ({
    ...create,
    stocks: create.stocks?.map(stock => ({ ...stock })),
    channelListings: create.channelListings?.map(listing => ({ ...listing })),
  }));

  opts.updates.forEach(update => {
    if (update.row >= 0 && update.row < next.length) {
      next[update.row] = applyStagedCreateUpdate(next[update.row], update);
    }
  });

  if (opts.removed.length > 0) {
    const removed = new Set(opts.removed);

    next = next.filter((_, index) => !removed.has(index));
  }

  return next;
};
