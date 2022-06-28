import { GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import { MoneyCell } from "@saleor/components/Datagrid/MoneyCell";
import { NumberCell } from "@saleor/components/Datagrid/NumberCell";
import { AvailableColumn } from "@saleor/components/Datagrid/types";
import { DatagridChange } from "@saleor/components/Datagrid/useDatagridChange";
import {
  ChannelFragment,
  ProductDetailsVariantFragment,
  WarehouseFragment
} from "@saleor/graphql";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";

const isStockColumn = /^stock:(.*)/;
const isChannelColumn = /^channel:(.*)/;
const isAttributeColumn = /^attribute:(.*)/;

interface GetData {
  availableColumns: AvailableColumn[];
  channels: ChannelFragment[];
  column: number;
  row: number;
  variants: ProductDetailsVariantFragment[];
  changes: MutableRefObject<DatagridChange[]>;
  getChangeIndex: (column: string, row: number) => number;
}

export function getData({
  availableColumns,
  changes,
  channels,
  column,
  getChangeIndex,
  row,
  variants
}: GetData): GridCell {
  const columnId = availableColumns[column].id;
  const common = {
    allowOverlay: true,
    readonly: false
  };
  const change = changes.current[getChangeIndex(columnId, row)]?.data;

  switch (columnId) {
    case "name":
    case "sku":
      const value = change ?? variants[row][columnId] ?? "";
      return {
        ...common,
        data: value,
        displayData: value,
        kind: GridCellKind.Text
      };
  }

  if (isStockColumn.test(columnId)) {
    const value =
      change?.value ??
      variants[row].stocks.find(
        stock => stock.warehouse.id === columnId.match(isStockColumn)[1]
      )?.quantity ??
      0;

    return {
      ...common,
      data: {
        kind: "number-cell",
        value
      },
      kind: GridCellKind.Custom,
      copyData: value.toString()
    } as NumberCell;
  }

  if (isChannelColumn.test(columnId)) {
    const channelId = columnId.match(isChannelColumn)[1];
    const listing = variants[row].channelListings.find(
      listing => listing.channel.id === channelId
    );
    const value = change?.value ?? listing?.price?.amount ?? 0;

    return {
      ...common,
      kind: GridCellKind.Custom,
      data: {
        kind: "money-cell",
        value,
        currency: channels.find(channel => channelId === channel.id)
          ?.currencyCode
      },
      copyData: value.toString()
    } as MoneyCell;
  }

  if (isAttributeColumn.test(columnId)) {
    const value =
      change ??
      variants[row].attributes
        .find(
          attribute =>
            attribute.attribute.id === columnId.match(isAttributeColumn)[1]
        )
        ?.values.map(v => v.name)
        .join(", ");

    return {
      ...common,
      data: value,
      displayData: value,
      kind: GridCellKind.Text
    };
  }
}

export function getColumnData(
  name: string,
  channels: ChannelFragment[],
  warehouses: WarehouseFragment[],
  variants: ProductDetailsVariantFragment[],
  intl: IntlShape
): AvailableColumn {
  const common = {
    id: name,
    width: 200
  };

  if (["name", "sku"].includes(name)) {
    return {
      ...common,
      title: intl.formatMessage(messages[name])
    };
  }

  if (isStockColumn.test(name)) {
    return {
      ...common,
      width: 100,
      title: warehouses.find(
        warehouse => warehouse.id === name.match(isStockColumn)[1]
      )?.name
    };
  }

  if (isChannelColumn.test(name)) {
    const channel = channels.find(
      channel => channel.id === name.match(isChannelColumn)[1]
    );
    return {
      ...common,
      width: 150,
      title: `${channel?.name} [${channel.currencyCode}]`
    };
  }

  if (isAttributeColumn.test(name)) {
    return {
      ...common,
      title: variants
        .flatMap(variant =>
          variant.attributes.map(attribute => attribute.attribute)
        )
        .find(attribute => attribute.id === name.match(isAttributeColumn)[1])
        ?.name
    };
  }

  throw new Error(`Unknown column: ${name}`);
}
