import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
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
import { ProductListQuery } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

export function getColumns(
  intl: IntlShape,
  sort: Sort<ProductListUrlSortField>,
): AvailableColumn[] {
  return [
    {
      id: "name",
      title: intl.formatMessage(commonMessages.name),
      width: 300,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.name),
    },
    {
      id: "productType",
      title: intl.formatMessage(commonMessages.type),
      width: 200,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.productType),
    },
    {
      id: "description",
      title: intl.formatMessage(commonMessages.description),
      width: 400,
    },
    {
      id: "availability",
      title: intl.formatMessage(commonMessages.availability),
      width: 250,
    },
  ];
}

function getColumnSortIconName(
  sort: Sort<ProductListUrlSortField>,
  columnName: ProductListUrlSortField,
) {
  if (columnName === sort.sort) {
    if (sort.asc) {
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

    if (columnId === "availability") {
      return getAvailabilityCellContent(rowData, intl);
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

function getAvailabilityCellContent(
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
  intl: IntlShape,
) {
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
