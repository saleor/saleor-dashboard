// @ts-strict-ignore
import {
  booleanCell,
  moneyCell,
  moneyDiscountedCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import {
  skeletonCell,
  type SkeletonCellVariant,
} from "@dashboard/components/Datagrid/customCells/SkeletonCell";
import { type GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Locale } from "@dashboard/components/Locale";
import { getDatagridRowDataIndex } from "@dashboard/misc";
import {
  isLineDiscounted,
  isPriceBreakdownColumn,
} from "@dashboard/orders/components/OrderDetailsDatagrid/datagrid";
import { lineMatrixStatusCell } from "@dashboard/orders/components/OrderLineMatrixDatagrid/LineMatrixStatusCell";
import { type OrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import {
  getOrderLineRollupStatus,
  getOrderLineRollupStatusLabel,
} from "@dashboard/orders/utils/getOrderLineRollupStatus";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { messages } from "./messages";

const QUANTITY_COLUMN_IDS = new Set([
  "ordered",
  "allocated",
  "toFulfill",
  "pendingApproval",
  "shipped",
  "returned",
  "refunded",
]);

export const STATUS_COLUMN_ID = "status";

export const PINNED_MATRIX_COLUMN_IDS = [STATUS_COLUMN_ID];

const isPinnedMatrixColumn = (columnId: string) => PINNED_MATRIX_COLUMN_IDS.includes(columnId);

export const orderLineMatrixStaticColumnsAdapter = (
  intl: IntlShape,
  emptyColumn: AvailableColumn,
): AvailableColumn[] => [
  emptyColumn,
  {
    id: STATUS_COLUMN_ID,
    title: intl.formatMessage(messages.status),
    width: 200,
  },
  {
    id: "product",
    title: intl.formatMessage(messages.product),
    width: 280,
  },
  {
    id: "sku",
    title: intl.formatMessage(messages.sku),
    width: 140,
  },
  {
    id: "variantName",
    title: intl.formatMessage(messages.variantName),
    width: 140,
  },
  {
    id: "ordered",
    title: intl.formatMessage(messages.ordered),
    width: 80,
  },
  {
    id: "allocated",
    title: intl.formatMessage(messages.allocated),
    width: 90,
  },
  {
    id: "toFulfill",
    title: intl.formatMessage(messages.toFulfill),
    width: 90,
  },
  {
    id: "pendingApproval",
    title: intl.formatMessage(messages.pendingApproval),
    width: 110,
  },
  {
    id: "shipped",
    title: intl.formatMessage(messages.shipped),
    width: 80,
  },
  {
    id: "returned",
    title: intl.formatMessage(messages.returned),
    width: 90,
  },
  {
    id: "refunded",
    title: intl.formatMessage(messages.refunded),
    width: 90,
  },
  {
    id: "price",
    title: intl.formatMessage(messages.price),
    width: 130,
  },
  {
    id: "total",
    title: intl.formatMessage(messages.total),
    width: 130,
  },
];

interface GetCellContentProps {
  columns: AvailableColumn[];
  data: OrderLineLifecycle[];
  loading: boolean;
  locale: Locale;
  intl: IntlShape;
  expandedLineId: string | null;
  interactivePricing?: boolean;
}

const getSkeletonVariant = (columnId: string | undefined): SkeletonCellVariant => {
  if (columnId && QUANTITY_COLUMN_IDS.has(columnId)) {
    return "narrow";
  }

  return "default";
};

const formatQuantity = (value: number) => (value > 0 ? value.toString() : "—");

export const createGetCellContent =
  ({
    columns,
    data,
    loading,
    locale,
    intl,
    expandedLineId,
    interactivePricing,
  }: GetCellContentProps) =>
  ([column, row]: Item, { added, removed }: GetCellContentOpts): GridCell => {
    const discountedOpts: Partial<GridCell> = interactivePricing
      ? { ...readonlyOptions, cursor: "pointer" }
      : readonlyOptions;
    const columnId = columns[column]?.id;

    if (loading) {
      if (columnId === "empty") {
        return readonlyTextCell("", false);
      }

      return skeletonCell(getSkeletonVariant(columnId));
    }

    const rowData = added.includes(row) ? undefined : data[getDatagridRowDataIndex(row, removed)];

    if (!rowData || !columnId) {
      return readonlyTextCell("", false);
    }

    if (columnId === "empty") {
      return readonlyTextCell("", false);
    }

    const line = rowData.orderLine;
    const isExpanded = expandedLineId === rowData.orderLineId;

    switch (columnId) {
      case STATUS_COLUMN_ID: {
        const rollupStatus = getOrderLineRollupStatus(rowData);

        return lineMatrixStatusCell(
          rollupStatus,
          getOrderLineRollupStatusLabel(rollupStatus, intl),
          isExpanded,
        );
      }
      case "product":
        return thumbnailCell(line.productName ?? "", line.thumbnail?.url ?? "", readonlyOptions);
      case "sku":
        return readonlyTextCell(line.productSku ?? "", false);
      case "variantName":
        return readonlyTextCell(line.variant?.name ?? "—", false);
      case "ordered":
        return readonlyTextCell(formatQuantity(rowData.ordered), false);
      case "allocated":
        return readonlyTextCell(formatQuantity(rowData.allocated), false);
      case "toFulfill":
        return readonlyTextCell(formatQuantity(rowData.toFulfill), false);
      case "pendingApproval":
        return readonlyTextCell(formatQuantity(rowData.pendingApproval), false);
      case "shipped":
        return readonlyTextCell(formatQuantity(rowData.shipped), false);
      case "returned":
        return readonlyTextCell(formatQuantity(rowData.returned), false);
      case "refunded":
        return readonlyTextCell(formatQuantity(rowData.refundedFulfillment), false);
      case "price":
        if (isLineDiscounted(line)) {
          return moneyDiscountedCell(
            {
              value: line.unitPrice.gross.amount,
              currency: line.unitPrice.gross.currency,
              undiscounted: line.undiscountedUnitPrice.gross.amount,
              locale,
            },
            discountedOpts,
          );
        }

        return moneyCell(
          line.unitPrice.gross.amount,
          line.unitPrice.gross.currency,
          readonlyOptions,
        );
      case "total":
        if (isLineDiscounted(line)) {
          return moneyDiscountedCell(
            {
              value: line.totalPrice.gross.amount,
              currency: line.totalPrice.gross.currency,
              undiscounted: line.undiscountedTotalPrice.gross.amount,
              locale,
            },
            discountedOpts,
          );
        }

        return moneyCell(
          line.totalPrice.gross.amount,
          line.totalPrice.gross.currency,
          readonlyOptions,
        );
      case "isGift":
        return booleanCell(line.isGift, {
          readonly: true,
          allowOverlay: false,
        });
      default:
        return readonlyTextCell("", false);
    }
  };

export { isLineDiscounted, isPinnedMatrixColumn, isPriceBreakdownColumn };

const readonlyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};
