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
  ProductVariantChannelListingAddInput,
  VariantDatagridChannelListingUpdateMutationVariables,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutationVariables,
  WarehouseFragment,
} from "@saleor/graphql";
import { ProductVariantListError } from "@saleor/products/views/ProductUpdate/handlers/errors";
import { mapNodeToChoice } from "@saleor/utils/maps";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";

export function makeGetColumnData(
  regexp: RegExp,
): (column: string) => string | null {
  return column => {
    if (!regexp.test(column)) {
      return null;
    }

    return column.match(regexp)[1];
  };
}

export const getColumnAttribute = makeGetColumnData(/^attribute:(.*)/);
export const getColumnChannel = makeGetColumnData(/^channel:(.*)/);
export const getColumnChannelAvailability = makeGetColumnData(
  /^availableInChannel:(.*)/,
);
export const getColumnStock = makeGetColumnData(/^stock:(.*)/);

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

  return {
    attributes,
    sku,
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
      variables => variables.input.sku || variables.input.attributes.length > 0,
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

export function getVariantChannelsInputs(
  data: DatagridChangeOpts,
  index: number,
) {
  return data.updates
    .filter(change => getColumnChannel(change.column))
    .filter(
      change =>
        change.row === index + data.removed.filter(r => r <= index).length,
    )
    .map<ProductVariantChannelListingAddInput>(change => ({
      channelId: getColumnChannel(change.column),
      price: change.data.value,
    }))
    .filter(change => change.price !== numberCellEmptyValue);
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

  const styled = (props: GridCell) => ({
    ...props,
    themeOverride:
      change !== undefined || dataRow === undefined
        ? {
            bgCell: "#C1DBFF",
          }
        : {},
  });

  switch (columnId) {
    case "name":
    case "sku":
      const value = change ?? (dataRow ? dataRow[columnId] : "");
      return styled(textCell(value || ""));
  }

  if (getColumnStock(columnId)) {
    const value =
      change?.value ??
      dataRow?.stocks.find(
        stock => stock.warehouse.id === getColumnStock(columnId),
      )?.quantity ??
      numberCellEmptyValue;

    return styled(numberCell(value));
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
      return styled({
        ...numberCell(numberCellEmptyValue),
        readonly: true,
        allowOverlay: false,
      });
    }

    const currency = channels.find(channel => channelId === channel.id)
      ?.currency;
    const value = change?.value ?? listing?.price?.amount ?? 0;

    return styled(moneyCell(value, currency));
  }

  if (getColumnChannelAvailability(columnId)) {
    const channelId = getColumnChannelAvailability(columnId);
    const listing = dataRow?.channelListings.find(
      listing => listing.channel.id === channelId,
    );
    const value = change ?? !!listing;

    return styled(booleanCell(value));
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

    return styled(
      dropdownCell(value, {
        allowCustomValues: true,
        emptyOption: true,
        update: text =>
          searchAttributeValues(getColumnAttribute(columnId), text),
      }),
    );
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
    };
  }

  if (getColumnChannel(name)) {
    const channel = channels.find(
      channel => channel.id === getColumnChannel(name),
    );
    return {
      ...common,
      width: 150,
      title: intl.formatMessage(messages.priceIn, {
        channelName: channel.name,
      }),
    };
  }

  if (getColumnChannelAvailability(name)) {
    const channel = channels.find(
      channel => channel.id === getColumnChannelAvailability(name),
    );
    return {
      ...common,
      width: 80,
      title: intl.formatMessage(messages.availableIn, {
        channelName: channel.name,
      }),
    };
  }

  if (getColumnAttribute(name)) {
    return {
      ...common,
      title: variantAttributes.find(
        attribute => attribute.id === getColumnAttribute(name),
      )?.name,
    };
  }

  throw new Error(`Unknown column: ${name}`);
}
