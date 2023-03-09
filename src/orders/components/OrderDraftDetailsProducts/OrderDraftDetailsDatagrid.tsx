import ColumnPicker from "@dashboard/components/ColumnPicker";
import {
  loadingCell,
  moneyCell,
  readonlyTextCell,
  tagsCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import Datagrid, {
  GetCellContentOpts,
} from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { OrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
import { themes, useTheme } from "@saleor/macaw-ui/next";
import React, { useContext, useMemo, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_LINE_DISCOUNT } from "../OrderDiscountCommonModal/types";
import { lineAlertMessages } from "./messages";
import { FormData } from "./OrderDraftDetailsProducts";

const columnsMessages = defineMessages({
  product: {
    id: "x/ZVlU",
    defaultMessage: "Product",
  },
  quantity: {
    id: "nEWp+k",
    defaultMessage: "Quantity",
    description: "quantity of ordered products",
  },
  price: {
    id: "32dfzI",
    defaultMessage: "Price",
    description: "price or ordered products",
  },
  total: {
    id: "lVwmf5",
    defaultMessage: "Total",
    description: "total price of ordered products",
  },
});

const messages = defineMessages({
  emptyText: {
    id: "RlfqSV",
    defaultMessage: "No orders found",
  },
});

interface OrderDraftDetailsDatagridProps {
  loading: boolean;
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

export const OrderDraftDetailsDatagrid = ({
  loading,
  lines,
  errors,
  onOrderLineRemove,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedLineId, setEditedLineId] = useState<string | null>(null);
  const getDiscountProviderValues = useContext(OrderLineDiscountContext);
  const { theme: currentTheme } = useTheme();
  const theme = themes[currentTheme];
  const discountProviderValues = editedLineId
    ? getDiscountProviderValues(editedLineId)
    : null;

  const availableColumns = useMemo(
    () => [
      {
        id: "empty",
        title: "",
        width: 20,
      },
      {
        id: "product",
        title: intl.formatMessage(columnsMessages.product),
        width: 300,
      },
      {
        id: "status",
        title: "Status",
        width: 250,
      },
      {
        id: "quantity",
        title: intl.formatMessage(columnsMessages.quantity),
        width: 150,
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
    ],
    [intl],
  );

  const getOrderLineStatus = (
    line: OrderDetailsFragment["lines"][number],
    error?: OrderErrorFragment,
  ) => {
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
        type: "error",
        status: "Error 1234",
      });
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

  const getCellContent = (
    [column, row]: Item,
    { added, removed }: GetCellContentOpts,
  ): GridCell => {
    if ([-1, 0].includes(column)) {
      return readonlyTextCell("", false);
    }

    if (loading) {
      return loadingCell();
    }

    const columnId = columns[column].id;
    const rowData = added.includes(row)
      ? undefined
      : lines[row + removed.filter(r => r <= row).length];

    if (!rowData) {
      return readonlyTextCell("", false);
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
        );
      case "quantity":
        return readonlyTextCell(rowData.quantity.toString(), false);
      case "price":
        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
        );
      case "status":
        const orderErrors = errors.find(error =>
          error.orderLines?.some(id => id === rowData.id),
        );
        const status = getOrderLineStatus(rowData, orderErrors);

        return tagsCell(
          status.map(({ status, type }) => ({
            color:
              type === "warning"
                ? "#FBE5AC"
                : theme.colors.background.surfaceCriticalDepressed,
            tag: status,
          })),
          status.map(status => status.status),
        );
      case "total":
        return moneyCell(
          rowData.totalPrice.gross.amount,
          rowData.totalPrice.gross.currency,
        );

      default:
        return readonlyTextCell("", false);
    }
  };

  const {
    availableColumnsChoices,
    columnChoices,
    columns,
    defaultColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker,
  } = useColumnsDefault(availableColumns);

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        showEmptyDatagrid
        rowMarkers="none"
        columnSelect="none"
        freezeColumns={2}
        verticalBorder={col => (col > 1 ? true : false)}
        availableColumns={columns}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={index => [
          {
            label: "Delete order",
            onSelect: () => {
              onOrderLineRemove(lines[index].id);
            },
          },
          {
            label: "Edit price",
            onSelect: () => {
              setEditedLineId(lines[index].id);
              setIsDialogOpen(true);
            },
          },
        ]}
        rows={loading ? 1 : lines.length}
        selectionActions={(indexes, { removeRows }) => (
          <Button variant="tertiary" onClick={() => removeRows(indexes)}>
            <FormattedMessage {...buttonMessages.delete} />
          </Button>
        )}
        onColumnResize={onColumnResize}
        onColumnMoved={onColumnMoved}
        renderColumnPicker={defaultProps => (
          <ColumnPicker
            {...defaultProps}
            IconButtonProps={{
              ...defaultProps.IconButtonProps,
              disabled: lines.length === 0,
            }}
            availableColumns={availableColumnsChoices}
            initialColumns={columnChoices}
            defaultColumns={defaultColumns}
            onSave={onColumnsChange}
            hasMore={false}
            loading={false}
            onFetchMore={() => undefined}
            onQueryChange={picker.setQuery}
            query={picker.query}
          />
        )}
      />

      {discountProviderValues !== null && (
        <OrderDiscountCommonModal
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          modalType={ORDER_LINE_DISCOUNT}
          maxPrice={discountProviderValues.unitDiscountedPrice}
          onConfirm={props => {
            setIsDialogOpen(false);
            discountProviderValues.addOrderLineDiscount(props);
          }}
          onRemove={discountProviderValues.removeOrderLineDiscount}
          existingDiscount={discountProviderValues.orderLineDiscount}
          confirmStatus={discountProviderValues.orderLineDiscountUpdateStatus}
          removeStatus={discountProviderValues.orderLineDiscountRemoveStatus}
        />
      )}
    </DatagridChangeStateContext.Provider>
  );
};
