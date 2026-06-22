import { type AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { getAttributeClassLabel } from "@dashboard/components/AttributeClass/getAttributeClassLabel";
import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { attributeInputTypeCell } from "@dashboard/components/Datagrid/customCells/AttributeInputTypeCell";
import { attributeTypeCell } from "@dashboard/components/Datagrid/customCells/AttributeTypeCell";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type AttributeFragment } from "@dashboard/graphql";
import { translateBoolean } from "@dashboard/intl";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

const NON_SORTABLE_COLUMNS = ["input-type", "attribute-type"];

export const attributesListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<AttributeListUrlSortField>,
) =>
  [
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 300,
    },
    {
      id: "slug",
      title: intl.formatMessage(columnsMessages.slug),
      width: 300,
    },
    {
      id: "input-type",
      title: intl.formatMessage(columnsMessages.inputType),
      width: 200,
    },
    {
      id: "attribute-type",
      title: intl.formatMessage(columnsMessages.attributeType),
      width: 200,
    },
    {
      id: "visible",
      title: intl.formatMessage(columnsMessages.visible),
      width: 200,
    },
    {
      id: "use-in-faceted-search",
      title: intl.formatMessage(columnsMessages.useInFacetedSearch),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id, {
      nonSortableColumns: NON_SORTABLE_COLUMNS,
    }),
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
      case "input-type":
        // attributeInputTypeCell is canvas-only; see AttributeInputTypeCell.tsx
        return rowData?.inputType
          ? attributeInputTypeCell(
              rowData.inputType,
              getAttributeInputTypeLabel(intl, rowData.inputType),
              { hasUnit: rowData.unit != null },
            )
          : readonlyTextCell(PLACEHOLDER);
      case "attribute-type":
        // attributeTypeCell is canvas-only; see AttributeTypeCell.tsx
        return rowData?.type
          ? attributeTypeCell(rowData.type, getAttributeClassLabel(rowData.type, intl))
          : readonlyTextCell(PLACEHOLDER);
      case "visible":
        return readonlyTextCell(translateBoolean(rowData?.visibleInStorefront, intl));
      case "use-in-faceted-search":
        return readonlyTextCell(translateBoolean(rowData?.filterableInStorefront, intl));
      default:
        return readonlyTextCell("");
    }
  };
