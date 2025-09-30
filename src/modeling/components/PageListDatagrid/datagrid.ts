import { readonlyTextCell, tagsCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor } from "@dashboard/misc";
import { Pages } from "@dashboard/modeling/types";
import { PageListUrlSortField } from "@dashboard/modeling/urls";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

import { columnsMessages, messages } from "./messages";

export const pageListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<PageListUrlSortField>,
): AvailableColumn[] =>
  [
    {
      id: "title",
      title: intl.formatMessage(columnsMessages.title),
      width: 450,
    },
    {
      id: "slug",
      title: intl.formatMessage(columnsMessages.slug),
      width: 350,
    },
    {
      id: "visible",
      title: intl.formatMessage(columnsMessages.visible),
      width: 130,
    },
    {
      id: "contentType",
      title: intl.formatMessage(columnsMessages.contentType),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id, { nonSortableColumns: ["contentType"] }),
  }));

export const createGetCellContent =
  ({
    pages,
    columns,
    intl,
    currentTheme,
  }: {
    pages: Pages | undefined;
    columns: AvailableColumn[];
    intl: IntlShape;
    currentTheme: DefaultTheme;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = pages?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "title":
        return readonlyTextCell(rowData?.title ?? "");
      case "slug":
        return readonlyTextCell(rowData?.slug ?? "");
      case "contentType":
        return readonlyTextCell(rowData?.pageType?.name ?? "");
      case "visible": {
        const tag = rowData?.isPublished
          ? intl.formatMessage(messages.published)
          : intl.formatMessage(messages.notPublished);
        const color = getStatusColor({
          status: rowData?.isPublished ? "success" : "error",
          currentTheme,
        });

        return tagsCell(
          [
            {
              tag,
              color: color.base,
            },
          ],
          [tag],
          { cursor: "pointer" },
        );
      }
      default:
        return readonlyTextCell("");
    }
  };
