import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderErrorFragment, OrderSharedType } from "@dashboard/orders/types";
import { useOrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";

import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import {
  ORDER_LINE_DISCOUNT,
  OrderDiscountCommonInput,
} from "../OrderDiscountCommonModal/types";
import { FormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { useColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface OrderDraftDetailsDatagridProps {
  loading: boolean;
  lines: OrderSharedType["lines"];
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

export const OrderDraftDetailsDatagrid = ({
  loading,
  lines,
  errors,
  onOrderLineChange,
  onOrderLineRemove,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedLineId, setEditedLineId] = useState<string | null>(null);
  const getDiscountProviderValues = useOrderLineDiscountContext();
  const discountProviderValues = editedLineId
    ? getDiscountProviderValues(editedLineId)
    : null;

  const { availableColumns } = useColumns();
  const getCellContent = useGetCellContent({
    columns: availableColumns,
    lines,
    loading,
    errors,
  });

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

  const getMenuItems = useCallback(
    index => [
      {
        label: intl.formatMessage(messages.deleteOrder),
        onSelect: () => {
          onOrderLineRemove(lines[index].id);
        },
      },
      {
        label: intl.formatMessage(messages.editDiscount),
        onSelect: () => {
          setEditedLineId(lines[index].id);
          setIsDialogOpen(true);
        },
      },
    ],
    [intl, lines, onOrderLineRemove],
  );

  const handleDiscountConfirm = useCallback(
    async (discount: OrderDiscountCommonInput) => {
      await discountProviderValues.addOrderLineDiscount(discount);
      setIsDialogOpen(false);
    },
    [discountProviderValues],
  );

  const handleDiscountRemove = useCallback(async () => {
    await discountProviderValues.removeOrderLineDiscount();
    setIsDialogOpen(false);
  }, [discountProviderValues]);

  const handleDatagridChange = useCallback(
    ({ updates }: DatagridChangeOpts) => {
      updates.forEach(({ data, row }) => {
        const orderId = lines[row].id;
        onOrderLineChange(orderId, { quantity: data });
      });
    },
    [lines, onOrderLineChange],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        rowMarkers="none"
        columnSelect="none"
        freezeColumns={2}
        verticalBorder={col => (col > 1 ? true : false)}
        availableColumns={columns}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={getMenuItems}
        rows={loading ? 1 : lines.length}
        selectionActions={() => null}
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
        onChange={handleDatagridChange}
      />

      {discountProviderValues !== null && (
        <OrderDiscountCommonModal
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          modalType={ORDER_LINE_DISCOUNT}
          maxPrice={discountProviderValues.unitDiscountedPrice}
          onConfirm={handleDiscountConfirm}
          onRemove={handleDiscountRemove}
          existingDiscount={discountProviderValues.orderLineDiscount}
          confirmStatus={discountProviderValues.orderLineDiscountUpdateStatus}
          removeStatus={discountProviderValues.orderLineDiscountRemoveStatus}
        />
      )}
    </DatagridChangeStateContext.Provider>
  );
};
