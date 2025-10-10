// @ts-strict-ignore
import { LazyQueryResult, QueryLazyOptions } from "@apollo/client";
import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
import {
  getChannelAvailabilityLabel,
  getChannelAvailabilityStatus,
} from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import { ColumnCategory } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import {
  dateCell,
  moneyCell,
  pillCell,
  readonlyTextCell,
  statusCell,
  tagsCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { ThumbnailCellProps } from "@dashboard/components/Datagrid/customCells/ThumbnailCell";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import {
  AttributeTypeEnum,
  AvailableColumnAttributesQuery,
  Exact,
  GridAttributesQuery,
  ProductListQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getDatagridRowDataIndex } from "@dashboard/misc";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

import { getAttributeIdFromColumnValue } from "../ProductListPage/utils";
import { categoryMetaGroups, columnsMessages } from "./messages";

export const productListStaticColumnAdapter = ({
  intl,
  sort,
  onPriceClick,
}: {
  intl: IntlShape;
  sort: Sort<ProductListUrlSortField>;
  onPriceClick: ((productId: string) => boolean) | undefined;
}) =>
  [
    {
      id: "name",
      title: intl.formatMessage(commonMessages.product),
      width: 300,
    },
    {
      id: "productType",
      title: intl.formatMessage(columnsMessages.type),
      width: 200,
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
    },
    {
      id: "date",
      title: intl.formatMessage(columnsMessages.updatedAt),
      width: 300,
    },
    {
      id: "created",
      title: intl.formatMessage(columnsMessages.created),
      width: 300,
    },
    {
      id: "price",
      title: intl.formatMessage(columnsMessages.price),
      width: 250,
      action: onPriceClick,
    },
    {
      id: "productCategory",
      title: intl.formatMessage(columnsMessages.category),
      width: 200,
    },
    {
      id: "productCollections",
      title: intl.formatMessage(columnsMessages.collections),
      width: 300,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const productListDynamicColumnAdapter = ({
  availableAttributesData,
  selectedAttributesData,
  activeAttributeSortId,
  sort,
  onSearch,
  initialSearch,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  intl,
}): ColumnCategory[] => [
  {
    name: intl.formatMessage(categoryMetaGroups.attribute),
    prefix: "attribute",
    availableNodes: parseAttributesColumns(
      availableAttributesData,
      activeAttributeSortId,
      sort,
      intl,
    ),
    selectedNodes: parseAttributesColumns(
      selectedAttributesData,
      activeAttributeSortId,
      sort,
      intl,
    ),
    onSearch,
    initialSearch,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
  },
];

const parseAttributesColumns = (
  attributes: RelayToFlat<SearchAvailableInGridAttributesQuery["availableInGrid"]>,
  activeAttributeSortId: string,
  sort: Sort<ProductListUrlSortField>,
  intl: IntlShape,
) =>
  attributes?.map(attribute => ({
    id: `attribute:${attribute.id}`,
    title: attribute.name,
    metaGroup: intl.formatMessage(categoryMetaGroups.attribute),
    width: 200,
    icon:
      attribute.id === activeAttributeSortId
        ? getColumnSortIconName(sort, ProductListUrlSortField.attribute)
        : undefined,
  }));

export function getColumnSortIconName(
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
  theme: DefaultTheme;
  locale: Locale;
  selectedChannelId?: string;
}

export function createGetCellContent({
  columns,
  intl,
  theme,
  products,
  selectedChannelId,
}: GetCellContentProps) {
  return ([column, row]: Item, { changes, getChangeIndex, added, removed }: GetCellContentOpts) => {
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
        return getProductTypeCellContent(theme, rowData);
      case "availability":
        return getAvailabilityCellContent(rowData, intl, channel);
      case "description":
        return getDescriptionCellContent(columnId, change, rowData);
      case "name":
        return getNameCellContent(change, rowData);
      case "price":
        return getPriceCellContent(intl, channel);
      case "date":
        return getDateCellContent(rowData);
      case "created":
        return getCreatedCellContent(rowData);
      case "productCategory":
        return getCategoryCellContent(theme, rowData);
      case "productCollections":
        return getCollectionsCellContent(theme, rowData);
    }

    if (columnId.startsWith("attribute")) {
      return getAttributeCellContent(columnId, rowData);
    }

    const value = change ?? rowData?.[columnId] ?? "";

    return readonlyTextCell(value || "");
  };
}

const COMMON_CELL_PROPS: Partial<GridCell> = { cursor: "pointer" };

function getDateCellContent(rowData: RelayToFlat<ProductListQuery["products"]>[number]) {
  return dateCell(rowData?.updatedAt, COMMON_CELL_PROPS);
}

function getCreatedCellContent(rowData: RelayToFlat<ProductListQuery["products"]>[number]) {
  return dateCell(rowData?.created, COMMON_CELL_PROPS);
}

function getProductTypeCellContent(
  theme: DefaultTheme,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const hue = stringToHue(rowData?.productType?.name);
  const color = theme === "defaultDark" ? hueToPillColorDark(hue) : hueToPillColorLight(hue);

  return pillCell(rowData.productType?.name, color, COMMON_CELL_PROPS);
}

function getCategoryCellContent(
  theme: DefaultTheme,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  if (!rowData.category) {
    return readonlyTextCell("-", true);
  }

  const hue = stringToHue(rowData.category?.name);
  const color = theme === "defaultDark" ? hueToPillColorDark(hue) : hueToPillColorLight(hue);

  return pillCell(rowData.category?.name, color, COMMON_CELL_PROPS);
}

function getCollectionsCellContent(
  theme: DefaultTheme,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  if (rowData.collections === undefined || rowData.collections.length === 0) {
    return readonlyTextCell("-", true);
  }

  const tags = rowData.collections.map(collection => {
    const hue = stringToHue(collection.name);
    const color = theme === "defaultDark" ? hueToPillColorDark(hue) : hueToPillColorLight(hue);

    return {
      tag: collection.name,
      color: color.base,
    };
  });

  return tagsCell(
    tags,
    tags.map(tag => tag.tag),
    {
      ...COMMON_CELL_PROPS,
      allowOverlay: false,
    },
  );
}

function getAvailabilityCellContent(
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
  intl: IntlShape,
  selectedChannnel?: RelayToFlat<ProductListQuery["products"]>[number]["channelListings"][number],
) {
  if (selectedChannnel) {
    return statusCell(
      getChannelAvailabilityStatus(selectedChannnel),
      intl.formatMessage(getChannelAvailabilityLabel(selectedChannnel)),
      COMMON_CELL_PROPS,
    );
  }

  if (rowData?.channelListings?.length) {
    return statusCell(
      "success",
      intl.formatMessage(messages.dropdownLabel, {
        channelCount: rowData?.channelListings?.length,
      }),
      COMMON_CELL_PROPS,
    );
  } else {
    return statusCell("error", intl.formatMessage(messages.noChannels), COMMON_CELL_PROPS);
  }
}

function getDescriptionCellContent(
  columnId: string,
  change: boolean,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const value = change ?? rowData?.[columnId] ?? "";

  if (!value) {
    return readonlyTextCell("", true);
  }

  return readonlyTextCell(getDescriptionValue(value), true);
}

function getNameCellContent(
  change: ThumbnailCellProps,
  rowData: RelayToFlat<ProductListQuery["products"]>[number],
) {
  const name = change?.name ?? rowData?.name ?? "";

  return thumbnailCell(name, rowData?.thumbnail?.url ?? "", COMMON_CELL_PROPS);
}

function getPriceCellContent(
  intl: IntlShape,
  selectedChannnel?: RelayToFlat<ProductListQuery["products"]>[number]["channelListings"][number],
) {
  const from = selectedChannnel?.pricing?.priceRange?.start?.net;
  const to = selectedChannnel?.pricing?.priceRange?.stop?.net;
  const priceValue = from?.amount === to?.amount ? from?.amount : [from?.amount, to?.amount];

  const price = from
    ? moneyCell(priceValue, from?.currency || "", COMMON_CELL_PROPS)
    : readonlyTextCell("-");

  return selectedChannnel
    ? price
    : readonlyTextCell(
        intl.formatMessage({
          defaultMessage: "Select channel",
          id: "jgURyO",
          description: "product price",
        }),
        true,
        "faded",
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

    const textValue = productAttribute.values.map(value => value.name).join(", ");

    return readonlyTextCell(textValue);
  }

  return readonlyTextCell("");
}

const MAX_DESCRIPTION_LENGHT = 100;

export function getDescriptionValue(value: string) {
  try {
    const parsed = JSON.parse(value);

    if (parsed) {
      const descriptionFirstParagraph = findFirstBlockWithText(parsed?.blocks);

      if (descriptionFirstParagraph) {
        const description = (descriptionFirstParagraph.data?.text ?? "")
          // Regular expression to identify HTML tags in
          // the input string. Replacing the identified
          // HTML tag with a null string.
          .replace(/(<([^>]+)>)/gi, "")
          .replace(/&nbsp;/g, "");

        if (description.length > MAX_DESCRIPTION_LENGHT) {
          return description.slice(0, MAX_DESCRIPTION_LENGHT) + "...";
        }

        return description;
      }
    }

    return "";
  } catch (e) {
    return "";
  }
}

function findFirstBlockWithText(blocks?: Array<{ id: string; data: { text: string } }>) {
  if (!blocks) {
    return undefined;
  }

  return blocks.find(block => block?.data?.text?.length > 0);
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

type AvailableAttributesDataQueryResult = LazyQueryResult<
  AvailableColumnAttributesQuery,
  Exact<{
    search: string;
    before?: string;
    after?: string;
    first?: number;
    last?: number;
  }>
>;

type GridAttributesDataQueryResult = LazyQueryResult<
  GridAttributesQuery,
  Exact<{
    ids: string | string[];
  }>
>;

type AttributesLazyQuery = (
  options?: QueryLazyOptions<
    Exact<{
      search: string;
      type: AttributeTypeEnum;
      before?: string;
      after?: string;
      first?: number;
      last?: number;
    }>
  >,
) => void;

/**
 * To avoid overfetching we use single query for initial render
 * (gridAttributesOpts) and when pagination / search is used
 * we use separate query - availableColumnsAttributesData
 */
export const getAvailableAttributesData = ({
  availableColumnsAttributesData,
  gridAttributesOpts,
}: {
  availableColumnsAttributesData: AvailableAttributesDataQueryResult;
  gridAttributesOpts: GridAttributesDataQueryResult;
}) =>
  mapEdgesToItems(availableColumnsAttributesData.data?.attributes) ??
  (availableColumnsAttributesData.loading
    ? undefined
    : (mapEdgesToItems(gridAttributesOpts.data?.availableAttributes) ?? []));

export const getAttributesFetchMoreProps = ({
  queryAvailableColumnsAttributes,
  availableColumnsAttributesData,
  gridAttributesOpts,
}: {
  queryAvailableColumnsAttributes: AttributesLazyQuery;
  availableColumnsAttributesData: AvailableAttributesDataQueryResult;
  gridAttributesOpts: GridAttributesDataQueryResult;
}) => {
  const onNextPage = (query: string) =>
    queryAvailableColumnsAttributes({
      variables: {
        search: query,
        type: AttributeTypeEnum.PRODUCT_TYPE,
        after:
          availableColumnsAttributesData.data?.attributes?.pageInfo.endCursor ??
          gridAttributesOpts.data?.availableAttributes?.pageInfo.endCursor,
        first: 10,
        last: null,
        before: null,
      },
    });
  const onPreviousPage = (query: string) =>
    queryAvailableColumnsAttributes({
      variables: {
        search: query,
        type: AttributeTypeEnum.PRODUCT_TYPE,
        before: availableColumnsAttributesData.data?.attributes?.pageInfo.startCursor,
        last: 10,
        first: null,
        after: null,
      },
    });
  const hasNextPage =
    availableColumnsAttributesData.data?.attributes?.pageInfo?.hasNextPage ??
    gridAttributesOpts.data?.availableAttributes?.pageInfo?.hasNextPage ??
    false;
  const hasPreviousPage =
    availableColumnsAttributesData.data?.attributes?.pageInfo?.hasPreviousPage ?? false;

  return {
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
  };
};
export const getCellAction = (
  availableColumns: readonly AvailableColumn[] | undefined,
  column: number,
) => {
  return availableColumns[column]?.action;
};
