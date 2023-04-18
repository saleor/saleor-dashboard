import { SearchAvailableInGridAttributesQuery } from "@dashboard/graphql";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { commonMessages } from "@dashboard/intl";
import { columnsMessages } from "@dashboard/products/components/ProductListDatagrid/messages";
import { getColumnSortIconName } from "@dashboard/products/components/ProductListDatagrid/utils";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { FetchMoreProps, RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import React from "react";

import { AvailableColumn } from "../Datagrid/types";

export interface ColumnCategory extends Partial<FetchMoreProps> {
  name: string;
  prefix: string;
  availableNodes: AvailableColumn[];
  selectedNodes: AvailableColumn[];
  onSearch?: (query: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  onFetchMore: () => void;
}

export interface UseColumnsProps {
  staticColumns: AvailableColumn[];
  columnCategories?: ColumnCategory[];
  selectedColumns: string[];
  onSave: (columns: string[]) => void;
  customColumnSettings: string[];
  setCustomColumnSettings: (cols: string[]) => void;
}

export const useColumns = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  onSave,
  customColumnSettings,
  setCustomColumnSettings,
}: UseColumnsProps) => {
  const customColumns: AvailableColumn[] = React.useMemo(
    () =>
      columnCategories.reduce((columns: AvailableColumn[], category) => {
        category.selectedNodes.forEach(column => {
          if (customColumnSettings.includes(column.id)) {
            columns.push(column);
          }
        });
        return columns;
      }, [] as AvailableColumn[]),
    [columnCategories, customColumnSettings],
  );

  const initialColumnsState = React.useMemo(
    () =>
      [...staticColumns, ...customColumns].filter(column =>
        selectedColumns.includes(column.id),
      ),
    [customColumns, staticColumns, selectedColumns],
  );

  const [visibleColumns, setVisibleColumns] =
    useStateFromProps(initialColumnsState);

  const onMove = React.useCallback(
    (startIndex: number, endIndex: number): void => {
      setVisibleColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [setVisibleColumns],
  );
  const onResize = React.useCallback(
    (column: GridColumn, newSize: number) => {
      if (column.id === "empty") {
        return;
      }
      return setVisibleColumns(prevColumns =>
        prevColumns.map(prevColumn =>
          prevColumn.id === column.id
            ? { ...prevColumn, width: newSize }
            : prevColumn,
        ),
      );
    },
    [setVisibleColumns],
  );

  const onChange = onSave;
  const onCustomColumnSelect = setCustomColumnSettings;

  return {
    handlers: {
      onMove,
      onResize,
      onChange,
      onCustomColumnSelect,
    },
    visibleColumns,
    staticColumns,
    customColumns,
    selectedColumns,
    columnCategories,
    customColumnSettings,
  };
};

// These two should provide input for useColumns
export const parseStaticColumnsForProductListView = (intl, emptyColumn, sort) =>
  [
    emptyColumn,
    {
      id: "name",
      title: intl.formatMessage(commonMessages.product),
      width: 300,
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
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const parseCustomColumnsForProductListView = ({
  attributesData,
  gridAttributesData,
  activeAttributeSortId,
  sort,
  onSearch,
  onFetchMore,
  hasNextPage,
  hasPreviousPage,
  totalCount,
}) => [
  {
    name: "Attributes",
    prefix: "attribute",
    availableNodes: parseAttributesColumns(
      attributesData,
      activeAttributeSortId,
      sort,
    ),
    selectedNodes: parseAttributesColumns(
      gridAttributesData,
      activeAttributeSortId,
      sort,
    ),
    onSearch,
    onFetchMore,
    hasNextPage,
    hasPreviousPage,
    totalCount,
  },
];

export const parseColumnsForVariantDetailsView = () => null;

export const filterEmptyColumn = (column: AvailableColumn) =>
  column.title !== "";

export const parseAttributesColumns = (
  attributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >,
  activeAttributeSortId: string,
  sort: Sort<ProductListUrlSortField>,
) =>
  attributes.map(attribute => ({
    id: `attribute:${attribute.id}`,
    title: attribute.name,
    metaGroup: "Attribute",
    width: 200,
    icon:
      attribute.id === activeAttributeSortId &&
      getColumnSortIconName(sort, ProductListUrlSortField.attribute),
  }));
