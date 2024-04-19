// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import {
  booleanCell,
  dropdownCell,
  moneyCell,
  numberCell,
  textCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { emptyDropdownCellValue } from "@dashboard/components/Datagrid/customCells/DropdownCell";
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Choice } from "@dashboard/components/SingleSelectField";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  WarehouseFragment,
} from "@dashboard/graphql";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { GridCell } from "@glideapps/glide-data-grid";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import {
  getColumnAttribute,
  getColumnChannel,
  getColumnChannelAvailability,
  getColumnName,
  getColumnStock,
} from "../../utils/datagrid";
import messages from "./messages";

function errorMatchesColumn(error: ProductVariantListError, columnId: string): boolean {
  if (error.type === "channel") {
    return (
      error.channelIds.includes(getColumnChannel(columnId)) ||
      error.channelIds.includes(getColumnChannelAvailability(columnId))
    );
  }

  if (error.type === "stock") {
    return error.warehouseId.includes(getColumnStock(columnId));
  }

  if (error.type === "variantData") {
    if (error.attributes?.length > 0) {
      return error.attributes.includes(getColumnAttribute(columnId));
    }

    return error?.field?.includes(getColumnName(columnId)) ?? false;
  }
}

export function getError(
  errors: ProductVariantListError[],
  { availableColumns, removed, column, row, variants }: GetDataOrError,
): boolean {
  if (column === -1) {
    return false;
  }

  const columnId = availableColumns[column]?.id;
  const variantId = variants[row + removed.filter(r => r <= row).length]?.id;

  if (!variantId) {
    return errors.some(err => err.type === "create" && err.index === row - variants.length);
  }

  return errors.some(
    err =>
      err.type !== "create" && err.variantId === variantId && errorMatchesColumn(err, columnId),
  );
}

interface GetDataOrError {
  availableColumns: AvailableColumn[];
  column: number;
  row: number;
  variants: ProductDetailsVariantFragment[];
  changes: MutableRefObject<DatagridChange[]>;
  channels: ChannelData[];
  added: number[];
  removed: number[];
  searchAttributeValues: (id: string, text: string) => Promise<Array<Choice<string, string>>>;
  getChangeIndex: (column: string, row: number) => number;
}

export function getData({
  availableColumns,
  changes,
  added,
  removed,
  column,
  getChangeIndex,
  row,
  channels,
  variants,
  searchAttributeValues,
}: GetDataOrError): GridCell {
  // For some reason it happens when user deselects channel
  if (column === -1) {
    return textCell("");
  }

  const columnId = availableColumns[column]?.id;
  const change = changes.current[getChangeIndex(columnId, row)]?.data;
  const dataRow = added.includes(row)
    ? undefined
    : variants.filter((_, index) => !removed.includes(index))[row];

  switch (columnId) {
    case "name":
    case "sku": {
      const value = change ?? (dataRow ? dataRow[columnId] : "");

      return textCell(value || "");
    }
  }

  if (getColumnStock(columnId)) {
    const value =
      change?.value ??
      dataRow?.stocks.find(stock => stock.warehouse.id === getColumnStock(columnId))?.quantity ??
      numberCellEmptyValue;

    return numberCell(value);
  }

  if (getColumnChannel(columnId)) {
    const channelId = getColumnChannel(columnId);
    const listing = dataRow?.channelListings.find(listing => listing.channel.id === channelId);
    const available =
      changes.current[getChangeIndex(`availableInChannel:${channelId}`, row)]?.data ?? !!listing;

    if (!available) {
      return {
        ...numberCell(numberCellEmptyValue, { hasFloatingPoint: true }),
        readonly: false,
        allowOverlay: false,
      };
    }

    const currency = channels.find(channel => channelId === channel.id)?.currency;
    const value = change?.value ?? listing?.price?.amount ?? 0;

    return moneyCell(value, currency);
  }

  if (getColumnChannelAvailability(columnId)) {
    const channelId = getColumnChannelAvailability(columnId);
    const listing = dataRow?.channelListings.find(listing => listing.channel.id === channelId);
    const value = change ?? !!listing;

    return booleanCell(value);
  }

  if (getColumnAttribute(columnId)) {
    const value =
      change?.value ??
      mapNodeToChoice(
        dataRow?.attributes.find(
          attribute => attribute.attribute.id === getColumnAttribute(columnId),
        )?.values,
      )[0] ??
      emptyDropdownCellValue;

    return dropdownCell(value, {
      allowCustomValues: true,
      emptyOption: true,
      update: text => searchAttributeValues(getColumnAttribute(columnId), text),
    });
  }
}

export function getColumnData(
  name: string,
  channels: ChannelData[],
  warehouses: WarehouseFragment[],
  variantAttributes: ProductFragment["productType"]["variantAttributes"],
  intl: IntlShape,
): AvailableColumn {
  const common = {
    id: name,
    width: 200,
    // Now we don't weirdly merge top-left header with the frozen column (name),
    // leaving rest unnamed group columns (sku in this case) unmerged
    group: " ",
  };

  if (["name", "sku"].includes(name)) {
    return {
      ...common,
      title: intl.formatMessage(messages[name]),
    };
  }

  if (getColumnStock(name)) {
    return {
      ...common,
      width: 100,
      title: warehouses.find(warehouse => warehouse.id === getColumnStock(name))?.name,
      group: intl.formatMessage(messages.warehouses),
    };
  }

  if (getColumnChannel(name)) {
    const channel = channels.find(channel => channel.id === getColumnChannel(name));

    return {
      ...common,
      width: 150,
      title: intl.formatMessage(messages.price),
      group: channel.name,
    };
  }

  if (getColumnChannelAvailability(name)) {
    const channel = channels.find(channel => channel.id === getColumnChannelAvailability(name));

    return {
      ...common,
      width: 80,
      title: intl.formatMessage(messages.available),
      group: channel.name,
    };
  }

  if (getColumnAttribute(name)) {
    return {
      ...common,
      title: variantAttributes.find(attribute => attribute.id === getColumnAttribute(name))?.name,
      group: intl.formatMessage(messages.attributes),
    };
  }

  throw new Error(`Unknown column: ${name}`);
}
