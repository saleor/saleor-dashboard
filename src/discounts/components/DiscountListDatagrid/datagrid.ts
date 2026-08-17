import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  dateCell,
  readonlyTextCell,
  statusCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { type DiscountListUrlSortField } from "@dashboard/discounts/discountsUrls";
import {
  getPromotionStatus,
  getRelativePromotionTimeParts,
  type PromotionStatus,
} from "@dashboard/discounts/utils";
import { type PromotionFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages, messages } from "./messages";

export const dicountListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<DiscountListUrlSortField>,
  emptyColumn: AvailableColumn,
) =>
  [
    emptyColumn,
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 350,
    },
    {
      id: "status",
      title: intl.formatMessage(columnsMessages.status),
      width: 180,
    },
    {
      id: "type",
      width: 150,
      title: intl.formatMessage(columnsMessages.type),
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

const COMMON_CELL_PROPS: Partial<GridCell> = { cursor: "pointer" };

const getStatusDot = (status: PromotionStatus): DotStatus => {
  if (status === "active") {
    return "success";
  }

  if (status === "scheduled") {
    return "scheduled";
  }

  return "neutral";
};

export const getPromotionListStatusLabel = ({
  promotion,
  intl,
  now = new Date(),
}: {
  promotion: Pick<PromotionFragment, "startDate" | "endDate">;
  intl: IntlShape;
  now?: Date;
}): { label: string; status: DotStatus } => {
  const promotionStatus = getPromotionStatus({
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    now,
  });
  const statusLabel = intl.formatMessage(
    promotionStatus === "scheduled"
      ? messages.statusScheduled
      : promotionStatus === "finished"
        ? messages.statusEnded
        : messages.statusActive,
  );
  const timeParts = getRelativePromotionTimeParts({
    status: promotionStatus,
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    now,
  });
  const timeHint = timeParts
    ? new Intl.RelativeTimeFormat(intl.locale, { numeric: "auto", style: "long" }).format(
        timeParts.value,
        timeParts.unit,
      )
    : null;

  return {
    status: getStatusDot(promotionStatus),
    label: timeHint ? `${statusLabel} · ${timeHint}` : statusLabel,
  };
};

export const createGetCellContent =
  ({
    promotions,
    columns,
    intl,
  }: {
    promotions: PromotionFragment[];
    columns: AvailableColumn[];
    intl: IntlShape;
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
      case "status": {
        const { label, status } = getPromotionListStatusLabel({ promotion: rowData, intl });

        return statusCell(status, label, {
          cursor: "pointer",
          readonly: true,
          allowOverlay: false,
        });
      }
      case "startDate":
        return rowData.startDate
          ? dateCell(rowData.startDate, COMMON_CELL_PROPS)
          : readonlyTextCell(PLACEHOLDER);
      case "endDate":
        return rowData.endDate
          ? dateCell(rowData.endDate, COMMON_CELL_PROPS)
          : readonlyTextCell(PLACEHOLDER);
      case "type":
        return readonlyTextCell(getDiscountType(rowData, intl));
      default:
        return readonlyTextCell("");
    }
  };

function getDiscountType(promotion: PromotionFragment, intl: IntlShape) {
  switch (promotion.type) {
    case PromotionTypeEnum.CATALOGUE:
      return intl.formatMessage({ defaultMessage: "Catalog", id: "GOdq5V" });
    case PromotionTypeEnum.ORDER:
      return intl.formatMessage({ defaultMessage: "Order", id: "XPruqs" });
    default:
      throw new Error(`Unhandled type for item: ${promotion.type}`);
  }
}
