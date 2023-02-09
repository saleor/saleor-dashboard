import {
  booleanCell,
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
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { RelayToFlat } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

export function getColumns(
  channels: ChannelFragment[],
  intl: IntlShape,
): AvailableColumn[] {
  return [
    {
      id: "name",
      title: intl.formatMessage(commonMessages.name),
      width: 300,
    },
    {
      id: "productType",
      title: intl.formatMessage(commonMessages.type),
      width: 200,
    },
    {
      id: "description",
      title: intl.formatMessage(commonMessages.description),
      width: 400,
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
  getProductTypes: (query: string) => Promise<DropdownChoice[]>,
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
      return getProductTypeCellContent(change, rowData, getProductTypes);
    }

    if (columnId.startsWith("channel")) {
      return getChannelCellContent(columnId, change, rowData);
    }

    if (columnId === "description") {
      return getDescriptionCellContent(columnId, change, rowData);
    }

    if (columnId === "name") {
      return getNameCellContent(change, rowData);
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
  const value =
    change?.value ?? getRowDataValue(rowData) ?? emptyDropdownCellValue;

  return dropdownCell(value, {
    allowCustomValues: false,
    emptyOption: false,
    update: (text: string) => getProductTypes(value.label !== text ? text : ""),
  });
}

function getRowDataValue(
  rowData?: RelayToFlat<ProductListQuery["products"]>[number],
): DropdownChoice {
  if (!rowData) {
    return undefined;
  }

  return {
    label: rowData.productType?.name,
    value: rowData.productType?.id,
  };
}

function getChannelCellContent(
  columnId: string,
  change: boolean,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const channelId = columnId.split(":")[1];
  const selectedChannel = rowData?.channelListings.find(
    chan => chan.channel.id === channelId,
  );

  return booleanCell(change ?? !!selectedChannel ?? false);
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
