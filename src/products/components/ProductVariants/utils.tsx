import { GridCell } from "@glideapps/glide-data-grid";
import { numberCell, textCell } from "@saleor/components/Datagrid/cells";
import {
  NumberCell,
  numberCellEmptyValue,
} from "@saleor/components/Datagrid/NumberCell";
import { AvailableColumn } from "@saleor/components/Datagrid/types";
import {
  DatagridChange,
  DatagridChangeOpts,
} from "@saleor/components/Datagrid/useDatagridChange";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  VariantDatagridStockUpdateMutationVariables,
  WarehouseFragment,
} from "@saleor/graphql";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";

const isStockColumn = /^stock:(.*)/;
// const isChannelColumn = /^channel:(.*)/;
const isAttributeColumn = /^attribute:(.*)/;

export function getStocks(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridStockUpdateMutationVariables[] {
  const stockChanges = data.updates.filter(change =>
    isStockColumn.test(change.column),
  );

  return variants.map((variant, variantIndex) => {
    const variantChanges = stockChanges
      .filter(
        change =>
          change.row ===
          variantIndex + data.removed.filter(r => r <= variantIndex).length,
      )
      .map(change => ({
        warehouse: change.column.match(isStockColumn)[1],
        quantity: change.data.value,
      }));

    return {
      id: variant.id,
      stocks: variantChanges.filter(
        change => change.quantity !== numberCellEmptyValue,
      ),
      removeStocks: variantChanges
        .filter(change => change.quantity === numberCellEmptyValue)
        .map(({ warehouse }) => warehouse),
    };
  });
}

interface GetData {
  availableColumns: AvailableColumn[];
  column: number;
  row: number;
  variants: ProductDetailsVariantFragment[];
  changes: MutableRefObject<DatagridChange[]>;
  added: number[];
  removed: number[];
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
  variants,
}: GetData): GridCell {
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

  if (isStockColumn.test(columnId)) {
    const value =
      change?.value ??
      dataRow?.stocks.find(
        stock => stock.warehouse.id === columnId.match(isStockColumn)[1],
      )?.quantity ??
      numberCellEmptyValue;

    return numberCell(value);
  }

  // TODO: We'll add channels later
  // if (isChannelColumn.test(columnId)) {
  //   const channelId = columnId.match(isChannelColumn)[1];
  //   const listing = dataRow?.channelListings.find(
  //     listing => listing.channel.id === channelId,
  //   );
  //   const currency = channels.find(channel => channelId === channel.id)
  //     ?.currencyCode;
  //   const value = change?.value ?? listing?.price?.amount ?? 0;

  //   return moneyCell(value, currency);
  // }

  if (isAttributeColumn.test(columnId)) {
    const value =
      change ??
      dataRow?.attributes
        .find(
          attribute =>
            attribute.attribute.id === columnId.match(isAttributeColumn)[1],
        )
        ?.values.map(v => v.name)
        .join(", ") ??
      "";

    return textCell(value || "");
  }
}

export function getColumnData(
  name: string,
  // channels: ChannelData[],
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

  if (isStockColumn.test(name)) {
    return {
      ...common,
      width: 100,
      title: warehouses.find(
        warehouse => warehouse.id === name.match(isStockColumn)[1],
      )?.name,
    };
  }

  // if (isChannelColumn.test(name)) {
  //   const channel = channels.find(
  //     channel => channel.id === name.match(isChannelColumn)[1],
  //   );
  //   return {
  //     ...common,
  //     width: 150,
  //     title: `${channel?.name} [${channel.currency}]`,
  //   };
  // }

  if (isAttributeColumn.test(name)) {
    return {
      ...common,
      title: variantAttributes.find(
        attribute => attribute.id === name.match(isAttributeColumn)[1],
      )?.name,
    };
  }

  throw new Error(`Unknown column: ${name}`);
}
