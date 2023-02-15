import ColumnPicker from "@dashboard/components/ColumnPicker";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import {
  FetchMoreProps,
  ListProps,
  PageListProps,
  RelayToFlat,
} from "@dashboard/types";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { getAttributeColumnValue } from "../ProductListPage/utils";
import { columnsMessages } from "./messages";

interface ProductListDatagridColumnPickerProps
  extends ListProps<ProductListColumns>,
    PageListProps<ProductListColumns>,
    FetchMoreProps {
  columnQuery: string;
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >;
  onColumnQueryChange: (query: string) => void;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
}

export const ProductListDatagridColumnPicker: React.FC<
  ProductListDatagridColumnPickerProps
> = ({
  onUpdateListSettings,
  hasMore,
  loading,
  onFetchMore,
  availableInGridAttributes,
  columnQuery,
  onColumnQueryChange,
  settings,
  defaultSettings,
  gridAttributes,
}) => {
  const intl = useIntl();
  const staticColumns = [
    {
      label: intl.formatMessage(columnsMessages.availability),
      value: "availability" as ProductListColumns,
    },
    {
      label: intl.formatMessage(columnsMessages.price),
      value: "price" as ProductListColumns,
    },
    {
      label: intl.formatMessage(columnsMessages.type),
      value: "productType" as ProductListColumns,
    },
    {
      label: intl.formatMessage(columnsMessages.updatedAt),
      value: "date" as ProductListColumns,
    },
  ];

  const initialColumnsChoices = useMemo(() => {
    const selectedStaticColumns = staticColumns.filter(column =>
      (settings.columns || []).includes(column.value),
    );
    const selectedAttributeColumns = gridAttributes.map(attribute => ({
      label: attribute.name,
      value: getAttributeColumnValue(attribute.id),
    }));

    return [...selectedStaticColumns, ...selectedAttributeColumns];
  }, [gridAttributes, settings.columns]);

  const availableColumns: MultiAutocompleteChoiceType[] = [
    ...staticColumns,
    ...availableInGridAttributes.map(
      attribute =>
        ({
          label: attribute.name,
          value: getAttributeColumnValue(attribute.id),
        } as MultiAutocompleteChoiceType),
    ),
  ];

  const handleSave = (columns: ProductListColumns[]) =>
    onUpdateListSettings("columns", columns);

  return (
    <ColumnPicker
      availableColumns={availableColumns}
      initialColumns={initialColumnsChoices}
      defaultColumns={defaultSettings.columns}
      hasMore={hasMore}
      loading={loading}
      query={columnQuery}
      onQueryChange={onColumnQueryChange}
      onFetchMore={onFetchMore}
      onSave={handleSave}
      IconButtonProps={{ variant: "secondary" }}
    />
  );
};
