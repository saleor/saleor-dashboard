import { GridCell } from "@glideapps/glide-data-grid";
import { ChannelData } from "@saleor/channels/utils";
import {
  moneyCell,
  numberCell,
  textCell,
} from "@saleor/components/Datagrid/cells";
import { numberCellEmptyValue } from "@saleor/components/Datagrid/NumberCell";
import { AvailableColumn } from "@saleor/components/Datagrid/types";
import {
  DatagridChange,
  DatagridChangeOpts,
} from "@saleor/components/Datagrid/useDatagridChange";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutationVariables,
  WarehouseFragment,
} from "@saleor/graphql";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";

const isStockColumn = /^stock:(.*)/;
const isChannelColumn = /^channel:(.*)/;
const isAttributeColumn = /^attribute:(.*)/;

export function getColumnChannel(column: string): string | null {
  if (!isChannelColumn.test(column)) {
    return null;
  }

  return column.match(isChannelColumn)[1];
}

export function getVariantInputs(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridUpdateMutationVariables[] {
  const attributeChanges = data.updates.filter(change =>
    isAttributeColumn.test(change.column),
  );
  const skuChanges = data.updates.filter(change => change.column === "sku");

  return variants
    .map(
      (variant, variantIndex): VariantDatagridUpdateMutationVariables => {
        const sku = skuChanges.find(
          change =>
            change.row ===
            variantIndex + data.removed.filter(r => r <= variantIndex).length,
        )?.data;

        const attributes = attributeChanges
          .filter(
            change =>
              change.row ===
              variantIndex + data.removed.filter(r => r <= variantIndex).length,
          )
          .map(change => {
            const attributeId = change.column.match(isAttributeColumn)[1];

            return {
              id: attributeId,
              values: [change.data],
            };
          });

        return {
          id: variant.id,
          input: {
            attributes,
            sku,
          },
        };
      },
    )
    .filter(
      variables => variables.input.sku || variables.input.attributes.length > 0,
    );
}

export function getStocks(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridStockUpdateMutationVariables[] {
  const stockChanges = data.updates.filter(change =>
    isStockColumn.test(change.column),
  );

  return variants
    .map((variant, variantIndex) => {
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
    })
    .filter(
      variables =>
        variables.removeStocks.length > 0 || variables.stocks.length > 0,
    );
}

interface GetData {
  availableColumns: AvailableColumn[];
  column: number;
  row: number;
  variants: ProductDetailsVariantFragment[];
  changes: MutableRefObject<DatagridChange[]>;
  channels: ChannelData[];
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
  channels,
  variants,
}: GetData): GridCell {
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

  if (isStockColumn.test(columnId)) {
    const value =
      change?.value ??
      dataRow?.stocks.find(
        stock => stock.warehouse.id === columnId.match(isStockColumn)[1],
      )?.quantity ??
      numberCellEmptyValue;

    return numberCell(value);
  }

  if (getColumnChannel(columnId)) {
    const channelId = getColumnChannel(columnId);
    const listing = dataRow?.channelListings.find(
      listing => listing.channel.id === channelId,
    );
    const currency = channels.find(channel => channelId === channel.id)
      ?.currency;
    const value = change?.value ?? listing?.price?.amount ?? 0;

    return moneyCell(value, currency);
  }

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

  if (isStockColumn.test(name)) {
    return {
      ...common,
      width: 100,
      title: warehouses.find(
        warehouse => warehouse.id === name.match(isStockColumn)[1],
      )?.name,
    };
  }

  if (getColumnChannel(name)) {
    const channel = channels.find(
      channel => channel.id === getColumnChannel(name),
    );
    return {
      ...common,
      width: 150,
      title: `${channel?.name} [${channel.currency}]`,
    };
  }

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
