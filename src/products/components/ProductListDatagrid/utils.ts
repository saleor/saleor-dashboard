import {
  booleanCell,
  dropdownCell,
  textCell,
} from "@dashboard/components/Datagrid/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import {
  DropdownChoice,
  emptyDropdownCellValue,
} from "@dashboard/components/Datagrid/DropdownCell";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";

export function getColumns(channels: ChannelFragment[]): AvailableColumn[] {
  return [
    {
      id: "name",
      title: "Produt name",
      width: 250,
    },
    {
      id: "productType",
      title: "Product type",
      width: 250,
    },
    ...(channels ?? []).map(channel => ({
      id: `channel:${channel.id}`,
      title: channel.name,
      width: 250,
    })),
  ];
}

export function createGetCellContent(
  columns: AvailableColumn[],
  products: RelayToFlat<ProductListQuery["products"]>,
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

    if (columnId === "productType") {
      return getProductTypeCellContent(change, rowData);
    }

    if (columnId.startsWith("channel")) {
      return getChannelCellContent(columnId, change, rowData);
    }

    const value = change ?? rowData?.[columnId] ?? "";
    return textCell(value || "");
  };
}

function getProductTypeCellContent(
  change: { value: DropdownChoice },
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const value =
    change?.value ?? {
      label: rowData?.productType?.name,
      value: rowData?.productType?.id,
    } ??
    emptyDropdownCellValue;

  return dropdownCell(value, {
    allowCustomValues: false,
    emptyOption: false,
    choices: [
      { label: "Bear", value: "UHJvZHVjdFR5cGU6MTE=" },
      { label: "Cushion", value: "UHJvZHVjdFR5cGU6MTI=" },
      { label: "Audiobook", value: "UHJvZHVjdFR5cGU6MTU=" },
      { label: "Juice", value: "UHJvZHVjdFR5cGU6OQ==" },
      { label: "Music", value: "UHJvZHVjdFR5cGU6OA==" },
    ],
  });
}

function getChannelCellContent(
  columnId: string,
  change: boolean,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const channelId = columnId.split(":")[1];
  const selectedChannel = rowData.channelListings.find(
    chan => chan.channel.id === channelId,
  );

  return booleanCell(change ?? !!selectedChannel ?? false);
}
