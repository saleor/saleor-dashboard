import {
  readonlyTextCell,
  tagsCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor } from "@dashboard/misc";
import { Pages } from "@dashboard/pages/types";
import { PageListUrlSortField } from "@dashboard/pages/urls";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { ThemeTokensValues } from "@saleor/macaw-ui/next";
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
      width: 300,
    },
    {
      id: "visible",
      title: intl.formatMessage(columnsMessages.visible),
      width: 300,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    pages,
    columns,
    intl,
    themeValues,
  }: {
    pages: Pages | undefined;
    columns: AvailableColumn[];
    intl: IntlShape;
    themeValues: ThemeTokensValues;
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
      case "visible": {
        const tag = rowData?.isPublished
          ? intl.formatMessage(messages.published)
          : intl.formatMessage(messages.notPublished);
        return tagsCell(
          [
            {
              tag,
              color:
                themeValues.colors.background[
                  getStatusColor(
                    rowData?.isPublished ? "success" : "error",
                  ) as keyof ThemeTokensValues["colors"]["background"]
                ],
            },
          ],
          [tag],
        );
      }
      default:
        return readonlyTextCell("");
    }
  };
