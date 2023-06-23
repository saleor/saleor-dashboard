// @ts-strict-ignore
import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
import { getChannelAvailabilityLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import {
  dropdownCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import {
  DropdownChoice,
  emptyDropdownCellValue,
} from "@dashboard/components/Datagrid/customCells/DropdownCell";
import { ThumbnailCellProps } from "@dashboard/components/Datagrid/customCells/ThumbnailCell";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { getMoneyRange } from "@dashboard/components/MoneyRange";
import { ProductListColumns } from "@dashboard/config";
import { GridAttributesQuery, ProductListQuery } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getDatagridRowDataIndex } from "@dashboard/misc";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { Item } from "@glideapps/glide-data-grid";
import moment from "moment-timezone";
import { IntlShape } from "react-intl";

import { getAttributeIdFromColumnValue } from "../ProductListPage/utils";
import { columnsMessages } from "./messages";

interface GetColumnsProps {
  intl: IntlShape;
  sort: Sort<ProductListUrlSortField>;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  gridAttributesFromSettings: ProductListColumns[];
  activeAttributeSortId: string;
}

export function getColumns({
  intl,
  sort,
  gridAttributes,
  gridAttributesFromSettings,
  activeAttributeSortId,
}: GetColumnsProps): AvailableColumn[] {
  return [
    {
      id: "name",
      title: intl.formatMessage(commonMessages.product),
      width: 300,
      icon: getColumnSortDirectionIcon(sort, ProductListUrlSortField.name),
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
      id: "availability",
      title: intl.formatMessage(columnsMessages.availability),
      width: 250,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.availability),
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
    ...gridAttributesFromSettings.map(
      toAttributeColumnData(gridAttributes, activeAttributeSortId, sort),
    ),
  ];
}

export function toAttributeColumnData(
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>,
  activeAttributeSortId: string,
  sort: Sort<ProductListUrlSortField>,
) {
  return (attribute: ProductListColumns) => {
    const attributeId = getAttributeIdFromColumnValue(attribute);

    const title =
      gridAttributes.find(gridAttribute => attributeId === gridAttribute.id)
        ?.name ?? "";

    return {
      id: attribute,
      title,
      width: 200,
      icon:
        attributeId === activeAttributeSortId &&
        getColumnSortDirectionIcon(sort, ProductListUrlSortField.attribute),
    };
  };
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

interface GetCellContentProps {
  columns: AvailableColumn[];
  products: RelayToFlat<ProductListQuery["products"]>;
  intl: IntlShape;
  getProductTypes: (query: string) => Promise<DropdownChoice[]>;
  locale: Locale;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  gridAttributesFromSettings: ProductListColumns[];
  selectedChannelId?: string;
}

export function createGetCellContent({
  columns,
  getProductTypes,
  intl,
  locale,
  products,
  selectedChannelId,
}: GetCellContentProps) {
  return (
    [column, row]: Item,
    { changes, getChangeIndex, added, removed }: GetCellContentOpts,
  ) => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const change = changes.current[getChangeIndex(columnId, row)]?.data;
    const rowData = added.includes(row)
      ? undefined
      : products[getDatagridRowDataIndex(row, removed)];

    const channel = rowData?.channelListings?.find(
      listing => listing.channel.id === selectedChannelId,
    );

    switch (columnId) {
      case "productType":
        return getProductTypeCellContent(change, rowData, getProductTypes);
      case "availability":
        return getAvailabilityCellContent(rowData, intl, channel);

      case "description":
        return getDescriptionCellContent(columnId, change, rowData);
      case "name":
        return getNameCellContent(change, rowData);
      case "price":
        return getPriceCellContent(intl, locale, channel);
      case "date":
        return getUpdatedAtrCellContent(rowData, locale);
    }

    if (columnId.startsWith("attribute")) {
      return getAttributeCellContent(columnId, rowData);
    }

    const value = change ?? rowData?.[columnId] ?? "";
    return readonlyTextCell(value || "");
  };
}

function getProductTypeCellContent(
  change: { value: DropdownChoice },
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
  getProductTypes: (query: string) => Promise<DropdownChoice[]>,
) {
  const value = change?.value ?? getRowDataValue(rowData, change?.value);

  return dropdownCell(
    value,
    {
      allowCustomValues: false,
      emptyOption: false,
      update: (text: string) =>
        getProductTypes(value.label !== text ? text : ""),
    },
    {
      cursor: "pointer",
    },
  );
}

function getRowDataValue(
  rowData?: RelayToFlat<ProductListQuery["products"]>[number],
  changeValue?: DropdownChoice,
): DropdownChoice {
  if (changeValue === null || !rowData) {
    return emptyDropdownCellValue;
  }

  return {
    label: rowData.productType?.name,
    value: rowData.productType?.id,
  };
}

function getAvailabilityCellContent(
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
  return thumbnailCell(name, rowData?.thumbnail?.url ?? "", {
    cursor: "pointer",
  });
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
  if (!rowData) {
    return readonlyTextCell("");
  }

  return readonlyTextCell(
    moment(rowData.updatedAt).locale(locale).format("lll"),
  );
}

function getAttributeCellContent(
  columnId: string,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const attributeId = getAttributeIdFromColumnValue(columnId);
  const productAttribute = rowData?.attributes.find(
    attribute => attribute.attribute.id === attributeId,
  );

  if (productAttribute) {
    if (productAttribute.values.length) {
      if (productAttribute.values[0].date) {
        return readonlyTextCell(productAttribute.values[0].date);
      }
      if (productAttribute.values[0].dateTime) {
        return readonlyTextCell(productAttribute.values[0].dateTime);
      }
    }

    const textValue = productAttribute.values
      .map(value => value.name)
      .join(", ");

    return readonlyTextCell(textValue);
  }

  return readonlyTextCell("");
}

export function getColumnMetadata(column: string) {
  if (column.includes(":")) {
    const [columnName, columnId] = column.split(":");

    return {
      columnName: columnName as ProductListUrlSortField,
      columnId,
    };
  }

  return {
    columnName: column as ProductListUrlSortField,
  };
}

export function getProductRowsLength(
  disabled: boolean,
  product?: RelayToFlat<ProductListQuery["products"]>,
  loading?: boolean,
) {
  if (loading) {
    return 1;
  }

  if (product?.length) {
    return product.length;
  }

  if (disabled) {
    return 1;
  }

  return 0;
}
