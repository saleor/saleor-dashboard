import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
import { getChannelAvailabilityLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import {
  dropdownCell,
  readonlyTextCell,
  textCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import {
  DropdownChoice,
  emptyDropdownCellValue,
} from "@dashboard/components/Datagrid/DropdownCell";
import { ThumbnailCellProps } from "@dashboard/components/Datagrid/ThumbnailCell";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { getMoneyRange } from "@dashboard/components/MoneyRange";
import { ProductListQuery } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import moment from "moment-timezone";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export function getColumns(
  intl: IntlShape,
  sort: Sort<ProductListUrlSortField>,
): AvailableColumn[] {
  return [
    {
      id: "name",
      title: intl.formatMessage(commonMessages.name),
      width: 350,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.name),
    },
    {
      id: "productType",
      title: intl.formatMessage(columnsMessages.type),
      width: 200,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.productType),
    },
    {
      id: "description",
      title: intl.formatMessage(commonMessages.description),
      width: 400,
    },
    {
      id: "status",
      title: intl.formatMessage(columnsMessages.availability),
      width: 250,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.status),
    },
    {
      id: "date",
      title: intl.formatMessage(columnsMessages.updatedAt),
      width: 250,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.date),
    },
    {
      id: "price",
      title: intl.formatMessage(columnsMessages.price),
      width: 250,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.price),
    },
  ];
}

function getColumnSortIconName(
  { sort, asc }: Sort<ProductListUrlSortField>,
  columnName: ProductListUrlSortField,
) {
  if (columnName === sort) {
    if (asc) {
      return "arrowUp";
    } else {
      return "arrowDown";
    }
  }

  return undefined;
}

export function createGetCellContent(
  columns: AvailableColumn[],
  products: RelayToFlat<ProductListQuery["products"]>,
  intl: IntlShape,
  getProductTypes: (query: string) => Promise<DropdownChoice[]>,
  locale: Locale,
  selectedChannelId?: string,
) {
  return (
    [column, row]: Item,
    { changes, getChangeIndex, added, removed }: GetCellContentOpts,
  ) => {
    const columnId = columns[column].id;
    const change = changes.current[getChangeIndex(columnId, row)]?.data;
    const rowData = added.includes(row)
      ? undefined
      : products[row + removed.filter(r => r <= row).length];

    const channel = rowData?.channelListings?.find(
      listing => listing.channel.id === selectedChannelId,
    );

    switch (columnId) {
      case "productType":
        return getProductTypeCellContent(change, rowData, getProductTypes);

      case "status":
        return getStatusCellContent(rowData, intl, channel);

      case "description":
        return getDescriptionCellContent(columnId, change, rowData);
      case "name":
        return getNameCellContent(change, rowData);
      case "price":
        return getPriceCellContent(intl, locale, channel);
      case "date":
        return getUpdatedAtrCellContent(rowData, locale);
    }

    const value = change ?? rowData?.[columnId] ?? "";
    return textCell(value || "");
  };
}

function getProductTypeCellContent(
  change: { value: DropdownChoice },
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
  getProductTypes: (query: string) => Promise<DropdownChoice[]>,
) {
  const value = change?.value ?? getRowDataValue(rowData, change?.value);

  return dropdownCell(value, {
    allowCustomValues: false,
    emptyOption: false,
    update: (text: string) => getProductTypes(value.label !== text ? text : ""),
  });
}

function getRowDataValue(
  rowData?: RelayToFlat<ProductListQuery["products"]>[number],
  changeValue?: DropdownChoice,
): DropdownChoice {
  if (changeValue === null) {
    return emptyDropdownCellValue;
  }

  return {
    label: rowData.productType?.name,
    value: rowData.productType?.id,
  };
}

function getStatusCellContent(
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
  intl: IntlShape,
  selectedChannnel?: RelayToFlat<
    ProductListQuery["products"]
  >[number]["channelListings"][number],
) {
  if (!!selectedChannnel) {
    return readonlyTextCell(
      intl.formatMessage(getChannelAvailabilityLabel(selectedChannnel)),
    );
  }

  return readonlyTextCell(
    rowData?.channelListings?.length
      ? intl.formatMessage(messages.dropdownLabel, {
          channelCount: rowData?.channelListings?.length,
        })
      : intl.formatMessage(messages.noChannels),
  );
}

function getDescriptionCellContent(
  columnId: string,
  change: boolean,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const value = change ?? rowData?.[columnId] ?? "";

  if (!value) {
    return readonlyTextCell("");
  }

  const parsed = JSON.parse(value);

  if (parsed) {
    const descriptionFirstParagraph = parsed.blocks.find(
      block => block.type === "paragraph",
    );
    if (descriptionFirstParagraph) {
      return readonlyTextCell(descriptionFirstParagraph.data.text);
    }
  }

  return readonlyTextCell(value || "");
}

function getNameCellContent(
  change: ThumbnailCellProps,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const name = change?.name ?? rowData?.name ?? "";
  return thumbnailCell(name, rowData?.thumbnail?.url ?? "");
}

function getPriceCellContent(
  intl: IntlShape,
  locale: Locale,
  selectedChannnel?: RelayToFlat<
    ProductListQuery["products"]
  >[number]["channelListings"][number],
) {
  const from = selectedChannnel?.pricing?.priceRange?.start?.net;
  const to = selectedChannnel?.pricing?.priceRange?.stop?.net;

  return readonlyTextCell(getMoneyRange(locale, intl, from, to));
}

function getUpdatedAtrCellContent(
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
  locale: Locale,
) {
  return readonlyTextCell(
    moment(rowData.updatedAt).locale(locale).format("lll"),
  );
}
