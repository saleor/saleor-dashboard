// @ts-strict-ignore
import {
  booleanCell,
  buttonCell,
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
import { type OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getDatagridRowDataIndex, isFirstColumn } from "@dashboard/misc";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const orderDetailsStaticColumnsAdapter = (
  intl: IntlShape,
  emptyColumn: AvailableColumn,
): AvailableColumn[] => [
  emptyColumn,
  {
    id: "product",
    title: intl.formatMessage(columnsMessages.product),
    width: 300,
  },
  {
    id: "sku",
    title: intl.formatMessage(columnsMessages.sku),
    width: 150,
  },
  {
    id: "variantName",
    title: intl.formatMessage(columnsMessages.variantName),
    width: 150,
  },
  {
    id: "quantity",
    title: intl.formatMessage(columnsMessages.quantity),
    width: 80,
  },
  {
    id: "price",
    title: intl.formatMessage(columnsMessages.price),
    width: 150,
  },
  {
    id: "total",
    title: intl.formatMessage(columnsMessages.total),
    width: 150,
  },
  {
    id: "isGift",
    title: intl.formatMessage(columnsMessages.isGift),
    width: 150,
  },
];

interface GetCellContentProps {
  columns: AvailableColumn[];
  data: OrderLineFragment[];
  loading: boolean;
  intl: IntlShape;
  locale: Locale;
  onOrderLineShowMetadata: (id: string) => void;
  /** When true, discounted price/total cells render with a pointer cursor
   *  to signal that clicking them opens the per-line price breakdown modal. */
  interactivePricing?: boolean;
}

const isLineDiscounted = (line: OrderLineFragment): boolean =>
  line.unitPrice.gross.amount < line.undiscountedUnitPrice.gross.amount ||
  (line.discounts?.length ?? 0) > 0;

/** Columns whose discounted cells open the per-line price breakdown modal. */
const PRICE_BREAKDOWN_COLUMN_IDS = ["price", "total"] as const;

type PriceBreakdownColumnId = (typeof PRICE_BREAKDOWN_COLUMN_IDS)[number];

export const isPriceBreakdownColumn = (
  columnId: string | undefined,
): columnId is PriceBreakdownColumnId =>
  PRICE_BREAKDOWN_COLUMN_IDS.includes(columnId as PriceBreakdownColumnId);

const getSkeletonVariant = (columnId: string | undefined): SkeletonCellVariant => {
  if (columnId === "quantity") {
    return "narrow";
  }

  return "default";
};

export const createGetCellContent =
  ({
    columns,
    data,
    loading,
    onOrderLineShowMetadata,
    intl,
    locale,
    interactivePricing,
  }: GetCellContentProps) =>
  ([column, row]: Item, { added, removed }: GetCellContentOpts): GridCell => {
    const discountedOpts: Partial<GridCell> = interactivePricing
      ? { ...readonlyOptions, cursor: "pointer" }
      : readonlyOptions;

    const columnId = columns[column]?.id;

    if (loading) {
      if (isFirstColumn(column)) {
        return readonlyTextCell("", false);
      }

      return skeletonCell(getSkeletonVariant(columnId));
    }

    const rowData = added.includes(row) ? undefined : data[getDatagridRowDataIndex(row, removed)];

    if (!rowData || !columnId) {
      return readonlyTextCell("", false);
    }

    if (isFirstColumn(column)) {
      return readonlyTextCell("", false);
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
          readonlyOptions,
        );
      case "sku":
        return readonlyTextCell(rowData.productSku ?? "", false);
      case "variantName":
        return readonlyTextCell(rowData?.variant?.name ?? "-", false);
      case "quantity":
        return readonlyTextCell(rowData.quantity.toString(), false);
      case "price":
        if (isLineDiscounted(rowData)) {
          return moneyDiscountedCell(
            {
              value: rowData.unitPrice.gross.amount,
              currency: rowData.unitPrice.gross.currency,
              undiscounted: rowData.undiscountedUnitPrice.gross.amount,
              locale,
            },
            discountedOpts,
          );
        }

        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
          readonlyOptions,
        );

      case "total":
        if (isLineDiscounted(rowData)) {
          return moneyDiscountedCell(
            {
              value: rowData.totalPrice.gross.amount,
              currency: rowData.totalPrice.gross.currency,
              undiscounted: rowData.undiscountedTotalPrice.gross.amount,
              locale,
            },
            discountedOpts,
          );
        }

        return moneyCell(
          rowData.totalPrice.gross.amount,
          rowData.totalPrice.gross.currency,
          readonlyOptions,
        );
      case "isGift":
        return booleanCell(rowData?.isGift, {
          readonly: true,
          allowOverlay: false,
        });
      case "metadata":
        return buttonCell(intl.formatMessage(commonMessages.viewMetadata), () => {
          onOrderLineShowMetadata(rowData.id);
        });

      default:
        return readonlyTextCell("", false);
    }
  };

export { isLineDiscounted };

const readonlyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};
