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

export interface LineReasonDisplay {
  reason: string | null;
  reasonType: string | null;
}

export const orderDetailsStaticColumnsAdapter = (
  intl: IntlShape,
  emptyColumn: AvailableColumn,
  { withReasonColumn }: { withReasonColumn?: boolean } = {},
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
  {
    id: "priceOverrideReason",
    title: intl.formatMessage(columnsMessages.priceOverrideReason),
    width: 200,
  },
  ...(withReasonColumn
    ? [
        {
          id: "reason",
          title: intl.formatMessage(columnsMessages.reason),
          width: 200,
        },
      ]
    : []),
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
  /** Per-line reasons aligned by index with `data`; enables the `reason` column. */
  lineReasons?: LineReasonDisplay[];
}

const isLineDiscounted = (line: OrderLineFragment): boolean =>
  line.unitPrice.gross.amount < line.undiscountedUnitPrice.gross.amount ||
  (line.discounts?.length ?? 0) > 0;

/** A line has a price breakdown worth opening when it was discounted or when
 *  its unit price was set custom (overridden). Override-only lines have no
 *  discount factors but still explain "why is this price custom" in the modal. */
const isLineExplainable = (line: OrderLineFragment): boolean =>
  isLineDiscounted(line) || Boolean(line.isPriceOverridden);

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
    lineReasons,
  }: GetCellContentProps) =>
  ([column, row]: Item, { added, removed }: GetCellContentOpts): GridCell => {
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
      case "reason": {
        const lineReason = lineReasons?.[getDatagridRowDataIndex(row, removed)];
        const parts = [lineReason?.reasonType, lineReason?.reason].filter(Boolean);

        return readonlyTextCell(parts.join(": "), false);
      }
      case "price": {
        // The breakdown marker and pointer only make sense when the modal is
        // wired (interactivePricing); otherwise the cue would promise a click
        // that does nothing.
        const showBreakdown = interactivePricing && isLineExplainable(rowData);
        const priceOpts = showBreakdown ? pointerOptions : readonlyOptions;

        if (isLineDiscounted(rowData)) {
          return moneyDiscountedCell(
            {
              value: rowData.unitPrice.gross.amount,
              currency: rowData.unitPrice.gross.currency,
              undiscounted: rowData.undiscountedUnitPrice.gross.amount,
              locale,
              hasBreakdown: showBreakdown,
            },
            priceOpts,
          );
        }

        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
          priceOpts,
          {
            hasBreakdown: showBreakdown,
          },
        );
      }

      case "total": {
        const totalOpts =
          interactivePricing && isLineExplainable(rowData) ? pointerOptions : readonlyOptions;

        if (isLineDiscounted(rowData)) {
          return moneyDiscountedCell(
            {
              value: rowData.totalPrice.gross.amount,
              currency: rowData.totalPrice.gross.currency,
              undiscounted: rowData.undiscountedTotalPrice.gross.amount,
              locale,
            },
            totalOpts,
          );
        }

        return moneyCell(
          rowData.totalPrice.gross.amount,
          rowData.totalPrice.gross.currency,
          totalOpts,
        );
      }
      case "isGift":
        return booleanCell(rowData?.isGift, {
          readonly: true,
          allowOverlay: false,
        });
      case "priceOverrideReason":
        return readonlyTextCell(rowData.priceOverrideReason ?? "", false);
      case "metadata":
        return buttonCell(intl.formatMessage(commonMessages.viewMetadata), () => {
          onOrderLineShowMetadata(rowData.id);
        });

      default:
        return readonlyTextCell("", false);
    }
  };

export { isLineDiscounted, isLineExplainable };

const readonlyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};

/** Readonly cell that signals interactivity — used on price/total cells whose
 *  line has a breakdown the user can open. */
const pointerOptions: Partial<GridCell> = {
  ...readonlyOptions,
  cursor: "pointer",
};
