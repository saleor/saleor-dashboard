import { GridCell } from "@glideapps/glide-data-grid";
import { ChannelData } from "@saleor/channels/utils";
import {
  booleanCell,
  dropdownCell,
  moneyCell,
  numberCell,
  textCell,
} from "@saleor/components/Datagrid/cells";
import { emptyDropdownCellValue } from "@saleor/components/Datagrid/DropdownCell";
import { numberCellEmptyValue } from "@saleor/components/Datagrid/NumberCell";
import { AvailableColumn } from "@saleor/components/Datagrid/types";
import {
  DatagridChange,
  DatagridChangeOpts,
} from "@saleor/components/Datagrid/useDatagridChange";
import { Choice } from "@saleor/components/SingleSelectField";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  VariantDatagridChannelListingUpdateMutationVariables,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutationVariables,
  WarehouseFragment,
} from "@saleor/graphql";
import { ProductVariantListError } from "@saleor/products/views/ProductUpdate/handlers/errors";
import { mapNodeToChoice } from "@saleor/utils/maps";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import {
  getColumnAttribute,
  getColumnChannel,
  getColumnChannelAvailability,
  getColumnStock,
} from "./datagrid/columnData";
import { getVariantChannelsInputs } from "./datagrid/getVariantChannelsInputs";
import messages from "./messages";

export function getVariantInput(data: DatagridChangeOpts, index: number) {
  const attributes = data.updates
    .filter(
      change =>
        getColumnAttribute(change.column) &&
        change.row === index + data.removed.filter(r => r <= index).length,
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
      change.column === "sku" &&
      change.row === index + data.removed.filter(r => r <= index).length,
  )?.data;

  const name = data.updates.find(
    change =>
      change.column === "name" &&
      change.row === index + data.removed.filter(r => r <= index).length,
  )?.data;

  return {
    attributes,
    sku,
    name,
  };
}

export function getVariantInputs(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridUpdateMutationVariables[] {
  return variants
    .map(
      (variant, variantIndex): VariantDatagridUpdateMutationVariables => ({
        id: variant.id,
        input: getVariantInput(data, variantIndex),
      }),
    )
    .filter(
      variables =>
        variables.input.sku ||
        variables.input.name ||
        variables.input.attributes.length > 0,
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

function errorMatchesColumn(
  error: ProductVariantListError,
  columnId: string,
): boolean {
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
    return columnId === "sku";
  }
}

export function getError(
  errors: ProductVariantListError[],
  { availableColumns, removed, column, row, variants }: GetDataOrError,
): boolean {
  if (column === -1) {
    return false;
  }

  const columnId = availableColumns[column].id;
  const variantId = variants[row + removed.filter(r => r <= row).length]?.id;

  if (!variantId) {
    return errors.some(
      err => err.type === "create" && err.index === row - variants.length,
    );
  }

  return errors.some(
    err =>
      err.type !== "create" &&
      err.variantId === variantId &&
      errorMatchesColumn(err, columnId),
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
  searchAttributeValues: (
    id: string,
    text: string,
  ) => Promise<Array<Choice<string, string>>>;
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

  const columnId = availableColumns[column].id;
  const change = changes.current[getChangeIndex(columnId, row)]?.data;
  const dataRow = added.includes(row)
    ? undefined
    : variants[row + removed.filter(r => r <= row).length];

  switch (columnId) {
    case "name":
    case "sku":
      const value = change ?? (dataRow ? dataRow[columnId] : "");
      return textCell(value || "");
  }

  if (getColumnStock(columnId)) {
    const value =
      change?.value ??
      dataRow?.stocks.find(
        stock => stock.warehouse.id === getColumnStock(columnId),
      )?.quantity ??
      numberCellEmptyValue;

    return numberCell(value);
  }

  if (getColumnChannel(columnId)) {
    const channelId = getColumnChannel(columnId);
    const listing = dataRow?.channelListings.find(
      listing => listing.channel.id === channelId,
    );
    const available =
      changes.current[getChangeIndex(`availableInChannel:${channelId}`, row)]
        ?.data ?? !!listing;

    if (!available) {
      return {
        ...numberCell(numberCellEmptyValue),
        readonly: false,
        allowOverlay: false,
      };
    }

    const currency = channels.find(channel => channelId === channel.id)
      ?.currency;
    const value = change?.value ?? listing?.price?.amount ?? 0;

    return moneyCell(value, currency);
  }

  if (getColumnChannelAvailability(columnId)) {
    const channelId = getColumnChannelAvailability(columnId);
    const listing = dataRow?.channelListings.find(
      listing => listing.channel.id === channelId,
    );
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
      title: warehouses.find(warehouse => warehouse.id === getColumnStock(name))
        ?.name,
      group: intl.formatMessage(messages.warehouses),
    };
  }

  if (getColumnChannel(name)) {
    const channel = channels.find(
      channel => channel.id === getColumnChannel(name),
    );
    return {
      ...common,
      width: 150,
      title: intl.formatMessage(messages.price),
      group: channel.name,
    };
  }

  if (getColumnChannelAvailability(name)) {
    const channel = channels.find(
      channel => channel.id === getColumnChannelAvailability(name),
    );
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
      title: variantAttributes.find(
        attribute => attribute.id === getColumnAttribute(name),
      )?.name,
      group: intl.formatMessage(messages.attributes),
    };
  }

  throw new Error(`Unknown column: ${name}`);
}
