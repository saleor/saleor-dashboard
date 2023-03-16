import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { buttonMessages } from "@dashboard/intl";
import { OrderErrorFragment, OrderSharedType } from "@dashboard/orders/types";
import { OrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { Button } from "@saleor/macaw-ui";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_LINE_DISCOUNT } from "../OrderDiscountCommonModal/types";
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
  onOrderLineRemove,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedLineId, setEditedLineId] = useState<string | null>(null);
  const getDiscountProviderValues = useContext(OrderLineDiscountContext);
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
