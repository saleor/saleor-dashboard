import { GridCell } from "@glideapps/glide-data-grid";
import { ChannelData } from "@saleor/channels/utils";
import {
  booleanCell,
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
  ProductVariantChannelListingAddInput,
  VariantDatagridChannelListingUpdateMutationVariables,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutationVariables,
  WarehouseFragment,
} from "@saleor/graphql";
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

export function getVariantInputs(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridUpdateMutationVariables[] {
  const attributeChanges = data.updates.filter(change =>
    getColumnAttribute(change.column),
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
            const attributeId = getColumnAttribute(change.column);

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
    getColumnStock(change.column),
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
          warehouse: getColumnStock(change.column),
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

export function getVariantChannels(
  variants: ProductFragment["variants"],
  data: DatagridChangeOpts,
): VariantDatagridChannelListingUpdateMutationVariables[] {
  const channelChanges = data.updates.filter(change =>
    getColumnChannel(change.column),
  );

  return variants
    .map((variant, variantIndex) => {
      const variantChanges = channelChanges
        .filter(
          change =>
            change.row ===
            variantIndex + data.removed.filter(r => r <= variantIndex).length,
        )
        .map<ProductVariantChannelListingAddInput>(change => ({
          channelId: getColumnChannel(change.column),
          price: change.data.value,
        }));

      return {
        id: variant.id,
        input: variantChanges.filter(
          change => change.price !== numberCellEmptyValue,
        ),
      };
    })
    .filter(({ input }) => input.length > 0);
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

  const styled = (props: GridCell) => ({
    ...props,
    themeOverride:
      change !== undefined
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
      change ??
      dataRow?.attributes
        .find(
          attribute => attribute.attribute.id === getColumnAttribute(columnId),
        )
        ?.values.map(v => v.name)
        .join(", ") ??
      "";

    return styled(textCell(value || ""));
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
      title: `Price in ${channel.name} [${channel.currency}]`,
    };
  }

  if (getColumnChannelAvailability(name)) {
    const channel = channels.find(
      channel => channel.id === getColumnChannelAvailability(name),
    );
    return {
      ...common,
      width: 80,
      title: `Available in ${channel.name}`,
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
