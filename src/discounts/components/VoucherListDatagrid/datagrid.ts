import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  moneyCell,
  numberCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { VoucherListUrlSortField } from "@dashboard/discounts/urls";
import { VoucherFragment } from "@dashboard/graphql";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import moment from "moment";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const vouchersListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<VoucherListUrlSortField>,
) =>
  [
    {
      id: "code",
      title: intl.formatMessage(columnsMessages.voucher),
      width: 350,
    },
    {
      id: "min-spent",
      title: intl.formatMessage(columnsMessages.minSpent),
      width: 200,
    },
    {
      id: "start-date",
      title: intl.formatMessage(columnsMessages.starts),
      width: 200,
    },
    {
      id: "end-date",
      title: intl.formatMessage(columnsMessages.ends),
      width: 200,
    },
    {
      id: "value",
      title: intl.formatMessage(columnsMessages.value),
      width: 200,
    },
    {
      id: "limit",
      title: intl.formatMessage(columnsMessages.uses),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    vouchers,
    columns,
    locale,
    selectedChannelId,
  }: {
    vouchers: VoucherFragment[];
    columns: AvailableColumn[];
    locale: Locale;
    selectedChannelId?: string;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: VoucherFragment | undefined = vouchers[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    const channel = rowData?.channelListings?.find(
      lisiting => lisiting.channel.id === selectedChannelId,
    );
    const hasChannelsLoaded = rowData?.channelListings?.length;

    switch (columnId) {
      case "code":
        return readonlyTextCell(rowData?.name ?? PLACEHOLDER);
      case "min-spent":
        return hasChannelsLoaded
          ? moneyCell(
              channel?.minSpent?.amount ?? null,
              channel?.minSpent?.currency ?? "",
              {
                cursor: "pointer",
                readonly: true,
              },
            )
          : readonlyTextCell(PLACEHOLDER);
      case "start-date":
        return readonlyTextCell(
          rowData.startDate
            ? moment(rowData.startDate).locale(locale).format("lll")
            : PLACEHOLDER,
        );
      case "end-date":
        return readonlyTextCell(
          rowData.endDate
            ? moment(rowData.endDate).locale(locale).format("lll")
            : PLACEHOLDER,
        );

      case "value":
        return getVoucherValueCell(rowData, channel);

      case "limit":
        return readonlyTextCell(
          rowData.usageLimit === null
            ? PLACEHOLDER
            : rowData.usageLimit.toString(),
        );

      default:
        return readonlyTextCell("");
    }
  };

function getVoucherValueCell(
  voucher: VoucherFragment,
  channel: NonNullable<VoucherFragment["channelListings"]>[number] | undefined,
) {
  const hasChannelsLoaded = voucher?.channelListings?.length;

  if (!hasChannelsLoaded || !channel) {
    return readonlyTextCell(PLACEHOLDER);
  }

  if (voucher?.discountValueType === "FIXED") {
    return moneyCell(channel?.discountValue, channel?.currency ?? "", {
      cursor: "pointer",
      readonly: true,
    });
  }

  return numberCell(channel?.discountValue, { format: "percent" });
}
