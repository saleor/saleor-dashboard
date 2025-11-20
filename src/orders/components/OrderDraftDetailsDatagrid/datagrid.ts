// @ts-strict-ignore
import {
  booleanCell,
  moneyCell,
  moneyDiscountedCell,
  numberCell,
  readonlyTextCell,
  tagsCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { getDatagridRowDataIndex, getStatusColor, isFirstColumn } from "@dashboard/misc";
import { useOrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import { IntlShape, useIntl } from "react-intl";

import { lineAlertMessages } from "../OrderDraftDetailsProducts/messages";
import { columnsMessages } from "./messages";

export const orderDraftDetailsStaticColumnsAdapter = (
  emptyColumn: AvailableColumn,
  intl: IntlShape,
) => [
  emptyColumn,
  {
    id: "product",
    title: intl.formatMessage(columnsMessages.product),
    width: 300,
  },
  {
    id: "sku",
    title: "SKU",
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
    id: "status",
    title: intl.formatMessage(columnsMessages.status),
    width: 250,
  },
];

interface GetCellContentProps {
  columns: AvailableColumn[];
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
}

export const useGetCellContent = ({ columns, lines, errors }: GetCellContentProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { locale } = useLocale();
  const getValues = useOrderLineDiscountContext();

  return (
    [column, row]: Item,
    { added, removed, changes, getChangeIndex }: GetCellContentOpts,
  ): GridCell => {
    if (isFirstColumn(column)) {
      return readonlyTextCell("", false);
    }

    const columnId = columns[column]?.id;
    const change = changes.current[getChangeIndex(columnId, row)]?.data;
    const rowData = added.includes(row) ? undefined : lines[getDatagridRowDataIndex(row, removed)];

    if (!rowData || !columnId) {
      return readonlyTextCell("", false);
    }

    const { unitUndiscountedPrice, unitDiscountedPrice } = getValues(rowData.id);

    switch (columnId) {
      case "product":
        return thumbnailCell(rowData?.productName ?? "", rowData.thumbnail?.url ?? "", {
          readonly: true,
          allowOverlay: false,
        });
      case "quantity":
        return numberCell(change?.value || rowData.quantity);
      case "price":
        return moneyDiscountedCell(
          {
            value: unitDiscountedPrice.amount,
            currency: unitDiscountedPrice.currency,
            undiscounted: unitUndiscountedPrice.amount,
            lineItemId: rowData.id,
            locale,
          },
          {
            allowOverlay: true,
          },
        );
      case "status": {
        const orderErrors = getOrderErrors(errors, rowData.id);
        const status = getOrderLineStatus(intl, rowData, orderErrors);

        return tagsCell(
          status.map(toTagValue(theme)),
          status.map(status => status.status),
          {
            readonly: true,
            allowOverlay: false,
          },
        );
      }
      case "sku":
        return readonlyTextCell(rowData?.productSku ?? "", false);
      case "variantName":
        return readonlyTextCell(rowData?.variant?.name ?? "", false);
      case "total":
        return moneyCell(rowData.totalPrice.gross.amount, rowData.totalPrice.gross.currency, {
          readonly: true,
          allowOverlay: false,
        });
      case "isGift":
        return booleanCell(rowData?.isGift, {
          allowOverlay: false,
          readonly: true,
        });

      default:
        return readonlyTextCell("", false);
    }
  };
};

function toTagValue(currentTheme: DefaultTheme) {
  return ({ status, type }: OrderStatus) => ({
    color: getStatusColor({ status: type, currentTheme }).base,
    tag: status,
  });
}

interface OrderStatus {
  type: "warning" | "error";
  status: string;
}

const getOrderLineStatus = (
  intl: IntlShape,
  line: OrderDetailsFragment["lines"][number],
  error?: OrderErrorFragment,
): OrderStatus[] => {
  const statuses = [];

  if (error) {
    statuses.push({
      type: "error",
      status: getOrderErrorMessage(error, intl),
    });
  }

  const product = line.variant?.product;

  if (!product) {
    statuses.push({
      type: "warning",
      status: intl.formatMessage(lineAlertMessages.notExists),
    });
  }

  const isAvailableForPurchase = product?.isAvailableForPurchase;

  if (product && !isAvailableForPurchase) {
    statuses.push({
      type: "warning",
      status: intl.formatMessage(lineAlertMessages.notAvailable),
    });
  }

  return statuses;
};

function getOrderErrors(errors: OrderErrorFragment[], id: string) {
  return errors.find(error => error.orderLines?.some(lineId => lineId === id));
}
