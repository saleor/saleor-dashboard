import {
  AvailableColumn,
  DatagridCell
} from "@saleor/components/Datagrid/types";
import {
  ChannelFragment,
  ProductDetailsVariantFragment
} from "@saleor/graphql";
import { IntlShape } from "react-intl";

import messages from "./messages";

const isStockColumn = /^stock:(.*)/;
const isChannelColumn = /^channel:(.*)/;
const isAttributeColumn = /^attribute:(.*)/;

interface GetData {
  channels: ChannelFragment[];
  column: string;
  variant: ProductDetailsVariantFragment;
}

export function getData({ channels, column, variant }: GetData): DatagridCell {
  switch (column) {
    case "name":
      return {
        id: variant.id,
        value: variant[column]?.toString() ?? "",
        column,
        readOnly: true,
        type: "string"
      };
    case "sku":
      return {
        id: variant.id,
        value: variant[column]?.toString() ?? "",
        column,
        type: "string"
      };
  }

  if (isStockColumn.test(column)) {
    return {
      column,
      id: variant.id,
      value: variant.stocks
        .find(stock => stock.warehouse.id === column.match(isStockColumn)[1])
        ?.quantity.toString(),
      type: "number",
      min: 0
    };
  }

  if (isChannelColumn.test(column)) {
    const channelId = column.match(isChannelColumn)[1];
    const listing = variant.channelListings.find(
      listing => listing.channel.id === channelId
    );

    return {
      column,
      id: variant.id,
      value: listing?.price?.amount.toString() ?? "",
      type: "moneyToggle",
      toggled: !!listing,
      currency: channels.find(channel => channelId === channel.id)?.currencyCode
    };
  }

  if (isAttributeColumn.test(column)) {
    return {
      column,
      id: variant.id,
      readOnly: true,
      value: variant.attributes
        .find(
          attribute =>
            attribute.attribute.id === column.match(isAttributeColumn)[1]
        )
        ?.values.map(v => v.name)
        .join(", "),
      type: "string"
    };
  }
}

export function getColumnData(
  name: string,
  variants: ProductDetailsVariantFragment[],
  intl: IntlShape
): AvailableColumn {
  const common = {
    value: name
  };

  if (["name", "sku"].includes(name)) {
    return {
      ...common,
      label: intl.formatMessage(messages[name]),
      type: "string"
    };
  }

  if (isStockColumn.test(name)) {
    return {
      ...common,
      label: variants
        .flatMap(variant => variant.stocks.map(stock => stock.warehouse))
        .find(warehouse => warehouse.id === name.match(isStockColumn)[1])?.name,
      type: "number"
    };
  }

  if (isChannelColumn.test(name)) {
    return {
      ...common,
      label: variants
        .flatMap(variant =>
          variant.channelListings.map(listing => listing.channel)
        )
        .find(channel => channel.id === name.match(isChannelColumn)[1])?.name,
      type: "moneyToggle"
    };
  }

  if (isAttributeColumn.test(name)) {
    return {
      ...common,
      label: variants
        .flatMap(variant =>
          variant.attributes.map(attribute => attribute.attribute)
        )
        .find(attribute => attribute.id === name.match(isAttributeColumn)[1])
        ?.name,
      type: "string"
    };
  }

  throw new Error(`Unknown column: ${name}`);
}
