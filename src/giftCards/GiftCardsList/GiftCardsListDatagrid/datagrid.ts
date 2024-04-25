import {
  moneyCell,
  readonlyTextCell,
  tagsCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import {
  ExtendedGiftCard,
  GiftCardBase,
} from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { PLACEHOLDER } from "@dashboard/giftCards/GiftCardUpdate/types";
import { GiftCardDataFragment, GiftCardListQuery } from "@dashboard/graphql";
import { getStatusColor } from "@dashboard/misc";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

import { giftCardUpdatePageHeaderMessages as giftCardStatusChipMessages } from "../../GiftCardUpdate/GiftCardUpdatePageHeader/messages";
import { GiftCardUrlSortField } from "../types";
import { columnsMessages, messages } from "./messages";

export const getColumns = (intl: IntlShape, sort?: Sort<GiftCardUrlSortField>): AvailableColumn[] =>
  [
    {
      id: "giftCardCode",
      title: intl.formatMessage(columnsMessages.name),
      width: 350,
    },
    {
      id: "status",
      title: intl.formatMessage(columnsMessages.status),
      width: 150,
    },
    {
      id: "tag",
      title: intl.formatMessage(columnsMessages.tag),
      width: 200,
    },
    {
      id: "product",
      title: intl.formatMessage(columnsMessages.productTitle),
      width: 200,
    },
    {
      id: "usedBy",
      title: intl.formatMessage(columnsMessages.customer),
      width: 200,
    },
    {
      id: "balance",
      title: intl.formatMessage(columnsMessages.balance),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: sort ? getColumnSortDirectionIcon(sort, column.id) : undefined,
  }));

export const createGetCellContent =
  (
    categories: Array<
      ExtendedGiftCard<NonNullable<GiftCardListQuery["giftCards"]>["edges"][0]["node"]>
    >,
    columns: AvailableColumn[],
    intl: IntlShape,
    currentTheme: DefaultTheme,
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const rowData = categories[row];

    switch (columnId) {
      case "giftCardCode":
        return readonlyTextCell(
          intl.formatMessage(messages.codeEndingWithLabel, {
            last4CodeChars: rowData?.last4CodeChars ?? "",
          }),
        );
      case "status": {
        const status = getStatusText(rowData);
        const color = getStatusColor({
          status: status?.color ?? "info",
          currentTheme,
        });

        if (!status) {
          return tagsCell(
            [
              {
                tag: intl.formatMessage(messages.active),
                color: color.base,
              },
            ],
            [intl.formatMessage(messages.active)],
          );
        }

        const statusLabel = status?.label ? intl.formatMessage(status.label) : "";

        return tagsCell(
          [
            {
              tag: statusLabel,
              color: color.base,
            },
          ],
          [statusLabel],
        );
      }
      case "tag":
        return readonlyTextCell(getTagCellText(rowData?.tags ?? []));
      case "product":
        return readonlyTextCell(rowData?.product?.name ?? PLACEHOLDER);
      case "usedBy":
        if (rowData.usedBy) {
          return readonlyTextCell(`${rowData.usedBy.firstName} ${rowData.usedBy.lastName}`);
        }

        return readonlyTextCell(rowData?.usedByEmail ?? PLACEHOLDER);
      case "balance":
        return moneyCell(rowData.currentBalance.amount, rowData.currentBalance.currency);
      default:
        return readonlyTextCell("", false);
    }
  };

export const getTagCellText = (tags: GiftCardDataFragment["tags"]) => {
  if (tags.length) {
    return tags.map(({ name }) => name).join(", ");
  }

  return PLACEHOLDER;
};

export const getStatusText = (giftCard: ExtendedGiftCard<GiftCardBase & { isActive: boolean }>) => {
  const { isExpired, isActive } = giftCard;

  if (isExpired) {
    return {
      color: "info",
      label: giftCardStatusChipMessages.expiredStatusLabel,
    } as const;
  }

  if (!isActive) {
    return {
      color: "error",
      label: giftCardStatusChipMessages.disabledStatusLabel,
    } as const;
  }

  return null;
};
