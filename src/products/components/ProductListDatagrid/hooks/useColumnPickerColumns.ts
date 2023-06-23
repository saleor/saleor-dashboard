// @ts-strict-ignore
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { ListSettings, RelayToFlat } from "@dashboard/types";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { getAttributeColumnValue } from "../../ProductListPage/utils";
import { columnsMessages } from "../messages";

export const useColumnPickerColumns = (
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>,
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >,
  settings: ListSettings<ProductListColumns>,
  defaultColumns: ProductListColumns[],
) => {
  const intl = useIntl();

  const staticColumns = useMemo(
    () => [
      {
        label: intl.formatMessage(columnsMessages.availability),
        value: "availability" as ProductListColumns,
      },
      {
        label: intl.formatMessage(columnsMessages.price),
        value: "price" as ProductListColumns,
      },
      {
        label: intl.formatMessage(commonMessages.description),
        value: "description" as ProductListColumns,
      },
      {
        label: intl.formatMessage(columnsMessages.type),
        value: "productType" as ProductListColumns,
      },
      {
        label: intl.formatMessage(columnsMessages.updatedAt),
        value: "date" as ProductListColumns,
      },
    ],
    [intl],
  );

  const initialColumns = useMemo(() => {
    const selectedStaticColumns = staticColumns.filter(column =>
      (settings.columns || []).includes(column.value),
    );
    const selectedAttributeColumns = gridAttributes.map(attribute => ({
      label: attribute.name,
      value: getAttributeColumnValue(attribute.id),
    }));

    return [...selectedStaticColumns, ...selectedAttributeColumns];
  }, [gridAttributes, settings.columns, staticColumns]);

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

  return {
    availableColumns,
    initialColumns,
    defaultColumns,
  };
};
