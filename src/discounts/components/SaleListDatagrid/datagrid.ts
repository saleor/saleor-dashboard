import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { formatMoney } from "@dashboard/components/Money";
import { formatPercantage } from "@dashboard/components/Percent/utils";
import { SaleListUrlSortField } from "@dashboard/discounts/urls";
import { SaleFragment } from "@dashboard/graphql";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import moment from "moment";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const salesListStaticColumnsAdapter = (intl: IntlShape, sort: Sort<SaleListUrlSortField>) =>
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
    {
      id: "value",
      title: intl.formatMessage(columnsMessages.value),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    sales,
    columns,
    locale,
    selectedChannelId,
  }: {
    sales: SaleFragment[];
    columns: AvailableColumn[];
    locale: Locale;
    selectedChannelId?: string;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = sales[row];
    const columnId = columns[column]?.id;
    const channel = rowData?.channelListings?.find(
      lisiting => lisiting.channel.id === selectedChannelId,
    );

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData.name);
      case "startDate":
        return readonlyTextCell(
          rowData.startDate ? moment(rowData.startDate).locale(locale).format("lll") : PLACEHOLDER,
        );
      case "endDate":
        return readonlyTextCell(
          rowData.endDate ? moment(rowData.endDate).locale(locale).format("lll") : PLACEHOLDER,
        );
      case "value":
        if (!channel) {
          return readonlyTextCell(PLACEHOLDER);
        }

        if (rowData?.type && channel?.discountValue) {
          if (rowData.type === "FIXED") {
            return readonlyTextCell(
              formatMoney(
                {
                  amount: channel.discountValue,
                  currency: channel.channel.currencyCode,
                },
                locale,
              ),
            );
          }

          return readonlyTextCell(formatPercantage(channel.discountValue, locale));
        }

        return readonlyTextCell(PLACEHOLDER);

      default:
        return readonlyTextCell("");
    }
  };
