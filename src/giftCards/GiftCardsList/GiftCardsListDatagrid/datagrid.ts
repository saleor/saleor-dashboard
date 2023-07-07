import {
  moneyCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { PLACEHOLDER } from "@dashboard/giftCards/GiftCardUpdate/types";
import { GiftCardDataFragment, GiftCardListQuery } from "@dashboard/graphql";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { GiftCardUrlSortField } from "../types";
import { columnsMessages, messages } from "./messages";

export const getColumns = (
  intl: IntlShape,
  sort?: Sort<GiftCardUrlSortField>,
): AvailableColumn[] =>
  [
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 350,
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
      ExtendedGiftCard<GiftCardListQuery["giftCards"]["edges"][0]["node"]>
    >,
    columns: AvailableColumn[],
    intl: IntlShape,
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const rowData = categories[row];

    switch (columnId) {
      case "name":
        return readonlyTextCell(
          intl.formatMessage(messages.codeEndingWithLabel, {
            last4CodeChars: rowData?.last4CodeChars ?? "",
          }),
        );
      case "tag":
        return readonlyTextCell(getTagCellText(rowData?.tags ?? []));
      case "product":
        return readonlyTextCell("-");
      case "usedBy":
        return readonlyTextCell(
          `${rowData?.usedBy?.firstName} ${rowData?.usedBy?.lastName}`,
        );
      case "balance":
        return moneyCell(
          rowData.currentBalance.amount,
          rowData.currentBalance.currency,
        );
      default:
        return readonlyTextCell("", false);
    }
  };

export const getTagCellText = (tags: GiftCardDataFragment["tags"]) => {
  if (!!tags.length) {
    return tags.map(({ name }) => name).join(", ");
  }

  return PLACEHOLDER;
};
