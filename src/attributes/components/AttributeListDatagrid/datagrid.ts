import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { AttributeFragment } from "@dashboard/graphql";
import { translateBoolean } from "@dashboard/intl";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const attributesListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<AttributeListUrlSortField>,
) =>
  [
    {
      id: "slug",
      title: intl.formatMessage(columnsMessages.slug),
      width: 300,
    },
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 300,
    },
    {
      id: "visible",
      title: intl.formatMessage(columnsMessages.visible),
      width: 200,
    },
    {
      id: "searchable",
      title: intl.formatMessage(columnsMessages.searchable),
      width: 200,
    },
    {
      id: "use-in-faceted-search",
      title: intl.formatMessage(columnsMessages.useInFacetedSearch),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    attributes,
    columns,
    intl,
  }: {
    attributes: AttributeFragment[];
    columns: AvailableColumn[];
    intl: IntlShape;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: AttributeFragment | undefined = attributes[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "slug":
        return readonlyTextCell(rowData?.slug ?? PLACEHOLDER);
      case "name":
        return readonlyTextCell(rowData?.name ?? PLACEHOLDER);
      case "visible":
        return readonlyTextCell(translateBoolean(rowData?.visibleInStorefront, intl));
      case "searchable":
        return readonlyTextCell(translateBoolean(rowData?.filterableInDashboard, intl));
      case "use-in-faceted-search":
        return readonlyTextCell(translateBoolean(rowData?.filterableInStorefront, intl));
      default:
        return readonlyTextCell("");
    }
  };
