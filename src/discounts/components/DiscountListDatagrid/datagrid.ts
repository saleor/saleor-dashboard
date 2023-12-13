import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { SaleListUrlSortField } from "@dashboard/discounts/urls";
import { PromotionFragment } from "@dashboard/graphql";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import moment from "moment";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const salesListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<SaleListUrlSortField>,
) =>
  [
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 350,
    },
    {
      id: "startDate",
      title: intl.formatMessage(columnsMessages.starts),
      width: 200,
    },
    {
      id: "endDate",
      title: intl.formatMessage(columnsMessages.ends),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    promotions,
    columns,
    locale,
  }: {
    promotions: PromotionFragment[];
    columns: AvailableColumn[];
    locale: Locale;
    selectedChannelId?: string;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = promotions[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData.name);
      case "startDate":
        return readonlyTextCell(
          rowData.startDate
            ? moment(rowData.startDate).locale(locale).format("lll")
            : PLACEHOLDER,
        );
      case "endDate":
        return readonlyTextCell(
          rowData.endDate
            ? moment(rowData.endDate).locale(locale).format("lll")
            : PLACEHOLDER,
        );
      default:
        return readonlyTextCell("");
    }
  };
